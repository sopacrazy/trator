import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Tractor, Operator, UsageRecord } from '../types';
import { TRACTOR_ICON_PNG } from './tractorIconPng';

const TEXT_PRIMARY: [number, number, number] = [40, 40, 38];
const TEXT_SECONDARY: [number, number, number] = [82, 81, 78];
const TEXT_MUTED: [number, number, number] = [140, 140, 135];
const HAIRLINE: [number, number, number] = [214, 213, 206];
const PANEL_BG: [number, number, number] = [249, 249, 247];
const TABLE_HEAD_BG: [number, number, number] = [243, 243, 240];
const ROW_ALT_BG: [number, number, number] = [250, 250, 249];
const OPEN_FG: [number, number, number] = [150, 90, 10];
const CLOSED_FG: [number, number, number] = [30, 105, 60];

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
  const headerHeight = 58;
  const footerHeight = 34;

  const drawHeader = () => {
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, headerHeight, 'F');

    const logoSize = 26;
    const logoX = margin;
    const logoY = 16;
    doc.addImage(TRACTOR_ICON_PNG, 'PNG', logoX, logoY, logoSize, logoSize);

    doc.setTextColor(...TEXT_PRIMARY);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Frota', logoX + logoSize + 10, logoY + 13);
    const frotaWidth = doc.getTextWidth('Frota');
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...TEXT_SECONDARY);
    doc.text('Muni', logoX + logoSize + 10 + frotaWidth, logoY + 13);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...TEXT_MUTED);
    doc.text('Sistema de Controle de Frota de Tratores', logoX + logoSize + 10, logoY + 24);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...TEXT_PRIMARY);
    doc.text('Relatório de Histórico de Uso', pageWidth - margin, logoY + 13, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...TEXT_MUTED);
    const generatedAt = new Date().toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
    doc.text(`Gerado em ${generatedAt}`, pageWidth - margin, logoY + 24, { align: 'right' });

    doc.setDrawColor(...HAIRLINE);
    doc.setLineWidth(0.75);
    doc.line(margin, headerHeight, pageWidth - margin, headerHeight);
  };

  const drawFooter = () => {
    doc.setDrawColor(...HAIRLINE);
    doc.setLineWidth(0.5);
    doc.line(margin, pageHeight - footerHeight, pageWidth - margin, pageHeight - footerHeight);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...TEXT_MUTED);
    doc.text('FrotaMuni · Controle de Frota', margin, pageHeight - footerHeight + 14);
  };

  drawHeader();

  const panelY = headerHeight + 20;
  const panelHeight = 76;
  doc.setFillColor(...PANEL_BG);
  doc.setDrawColor(...HAIRLINE);
  doc.setLineWidth(0.75);
  doc.roundedRect(margin, panelY, pageWidth - margin * 2, panelHeight, 6, 6, 'FD');

  const statsX = pageWidth - margin - 190;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...TEXT_PRIMARY);
  doc.text('FILTROS APLICADOS', margin + 14, panelY + 18);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(...TEXT_SECONDARY);
  doc.text(`Trator: ${filters.tractorLabel}`, margin + 14, panelY + 33);
  doc.text(`Operador: ${filters.operatorLabel}`, margin + 14, panelY + 46);
  doc.text(`Período: ${filters.periodLabel}`, margin + 14, panelY + 59);

  doc.setDrawColor(...HAIRLINE);
  doc.line(statsX - 20, panelY + 10, statsX - 20, panelY + panelHeight - 10);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...TEXT_PRIMARY);
  doc.text('RESUMO', statsX, panelY + 18);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(...TEXT_SECONDARY);
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
      textColor: TEXT_SECONDARY, lineColor: HAIRLINE, lineWidth: 0.5,
    },
    headStyles: {
      fillColor: TABLE_HEAD_BG, textColor: TEXT_PRIMARY, fontStyle: 'bold', halign: 'left',
      lineColor: HAIRLINE, lineWidth: 0.5,
    },
    alternateRowStyles: { fillColor: ROW_ALT_BG },
    columnStyles: {
      0: { cellWidth: 62 },
      4: { halign: 'right' },
      6: { halign: 'right' },
      7: { halign: 'right', fontStyle: 'bold', textColor: TEXT_PRIMARY },
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
        const fg = isOpen ? OPEN_FG : CLOSED_FG;
        const padX = 6;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        const textWidth = doc.getTextWidth(label);
        const chipW = textWidth + padX * 2;
        const chipH = 14;
        const chipX = data.cell.x + 4;
        const chipY = data.cell.y + (data.cell.height - chipH) / 2;
        doc.setDrawColor(...fg);
        doc.setLineWidth(0.6);
        doc.roundedRect(chipX, chipY, chipW, chipH, 7, 7, 'S');
        doc.setTextColor(...fg);
        doc.text(label, chipX + chipW / 2, chipY + chipH / 2 + 2.7, { align: 'center' });
      }
    },
    didDrawPage: (data) => {
      if (data.pageNumber > 1) {
        drawHeader();
      }
      drawFooter();
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
