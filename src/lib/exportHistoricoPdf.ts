import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Tractor, Operator, UsageRecord } from '../types';

const BRAND_GREEN: [number, number, number] = [27, 94, 32];
const PANEL_BG: [number, number, number] = [241, 248, 242];
const PANEL_BORDER: [number, number, number] = [200, 224, 202];
const TEXT_MUTED: [number, number, number] = [140, 140, 135];
const TEXT_BODY: [number, number, number] = [55, 55, 50];
const OPEN_BG: [number, number, number] = [254, 243, 199];
const OPEN_FG: [number, number, number] = [180, 83, 9];
const CLOSED_BG: [number, number, number] = [220, 252, 231];
const CLOSED_FG: [number, number, number] = [21, 128, 61];

export interface PdfFilters {
  tractorLabel: string;
  operatorLabel: string;
  periodLabel: string;
}

const fmtNum = (n: number) => n.toLocaleString('pt-BR');

const fmtDateTime = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

export function exportHistoricoPdf(
  usages: UsageRecord[],
  tractors: Tractor[],
  operators: Operator[],
  filters: PdfFilters,
  totalRpm: number
) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 36;
  const headerHeight = 64;
  const footerHeight = 34;

  const drawHeader = () => {
    doc.setFillColor(...BRAND_GREEN);
    doc.rect(0, 0, pageWidth, headerHeight, 'F');

    const logoX = margin;
    const logoY = 14;
    const logoSize = 36;
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(logoX, logoY, logoSize, logoSize, 8, 8, 'F');
    doc.setTextColor(...BRAND_GREEN);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.text('FM', logoX + logoSize / 2, logoY + logoSize / 2 + 5, { align: 'center' });

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('FrotaMuni', logoX + logoSize + 12, logoY + 15);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(220, 235, 220);
    doc.text('Sistema de Controle de Frota de Tratores', logoX + logoSize + 12, logoY + 27);

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Relatório de Histórico de Uso', pageWidth - margin, logoY + 15, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(220, 235, 220);
    const generatedAt = new Date().toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
    doc.text(`Gerado em ${generatedAt}`, pageWidth - margin, logoY + 27, { align: 'right' });
  };

  const drawFooter = (pageNumber: number) => {
    doc.setDrawColor(225, 224, 217);
    doc.setLineWidth(0.5);
    doc.line(margin, pageHeight - footerHeight, pageWidth - margin, pageHeight - footerHeight);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...TEXT_MUTED);
    doc.text('FrotaMuni · Controle de Frota', margin, pageHeight - footerHeight + 14);
    void pageNumber;
  };

  drawHeader();

  const panelY = headerHeight + 20;
  const panelHeight = 76;
  doc.setFillColor(...PANEL_BG);
  doc.setDrawColor(...PANEL_BORDER);
  doc.roundedRect(margin, panelY, pageWidth - margin * 2, panelHeight, 6, 6, 'FD');

  const statsX = pageWidth - margin - 190;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...BRAND_GREEN);
  doc.text('FILTROS APLICADOS', margin + 14, panelY + 18);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(...TEXT_BODY);
  doc.text(`Trator: ${filters.tractorLabel}`, margin + 14, panelY + 33);
  doc.text(`Operador: ${filters.operatorLabel}`, margin + 14, panelY + 46);
  doc.text(`Período: ${filters.periodLabel}`, margin + 14, panelY + 59);

  doc.setDrawColor(...PANEL_BORDER);
  doc.line(statsX - 20, panelY + 10, statsX - 20, panelY + panelHeight - 10);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...BRAND_GREEN);
  doc.text('RESUMO', statsX, panelY + 18);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(...TEXT_BODY);
  doc.text(`Registros: ${usages.length}`, statsX, panelY + 33);
  doc.text(`Total RPM do período: ${fmtNum(totalRpm)}`, statsX, panelY + 46);

  const tableStartY = panelY + panelHeight + 20;

  const body = usages.map(u => {
    const op = operators.find(o => o.id === u.operatorId);
    const tr = tractors.find(t => t.id === u.tractorId);
    return [
      u.status,
      fmtDateTime(u.departureTime),
      op?.name || 'Desconhecido',
      `${tr?.name || 'Desconhecido'}${tr?.plate ? ` (${tr.plate})` : ''}`,
      fmtNum(u.initialRpm),
      u.returnTime ? fmtDateTime(u.returnTime) : '-',
      u.finalRpm !== undefined ? fmtNum(u.finalRpm) : '-',
      u.finalRpm !== undefined ? fmtNum(u.finalRpm - u.initialRpm) : '-',
    ];
  });

  autoTable(doc, {
    head: [['Status', 'Saída', 'Operador', 'Trator', 'RPM Inicial', 'Retorno', 'RPM Final', 'RPM Total']],
    body,
    startY: tableStartY,
    margin: { top: headerHeight + 16, left: margin, right: margin, bottom: footerHeight + 10 },
    styles: {
      font: 'helvetica', fontSize: 8.5, cellPadding: 6,
      textColor: TEXT_BODY, lineColor: [230, 229, 222], lineWidth: 0.5,
    },
    headStyles: { fillColor: BRAND_GREEN, textColor: [255, 255, 255], fontStyle: 'bold', halign: 'left' },
    alternateRowStyles: { fillColor: [247, 247, 245] },
    columnStyles: {
      0: { cellWidth: 62 },
      4: { halign: 'right' },
      6: { halign: 'right' },
      7: { halign: 'right', fontStyle: 'bold' },
    },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 0) {
        data.cell.text = [];
      }
    },
    didDrawCell: (data) => {
      if (data.section === 'body' && data.column.index === 0) {
        const isOpen = data.cell.raw === 'OPEN';
        const label = isOpen ? 'EM ABERTO' : 'CONCLUÍDO';
        const bg = isOpen ? OPEN_BG : CLOSED_BG;
        const fg = isOpen ? OPEN_FG : CLOSED_FG;
        const padX = 6;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        const textWidth = doc.getTextWidth(label);
        const chipW = textWidth + padX * 2;
        const chipH = 14;
        const chipX = data.cell.x + 4;
        const chipY = data.cell.y + (data.cell.height - chipH) / 2;
        doc.setFillColor(...bg);
        doc.roundedRect(chipX, chipY, chipW, chipH, 7, 7, 'F');
        doc.setTextColor(...fg);
        doc.text(label, chipX + chipW / 2, chipY + chipH / 2 + 2.7, { align: 'center' });
      }
    },
    didDrawPage: (data) => {
      if (data.pageNumber > 1) {
        drawHeader();
      }
      drawFooter(data.pageNumber);
    },
  });

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...TEXT_MUTED);
    doc.text(`Página ${i} de ${pageCount}`, pageWidth - margin, pageHeight - footerHeight + 14, { align: 'right' });
  }

  const fileDate = new Date().toISOString().split('T')[0];
  doc.save(`historico_frota_${fileDate}.pdf`);
}
