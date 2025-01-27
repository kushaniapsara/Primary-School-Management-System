import React from 'react';
import Navbar from '../../components/NavbarTeacher';

const Profile = () => {
  return (
    <div className="flex h-screen">
      <Navbar/>

      {/* Main Content */}
      <div className="flex-1 bg-blue-900">
        {/* Header */}
        <header className="flex justify-between items-center bg-white px-8 py-4 border-b border-gray-300">
          <h1 className="text-2xl font-bold">Profile</h1>
          <div className="text-right">
            <p className="font-medium">Teacher_002</p>
            <p className="text-gray-500">Hansi Perera</p>
          </div>
        </header>

        <div className="grid grid-cols-3 gap-6">
          {/* Profile Info */}
          <div className="col-span-1 bg-gray-200 p-4 mt-4 mx-4 rounded-md flex flex-col items-center h-96">
            <div className="w-48 h-48 bg-white rounded-full mb-4"></div>
            <p className="text-lg font-bold">Teacher ID</p>
            <p className="bg-white text-black rounded-md px-4 py-2 mt-2">
              Teacher_004
            </p>
          </div>

          {/* Contact Information */}
          <div className="col-span-2 bg-gray-200 p-4 mt-4 mx-4 rounded-md text-xl">
            <p>Name: Hansi Perera</p>
            <p>Class: 1A</p>
            <p>Address: Mawanella, Kegalle</p>
            <p>Contact Number: 0713144487</p>
            <p>Email: hansi@gmail.com</p>
          </div>
        </div>

        {/* Buttons */}
            <div className="mt-6 flex space-x-4">
              <button className="bg-gray-400 text-black px-6 py-3 mx-4 rounded-md text-lg">
               Student Profiles
              </button>
             <button className="bg-gray-400 text-black px-6 py-3 rounded-md text-lg">
                Class Schedule
             </button>
             <button className="bg-green-500 text-white px-6 py-3 rounded-md text-lg">
                Edit Details
             </button>
             <button className="bg-red-500 text-white px-6 py-3 rounded-md text-lg">
                Change Password
            </button>
           </div>

      </div>
    </div>
  );
};

export default Profile;
