const ExcelJS = require('exceljs');

async function generateExcel(data, fromDate, toDate) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Attendance Report');

    worksheet.mergeCells('A1:C1');
    worksheet.getCell('A1').value = 'My School Name';
    worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('A1').font = { size: 16, bold: true };

    worksheet.mergeCells('A2:C2');
    worksheet.getCell('A2').value = `Attendance Report (${fromDate} to ${toDate})`;
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('A2').font = { size: 12 };

    worksheet.addRow([]);
    worksheet.addRow(['Student ID', 'Date', 'Status']).eachCell(cell => {
        cell.font = { bold: true };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEEEEEE' } };
    });

    data.forEach(row => {
        worksheet.addRow([row.Student_ID, row.Date, row.Status]);
    });

    worksheet.columns.forEach(column => {
        column.width = 20;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;


    function getTableHeader(reportType) {
        switch (reportType) {
          case 'attendance':
            return ['Student ID', 'Date', 'Status'];
          case 'student':
            return ['Student ID', 'Full Name', 'Grade'];
          case 'extra-curricular':
            return ['Student ID', 'Activity Name', 'Participation Date'];
          case 'payment':
            return ['Student ID', 'Amount', 'Paid Date'];
          default:
            return [];
        }
      }
      
}

module.exports = generateExcel;
