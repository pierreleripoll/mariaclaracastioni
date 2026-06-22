import { marked } from "marked";

// Render the small markdown subset (emphasis, links, paragraphs, hard breaks)
// used in project `description`/`credits` frontmatter. breaks:false matches the
// previous <MDC> (remark) behaviour: a single newline is a soft break, blank
// lines start a new paragraph.
marked.use({ gfm: true, breaks: false });

const FIELDS = ["description", "credits"] as const;

/**
 * Pre-render `description`/`credits` markdown to HTML when @nuxt/content parses
 * each document, so the ~140 KB (gzipped) runtime markdown parser that <MDC>
 * pulls into the client bundle is no longer needed. ContentPage.vue consumes the
 * resulting `descriptionHtml`/`creditsHtml` via v-html. Content is author-owned
 * (no untrusted input), so v-html is safe here.
 *
 * `content:file:afterParse` is a Nitro runtime hook (not a Nuxt build hook), so
 * it must be registered from a server plugin. It fires whenever a document is
 * parsed — i.e. on a cold parsed-content cache, which is the case for every
 * clean (CI/Netlify) build.
 */
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook(
    "content:file:afterParse",
    (file: Record<string, unknown>) => {
      if (typeof file._id === "string" && !file._id.endsWith(".md")) return;
      for (const key of FIELDS) {
        const value = file[key];
        if (typeof value === "string" && value.trim()) {
          file[`${key}Html`] = marked.parse(value.trim());
        }
      }
    }
  );
});
