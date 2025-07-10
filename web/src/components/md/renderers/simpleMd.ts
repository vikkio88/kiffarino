import { marked, Renderer } from "marked";

const renderer = new Renderer();

renderer.link = ({ href, title, text }) => {
  const titleAttr = title ? ` title="${title}"` : "";
  return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`;
};

renderer.image = ({ href, title, text }) => {
  const titleAttr = title ? ` title="${title}"` : "";
  const altAttr = text ? ` alt="${text}"` : "";
  return `<img src="${href}"${altAttr}${titleAttr} style="max-width: 90%;" />`;
};


marked.setOptions({ renderer });

export default marked;
