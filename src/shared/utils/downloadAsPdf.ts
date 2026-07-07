import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const MARGIN_MM = 10;

/**
 * Captures `element` as a raster image and assembles it into a real,
 * downloadable A4 PDF, paginating the image across as many pages as needed.
 * Uses html2canvas-pro (not html2canvas) because it supports modern CSS
 * color functions (oklch, lab, color-mix, …) that vanilla html2canvas
 * cannot parse and previously caused capture failures.
 */
export async function downloadElementAsPdf(
  element: HTMLElement,
  filename = "document.pdf"
): Promise<void> {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
  });

  const imgData = canvas.toDataURL("image/png");

  const contentWidth = A4_WIDTH_MM - MARGIN_MM * 2;
  const pageContentHeight = A4_HEIGHT_MM - MARGIN_MM * 2;
  const imgHeight = (canvas.height * contentWidth) / canvas.width;

  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  let heightLeft = imgHeight;
  let offsetY = 0;

  pdf.addImage(imgData, "PNG", MARGIN_MM, MARGIN_MM, contentWidth, imgHeight);
  heightLeft -= pageContentHeight;

  while (heightLeft > 0) {
    offsetY += pageContentHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", MARGIN_MM, MARGIN_MM - offsetY, contentWidth, imgHeight);
    heightLeft -= pageContentHeight;
  }

  pdf.save(filename);
}
