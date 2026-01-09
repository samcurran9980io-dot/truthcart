import { jsPDF } from 'jspdf';
import { AnalysisResult } from '@/types/analysis';

export async function exportAnalysisPDF(result: AnalysisResult): Promise<void> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let yPos = 20;

  // Helper function to add wrapped text
  const addWrappedText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number = 7): number => {
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return y + lines.length * lineHeight;
  };

  // Header
  doc.setFillColor(0, 210, 106); // Primary green
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('TruthCart Analysis Report', margin, 25);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }), pageWidth - margin - 50, 25);

  yPos = 55;

  // Product Name
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  yPos = addWrappedText(result.productName, margin, yPos, contentWidth, 8);
  
  if (result.brand) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    yPos = addWrappedText(`by ${result.brand}`, margin, yPos + 5, contentWidth);
  }

  yPos += 10;

  // Trust Score Box
  const scoreBoxHeight = 50;
  const statusColors: Record<string, [number, number, number]> = {
    trusted: [0, 210, 106],
    mixed: [255, 193, 7],
    suspicious: [239, 68, 68],
  };
  
  const statusColor = statusColors[result.status] || [100, 100, 100];
  doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.roundedRect(margin, yPos, contentWidth, scoreBoxHeight, 5, 5, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(36);
  doc.setFont('helvetica', 'bold');
  doc.text(`${result.trustScore}`, margin + 20, yPos + 32);
  
  doc.setFontSize(14);
  doc.text('/100', margin + 55, yPos + 32);
  
  doc.setFontSize(16);
  doc.text(`TRUST SCORE — ${result.status.toUpperCase()}`, margin + 85, yPos + 32);

  yPos += scoreBoxHeight + 15;

  // Verdict Section
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(margin, yPos, contentWidth, 40, 3, 3, 'F');
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('VERDICT', margin + 10, yPos + 12);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  yPos = addWrappedText(result.verdict, margin + 10, yPos + 22, contentWidth - 20, 5);
  
  yPos += 20;

  // Score Breakdown
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Score Breakdown', margin, yPos);
  yPos += 10;

  result.breakdown.forEach((item) => {
    // Label
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(item.label, margin, yPos);
    
    // Score
    doc.text(`${item.score}/100`, pageWidth - margin - 20, yPos);
    
    // Progress bar background
    const barWidth = 100;
    const barHeight = 6;
    const barX = margin + 60;
    doc.setFillColor(230, 230, 230);
    doc.roundedRect(barX, yPos - 5, barWidth, barHeight, 2, 2, 'F');
    
    // Progress bar fill
    const fillColor = item.score >= 70 ? [0, 210, 106] : item.score >= 40 ? [255, 193, 7] : [239, 68, 68];
    doc.setFillColor(fillColor[0], fillColor[1], fillColor[2]);
    doc.roundedRect(barX, yPos - 5, (item.score / 100) * barWidth, barHeight, 2, 2, 'F');
    
    yPos += 12;
  });

  yPos += 10;

  // Risk Factors (if available)
  if (result.riskFactors && result.riskFactors.length > 0) {
    // Check if we need a new page
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(239, 68, 68);
    doc.text('Reality Gaps / Risk Factors', margin, yPos);
    yPos += 10;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    
    result.riskFactors.forEach((risk) => {
      doc.text('•', margin, yPos);
      yPos = addWrappedText(risk, margin + 8, yPos, contentWidth - 8, 5);
      yPos += 3;
    });
  }

  yPos += 10;

  // Community Signals (if available)
  if (result.communitySignals && result.communitySignals.length > 0) {
    if (yPos > 220) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Community Feedback', margin, yPos);
    yPos += 10;

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    
    result.communitySignals.slice(0, 3).forEach((signal) => {
      doc.text(`"${signal.quote}"`, margin, yPos);
      yPos += 5;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(120, 120, 120);
      doc.text(`— ${signal.source} (${signal.sentiment})`, margin + 10, yPos);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(80, 80, 80);
      yPos += 10;
    });
  }

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 15;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(150, 150, 150);
  doc.text('Generated by TruthCart — AI-Powered Product Analysis', margin, footerY);
  doc.text('www.truthcart.com', pageWidth - margin - 35, footerY);

  // Product URL
  if (result.productUrl) {
    doc.setTextColor(0, 100, 200);
    doc.textWithLink('View Original Product', pageWidth / 2 - 20, footerY, { url: result.productUrl });
  }

  // Save the PDF
  const fileName = `TruthCart-${result.productName.replace(/[^a-z0-9]/gi, '-').slice(0, 30)}-${Date.now()}.pdf`;
  doc.save(fileName);
}
