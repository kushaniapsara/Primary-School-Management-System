// adminControllerPayment.js
const pool = require('../config/db');

// Helper: Get current month-year (YYYY-MM)
const getCurrentMonthYear = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

// Get all students + total payable
exports.getAllStudents = (req, res) => {
  const query = `
    SELECT s.*, COALESCE(SUM(sp.amount), 0) AS total_payable
    FROM student s
    LEFT JOIN student_payable sp ON s.Student_ID = sp.student_id
    GROUP BY s.Student_ID
    ORDER BY s.Student_ID
  `;
  pool.query(query, (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch students' });
    res.status(200).json(result);
  });
};

// Update monthly_amount
exports.updateMonthlyAmount = (req, res) => {
  const { Student_ID, monthly_amount } = req.body;
  const query = `UPDATE student SET monthly_amount = ? WHERE Student_ID = ?`;
  pool.query(query, [monthly_amount, Student_ID], (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to update monthly amount' });
    res.status(200).json({ message: 'Monthly amount updated successfully' });
  });
};

// Add monthly amount to all students (if not already added this month)
exports.addMonthlyForAll = async (req, res) => {
  const monthYear = getCurrentMonthYear();
  try {
    const [students] = await pool.promise().query(`SELECT Student_ID, monthly_amount FROM student`);
    for (const student of students) {
      if (!student.monthly_amount || student.monthly_amount <= 0) continue;
      const [exist] = await pool.promise().query(
        `SELECT id FROM student_payable WHERE student_id = ? AND month_year = ? AND description = 'Monthly Fee'`,
        [student.Student_ID, monthYear]
      );
      if (exist.length === 0) {
        await pool.promise().query(
          `INSERT INTO student_payable (student_id, amount, description, month_year) VALUES (?, ?, 'Monthly Fee', ?)`,
          [student.Student_ID, student.monthly_amount, monthYear]
        );
      }
    }
    res.json({ message: 'Monthly amounts added for all students.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
};

// Add monthly amount to a single student
exports.addMonthlyForOne = async (req, res) => {
  const { student_id, monthly_amount } = req.body;
  const monthYear = getCurrentMonthYear();
  if (!monthly_amount || monthly_amount <= 0) {
    return res.status(400).json({ error: 'Monthly amount is missing or invalid' });
  }
  try {
    const [existing] = await pool.promise().query(
      `SELECT id FROM student_payable WHERE student_id = ? AND month_year = ? AND description = 'Monthly Fee'`,
      [student_id, monthYear]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Already added for this month.' });
    }
    await pool.promise().query(
      `INSERT INTO student_payable (student_id, amount, description, month_year) VALUES (?, ?, 'Monthly Fee', ?)`,
      [student_id, monthly_amount, monthYear]
    );
    res.json({ message: 'Monthly amount added for student.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
};

// Get all payment records
exports.getAllStudentPayments = (req, res) => {
  const query = `
    SELECT id, student_id, DATE_FORMAT(date, '%Y-%m-%d') AS date, amount, description, month_year
    FROM student_payable
    ORDER BY date DESC
  `;
  pool.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch payment records' });
    res.status(200).json(results);
  });
};