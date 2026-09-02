import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface PdfEstimateData {
  projectName: string;
  calculatorType: "Wall Calculator" | "Ceiling Calculator" | "Paint Calculator" | "Cost Calculator" | "Full Painting Estimate";
  date?: string;
  unitSystem?: string;
  currency?: string;
  // Measurements & Areas
  dimensions?: string;
  grossArea?: string;
  openingsSummary?: string;
  netPaintableArea?: string;
  // Paint specs
  coverage?: string;
  coats?: string;
  wastage?: string;
  recommendedPaint?: string;
  basePaint?: string;
  // Cost breakdown
  paintCost?: string;
  primerCost?: string;
  laborCost?: string;
  materialsCost?: string;
  materialsList?: Array<{ name: string; quantity: string; unitPrice: string; total: string }>;
  totalCost?: string;
  notes?: string;
}

export function generateEstimatePdf(data: PdfEstimateData): void {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const primaryColor: [number, number, number] = [37, 99, 235]; // #2563eb
  const darkTextColor: [number, number, number] = [30, 41, 59]; // slate-800
  const lightBgColor: [number, number, number] = [248, 250, 252]; // slate-50

  // 1. Top Header Bar
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 24, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("PAINT CALCULATOR & ESTIMATOR", 14, 15);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Official Estimate Report", 196, 15, { align: "right" });

  // 2. Project & Date Information
  let currentY = 34;

  doc.setTextColor(...darkTextColor);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(data.projectName || "Painting Project Estimate", 14, currentY);

  currentY += 6;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  const dateStr = data.date || new Date().toLocaleDateString("en-US", { dateStyle: "long" });
  doc.text(`Tool: ${data.calculatorType}  |  Generated: ${dateStr}`, 14, currentY);

  currentY += 8;
  doc.setDrawColor(226, 232, 240);
  doc.line(14, currentY, 196, currentY);
  currentY += 6;

  // 3. Prepare tables
  const summaryRows: [string, string][] = [];

  if (data.dimensions) summaryRows.push(["Dimensions / Setup", data.dimensions]);
  if (data.grossArea) summaryRows.push(["Gross Surface Area", data.grossArea]);
  if (data.openingsSummary) summaryRows.push(["Doors & Windows Deduction", data.openingsSummary]);
  if (data.netPaintableArea) summaryRows.push(["Net Paintable Area", data.netPaintableArea]);

  if (data.coverage) summaryRows.push(["Paint Coverage", data.coverage]);
  if (data.coats) summaryRows.push(["Number of Coats", data.coats]);
  if (data.wastage) summaryRows.push(["Wastage Allowance", data.wastage]);
  if (data.basePaint) summaryRows.push(["Base Paint Volume", data.basePaint]);
  if (data.recommendedPaint) summaryRows.push(["Recommended Paint to Buy", data.recommendedPaint]);

  if (summaryRows.length > 0) {
    autoTable(doc, {
      startY: currentY,
      head: [["Specification", "Value"]],
      body: summaryRows,
      theme: "striped",
      headStyles: {
        fillColor: primaryColor,
        textColor: 255,
        fontStyle: "bold",
      },
      styles: {
        fontSize: 10,
        cellPadding: 3,
        textColor: darkTextColor,
      },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 70 },
        1: { cellWidth: 112 },
      },
      margin: { left: 14, right: 14 },
    });

    currentY = (doc as any).lastAutoTable.finalY + 8;
  }

  // Cost Breakdown Table if costs exist
  const costRows: [string, string][] = [];
  if (data.paintCost) costRows.push(["Paint Material", data.paintCost]);
  if (data.primerCost) costRows.push(["Primer Material", data.primerCost]);
  if (data.laborCost) costRows.push(["Labor / Application", data.laborCost]);
  if (data.materialsCost) costRows.push(["Additional Materials & Supplies", data.materialsCost]);

  if (costRows.length > 0) {
    // Add sub-materials list if any
    if (data.materialsList && data.materialsList.length > 0) {
      data.materialsList.forEach((m) => {
        costRows.push([`   • ${m.name} (${m.quantity} × ${m.unitPrice})`, m.total]);
      });
    }

    if (data.totalCost) {
      costRows.push(["TOTAL ESTIMATED PROJECT COST", data.totalCost]);
    }

    autoTable(doc, {
      startY: currentY,
      head: [["Cost Category", "Estimated Amount"]],
      body: costRows,
      theme: "striped",
      headStyles: {
        fillColor: [30, 41, 59], // dark slate
        textColor: 255,
        fontStyle: "bold",
      },
      styles: {
        fontSize: 10,
        cellPadding: 3.5,
        textColor: darkTextColor,
      },
      columnStyles: {
        0: { cellWidth: 120 },
        1: { halign: "right", cellWidth: 62 },
      },
      didParseCell: (hookData) => {
        if (hookData.row.index === costRows.length - 1 && data.totalCost) {
          hookData.cell.styles.fontStyle = "bold";
          hookData.cell.styles.fontSize = 11;
          hookData.cell.styles.textColor = [37, 99, 235];
        }
      },
      margin: { left: 14, right: 14 },
    });

    currentY = (doc as any).lastAutoTable.finalY + 8;
  }

  // Notes if any
  if (data.notes) {
    if (currentY > 240) {
      doc.addPage();
      currentY = 20;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...darkTextColor);
    doc.text("Project Notes:", 14, currentY);
    currentY += 5;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    const splitNotes = doc.splitTextToSize(data.notes, 182);
    doc.text(splitNotes, 14, currentY);
    currentY += splitNotes.length * 5 + 6;
  }

  // Disclaimer Box (Required by specification)
  if (currentY > 250) {
    doc.addPage();
    currentY = 20;
  }

  doc.setFillColor(241, 245, 249);
  doc.roundedRect(14, currentY, 182, 22, 2, 2, "F");

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(71, 85, 105);
  doc.text("IMPORTANT DISCLAIMER:", 18, currentY + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  const disclaimerText =
    "This is an estimate. Actual paint consumption and cost may vary depending on surface condition, application method, paint brand, coverage and local prices.";
  const splitDisclaimer = doc.splitTextToSize(disclaimerText, 174);
  doc.text(splitDisclaimer, 18, currentY + 12);

  // Footer on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      "Paint Calculator & Estimator • Web Companion & Mobile App",
      14,
      290
    );
    doc.text(`Page ${i} of ${totalPages}`, 196, 290, { align: "right" });
  }

  const safeFileName = (data.projectName || "paint-estimate")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-");

  doc.save(`${safeFileName}-estimate.pdf`);
}
