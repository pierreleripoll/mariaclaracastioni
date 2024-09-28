import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,

  // Get this from tina.io
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  // Get this from tina.io
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "uploads",
      publicFolder: "public",
    },
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/schema/
  schema: {
    collections: [
      {
        label: "Spaces",
        name: "space",
        path: "content/1.spaces",
        format: "md",
        ui: {
          filename: {
            readonly: true,
          },
        },
        fields: [
          {
            type: "string",
            label: "Title",
            name: "title",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            label: "Year",
            name: "year",
          },
          {
            type: "image",
            label: "Icon",
            name: "icon",
            ui: {
              description:
                "Upload a PNG icon for the project. Please ensure the file is in PNG format.",
              validate: (value, allValues, meta, field) => {
                if (value && !value.endsWith(".png")) {
                  return "Only PNG files are allowed";
                }
              },
            },
          },
          {
            type: "object",
            label: "Images",
            name: "images",
            list: true,
            fields: [
              {
                type: "image",
                label: "Image",
                name: "src",
              },
              {
                type: "string",
                label: "Caption",
                name: "caption",
                required: false,
              },
            ],
          },
          {
            type: "string",
            label: "Art Description",
            name: "description",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "string",
            label: "Credits",
            name: "credits",
            ui: {
              component: "textarea",
            },
          },
        ],
      },
      {
        label: "Words",
        name: "word",
        path: "content/2.words",
        fields: [
          {
            type: "string",
            label: "Title",
            name: "title",
          },
          {
            type: "string",
            label: "Year",
            name: "year",
          },
          {
            type: "image",
            label: "Icon",
            name: "icon",
            ui: {
              description:
                "Upload a PNG icon for the project. Please ensure the file is in PNG format.",
              validate: (value, allValues, meta, field) => {
                if (!value.endsWith(".png")) {
                  return "Only PNG files are allowed";
                }
              },
            },
          },
          {
            type: "object",
            label: "Images",
            name: "images",
            list: true,
            fields: [
              {
                type: "image",
                label: "Image",
                name: "src",
              },
              {
                type: "string",
                label: "Caption",
                name: "caption",
                required: false,
              },
            ],
          },
          {
            type: "string",
            label: "Text",
            name: "text",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "string",
            label: "Credits",
            name: "credits",
            ui: {
              component: "textarea",
            },
          },
        ],
      },
    ],
  },
});
