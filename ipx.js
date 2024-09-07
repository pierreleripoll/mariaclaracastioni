import { listen } from "listhen";
import express from "express";
import {
  createIPX,
  ipxFSStorage,
  ipxHttpStorage,
  createIPXNodeServer,
} from "ipx";
import fs from "fs";
import path from "path";
import { Writable, PassThrough } from "stream";

const cacheDir = "./.ipx-cache";

// Ensure cache directory exists
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}

// Custom Writable Stream to capture response data
class CaptureStream extends Writable {
  constructor(options) {
    super(options);
    this.chunks = [];
  }

  _write(chunk, encoding, callback) {
    this.chunks.push(chunk);
    callback();
  }

  getBuffer() {
    return Buffer.concat(this.chunks);
  }
}

// Middleware to check and cache the response
const cacheMiddleware = (req, res, next) => {
  const cacheFilePath = path.resolve(path.join(cacheDir, req.originalUrl));

  console.log("Checking cache", cacheFilePath);
  if (fs.existsSync(cacheFilePath)) {
    console.log("Cache found", cacheFilePath);
    res.sendFile(cacheFilePath);
  } else {
    console.log("Cache not found", cacheFilePath);
    // Create a PassThrough stream to capture the response data
    // Create CaptureStream to capture response data
    const captureStream = new CaptureStream();
    const passThrough = new PassThrough();

    passThrough.pipe(captureStream);

    // Override res.write and res.end to use PassThrough stream
    const originalWrite = res.write.bind(res);
    const originalEnd = res.end.bind(res);

    res.write = (chunk, encoding, callback) => {
      console.log("res.write");
      passThrough.write(chunk, encoding, callback);
      return originalWrite(chunk, encoding, callback);
    };

    res.end = (chunk, encoding, callback) => {
      if (chunk) passThrough.write(chunk, encoding);
      passThrough.end();
      return originalEnd(chunk, encoding, callback);
    };

    res.on("finish", () => {
      // Create dit if it doesnt exist
      if (!fs.existsSync(path.dirname(cacheFilePath)))
        fs.mkdirSync(path.dirname(cacheFilePath), { recursive: true });

      // Write captured data to cache file
      console.log("Writing cache: ", cacheFilePath);
      fs.writeFile(cacheFilePath, captureStream.getBuffer(), (err) => {
        if (err) {
          console.error("Error writing cache file:", err);
        }
      });
    });

    // Continue with IPX processing
    next();
  }
};

const ipx = createIPX({
  storage: ipxFSStorage({ dir: "./public" }),
  httpStorage: ipxHttpStorage({ domains: ["picsum.photos"] }),
});

const app = express();
app.use(cacheMiddleware);
app.use("/", createIPXNodeServer(ipx));

listen(app, { port: 4000 });
