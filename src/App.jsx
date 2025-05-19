import React, { useState } from "react";
import "./App.css";
import Layout from "./components/Layout";
import ExerciseList from "./components/ExerciseList";

function App() {
  const [activePage, setActivePage] = useState("home");
  const [workout, setWorkout] = useState([]);
  const [error, setError] = useState("");

  const handleAddToWorkout = (exercise) => {
    if (workout.find((ex) => ex.id === exercise.id)) {
      setError("Exercise already added to workout.");
      setTimeout(() => setError(""), 2000);
      return;
    }
    setWorkout([...workout, exercise]);
    setError("");
  };

  const handleRemoveFromWorkout = (id) => {
    setWorkout(workout.filter((ex) => ex.id !== id));
  };

  let content;
  if (activePage === "home") {
    content = (
      <div className="welcome-section">
        <h1>Welcome to Fitness Tracker</h1>
        <p>Start your fitness journey today!</p>
      </div>
    );
  } else if (activePage === "exercises") {
    content = (
      <>
        <ExerciseList onAddToWorkout={handleAddToWorkout} />
        <div className="current-workout-section">
          <h2>Current Workout</h2>
          {error && <div className="error">{error}</div>}
          {workout.length === 0 ? (
            <p>No exercises added yet.</p>
          ) : (
            <ul className="workout-list">
              {workout.map((exercise) => (
                <li key={exercise.id} className="workout-item">
                  <span>{exercise.name}</span>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveFromWorkout(exercise.id)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </>
    );
  } else if (activePage === "workouts") {
    content = (
      <div className="welcome-section">
        <h1>Workouts</h1>
        <p>Your workout history and plans will appear here.</p>
      </div>
    );
  }

  return (
    <Layout activePage={activePage} setActivePage={setActivePage}>
      {content}
    </Layout>
  );
}

export default App;
