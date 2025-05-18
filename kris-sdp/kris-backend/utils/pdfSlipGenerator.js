const PdfPrinter = require('pdfmake');
const fs = require('fs');
const path = require('path');

const fonts = {
  Roboto: {
    normal: path.join(__dirname, './fonts/Roboto-Regular.ttf'),
    bold: path.join(__dirname, './fonts/Roboto-Bold.ttf'),
    italics: path.join(__dirname, './fonts/Roboto-Italic.ttf'),
    bolditalics: path.join(__dirname, './fonts/Roboto-BoldItalic.ttf')
  }
};

const printer = new PdfPrinter(fonts);

async function generatePdf(dataArray) {
  const logoBase64 = fs.readFileSync('uploads/school_logo.png', { encoding: 'base64' });
    const paidBase64  = fs.readFileSync('uploads/paid.jpg',        { encoding: 'base64' }); // ← NEW


  const tableBody = [
    [
      { text: 'Field', bold: true, fillColor: '#eeeeee' },
      { text: 'Value', bold: true, fillColor: '#eeeeee' }
    ],
    ...dataArray.map(item => [
      { text: item.label },
      { text: item.value }
    ])
  ];

  const docDefinition = {
    content: [
      {
        columns: [
          { image: 'data:image/png;base64,' + logoBase64, width: 80 },
          {
            width: '*',
            stack: [
              { text: 'Kandy Royal International School', style: 'header' },
              { text: '459/B, Kandy Colombo RD, Ranwala, Kegalle', style: 'address' },
              { text: 'Contact: 035 2051966', style: 'address' }
            ],
            alignment: 'center'
          }
        ],
        columnGap: 10,
        margin: [0, 0, 0, 10]
      },
      {
        canvas: [
          { type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }
        ],
        margin: [0, 0, 0, 10]
      },
      { text: 'Payment Slip', style: 'subheader' },
      {
        table: {
          headerRows: 1,
          widths: ['30%', '*'],
          body: tableBody
        }
      },
      {
        image: `data:image/jpg;base64,${paidBase64}`,
        alignment: 'center',     // centre under the table
        width: 150,              // adjust size as you like
        margin: [0, 10, 0, 0]    // top margin to separate from table
      }
    ],
    footer: (currentPage, pageCount) => {
      const now = new Date().toLocaleString();
      return {
        columns: [
          { text: `Generated on: ${now}`, alignment: 'left', fontSize: 8, margin: [40, 0, 0, 0] },
          { text: `Page ${currentPage} of ${pageCount}`, alignment: 'right', fontSize: 8, margin: [0, 0, 40, 0] }
        ]
      };
    },
    styles: {
      header: {
        fontSize: 20,
        bold: true,
        alignment: 'center'
      },
      address: {
        fontSize: 10,
        alignment: 'center'
      },
      subheader: {
        fontSize: 14,
        alignment: 'center',
        margin: [0, 10, 0, 10]
      }
    },
    defaultStyle: {
      font: 'Roboto'
    }
  };

  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  const chunks = [];

  return new Promise((resolve, reject) => {
    pdfDoc.on('data', chunk => chunks.push(chunk));
    pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
    pdfDoc.end();
  });
}

module.exports = generatePdf;
