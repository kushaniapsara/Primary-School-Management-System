const PdfPrinter = require('pdfmake');
const fs = require('fs');
const path = require('path');

const fonts = {
    Roboto: {
        normal: path.join(__dirname, '../utils/fonts/Roboto-Regular.ttf'),
        bold: path.join(__dirname, '../utils/fonts/Roboto-Bold.ttf'),
        italics: path.join(__dirname, '../utils/fonts/Roboto-Italic.ttf'),
        bolditalics: path.join(__dirname, '../utils/fonts/Roboto-BoldItalic.ttf')
    }
};

const printer = new PdfPrinter(fonts);

async function generatePdf(data, fromDate, toDate) {
    const logoBase64 = fs.readFileSync('uploads/school_logo.png', { encoding: 'base64' });

    // Table header
    const tableBody = [
        [
            { text: 'Student ID', bold: true, fillColor: '#eeeeee' },
            { text: 'Date', bold: true, fillColor: '#eeeeee' },
            { text: 'Status', bold: true, fillColor: '#eeeeee' }
        ]
    ];

    // Safely push rows with validation
    data.forEach(row => {
        const studentId = row.Student_ID !== undefined ? String(row.Student_ID) : '';
        const date = row.Date !== undefined ? String(row.Date) : '';
        const status = row.Status !== undefined ? String(row.Status) : '';

        tableBody.push([
            { text: studentId },
            { text: date },
            { text: status }
        ]);
    });

    const docDefinition = {
        content: [
            {
                image: 'data:image/png;base64,' + logoBase64,
                width: 100,
                alignment: 'center'
            },
            { text: 'My School Name', style: 'header' },
            { text: 'Attendance Report', style: 'subheader' },
            { text: `From ${fromDate} to ${toDate}`, style: 'subheader' },
            { text: ' ' },
            {
                table: {
                    headerRows: 1,
                    widths: ['*', '*', '*'],
                    body: tableBody
                }
            }
        ],
        styles: {
            header: {
                fontSize: 20,
                bold: true,
                alignment: 'center',
                margin: [0, 10, 0, 5]
            },
            subheader: {
                fontSize: 14,
                alignment: 'center',
                margin: [0, 5, 0, 10]
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
