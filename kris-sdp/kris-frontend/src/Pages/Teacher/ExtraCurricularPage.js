import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ExtraCurricularPage = () => {
  const { studentId } = useParams();
  const [activities, setActivities] = useState([]);
  const [newActivity, setNewActivity] = useState({ activityName: "", activityEmoji: "" });

  useEffect(() => {
    fetch(`http://localhost:5001/api/extra-curricular/${studentId}`)
      .then((res) => res.json())
      .then((data) => setActivities(data))
      .catch((err) => console.error("Error fetching activities:", err));
  }, [studentId]);

  const handleChange = (e) => {
    setNewActivity({ ...newActivity, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:5001/api/extra-curricular", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, ...newActivity }),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Activity added successfully");
        setNewActivity({ activityName: "", activityEmoji: "" });
      })
      .catch((err) => console.error("Error adding activity:", err));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Extra Curricular Activities</h1>
      <ul className="list-disc ml-6">
        {activities.map((activity, index) => (
          <li key={index}>{activity.Activity_name} {activity.Activity_emoji}</li>
        ))}
      </ul>

      {/* Add New Extra Curricular Activity Form */}
      <form onSubmit={handleSubmit} className="mt-6">
        <input type="text" name="activityName" placeholder="Activity Name" value={newActivity.activityName} onChange={handleChange} className="block w-full border p-2 mb-2" />
        <input type="text" name="activityEmoji" placeholder="Emoji (e.g. ⚽🎭🎨)" value={newActivity.activityEmoji} onChange={handleChange} className="block w-full border p-2 mb-2" />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md">Add Activity</button>
      </form>
    </div>
  );
};

export default ExtraCurricularPage;
