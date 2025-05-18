import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';

const AdminPayment = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState('');
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [filterMonth, setFilterMonth] = useState('');
  const [summary, setSummary] = useState({ totalCollected: 0, totalDue: 0, paid: 0, unpaid: 0 });

  const [selectedStudentID, setSelectedStudentID] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [customDescription, setCustomDescription] = useState('');

  useEffect(() => {
    fetchStudents();
    fetchPayments();
  }, []);

  const fetchStudents = () => {
    axios.get('http://localhost:5001/api/admins/students')
      .then(res => {
        setStudents(res.data);
        setFilteredStudents(res.data);
        updateSummary(res.data);
      });
  };

  const fetchPayments = () => {
    axios.get('http://localhost:5001/api/admins/payments')
      .then(res => {
        const sorted = [...res.data].sort((a, b) => new Date(b.date) - new Date(a.date));
        setPaymentHistory(sorted);
      });
  };

  const updateSummary = (data) => {
    let paid = 0, unpaid = 0, collected = 0, due = 0;
    data.forEach(s => {
      if (s.total_payable <= 0) paid++;
      else unpaid++;
      if (s.total_payable > 0) due += parseFloat(s.total_payable);
      if (s.total_payable < 0) collected += Math.abs(parseFloat(s.total_payable));
    });
    setSummary({ totalCollected: collected, totalDue: due, paid, unpaid });
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = students.filter(student =>
      student.Student_ID.toString().includes(value) ||
      student.Name_with_initials.toLowerCase().includes(value)
    );
    setFilteredStudents(filtered);
  };

  const sortStudents = (key) => {
    const sorted = [...filteredStudents].sort((a, b) => {
      if (typeof a[key] === 'string') return a[key].localeCompare(b[key]);
      return parseFloat(a[key]) - parseFloat(b[key]);
    });
    setSortKey(key);
    setFilteredStudents(sorted);
  };

  const handleExport = () => {
    const csv = paymentHistory.map(p => `${p.id},${p.student_id},${p.date},${p.amount},${p.description},${p.month_year}`).join("\n");
    const blob = new Blob(["id,student_id,date,amount,description,month_year\n" + csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "payment_history.csv");
  };

  const handleAddAll = () => {
    axios.post('http://localhost:5001/api/admins/payable/addMonthlyAll')
      .then(res => {
        alert(res.data.message);
        fetchStudents();
        fetchPayments();
      })
      .catch(err => {
        const errorMsg = err.response?.data?.message || err.response?.data?.error || '❌ Error adding for all students';
        alert(errorMsg);
      });
  };

  const handleAddCustomFee = () => {
    if (!selectedStudentID || !customAmount || !customDescription) {
      return alert("❗ Please fill all fields.");
    }

    axios.post('http://localhost:5001/api/admins/payable/addCustomFee', {
      student_id: selectedStudentID,
      amount: parseFloat(customAmount).toFixed(2),
      description: customDescription
    })
      .then(res => {
        alert(res.data.message);
        fetchStudents();
        fetchPayments();
        setSelectedStudentID('');
        setCustomAmount('');
        setCustomDescription('');
      })
      .catch(err => {
        const errorMsg = err.response?.data?.message || err.response?.data?.error || '❌ Error adding fee';
        alert(errorMsg);
      });
  };

  const handleAmountChange = (e) => {
    let val = e.target.value;
    if (val === '' || /^\d*\.?\d{0,2}$/.test(val)) {
      setCustomAmount(val);
    }
  };

  const isAddButtonDisabled = !selectedStudentID || !customAmount || !customDescription;

  return (
    // Main container with fixed height and independent vertical scroll
    <div className="flex flex-col h-full max-h-[calc(100vh-80px)] overflow-y-auto bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8 w-full">

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Admin - Student Payments</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-5 text-center">
            <p className="text-gray-500">Over Collected</p>
            <p className="text-2xl font-semibold">Rs. {summary.totalCollected.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-5 text-center">
            <p className="text-gray-500">Total Due</p>
            <p className="text-2xl font-semibold">Rs. {summary.totalDue.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-5 text-center">
            <p className="text-gray-500">Paid Students</p>
            <p className="text-2xl font-semibold">{summary.paid}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-5 text-center">
            <p className="text-gray-500">Unpaid Students</p>
            <p className="text-2xl font-semibold">{summary.unpaid}</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-4 mt-6">
          <button
            onClick={handleAddAll}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded"
          >
            ➕ Add Fee to All
          </button>
          <button
            onClick={handleExport}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded"
          >
            ⬇️ Export CSV
          </button>
        </div>

        {/* Custom Fee Form */}
        <div className="bg-white p-6 rounded-lg shadow mt-10 max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">➕ Add Custom Fee to Student</h2>
          <form
            onSubmit={e => {
              e.preventDefault();
              handleAddCustomFee();
            }}
            className="grid grid-cols-1 sm:grid-cols-4 gap-6 items-end"
          >
            <div>
              <label className="block mb-2 font-medium text-gray-700">Select Student</label>
              <select
                value={selectedStudentID}
                onChange={e => setSelectedStudentID(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="" disabled>Select Student</option>
                {students.map(s => (
                  <option key={s.Student_ID} value={s.Student_ID}>
                    {s.Student_ID} - {s.Name_with_initials}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">Amount (Rs.)</label>
              <input
                type="text"
                value={customAmount}
                onChange={handleAmountChange}
                placeholder="e.g. 1500.00"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">Description</label>
              <input
                type="text"
                value={customDescription}
                onChange={e => setCustomDescription(e.target.value)}
                placeholder="e.g. Extra Class"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isAddButtonDisabled}
                className={`w-full py-2 rounded text-white font-semibold transition ${
                  isAddButtonDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                Add Fee
              </button>
            </div>
          </form>
        </div>

        {/* Search Students */}
        <div className="max-w-4xl mx-auto mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search by Student ID or Name"
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Students Table */}
        <div className="overflow-x-auto max-w-7xl mx-auto rounded-lg shadow bg-white mb-14">
          <table className="min-w-full border-collapse table-auto">
            <thead className="bg-gray-200 sticky top-0 z-10">
              <tr>
                <th
                  className="p-4 text-left font-semibold text-gray-700 cursor-pointer"
                  onClick={() => sortStudents('Student_ID')}
                  style={{ minWidth: '110px' }}
                >
                  Student ID
                </th>
                <th
                  className="p-4 text-left font-semibold text-gray-700 cursor-pointer"
                  onClick={() => sortStudents('Name_with_initials')}
                  style={{ minWidth: '220px' }}
                >
                  Name
                </th>
                <th className="p-4 text-left font-semibold text-gray-700" style={{ minWidth: '140px' }}>
                  Monthly Fee
                </th>
                <th className="p-4 text-left font-semibold text-gray-700" style={{ minWidth: '140px' }}>
                  Total Payable
                </th>
                <th className="p-4 text-left font-semibold text-gray-700" style={{ minWidth: '140px' }}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((s, idx) => (
                <tr
                  key={s.Student_ID}
                  className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-indigo-50 transition`}
                >
                  <td className="p-4 text-gray-900">{s.Student_ID}</td>
                  <td className="p-4 text-gray-900">{s.Name_with_initials}</td>
                  <td className="p-4 font-semibold text-gray-900">Rs. {parseFloat(s.monthly_amount || 0).toFixed(2)}</td>
                  <td
                    className={`p-4 font-semibold ${
                      s.total_payable < 0 ? 'text-green-600' : s.total_payable > 0 ? 'text-red-600' : 'text-gray-800'
                    }`}
                  >
                    Rs. {parseFloat(s.total_payable || 0).toFixed(2)}
                  </td>
                  <td className="p-4 text-gray-900">{s.total_payable <= 0 ? '🟢 Up-to-date' : '🔴 Has Dues'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Filter Payments by Month */}
        <div className="max-w-7xl mx-auto mt-10 mb-4">
          <select
            value={filterMonth}
            onChange={e => setFilterMonth(e.target.value)}
            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Months</option>
            <option value="2025-05">2025-05</option>
            <option value="2025-04">2025-04</option>
          </select>
        </div>

        {/* Payment History Table */}
        <div className="overflow-x-auto max-w-7xl mx-auto rounded-lg shadow bg-white mb-20">
          <h2 className="text-2xl font-semibold p-6 border-b border-gray-200">📄 Student Transaction History</h2>
          <table className="min-w-full border-collapse table-auto">
            <thead className="bg-gray-200 sticky top-[104px] z-10">
              <tr>
                <th className="p-4 text-left font-semibold text-gray-700" style={{ minWidth: '60px' }}>
                  ID
                </th>
                <th className="p-4 text-left font-semibold text-gray-700" style={{ minWidth: '100px' }}>
                  Student ID
                </th>
                <th className="p-4 text-left font-semibold text-gray-700" style={{ minWidth: '140px' }}>
                  Date
                </th>
                <th className="p-4 text-left font-semibold text-gray-700" style={{ minWidth: '120px' }}>
                  Amount
                </th>
                <th className="p-4 text-left font-semibold text-gray-700" style={{ minWidth: '220px' }}>
                  Description
                </th>
                <th className="p-4 text-left font-semibold text-gray-700" style={{ minWidth: '120px' }}>
                  Type
                </th>
              </tr>
            </thead>
            <tbody>
              {paymentHistory
                .filter(p => filterMonth === '' || p.month_year === filterMonth)
                .map((p, idx) => (
                  <tr
                    key={p.id}
                    className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-indigo-50 transition`}
                  >
                    <td className="p-4 text-gray-900">{p.id}</td>
                    <td className="p-4 text-gray-900">{p.student_id}</td>
                    <td className="p-4 text-gray-900">{p.date}</td>
                    <td
                      className={`p-4 font-semibold ${
                        p.amount < 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      Rs. {parseFloat(p.amount).toFixed(2)}
                    </td>
                    <td className="p-4 text-gray-900">{p.description}</td>
                    <td className="p-4 text-gray-900">{p.month_year}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPayment;