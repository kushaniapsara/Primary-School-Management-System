import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/NavbarTeacher'; // Reusing the Navbar

const LeavingCertificateGenerator = () => {
  const [formData, setFormData] = useState({
    studentName: '',
    admissionNo: '',
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

  const [students, setStudents] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const [activities, setActivities] = useState([]);


  useEffect(() => {
    axios.get('http://localhost:5001/api/report/students')
      .then(res => {
        if (res.data.success) setStudents(res.data.students);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (selectedId) {
      axios.get(`http://localhost:5001/api/report/student/${selectedId}`)
        .then(res => {
          if (res.data.success) {
            const s = res.data.student;
            setFormData(prev => ({
              ...prev,
              studentName: s.student_name,
              admissionNo: s.student_id,
              dateOfAdmission: s.admission_date ? s.admission_date.split('T')[0] : '',
              dateOfLeaving: s.date_of_leaving || '',
              conduct: s.conduct || '',
              classCompleted: s.class_completed || '',
              reason: s.reason,
              //Gender: s.gender
            }));
            setActivities(s.activities || []);
            console.log('Fetched activities:', s.activities);

          }
        })
        .catch(err => console.error(err));
    }
  }, [selectedId]);

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
      const response = await axios.post(`http://localhost:5001/api/report/generate-leaving-certificate`, {
        ...formData,
        activities // ✅ Send activities in the request
      });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5001/api/report/generate-leaving-certificate', {
        ...formData,
        activities // ✅ Send activities here as well
      }); if (res.data.success) window.open(`http://localhost:5001${res.data.fileUrl}`, '_blank');
    } catch (err) {
      alert('Error generating certificate');
    }
  };

  const filteredStudents = students.filter((s) =>
    s.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.student_id.toString().includes(searchQuery)
  );

  return (

    <div className="flex flex-col h-full max-h-[calc(100vh-40px)] overflow-y-auto bg-gray-100 p-6">

      <div className="flex h-screen overflow-hidden">
        <div className="flex flex-col flex-1">
          {/* Top Bar */}
          <div className="flex justify-between items-center p-6 bg-white border-b">
            <h1 className="text-2xl font-bold">Leaving Certificate</h1>

          </div>

          {/* Main Content */}
          <div className="flex flex-1 overflow-hidden bg-blue-900 p-4">
            {/* Left Panel */}
            <div className="w-full md:w-1/3 bg-white rounded-xl p-6 shadow-md flex flex-col overflow-y-auto max-h-screen">
              <h2 className="text-lg font-semibold mb-4">📝 Fill Student Details</h2>

              <label className="block mb-2 text-sm font-medium">Select Student</label>
              <input
                type="text"
                placeholder="Search student by name or ID"
                className="border p-2 mb-2 rounded w-full"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
              />

              {/* ✅ updated: dropdown styles with z-10, absolute positioning */}
              {showDropdown && searchQuery && filteredStudents.length > 0 && (
                <ul className="absolute top-[145px] w-full border rounded max-h-40 overflow-y-auto bg-white z-10 shadow-lg">
                  {filteredStudents.map((s) => (
                    <li
                      key={s.student_id}
                      className="p-2 hover:bg-blue-100 cursor-pointer"
                      onClick={() => {
                        console.log('Selected student:', s); // Debug line

                        setSelectedId(s.student_id);
                        setSearchQuery(`${s.student_name} (${s.student_id})`);
                        setShowDropdown(false);
                      }}
                    >
                      {s.student_name} ({s.student_id})
                    </li>
                  ))}
                </ul>
              )}

              <form onSubmit={handleSubmit} className="grid gap-4">
                <label htmlFor="dateOfAdmission" className="block text-sm font-medium mb-1">
                  Date of Admission
                </label>
                {/* Date of Admission */}
                <input
                  type="date"
                  name="dateOfAdmission"
                  value={formData.dateOfAdmission}
                  readOnly
                  className="border p-2 rounded"
                  placeholder="Date of Admission" // Added placeholder for clarity
                />

                {/* Class Completed */}
                <input
                  type="text"
                  name="classCompleted"
                  value={formData.classCompleted}
                  onChange={handleChange}
                  className="border p-2 rounded"
                  placeholder="Class Completed" // Added placeholder for clarity
                />

                {/* Conduct */}
                <input
                  type="text"
                  name="conduct"
                  value={formData.conduct}
                  onChange={handleChange}
                  className="border p-2 rounded"
                  placeholder="Conduct" // Added placeholder for clarity
                />

                {activities.length > 0 && (
                  <div>
                    <label className="block mb-2 text-sm font-medium">🏆 Extracurricular Activities & Awards</label>
                    <textarea
                      className="border p-2 rounded w-full text-sm text-gray-700 bg-gray-100"
                      readOnly
                      rows={activities.length + 1}
                      value={activities.map((a, i) => `${i + 1}. ${a.Activity_name}${a.Awards ? ` - ${a.Awards}` : ''}`).join('\n')}
                    />
                  </div>
                )}


                <label htmlFor="dateOfLeaving" className="block text-sm font-medium mb-1">
                  Date of Leaving
                </label>
                {/* Date of Leaving */}
                <input
                  type="date"
                  name="dateOfLeaving"
                  value={formData.dateOfLeaving}
                  onChange={handleChange}
                  className="border p-2 rounded"
                  placeholder="Date of Leaving" // Added placeholder for clarity
                />

                {/* Reason for Leaving */}
                <textarea
                  name="reason"
                  placeholder="Reason for Leaving"
                  value={formData.reason}
                  onChange={handleChange}
                  className="border p-2 rounded"
                  rows="3" // Added rows for better visibility of the text area
                />
                <button
                  onClick={handleGenerate}
                  className="bg-green-500 text-white py-2 mb-2 rounded hover:bg-green-600"
                  disabled={loading}
                >
                  {loading ? 'Generating...' : '🖨️ Generate Certificate'}
                </button>

                <button
                  onClick={handleDownload}
                  className={`py-2 rounded ${generated ? 'bg-green-700 hover:bg-green-800' : 'bg-gray-400 cursor-not-allowed'} text-white`}
                  disabled={!generated}
                >
                  ⬇️ Download Certificate
                </button>
              </form>
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
    </div>
  );
};

export default LeavingCertificateGenerator;
