import React, { useEffect, useState } from "react";

const GoogleSheetPage = () => {
  const [link, setLink] = useState("");
  const [newLink, setNewLink] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5001/api/google-link")
      .then((res) => res.json())
      .then((data) => {
        setLink(data.link);
        setNewLink(data.link);
      })
      .catch((err) => console.error("Failed to load link", err));
  }, []);

  const handleSave = () => {
    fetch("http://localhost:5001/api/google-link", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ link: newLink }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Link updated!");
        setLink(newLink);
        setIsEditing(false);
      })
      .catch((err) => {
        console.error("Update failed", err);
        alert("Failed to update link");
      });
  };

  return (
    <div className="p-6 max-w-xl mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Activity Schedule</h1>

      {isEditing ? (
        <div>
          <input
            type="text"
            className="w-full border p-2 mb-4"
            value={newLink}
            onChange={(e) => setNewLink(e.target.value)}
          />
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-4 py-2 rounded mr-2"
          >
            Save
          </button>
          <button
            onClick={() => {
              setNewLink(link);
              setIsEditing(false);
            }}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline block mb-4"
          >
            View Google Sheet
          </a>

          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Edit Link
          </button>
        </div>
      )}
    </div>
  );
};

export default GoogleSheetPage;
