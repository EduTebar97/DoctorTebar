import sanitizeHtmlLib from "sanitize-html";

export function sanitizeRichHtml(value: string) {
  return sanitizeHtmlLib(value, {
    allowedTags: sanitizeHtmlLib.defaults.allowedTags.concat(["img", "h1", "h2", "h3"]),
    allowedAttributes: {
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "title"]
    },
    allowedSchemes: ["http", "https", "mailto"]
  });
}
