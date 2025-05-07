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

async function generateLeavingCertificate(student) {
    const {
        Full_Name,
        Student_ID,
        Parent_Name,
        Grade,
        Start_Date,
        End_Date,
        Conduct,
        Issue_Date
    } = student;

    const logoBase64 = fs.readFileSync('uploads/school_logo.png', { encoding: 'base64' });

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
                margin: [0, 0, 0, 10]
            },
            {
                canvas: [
                    { type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }
                ],
                margin: [0, 0, 0, 10]
            },
            { text: 'LEAVING CERTIFICATE', style: 'title' },
            {
                text:
                    `This is to certify that ${Full_Name}, ` +
                    `was a bonafide student of this school.\n\n` +
                    `He/She was enrolled in Grade ${Grade} and studied at this institution from ${Start_Date} to ${End_Date}.\n\n` +
                    `During this period, his/her conduct and behavior were found to be ${Conduct}.\n\n` +
                    `This certificate is issued upon his/her request for future educational purposes.\n\nReason for leaving: ${Reason}`,
                style: 'body'
            },
            {
                text: `\nDate of Issue: ${Issue_Date}`,
                style: 'issueDate'
            },
            {
                text: '\n\n\n____________________\nPrincipal',
                alignment: 'right',
                margin: [0, 20, 0, 0]
            }
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                alignment: 'center'
            },
            address: {
                fontSize: 10,
                alignment: 'center'
            },
            title: {
                fontSize: 16,
                bold: true,
                alignment: 'center',
                margin: [0, 10, 0, 20]
            },
            body: {
                fontSize: 12,
                alignment: 'justify',
                margin: [0, 0, 0, 10]
            },
            issueDate: {
                fontSize: 12,
                alignment: 'left'
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

module.exports = generateLeavingCertificate;