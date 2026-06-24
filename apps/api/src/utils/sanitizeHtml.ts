import sanitizeHtmlLib from "sanitize-html";

export function sanitizeRichHtml(value: string) {
  return sanitizeHtmlLib(value, {
    allowedTags: sanitizeHtmlLib.defaults.allowedTags.concat([
      "img", "h1", "h2", "h3", "h4",
      "u", "s", "sub", "sup",
      "table", "thead", "tbody", "tr", "th", "td", "colgroup", "col",
    ]),
    allowedAttributes: {
      ...sanitizeHtmlLib.defaults.allowedAttributes,
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "title"],
      // Math formula nodes — must preserve data-math-* attributes
      span: ["class", "data-math-inline", "style"],
      div: ["class", "data-math-block", "style"],
      // Table attributes for resizable tables
      table: ["class", "style"],
      th: ["class", "style", "colspan", "rowspan"],
      td: ["class", "style", "colspan", "rowspan"],
      // Text alignment
      p: ["class", "style"],
      h1: ["class", "style"],
      h2: ["class", "style"],
      h3: ["class", "style"],
      h4: ["class", "style"],
    },
    allowedSchemes: ["http", "https", "mailto"],
  });
}
