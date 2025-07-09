declare global {
  interface Window {
    hljs?: {
      highlightAll: () => void;
    };
  }
}

export function loadHighlightJS() {
  const cdn = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1";
  const themeHref = `${cdn}/styles/base16/dracula.min.css`;
  const inserted: (HTMLScriptElement | HTMLLinkElement)[] = [];

  if (!document.querySelector(`link[href="${themeHref}"]`)) {
    const style = document.createElement("link");
    style.rel = "stylesheet";
    style.href = themeHref;
    document.head.appendChild(style);
    inserted.push(style);
  }

  if (!document.querySelector(`script[src="${cdn}/highlight.min.js"]`)) {
    const script = document.createElement("script");
    script.src = `${cdn}/highlight.min.js`;
    script.onload = () => {
      window.hljs?.highlightAll();
    };
    document.head.appendChild(script);
    inserted.push(script);
  } else {
    window.hljs?.highlightAll();
  }

  return () => {
    for (const el of inserted) {
      el.remove();
    }
  };
}
