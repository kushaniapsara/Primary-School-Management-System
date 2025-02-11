import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ActivityDetails = () => {
  const { id } = useParams(); // Get activity id from URL params
  const [activity, setActivity] = useState(null);

  // Fetch activity details based on the id
  useEffect(() => {
    fetch(`http://localhost:5001/api/activities/${id}`)
      .then(res => res.json())
      .then(data => setActivity(data))
      .catch(err => console.error('Error fetching activity details:', err));
  }, [id]);

  if (!activity) return <div>Loading...</div>;

  return (
    <div>
      <h1>{activity.name}</h1>
      <p>{activity.description}</p>
      <div>{activity.img}</div>
    </div>
  );
};

export default ActivityDetails;
