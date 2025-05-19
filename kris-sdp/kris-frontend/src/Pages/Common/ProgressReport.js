import React, { useState } from 'react';

const ProgressReport = () => {
    const [reportGenerated, setReportGenerated] = useState(false);
    const [reportUrl, setReportUrl] = useState('');


    const handleProcess = async () => {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch('http://localhost:5001/api/report/progress-report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                },
                body: JSON.stringify({ format: 'pdf' })  // Format always PDF
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server error: ${errorText}`);
            }

            const data = await response.json();

            if (data.success) {
                const fileUrl = `http://localhost:5001${data.fileUrl}`;
                const fileResponse = await fetch(fileUrl);
                const blob = await fileResponse.blob();
                const blobUrl = URL.createObjectURL(blob);
                setReportUrl(blobUrl);
                setReportGenerated(true);
            } else {
                console.error('Report generation failed:', data.error);
            }
        } catch (err) {
            console.error('Error:', err.message);
        }
    };

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
                        <h1 className="text-2xl font-bold">Progress Report</h1>
                    </div>

                    {/* Main Content */}
                    <div className="flex flex-1 overflow-hidden bg-blue-900 p-4">
                        <div className="w-1/3 bg-white rounded-xl p-6 shadow-md flex flex-col">
                            {/* Buttons */}
                            <button
                                onClick={handleProcess}
                                className="bg-green-500 text-white py-2 mb-2 rounded hover:bg-green-600"
                            >
                                🖨️ Process Progress Report
                            </button>
                            <button
                                onClick={handleDownload}
                                className={`py-2 rounded ${reportGenerated
                                    ? 'bg-green-700 hover:bg-green-800'
                                    : 'bg-gray-400 cursor-not-allowed'
                                    } text-white`}
                                disabled={!reportGenerated}
                            >
                                ⬇️ Download as PDF
                            </button>
                        </div>

                        {/* Report Preview */}
                        <div className="flex-1 ml-6 bg-white rounded-xl shadow-md flex items-center justify-center p-4">
                            {reportGenerated ? (
                                <iframe
                                    src={reportUrl}
                                    title="PDF Preview"
                                    width="100%"
                                    height="500px"
                                    style={{ border: '1px solid #ccc', borderRadius: '12px' }}
                                />
                            ) : (
                                <div className="text-center text-gray-500 italic">
                                    📄 Progress Report preview will appear here after processing...
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProgressReport;
