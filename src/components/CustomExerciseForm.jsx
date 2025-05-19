import React, { useState } from "react";
import "./CustomExerciseForm.css";

const CustomExerciseForm = ({ onAddCustomExercise }) => {
  const [exerciseData, setExerciseData] = useState({
    name: "",
    gifUrl: "",
    target: "",
    equipment: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExerciseData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple validation
    if (!exerciseData.name || !exerciseData.target || !exerciseData.equipment) {
      alert("Please fill in name, target, and equipment.");
      return;
    }

    // Generate a unique ID for the custom exercise
    const newCustomExercise = {
      id: Date.now().toString(), // Use timestamp as a simple unique ID
      ...exerciseData,
    };

    onAddCustomExercise(newCustomExercise);

    // Clear the form
    setExerciseData({
      name: "",
      gifUrl: "",
      target: "",
      equipment: "",
    });
  };

  return (
    <div className="custom-exercise-form-card">
      <h2>Add Custom Exercise</h2>
      <form onSubmit={handleSubmit} className="custom-exercise-form">
        <div className="form-group">
          <label htmlFor="name">Exercise Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={exerciseData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="gifUrl">Image URL (Optional):</label>
          <input
            type="text"
            id="gifUrl"
            name="gifUrl"
            value={exerciseData.gifUrl}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="target">Target Muscle:</label>
          <input
            type="text"
            id="target"
            name="target"
            value={exerciseData.target}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="equipment">Equipment:</label>
          <input
            type="text"
            id="equipment"
            name="equipment"
            value={exerciseData.equipment}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="add-custom-btn">
          Add Exercise
        </button>
      </form>
    </div>
  );
};

export default CustomExerciseForm;
