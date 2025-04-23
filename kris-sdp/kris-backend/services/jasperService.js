const { exec } = require('child_process');
const path = require('path');

const generateReport = (fromDate, toDate, format, reportType) => {
    return new Promise((resolve, reject) => {
      const jasperStarterPath = '/opt/jasperstarter/bin/jasperstarter';
      const reportFileMap = {
        'student' : 'Hello.jrxml',
        'extra-curricular': 'ExtraCurricular.jasper',
        'attendance': 'AttendanceReport.jasper',
        'payment': 'PaymentReport.jasper'
      };
  
      const reportPath = path.join(__dirname, '../jasperreports', reportFileMap[reportType]);
      const outputPath = path.join(__dirname, '../output/report_' + Date.now());
  
      const command = `${jasperStarterPath} pr ${reportPath} -o ${outputPath} -f ${format.toLowerCase()} -P from_date="${fromDate}" to_date="${toDate}" -t mysql -u root -p "" -H localhost -n your_database`;
  
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error('Error generating report:', stderr);
          return reject(error);
        }
        resolve(`${outputPath}.${format.toLowerCase()}`);
      });
    });
  };
  

module.exports = { generateReport };
