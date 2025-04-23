import React, { useState } from 'react';
import Navbar from '../../components/NavbarTeacher';


const Reports = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reportType, setReportType] = useState('');
  const [format, setFormat] = useState('PDF');
  const [reportGenerated, setReportGenerated] = useState(false);
  const [reportUrl, setReportUrl] = useState(''); // 👈 Add this line


  const handleProcess = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/report/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromDate, toDate, format, reportType })
      });
  
      const data = await response.json();
      if (data.success) {
        setReportUrl(`http://localhost:5001/api/report/download/${data.file}`);
        setReportGenerated(true);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };
  
  const handleDownload = () => {
    window.open(reportUrl, '_blank');
  };

  return (
    <div className="flex h-screen overflow-hidden">
          <Navbar />

      {/* Main Content */}
      <div className="flex-1 bg-blue-900 flex flex-col">
      <div className="flex justify-between items-center p-6 bg-white border-b">
      <h1 className="text-2xl font-bold">Reports</h1>
          <div>
            <p className="text-sm text-right">Admin_002</p>
            <p className="text-sm text-right">Champika</p>
          </div>
        </div>

        <div className="flex gap-6 mx-4 my-4">
          {/* Filters */}
          <div className="w-1/3 bg-white rounded-xl p-4 shadow">
            <h2 className="text-md font-semibold mb-4">Select Time Range:</h2>
            <div className="mb-4">
              <label className="block mb-1 text-sm">From</label>
              <input type="date" className="w-full border p-2 rounded" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-sm">To</label>
              <input type="date" className="w-full border p-2 rounded" value={toDate} onChange={(e) => setToDate(e.target.value)} />
            </div>

            
            <div className="mb-4">
                <label className="block mb-1 text-sm">Report Type</label>
                <select
                    className="w-full border p-2 rounded"
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                >
                    <option value="">Select Report</option>
                    <option value="student">Student Report</option>
                    <option value="extra-curricular">Extra Curricular Activity Report</option>
                    <option value="attendance">Attendance Report</option>
                    <option value="payment">Payment Report</option>
                </select>
            </div>



            <div className="mb-4">
              <label className="block mb-1 text-sm">Format</label>
              <select className="w-full border p-2 rounded" value={format} onChange={(e) => setFormat(e.target.value)}>
                <option value="PDF">PDF</option>
                <option value="Excel">Excel</option>
              </select>
            </div>

            <button
              onClick={handleProcess}
              className="bg-green-500 text-white w-full py-2 mb-2 rounded hover:bg-green-600"
            >
              🖨️ Process Report
            </button>
            <button
              onClick={handleDownload}
              className="bg-green-700 text-white w-full py-2 rounded hover:bg-green-800"
              disabled={!reportGenerated}
            >
              ⬇️ Download as {format}
            </button>
          </div>

          {/* Report Preview */}
          {reportGenerated ? (
                    <iframe
                        src={reportUrl}
                        title="Report Preview"
                        width="100%"
                        height="600px"
                    />
                    ) : (
                    <p className="text-gray-500 italic text-center mt-40">
                        📄 Report preview will appear here after processing...
                    </p>
                    )}

        </div>
      </div>
    </div>
  );
};

export default Reports;
