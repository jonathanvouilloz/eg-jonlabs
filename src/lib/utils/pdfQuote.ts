export async function generateQuotePdf(element: HTMLElement, filename: string): Promise<void> {
	const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
		import('html2canvas'),
		import('jspdf')
	]);

	const canvas = await html2canvas(element, {
		scale: 2,
		useCORS: true,
		backgroundColor: '#ffffff',
		logging: false
	});

	const imgData = canvas.toDataURL('image/png');
	const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

	const pageWidth = pdf.internal.pageSize.getWidth();
	const pageHeight = pdf.internal.pageSize.getHeight();
	const margin = 10;
	const imgWidth = pageWidth - margin * 2;
	const imgHeight = (canvas.height * imgWidth) / canvas.width;

	if (imgHeight <= pageHeight - margin * 2) {
		pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
	} else {
		let remaining = imgHeight;
		let position = margin;
		const usableHeight = pageHeight - margin * 2;
		while (remaining > 0) {
			pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
			remaining -= usableHeight;
			if (remaining > 0) {
				pdf.addPage();
				position = margin - (imgHeight - remaining);
			}
		}
	}

	pdf.save(filename);
}
