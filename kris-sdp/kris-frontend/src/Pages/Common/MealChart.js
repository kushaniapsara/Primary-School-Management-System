import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";


const MealChart = () => {
    const [meals, setMeals] = useState([]);
    const [day, setDay] = useState("");
    const [meal, setMeal] = useState("");
    const [editId, setEditId] = useState(null);

    const [userRole, setUserRole] = useState(""); // NEW state to track user role


    // Fetch meals from server
    const fetchMeals = async () => {
        try {
            const res = await axios.get("http://localhost:5001/api/meal-chart");
            setMeals(res.data);
        } catch (err) {
            console.error("Error fetching meals:", err);
        }
    };

    useEffect(() => {
        fetchMeals();
    }, []);

    // to hide buttons
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUserRole(decoded.role);
                console.log(decoded.role); // Add this line to check the value

            } catch (error) {
                console.error("Invalid token", error);
                setUserRole(""); // assuming your token has a 'role' field
            }
        }
    }, []);




    // Add or update a meal
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!day || !meal) return alert("Please enter both day and meal");

        try {
            if (editId) {
                await axios.put(`http://localhost:5001/api/meal-chart/${editId}`, {
                    meal,
                });
            } else {
                await axios.post("http://localhost:5001/api/meal-chart", { day, meal });
            }
            setDay("");
            setMeal("");
            setEditId(null);
            fetchMeals();
        } catch (err) {
            console.error("Error saving meal:", err);
        }
    };

    // Edit
    const handleEdit = (mealItem) => {
        setDay(mealItem.day);
        setMeal(mealItem.meal);
        setEditId(mealItem.id);
    };

    // Delete
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5001/api/meal-chart/${id}`);
            fetchMeals();
        } catch (err) {
            console.error("Error deleting meal:", err);
        }
    };

    return (
        <div className="bg-gray-100 p-4 mt-3 rounded shadow-md">
            <h2 className="text-lg font-bold mb-3">Meal Chart</h2>



            {/* Form */}

            {userRole === "Admin" && (
                <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 mb-4">
                    <input
                        type="text"
                        placeholder="Day (e.g., Today)"
                        className="p-2 rounded border"
                        value={day}
                        onChange={(e) => setDay(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Meal (e.g., Fried Rice)"
                        className="p-2 rounded border"
                        value={meal}
                        onChange={(e) => setMeal(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        {editId ? "Update" : "Add"}
                    </button>
                </form>
            )}




            {/* Meal List */}
            <ul className="space-y-2">
                {meals.map((m) => (
                    <li
                        key={m.id}
                        className="bg-white p-3 rounded shadow flex justify-between items-center"
                    >
                        <div>
                            <strong>{m.day}</strong>: {m.meal}
                        </div>
                        <div className="flex gap-2">
                            {userRole === "Admin" && (

                                <button
                                    className="text-blue-500 hover:underline"
                                    onClick={() => handleEdit(m)}
                                >
                                    <EditIcon />
                                </button>
                            )}

                            {userRole === "Admin" && (
                                <button
                                    className="text-red-500 hover:underline"
                                    onClick={() => handleDelete(m.id)}
                                >
                                     <DeleteIcon />
                                </button>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MealChart;
