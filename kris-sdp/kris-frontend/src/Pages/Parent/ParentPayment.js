import React from "react";
import Button from "@mui/material/Button";
import ParentNavbar from '../../components/ParentNavbar';

const PaymentUI = () => {
  return (
    <div className="flex h-screen">
      <ParentNavbar />
      
      {/* Main Content */}
      <div className="flex-1 bg-blue-900">
        {/* Header */}
        <header className="flex justify-between items-center bg-white px-8 py-4 border-b border-gray-300">
          <h1 className="text-2xl font-bold">Payments</h1>
          <div className="text-right">
            <p className="font-medium">Student_001</p>
            <p className="text-gray-500">Kushani Apsara</p>
          </div>
        </header>

        <div className="flex">
          {/* Payment Details  */}
          <div className="bg-gray-200 p-4 rounded-lg w-96 h-[500px] mr-6 mt-4 mx-4 flex flex-col justify-between">
            <div>
              <div className="mb-4 mt-6">
                <p className="text-lg font-semibold">Month</p>
                <div className="bg-blue-400 text-black text-lg font-bold rounded-lg px-4 py-6">
                  December
                </div>
              </div>

              <div className="mb-4 mt-18">
                <p className="text-lg font-semibold">Amount</p>
                <div className="bg-blue-400 text-black text-lg font-bold rounded-lg px-4 py-6">
                  6500.00 LKR
                </div>
              </div>
            </div>

            {/* Move the button to the bottom of the container */}
            <Button
              variant="contained"
              style={{
                backgroundColor: "#4caf50", 
                color: "#fff", 
                width: "100%", 
                fontSize: "1.25rem", 
                padding: "16px",
              }}
              className="font-bold mt-auto"
            >
              Pay Now
            </Button>
          </div>

          {/* Payment History Table  */}
          <div className="bg-gray-200 p-4 rounded-lg flex-1 mt-4 mx-4 h-[700px]">
            <h2 className="text-xl font-bold mb-4">Payment History</h2>
            <div className="grid grid-cols-5 gap-5 text-center text-sm">
              <p className="font-bold">Month</p>
              <p className="font-bold">Amount</p>
              <p className="font-bold">Date</p>
              <p className="font-bold">Status</p>
              <p className="font-bold">Transaction ID</p>
              {Array(55)
                .fill("")
                .map((_, index) => (
                  <div key={index} className="border border-gray-300 p-4 bg-blue-300 rounded"></div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentUI;
