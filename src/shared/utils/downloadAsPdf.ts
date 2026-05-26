export async function downloadElementAsPdf(
  element: HTMLElement,
  filename = "document.pdf"
): Promise<void> {
  return new Promise<void>((resolve) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      resolve();
      return;
    }

    // Collect all styles — <link> hrefs are already absolute in the DOM
    const styles = Array.from(
      document.querySelectorAll<HTMLStyleElement | HTMLLinkElement>(
        "style, link[rel=stylesheet]"
      )
    )
      .map((el) =>
        el instanceof HTMLLinkElement
          ? `<link rel="stylesheet" href="${el.href}">`
          : el.outerHTML
      )
      .join("\n");

    const clone = element.cloneNode(true) as HTMLElement;

    // Resolve image src to absolute URLs so they load correctly from about:blank
    const origImgs = element.querySelectorAll<HTMLImageElement>("img");
    const cloneImgs = clone.querySelectorAll<HTMLImageElement>("img");
    origImgs.forEach((orig, i) => {
      const resolved = orig.currentSrc || orig.src;
      if (resolved && cloneImgs[i]) cloneImgs[i].setAttribute("src", resolved);
    });

    printWindow.document.write(`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>${filename}</title>
  <base href="${window.location.origin}/" />
  ${styles}
  <style>
    body {
      background: #fff !important;
      padding: 24px;
      margin: 0;
    }
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    @media print {
      @page { margin: 12mm; size: A4 portrait; }
      body { padding: 0; }
    }
  </style>
</head>
<body>${clone.outerHTML}</body>
</html>`);

    printWindow.document.close();

    const doPrint = () => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
      resolve();
    };

    if (printWindow.document.readyState === "complete") {
      setTimeout(doPrint, 600);
    } else {
      printWindow.addEventListener("load", () => setTimeout(doPrint, 600));
    }
  });
}
