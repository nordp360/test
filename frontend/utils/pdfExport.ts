import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';

/**
 * Export the entire page to PDF with colors preserved
 */
export async function exportPageToPDF(filename: string = 'lexportal-checklist.pdf'): Promise<void> {
  try {
    // Get the main content element
    const element = document.body;
    
    // Create canvas from the element
    const canvas = await html2canvas(element, {
      scale: 2, // Higher quality
      useCORS: true,
      logging: false,
      backgroundColor: getComputedStyle(document.documentElement).backgroundColor,
    });

    // Calculate PDF dimensions
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png');

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if content is longer than one page
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Save the PDF
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
}

/**
 * Generate a professional 90-day SEO campaign plan PDF for LexPortal
 */
export async function generateSEOCampaignPDF(): Promise<void> {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    
    // Title
    pdf.setFontSize(24);
    pdf.setTextColor(15, 23, 42); // slate-900
    pdf.text('Plan Kampanii SEO (90 dni)', pageWidth / 2, 20, { align: 'center' });
    
    // Subtitle
    pdf.setFontSize(14);
    pdf.setTextColor(100, 116, 139); // slate-500
    pdf.text('LexPortal - Platforma Usług Prawnych Online', pageWidth / 2, 30, { align: 'center' });
    
    // Introduction
    pdf.setFontSize(12);
    pdf.setTextColor(51, 65, 85); // slate-700
    pdf.text('Kompleksowy plan działań SEO na pierwsze 90 dni działalności platformy.', 14, 45);
    
    let yPosition = 55;

    // Month 1: Foundation (Days 1-30)
    pdf.setFontSize(16);
    pdf.setTextColor(37, 99, 235); // blue-600
    pdf.text('Miesiąc 1: Fundamenty (Dni 1-30)', 14, yPosition);
    yPosition += 10;

    const month1Data = [
      ['Tydzień 1-2', 'Audyt Techniczny', 'Analiza struktury strony, szybkości ładowania, mobile-friendliness'],
      ['', 'Research Słów Kluczowych', 'Identyfikacja 50-100 głównych fraz prawniczych'],
      ['Tydzień 3-4', 'Optymalizacja On-Page', 'Meta tagi, nagłówki, struktura URL, schema markup'],
      ['', 'Content Strategy', 'Plan treści na 3 miesiące - artykuły eksperckie'],
    ];

    autoTable(pdf, {
      startY: yPosition,
      head: [['Okres', 'Działanie', 'Szczegóły']],
      body: month1Data,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235], textColor: 255 },
      styles: { fontSize: 10, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 50 },
        2: { cellWidth: 100 },
      },
    });

    yPosition = (pdf as any).lastAutoTable.finalY + 15;

    // Month 2: Content & Authority (Days 31-60)
    pdf.setFontSize(16);
    pdf.setTextColor(37, 99, 235);
    pdf.text('Miesiąc 2: Treść i Autorytet (Dni 31-60)', 14, yPosition);
    yPosition += 10;

    const month2Data = [
      ['Tydzień 5-6', 'Publikacja Treści', '8-12 artykułów eksperckich (poradniki, wzory pism)'],
      ['', 'Link Building', 'Outreach do 20 portali prawniczych i biznesowych'],
      ['Tydzień 7-8', 'Local SEO', 'Optymalizacja Google My Business, lokalne cytowania'],
      ['', 'Social Signals', 'Aktywność na LinkedIn, Facebook - udostępnianie treści'],
    ];

    autoTable(pdf, {
      startY: yPosition,
      head: [['Okres', 'Działanie', 'Szczegóły']],
      body: month2Data,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235], textColor: 255 },
      styles: { fontSize: 10, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 50 },
        2: { cellWidth: 100 },
      },
    });

    yPosition = (pdf as any).lastAutoTable.finalY + 15;

    // Month 3: Optimization & Scaling (Days 61-90)
    pdf.setFontSize(16);
    pdf.setTextColor(37, 99, 235);
    pdf.text('Miesiąc 3: Optymalizacja i Skalowanie (Dni 61-90)', 14, yPosition);
    yPosition += 10;

    const month3Data = [
      ['Tydzień 9-10', 'Analiza Wyników', 'Google Analytics, Search Console - raport postępów'],
      ['', 'A/B Testing', 'Testowanie meta opisów, tytułów, CTA'],
      ['Tydzień 11-12', 'Rozszerzenie Treści', 'Long-tail keywords, FAQ, case studies'],
      ['', 'Backlink Audit', 'Analiza profilu linków, disavow toksycznych'],
    ];

    autoTable(pdf, {
      startY: yPosition,
      head: [['Okres', 'Działanie', 'Szczegóły']],
      body: month3Data,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235], textColor: 255 },
      styles: { fontSize: 10, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 50 },
        2: { cellWidth: 100 },
      },
    });

    yPosition = (pdf as any).lastAutoTable.finalY + 15;

    // Add new page for KPIs
    pdf.addPage();
    yPosition = 20;

    // KPIs Section
    pdf.setFontSize(16);
    pdf.setTextColor(37, 99, 235);
    pdf.text('Kluczowe Wskaźniki Efektywności (KPIs)', 14, yPosition);
    yPosition += 10;

    const kpiData = [
      ['Organiczny Ruch', 'Wzrost o 150-200% w ciągu 90 dni'],
      ['Pozycje Słów Kluczowych', 'Top 10 dla 15-20 głównych fraz'],
      ['Backlinki', 'Zdobycie 30-50 wartościowych linków'],
      ['Domain Authority', 'Wzrost z 0 do 20-25 (Moz)'],
      ['Conversion Rate', 'Osiągnięcie 2-3% dla organicznego ruchu'],
      ['Bounce Rate', 'Utrzymanie poniżej 60%'],
    ];

    autoTable(pdf, {
      startY: yPosition,
      head: [['Wskaźnik', 'Cel']],
      body: kpiData,
      theme: 'striped',
      headStyles: { fillColor: [37, 99, 235], textColor: 255 },
      styles: { fontSize: 11, cellPadding: 4 },
    });

    yPosition = (pdf as any).lastAutoTable.finalY + 15;

    // Tools & Resources
    pdf.setFontSize(16);
    pdf.setTextColor(37, 99, 235);
    pdf.text('Narzędzia i Zasoby', 14, yPosition);
    yPosition += 10;

    const toolsData = [
      ['Google Search Console', 'Monitorowanie wydajności wyszukiwania'],
      ['Google Analytics 4', 'Analiza ruchu i zachowań użytkowników'],
      ['Ahrefs / SEMrush', 'Research słów kluczowych, analiza konkurencji'],
      ['Screaming Frog', 'Audyt techniczny SEO'],
      ['GTmetrix / PageSpeed', 'Optymalizacja szybkości strony'],
    ];

    autoTable(pdf, {
      startY: yPosition,
      head: [['Narzędzie', 'Zastosowanie']],
      body: toolsData,
      theme: 'striped',
      headStyles: { fillColor: [37, 99, 235], textColor: 255 },
      styles: { fontSize: 11, cellPadding: 4 },
    });

    // Footer
    const footerY = pdf.internal.pageSize.getHeight() - 15;
    pdf.setFontSize(10);
    pdf.setTextColor(148, 163, 184); // slate-400
    pdf.text('© 2026 LexPortal - Plan wygenerowany automatycznie', pageWidth / 2, footerY, { align: 'center' });

    // Save the PDF
    pdf.save('lexportal-seo-campaign-90-days.pdf');
  } catch (error) {
    console.error('Error generating SEO campaign PDF:', error);
    throw new Error('Failed to generate SEO campaign PDF. Please try again.');
  }
}
