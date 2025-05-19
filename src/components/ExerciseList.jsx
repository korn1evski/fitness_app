import React, { useState, useEffect } from "react";
import { API_CONFIG } from "../config";
import "./ExerciseList.css";

const ExerciseList = ({ onAddToWorkout }) => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExercises = async () => {
      if (!API_CONFIG.RAPID_API_KEY) {
        setError(
          "API key is not configured. Please add your RapidAPI key to the .env file."
        );
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "https://exercisedb.p.rapidapi.com/exercises",
          {
            headers: {
              "X-RapidAPI-Key": API_CONFIG.RAPID_API_KEY,
              "X-RapidAPI-Host": API_CONFIG.RAPID_API_HOST,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch exercises");
        }

        const data = await response.json();
        setExercises(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  if (loading) {
    return <div className="loading">Loading exercises...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="exercise-list">
      <h2>Available Exercises</h2>
      <div className="exercise-grid">
        {exercises.map((exercise) => (
          <div key={exercise.id} className="exercise-card">
            <img src={exercise.gifUrl} alt={exercise.name} />
            <h3>{exercise.name}</h3>
            <p>Target: {exercise.target}</p>
            <p>Equipment: {exercise.equipment}</p>
            {onAddToWorkout && (
              <button
                className="add-to-workout-btn"
                onClick={() => onAddToWorkout(exercise)}
              >
                Add to Workout
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExerciseList;
