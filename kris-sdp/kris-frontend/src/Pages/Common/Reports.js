import React, { useState } from 'react';
import Navbar from '../../components/NavbarTeacher'; // Import Navbar correctly

const Reports = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reportType, setReportType] = useState('');
  const [format, setFormat] = useState('PDF');
  const [reportGenerated, setReportGenerated] = useState(false);
  const [reportUrl, setReportUrl] = useState(''); // To store the generated report URL


  const handleProcess = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/report/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromDate, toDate, format, reportType })
      });

      const data = await response.json();

      if (data.success) {
        const fileUrl = `http://localhost:5001${data.fileUrl}`;

        if (format.toLowerCase() === 'pdf') {
          // Fetch the file as blob and preview
          const fileResponse = await fetch(fileUrl);
          const blob = await fileResponse.blob();
          const blobUrl = URL.createObjectURL(blob);
          setReportUrl(blobUrl);
          setReportGenerated(true);
        } else {
          // For Excel, no need to fetch as blob, just link to download
          setReportUrl(fileUrl);
          setReportGenerated(true);
        }
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };



  // Function to handle the download of the report
  const handleDownload = () => {
    if (reportUrl) {
      window.open(reportUrl, '_blank');
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-40px)] overflow-y-auto bg-gray-100 p-6">

      <div className="flex h-screen overflow-hidden">

        <div className="flex flex-col flex-1">
          {/* Top Bar */}
          <div className="flex justify-between items-center p-6 bg-white border-b">
            <h1 className="text-2xl font-bold">Reports</h1>

          </div>

          {/* Filters and Buttons */}
          <div className="flex flex-1 overflow-hidden bg-blue-900 p-4">
            <div className="w-1/3 bg-white rounded-xl p-6 shadow-md flex flex-col">
              <h2 className="text-lg font-semibold mb-6">🗓️ Select Time Range</h2>

              {/* From Date */}
              <label className="block mb-2 text-sm font-medium">From Date</label>
              <input
                type="date"
                className="mb-4 border rounded p-2"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />

              {/* To Date */}
              <label className="block mb-2 text-sm font-medium">To Date</label>
              <input
                type="date"
                className="mb-4 border rounded p-2"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />

              {/* Report Type */}
              <label className="block mb-2 text-sm font-medium">Report Type</label>
              <select
                className="mb-4 border rounded p-2"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="">Select Report</option>
                <option value="student">Student Report</option>
                <option value="extra-curricular">Extra Curricular Activity Report</option>
                <option value="attendance">Attendance Report</option>
                <option value="payment">Payment Report</option>
              </select>

              {/* Report Format */}
              <label className="block mb-2 text-sm font-medium">Format</label>
              <select
                className="mb-6 border rounded p-2"
                value={format}
                onChange={(e) => setFormat(e.target.value)}
              >
                <option value="PDF">PDF</option>
                <option value="Excel">Excel</option>
              </select>

              {/* Process and Download Buttons */}
              <button
                onClick={handleProcess}
                className="bg-green-500 text-white py-2 mb-2 rounded hover:bg-green-600"
              >
                🖨️ Process Report
              </button>
              <button
                onClick={handleDownload}
                className={`py-2 rounded ${reportGenerated
                    ? 'bg-green-700 hover:bg-green-800'
                    : 'bg-gray-400 cursor-not-allowed'
                  } text-white`}

                disabled={!reportGenerated}
              >
                ⬇️ Download as {format}
              </button>
            </div>

            {/* Report Preview */}
            {/* Report Preview */}
            <div className="flex-1 ml-6 bg-white rounded-xl shadow-md flex items-center justify-center p-4">
              {format.toLowerCase() === 'pdf' && reportGenerated && (
                <iframe
                  src={reportUrl}
                  title="PDF Preview"
                  width="100%"
                  height="500px"
                  style={{ border: '1px solid #ccc', borderRadius: '12px' }}
                />
              )}

              {format.toLowerCase() === 'excel' && reportGenerated && (
                <div className="text-center text-gray-500 italic">
                  📁 Excel reports cannot be previewed. Click "Download" to view the file.
                </div>
              )}

              {!reportGenerated && (
                <div className="text-center text-gray-500 italic">
                  📄 Report preview will appear here after processing...
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
