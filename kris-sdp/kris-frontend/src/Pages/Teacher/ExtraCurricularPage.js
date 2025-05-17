import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';


const ExtraCurricularPage = () => {
  const { studentId } = useParams();
  const [activities, setActivities] = useState([]);
  const [editingAward, setEditingAward] = useState({});
  const [awardInput, setAwardInput] = useState("");

  useEffect(() => {
    fetchActivities();
  }, [studentId]);

  const fetchActivities = () => {
    fetch(`http://localhost:5001/api/extra-curricular/${studentId}`)
      .then((res) => res.json())
      .then((data) => setActivities(data))
      .catch((err) => console.error("Error fetching activities:", err));
  };

  const handleAwardSubmit = (activityId) => {
    fetch(`http://localhost:5001/api/extra-curricular/${studentId}/${activityId}/award`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ award: awardInput }),
    })
      .then((res) => res.json())
      .then(() => {
        setEditingAward({});
        setAwardInput("");
        fetchActivities(); // Refresh after update
      })
      .catch((err) => console.error("Error updating award:", err));
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold mb-8 text-center">Enrolled Extra Curricular Activities</h1>
  
      {activities.length === 0 ? (
        <p className="text-center text-gray-500">No enrolled activities found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {activities.map((activity) => (
            <div
  key={activity.Activity_ID}
  className="bg-white shadow-lg rounded-2xl p-8 hover:scale-105 hover:shadow-2xl transition-all duration-300 ease-in-out relative h-72 flex flex-col items-center"
>
  {/* Emoji with hover animation */}
  <div className="text-8xl mb-2 text-center transform transition-transform duration-300 hover:scale-110 hover:-translate-y-1">
    {activity.Activity_emoji}
  </div>

  {/* Activity Name */}
  <h2 className="text-2xl font-bold text-center mb-2">{activity.Activity_name}</h2>

  {/* Award/Highlights */}
  {editingAward.activityId === activity.Activity_ID ? (
    <div className="mt-2 flex flex-col items-center w-full">
      <input
        type="text"
        value={awardInput}
        onChange={(e) => setAwardInput(e.target.value)}
        placeholder="Enter highlight"
        className="border rounded p-2 mb-2 w-full text-sm"
      />
      <button
        onClick={() => handleAwardSubmit(activity.Activity_ID)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
      >
        Save
      </button>
    </div>
  ) : (
    <div className="mt-3">
      {activity.Awards ? (
        <span className="bg-yellow-100 text-yellow-800 text-base font-semibold px-4 py-2 rounded-full">
          {activity.Awards}
        </span>
      ) : (
        <span className="text-gray-400 italic">No Highlights</span>
      )}
    </div>
  )}

  {/* Edit button */}
  <button
    onClick={() => {
      setEditingAward({ activityId: activity.Activity_ID });
      setAwardInput(activity.Awards || "");
    }}
    className="absolute top-3 right-3 text-xs bg-gray-200 hover:bg-gray-300 p-2 rounded"
  >
    {editingAward.activityId === activity.Activity_ID ? "Cancel" : "Edit Highlight"}
  </button>
</div>


          ))}
        </div>
      )}
    </div>
  );
  
};

export default ExtraCurricularPage;
