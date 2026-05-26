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
    // Strip interactive controls — they have no place in a printed document
    clone
      .querySelectorAll("button, select, input, [role=button]")
      .forEach((el) => el.remove());

    printWindow.document.write(`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>${filename}</title>
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
      @page { margin: 10mm; }
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
      setTimeout(doPrint, 500);
    } else {
      printWindow.addEventListener("load", () => setTimeout(doPrint, 500));
    }
  });
}
