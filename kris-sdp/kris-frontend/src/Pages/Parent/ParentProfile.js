//no need this now 
import React from 'react';
import ParentNavbar from '../../components/ParentNavbar';

const Profile = () => {
  return (
    <div className="flex h-screen">

      {/* Main Content */}
      <div className="flex-1 bg-blue-900">
        {/* Header */}
        <header className="flex justify-between items-center bg-white px-8 py-4 border-b border-gray-300">
          <h1 className="text-2xl font-bold">Profile</h1>
          <div className="text-right">
            <p className="font-medium">Student_001</p>
            <p className="text-gray-500">Kushani Apsara</p>
          </div>
        </header>

        <div className="grid grid-cols-3 gap-6">
          {/* Profile Info */}
          <div className="col-span-1 bg-gray-200 p-4 mt-4 mx-4 rounded-md flex flex-col items-center h-96">
            <div className="w-48 h-48 bg-white rounded-full mb-4"></div>
            <p className="text-lg font-bold">Student ID</p>
            <p className="bg-white text-black rounded-md px-4 py-2 mt-2">
              Student_001
            </p>
          </div>

          {/* Contact Information */}
          <div className="col-span-2 bg-gray-200 p-4 mt-4 mx-4 rounded-md text-xl">
            <p>Name: Kushani Apsara</p>
            <p>Current class: 1A</p>
            <p>Address: Mawanella, Kegalle</p>
            <p>Contact Number: 0713144487</p>
            <p>Email: kushani@gmail.com</p>
            <p>Class Teacher: Miss. Hansi</p>
            <p>Guardian: Mr. Perera</p>
            <p>Extra Curricular activities: Chess, Dancing</p>
            <p>Health Conditions: Allergic to direct sun light</p>
            <p>Special: </p>




          </div>
        </div>

        {/* Buttons */}
            <div className="mt-6 flex space-x-4">

             <button className="bg-green-500 text-white px-6 py-3 rounded-md text-lg mx-4">
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
