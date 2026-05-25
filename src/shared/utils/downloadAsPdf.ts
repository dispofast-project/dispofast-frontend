import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * Converts any valid CSS color value (including oklch) to an rgb() string
 * by painting it on a 1x1 canvas and reading the pixel back.
 * This delegates the conversion to the browser's rendering engine.
 */
function resolveColorToRgb(cssColor: string): string {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "#000000";
  ctx.fillStyle = cssColor;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return `rgb(${r}, ${g}, ${b})`;
}

/** CSS properties that can hold color values and may contain oklch */
const COLOR_PROPERTIES: (keyof CSSStyleDeclaration)[] = [
  "color",
  "backgroundColor",
  "borderTopColor",
  "borderRightColor",
  "borderBottomColor",
  "borderLeftColor",
  "outlineColor",
  "textDecorationColor",
  "caretColor",
  "fill",
  "stroke",
];

type SavedStyles = Map<HTMLElement, Record<string, string>>;

/**
 * Walks every descendant of `element`, detects oklch colors in computed styles,
 * and replaces them with their rgb equivalents via the canvas trick.
 * Returns a map of the original inline styles so they can be restored.
 */
function replaceOklchColors(element: HTMLElement): SavedStyles {
  const saved: SavedStyles = new Map();
  const elements = [element, ...element.querySelectorAll<HTMLElement>("*")];

  for (const el of elements) {
    const computed = window.getComputedStyle(el);
    const original: Record<string, string> = {};
    let changed = false;

    for (const prop of COLOR_PROPERTIES) {
      const value = computed[prop] as string;
      if (typeof value === "string" && value.includes("oklch")) {
        original[prop as string] = (el.style as unknown as Record<string, string>)[prop as string] ?? "";
        (el.style as unknown as Record<string, string>)[prop as string] = resolveColorToRgb(value);
        changed = true;
      }
    }

    if (changed) saved.set(el, original);
  }

  return saved;
}

function restoreOklchColors(saved: SavedStyles): void {
  for (const [el, original] of saved) {
    for (const [prop, value] of Object.entries(original)) {
      (el.style as unknown as Record<string, string>)[prop] = value;
    }
  }
}

/**
 * Captures `element` as a PDF and triggers a browser download.
 * Handles oklch colors that html2canvas cannot parse.
 */
export async function downloadElementAsPdf(
  element: HTMLElement,
  filename = "document.pdf"
): Promise<void> {
  window.scrollTo(0, 0);

  const saved = replaceOklchColors(element);

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdfWidth = canvas.width / 2;
    const pdfHeight = canvas.height / 2;

    const pdf = new jsPDF({
      orientation: pdfHeight > pdfWidth ? "portrait" : "landscape",
      unit: "px",
      format: [pdfWidth, pdfHeight],
    });

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(filename);
  } finally {
    // Always restore, even if capture fails
    restoreOklchColors(saved);
  }
}
