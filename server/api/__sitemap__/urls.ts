import { serverQueryContent } from "#content/server";
import { asSitemapUrl, defineSitemapEventHandler } from "#imports";

export default defineSitemapEventHandler(async (e) => {
  const contentList = await serverQueryContent(e).find();

  return contentList
    .filter((c) => c._path && c.images)
    .map((c) => {
      return asSitemapUrl({
        loc: c._path,
        lastmod: c._updatedAt || c._createdAt || new Date().toISOString(),
        images: c.images?.map((img: any) => ({
          loc: img.src,
          caption: img.caption,
        })),
      });
    });
});
