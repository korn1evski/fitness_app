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
    setWorkout([...workout, { ...exercise, sets: 3, reps: 10, weight: 0 }]);
    setError("");
  };

  const handleRemoveFromWorkout = (id) => {
    setWorkout(workout.filter((ex) => ex.id !== id));
  };

  const handleWorkoutInputChange = (id, field, value) => {
    setWorkout((prevWorkout) =>
      prevWorkout.map((ex) => (ex.id === id ? { ...ex, [field]: value } : ex))
    );
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
        <div className="current-workout-section">
          <h2>Current Workout</h2>
          {error && <div className="error">{error}</div>}
          {workout.length === 0 ? (
            <p>No exercises added yet.</p>
          ) : (
            <ul className="workout-list">
              {workout.map((exercise) => (
                <li key={exercise.id} className="workout-item improved">
                  <img
                    src={exercise.gifUrl}
                    alt={exercise.name}
                    className="workout-ex-img"
                  />
                  <div className="workout-ex-info">
                    <span className="workout-ex-name">{exercise.name}</span>
                    <div className="workout-inputs">
                      <label>
                        Sets:
                        <input
                          type="number"
                          min="1"
                          value={exercise.sets}
                          onChange={(e) =>
                            handleWorkoutInputChange(
                              exercise.id,
                              "sets",
                              Number(e.target.value)
                            )
                          }
                        />
                      </label>
                      <label>
                        Reps:
                        <input
                          type="number"
                          min="1"
                          value={exercise.reps}
                          onChange={(e) =>
                            handleWorkoutInputChange(
                              exercise.id,
                              "reps",
                              Number(e.target.value)
                            )
                          }
                        />
                      </label>
                      <label>
                        Weight:
                        <input
                          type="number"
                          min="0"
                          value={exercise.weight}
                          onChange={(e) =>
                            handleWorkoutInputChange(
                              exercise.id,
                              "weight",
                              Number(e.target.value)
                            )
                          }
                        />
                      </label>
                    </div>
                  </div>
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
        <ExerciseList onAddToWorkout={handleAddToWorkout} />
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
