import React from "react";
import "./ExerciseList.css";

const ExerciseList = ({ exercises, onAddToWorkout, loading, error }) => {
  if (loading) {
    return <div className="loading">Loading exercises...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="exercise-section-card">
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
