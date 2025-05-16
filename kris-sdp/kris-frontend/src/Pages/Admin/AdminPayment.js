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
      .then(res => setPaymentHistory(res.data));
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

  const handleAddSingle = (student) => {
    axios.post('http://localhost:5001/api/admins/payable/addMonthlySingle', {
      student_id: student.Student_ID,
      monthly_amount: student.monthly_amount
    })
      .then(res => {
        alert(res.data.message);
        fetchStudents();
        fetchPayments();
      })
      .catch(err => {
        const errorMsg = err.response?.data?.message || err.response?.data?.error || '❌ Error adding for student';
        alert(errorMsg);
      });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-1  flex flex-col">
        <div className="flex justify-between items-center p-6 bg-white border-b">
          

      <h2 className="text-2xl font-bold mb-4 text-gray-800">Admin - Student Payments</h2>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <button onClick={handleAddAll} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">➕ Add Fee to All</button>
        <button onClick={handleExport} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">⬇️ Export CSV</button>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search by ID or Name"
          className="p-2 border rounded w-64"
        />
        <select
          value={filterMonth}
          onChange={e => setFilterMonth(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Months</option>
          <option value="2025-05">2025-05</option>
          <option value="2025-04">2025-04</option>
        </select>
      </div>

      <div className="bg-white p-4 rounded shadow mb-6">
        <p className="text-gray-700"><strong>Over Collected:</strong> Rs. {summary.totalCollected.toFixed(2)}</p>
        <p className="text-gray-700"><strong>Total Due:</strong> Rs. {summary.totalDue.toFixed(2)}</p>
        <p className="text-gray-700"><strong>Paid:</strong> {summary.paid} / <strong>Unpaid:</strong> {summary.unpaid}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto bg-white rounded shadow">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 cursor-pointer" onClick={() => sortStudents('Student_ID')}>Student ID</th>
              <th className="p-3 cursor-pointer" onClick={() => sortStudents('Name_with_initials')}>Name</th>
              <th className="p-3">Monthly Fee</th>
              <th className="p-3">Total Payable</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map(s => (
              <tr key={s.Student_ID} className="text-center hover:bg-gray-50">
                <td className="p-2">{s.Student_ID}</td>
                <td className="p-2">{s.Name_with_initials}</td>
                <td className="p-2">Rs. {parseFloat(s.monthly_amount || 0).toFixed(2)}</td>
                <td className={`p-2 font-semibold ${s.total_payable < 0 ? 'text-green-600' : s.total_payable > 0 ? 'text-red-600' : 'text-gray-800'}`}>
                  Rs. {parseFloat(s.total_payable || 0).toFixed(2)}
                </td>
                <td className="p-2">{s.total_payable <= 0 ? '🟢 Up-to-date' : '🔴 Has Dues'}</td>
                <td className="p-2">
                  <button onClick={() => handleAddSingle(s)} className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700">
                    Add Fee
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="text-xl font-semibold mt-10 mb-4">📄 Student Transaction History</h3>
      <div className="overflow-x-auto">
        <table className="w-full table-auto bg-white rounded shadow">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Student ID</th>
              <th className="p-3">Date</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Description</th>
              <th className="p-3">Month/Year</th>
            </tr>
          </thead>
          <tbody>
            {paymentHistory
              .filter(p => filterMonth === '' || p.month_year === filterMonth)
              .map(p => (
                <tr key={p.id} className="text-center hover:bg-gray-50">
                  <td className="p-2">{p.id}</td>
                  <td className="p-2">{p.student_id}</td>
                  <td className="p-2">{p.date}</td>
                  <td className={`p-2 ${p.amount < 0 ? 'text-green-600' : 'text-red-600'}`}>
                    Rs. {parseFloat(p.amount || 0).toFixed(2)}
                  </td>
                  <td className="p-2">{p.description}</td>
                  <td className="p-2">{p.month_year}</td>
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
