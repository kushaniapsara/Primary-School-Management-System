const ExcelJS = require('exceljs');

async function generateExcel(data, fromDate, toDate, reportType) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`${capitalize(reportType)} Report`);

    // Title
    worksheet.mergeCells('A1:C1');
    worksheet.getCell('A1').value = 'Kandy Royal International School';
    worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('A1').font = { size: 16, bold: true };

    // Subtitle
    worksheet.mergeCells('A2:C2');
    worksheet.getCell('A2').value = `${capitalize(reportType)} Report (${fromDate} to ${toDate})`;
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('A2').font = { size: 12 };

    worksheet.addRow([]);

    // Headers
    const headers = getTableHeader(reportType);
    worksheet.addRow(headers).eachCell(cell => {
        cell.font = { bold: true };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEEEEEE' } };
    });

    // Data rows
    const rows = formatDataByType(data, reportType);
    rows.forEach(row => worksheet.addRow(row));

    // Column widths
    worksheet.columns.forEach(column => {
        column.width = 20;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
}

// Helper: Capitalize first letter
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Helper: Table headers by report type
function getTableHeader(reportType) {
    switch (reportType) {
        case 'attendance':
            return ['Student ID', 'Date', 'Status'];
        case 'student':
            return ['Student ID', 'Full Name', 'Grade'];
        case 'extra-curricular':
            return ['Activity Name', 'Teacher_incharge', 'Location'];
        case 'payment':
            return ['Student ID', 'Amount', 'Paid Date'];
        default:
            return [];
    }
}

// Helper: Format data rows by type
function formatDataByType(data, reportType) {
    switch (reportType) {
        case 'attendance':
            return data.map(row => [row.Student_ID || '', row.Date || '', row.Status || '']);
        case 'student':
            return data.map(row => [row.Student_ID || '', row.Full_Name || '', row.Grade || '']);
        case 'extra-curricular':
            return data.map(row => [row.Activity_name || '', row.Teacher_incharge || '', row.Location || '']);
        case 'payment':
            return data.map(row => [row.Student_ID || '', row.Amount || '', row.Paid_Date || '']);
        default:
            return [];
    }
}

module.exports = generateExcel;
