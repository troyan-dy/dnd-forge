// PDF export: rasterize a DOM node and lay it out across A4 pages.
// jspdf + html2canvas are imported lazily so they stay out of the main bundle.

/** Dark page background so semi-transparent cards render on solid ink, not white. */
const PAGE_BG = '#0b0a08'

export async function downloadElementAsPdf(element: HTMLElement, filename: string) {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ])

  const canvas = await html2canvas(element, {
    scale: 2, // crisper text on the rasterized page
    backgroundColor: PAGE_BG,
    useCORS: true,
    logging: false,
  })

  const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })
  const pageW = pdf.internal.pageSize.getWidth()
  const pageH = pdf.internal.pageSize.getHeight()

  // Scale the captured canvas to the full page width, then paginate vertically.
  const imgW = pageW
  const imgH = (canvas.height * imgW) / canvas.width
  const img = canvas.toDataURL('image/jpeg', 0.95)

  let remaining = imgH
  let position = 0
  pdf.addImage(img, 'JPEG', 0, position, imgW, imgH)
  remaining -= pageH

  while (remaining > 0) {
    position -= pageH
    pdf.addPage()
    pdf.setFillColor(PAGE_BG)
    pdf.rect(0, 0, pageW, pageH, 'F')
    pdf.addImage(img, 'JPEG', 0, position, imgW, imgH)
    remaining -= pageH
  }

  pdf.save(filename)
}
