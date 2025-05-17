import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const ParentPayment = () => {
  const [studentData, setStudentData] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // success or error
  const [paymentHistory, setPaymentHistory] = useState([]);

  //slip
  const [loading, setLoading] = useState(false);
  const [downloadReady, setDownloadReady] = useState(false);
  const [lastPaymentData, setLastPaymentData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const userID = decoded.userID;

        axios.get(`http://localhost:5001/api/students/payment/${userID}`)
          .then(res => setStudentData(res.data))
          .catch(err => console.error('Error fetching student data:', err));

        axios.get(`http://localhost:5001/api/students/payment/amount/${userID}`)
          .then(res => setTotalAmount(res.data.totalAmount))
          .catch(err => console.error('Error fetching total amount:', err));

        axios.get(`http://localhost:5001/api/students/payment/history/${userID}`)
          .then(res => setPaymentHistory(res.data))
          .catch(err => console.error('Error fetching payment history:', err));

      } catch (err) {
        console.error('Token decode error:', err);
      }
    }
  }, []);

  const handlePayment = async () => {
    if (!paymentAmount) {
      setMessageType('error');
      setMessage('Please enter a payment amount.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);
      const userID = decoded.userID;

      await axios.post('http://localhost:5001/api/students/payment/add', {
        student_id: userID,
        amount: paymentAmount,
        description: description || 'Online payment'
      });

      setMessageType('success');
      setMessage('Payment submitted successfully.');
      setPaymentAmount('');
      setDescription('');

      const res = await axios.get(`http://localhost:5001/api/students/payment/amount/${userID}`);
      setTotalAmount(res.data.totalAmount);

      const historyRes = await axios.get(`http://localhost:5001/api/students/payment/history/${userID}`);
const updatedHistory = historyRes.data;
    setPaymentHistory(updatedHistory);
    
      // Set the last payment data for the slip
    const lastPayment = updatedHistory[updatedHistory.length - 1];
    setLastPaymentData(lastPayment);
    setDownloadReady(true);

    } catch (err) {
      console.error('Payment error:', err);
      setMessageType('error');
      setMessage('Failed to submit payment.');
    }
  };

const handleDownloadSlip = async () => {
    if (!lastPaymentData) return;

    try {
      const response = await axios.post(
        'http://localhost:5001/api/students/payment/download-slip',
        lastPaymentData,
        { responseType: 'blob' }
      );

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'payment_slip.pdf';
      link.click();
    } catch (err) {
      console.error('Failed to download payment slip:', err);
      setMessageType('error');
      setMessage('Failed to download payment slip.');
    }
  };


  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-8">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">💳 Payment Information</h2>

      {studentData ? (
        <div>
          <div className="mb-6">
            <p><strong>Student ID:</strong> {studentData.Student_ID}</p>
            <p><strong>Name:</strong> {studentData.Name_with_initials}</p>
            <p><strong>Monthly Fee:</strong> Rs. {parseFloat(studentData.monthly_amount).toFixed(2)}</p>
            <p><strong>Total Payable Amount:</strong> Rs. {parseFloat(totalAmount).toFixed(2)}</p>
          </div>

          <hr className="my-6" />

          <h3 className="text-xl font-semibold mb-2">Make a Payment</h3>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <input
              type="number"
              placeholder="Enter payment amount"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              className="border p-2 rounded-md w-full md:w-1/3"
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-2 rounded-md w-full md:w-1/2"
            />
            <button
              onClick={handlePayment}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Submit Payment
            </button>
          </div>

          {message && (
            <div className={`p-3 rounded-md mb-4 ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message}
            </div>
          )}


{downloadReady && (
            <button
              onClick={handleDownloadSlip}
              className="mb-6 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md"
            >
              Download Payment Slip 📄
            </button>
          )}


          <hr className="my-6" />

          <h3 className="text-xl font-semibold mb-4">Payment History</h3>
          {paymentHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="px-4 py-2 border">Date</th>
                    <th className="px-4 py-2 border">Amount</th>
                    <th className="px-4 py-2 border">Description</th>
                    <th className="px-4 py-2 border">Month/Year</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.map((payment, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border">{new Date(payment.date).toLocaleDateString()}</td>
                      <td className="px-4 py-2 border">Rs. {parseFloat(payment.amount).toFixed(2)}</td>
                      <td className="px-4 py-2 border">{payment.description || 'No Description'}</td>
                      <td className="px-4 py-2 border">{payment.month_year}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No payment history available.</p>
          )}
        </div>
      ) : (
        <p>Loading student details...</p>
      )}
    </div>
  );
};

export default ParentPayment;
