import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/NavbarTeacher'; // Reusing the Navbar

const LeavingCertificateGenerator = () => {
  const [formData, setFormData] = useState({
    studentName: '',
    dateOfAdmission: '',
    dateOfLeaving: '',
    conduct: '',
    reason: '',
    classCompleted: ''
  });

  const [fileUrl, setFileUrl] = useState('');
  const [blobUrl, setBlobUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setGenerated(false);
    setBlobUrl('');

    try {
      const response = await axios.post(`http://localhost:5001/api/report/generate-leaving-certificate`, formData);
      if (response.data.success) {
        const url = `http://localhost:5001${response.data.fileUrl}`;
        const fileResponse = await fetch(url);
        const blob = await fileResponse.blob();
        const previewUrl = URL.createObjectURL(blob);
        setFileUrl(url);
        setBlobUrl(previewUrl);
        setGenerated(true);
      }
    } catch (error) {
      console.error('Error generating certificate:', error);
      alert('Failed to generate certificate');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Navbar />

      <div className="flex flex-col flex-1">
        {/* Top Bar */}
        <div className="flex justify-between items-center p-6 bg-white border-b">
          <h1 className="text-2xl font-bold">Leaving Certificate</h1>
          <div className="text-right">
            <p className="text-sm">Admin_002</p>
            <p className="text-sm">Champika</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden bg-blue-900 p-4">
          {/* Left Panel */}
          <div className="w-1/3 bg-white rounded-xl p-6 shadow-md flex flex-col overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">📝 Fill Student Details</h2>

            <input name="studentName" placeholder="Student Name" value={formData.studentName} onChange={handleChange} className="mb-3 border rounded p-2" required />
            <label className="block mb-1 text-sm font-medium">Date of Admission</label>
            <input type="date" name="dateOfAdmission" value={formData.dateOfAdmission} onChange={handleChange} className="mb-3 border rounded p-2" required />
            <label className="block mb-1 text-sm font-medium">Date of Leaving</label>
            <input type="date" name="dateOfLeaving" value={formData.dateOfLeaving} onChange={handleChange} className="mb-3 border rounded p-2" required />
            <input name="classCompleted" placeholder="Class Completed" value={formData.classCompleted} onChange={handleChange} className="mb-3 border rounded p-2" required />
            <input name="conduct" placeholder="Conduct" value={formData.conduct} onChange={handleChange} className="mb-3 border rounded p-2" required />
            <textarea name="reason" placeholder="Reason for Leaving" value={formData.reason} onChange={handleChange} className="mb-4 border rounded p-2" required />

            <button
              onClick={handleGenerate}
              className="bg-green-500 text-white py-2 mb-2 rounded hover:bg-green-600"
              disabled={loading}
            >
              {loading ? 'Generating...' : '🖨️ Generate Certificate'}
            </button>

            <button
              onClick={handleDownload}
              className={`py-2 rounded ${
                generated ? 'bg-green-700 hover:bg-green-800' : 'bg-gray-400 cursor-not-allowed'
              } text-white`}
              disabled={!generated}
            >
              ⬇️ Download Certificate
            </button>
          </div>

          {/* Right Panel - Certificate Preview */}
          <div className="flex-1 ml-6 bg-white rounded-xl shadow-md flex items-center justify-center p-4">
            {generated ? (
              <iframe
                src={blobUrl}
                title="Certificate Preview"
                width="100%"
                height="500px"
                style={{ border: '1px solid #ccc', borderRadius: '12px' }}
              />
            ) : (
              <div className="text-center text-gray-500 italic">
                📄 Certificate preview will appear here after generation...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeavingCertificateGenerator;
