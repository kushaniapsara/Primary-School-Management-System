// ✅ Final Full AdminPayment.js with All Features Combined
// - Monthly fee management (individual & all)
// - Total payable summary & tags
// - CSV export, filter, color-coded amounts
// - .toFixed() fixes
// - Uses baseURL http://localhost:5001

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
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={handleAddAll} style={{ marginRight: '1rem' }}>➕ Add Monthly Fee to All</button>
        <button onClick={handleExport} style={{ marginRight: '1rem' }}>⬇️ Export CSV</button>
        <input type="text" placeholder="Search by ID or Name" value={searchTerm} onChange={handleSearch} style={{ padding: '0.5rem', marginRight: '1rem' }} />
        <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)}>
          <option value="">All Months</option>
          <option value="2025-05">2025-05</option>
          <option value="2025-04">2025-04</option>
        </select>
      </div>

      <h2>🧾 Admin - Student Payments</h2>
      <div style={{ margin: '1rem 0', border: '1px solid #ccc', padding: '1rem' }}>
        <p><strong>Total Collected:</strong> Rs. {parseFloat(summary.totalCollected || 0).toFixed(2)}</p>
        <p><strong>Total Due:</strong> Rs. {parseFloat(summary.totalDue || 0).toFixed(2)}</p>
        <p><strong>Paid:</strong> {summary.paid} / <strong>Unpaid:</strong> {summary.unpaid}</p>
      </div>

      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th onClick={() => sortStudents('Student_ID')}>Student ID</th>
            <th onClick={() => sortStudents('Name_with_initials')}>Name</th>
            <th>Monthly Fee</th>
            <th>Total Payable</th>
            <th>Status</th>
            <th>Add Fee</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map(s => (
            <tr key={s.Student_ID}>
              <td>{s.Student_ID}</td>
              <td>{s.Name_with_initials}</td>
              <td>{parseFloat(s.monthly_amount || 0).toFixed(2)}</td>
              <td style={{ color: s.total_payable < 0 ? 'green' : s.total_payable > 0 ? 'red' : 'black' }}>
                Rs. {parseFloat(s.total_payable || 0).toFixed(2)}
              </td>
              <td>{s.total_payable <= 0 ? '🟢 Up-to-date' : '🔴 Has Dues'}</td>
              <td>
                <button onClick={() => handleAddSingle(s)}>Add Fee</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ marginTop: '2rem' }}>📄 Student Payment History</h3>
      <table border="1" cellPadding="6" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Student ID</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Description</th>
            <th>Month/Year</th>
          </tr>
        </thead>
        <tbody>
          {paymentHistory
            .filter(p => filterMonth === '' || p.month_year === filterMonth)
            .map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.student_id}</td>
                <td>{p.date}</td>
                <td style={{ color: p.amount < 0 ? 'green' : 'red' }}>
                  Rs. {parseFloat(p.amount || 0).toFixed(2)}
                </td>
                <td>{p.description}</td>
                <td>{p.month_year}</td>
              </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPayment;