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

async function generatePdf(data, fromDate, toDate, reportType) {
    const logoBase64 = fs.readFileSync('uploads/school_logo.png', { encoding: 'base64' });

    // Set report title and build dynamic table
    let reportTitle = '';
    let tableHeaders = [];
    let tableRows = [];

     // Utility function to safely convert value to string
     const safeText = (value) => (value !== undefined && value !== null ? String(value) : '');

    

    switch (reportType) {
        case 'attendance':
            reportTitle = 'Attendance Report';
            tableHeaders = ['Student ID', 'Date', 'Status'];
            tableRows = data.map(row => [
                { text: safeText(row.Student_ID) },
                { text: safeText(row.Date) },
                { text: safeText(row.Status) }
            ]);
            break;

        case 'student':
            reportTitle = 'Student Report';
            tableHeaders = ['Student ID', 'Full Name', 'Grade'];
            tableRows = data.map(row => [
                { text: row.Student_ID || '' },
                { text: row.Full_name || '' },
                { text: row.Grade || '' }
            ]);
            break;

        case 'extra-curricular':
            reportTitle = 'Extra-Curricular Activities Report';
            tableHeaders = ['Activity Name', 'Teacher_incharge', 'Location'];
            tableRows = data.map(row => [
                { text: row.Activity_name  || '' },
                { text: row.Teacher_incharge || '' },
                { text: row.Location || '' }
            ]);
            break;

        case 'payment':
            reportTitle = 'Payment Report';
            tableHeaders = ['Student ID', 'Amount', 'Paid Date'];
            tableRows = data.map(row => [
                { text: row.Student_ID || '' },
                { text: row.Amount || '' },
                { text: row.Paid_Date || '' }
            ]);
            break;

        default:
            reportTitle = 'Report';
            tableHeaders = ['Column 1', 'Column 2', 'Column 3'];
            tableRows = [];
            break;
    }

    const tableBody = [
        tableHeaders.map(header => ({
            text: header,
            bold: true,
            fillColor: '#eeeeee'
        })),
        ...tableRows
    ];

    const docDefinition = {
        content: [
            {
                columns: [
                    {
                        image: 'data:image/png;base64,' + logoBase64,
                        width: 80
                    },
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
            { text: reportTitle, style: 'subheader' },
            { text: `From ${fromDate} to ${toDate}`, style: 'subheader' },
            {
                table: {
                    headerRows: 1,
                    widths: ['*', '*', '*'],
                    body: tableBody
                }
            }
        ],


        footer: function(currentPage, pageCount) {
    const now = new Date();
    const formattedDateTime = now.toLocaleString(); // e.g., "5/17/2025, 10:30:15 AM"

    return {
        columns: [
            { text: `Generated on: ${formattedDateTime}`, alignment: 'left', fontSize: 8, margin: [40, 0, 0, 0] },
            { text: `Page ${currentPage} of ${pageCount}`, alignment: 'right', fontSize: 8, margin: [0, 0, 40, 0] }
        ]
    };
},


        styles: {
            header: {
                fontSize: 20,
                bold: true,
                alignment: 'center',
                margin: [0, 0, 0, 2]
            },
            address: {
                fontSize: 10,
                alignment: 'center'
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
