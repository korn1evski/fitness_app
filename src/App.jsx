import React, { useState, useEffect } from "react";
import "./App.css";
import Layout from "./components/Layout";
import ExerciseList from "./components/ExerciseList";

function App() {
  const [activePage, setActivePage] = useState("home");
  const [workout, setWorkout] = useState([]);
  const [error, setError] = useState("");
  const [savedWorkouts, setSavedWorkouts] = useState(() => {
    const stored = localStorage.getItem("savedWorkouts");
    return stored ? JSON.parse(stored) : [];
  });

  // Save workouts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("savedWorkouts", JSON.stringify(savedWorkouts));
  }, [savedWorkouts]);

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

  const handleSaveWorkout = () => {
    if (workout.length === 0) {
      setError("Add at least one exercise to save a workout.");
      setTimeout(() => setError(""), 2000);
      return;
    }
    const newWorkout = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      exercises: workout,
    };
    setSavedWorkouts([newWorkout, ...savedWorkouts]);
    setWorkout([]);
    setError("");
  };

  let content;
  if (activePage === "home") {
    // Calculate statistics
    const totalWorkouts = savedWorkouts.length;
    const allExercises = savedWorkouts.flatMap((w) => w.exercises);
    const totalExercises = allExercises.length;
    const exerciseCount = {};
    let totalSets = 0,
      totalReps = 0,
      totalWeight = 0;
    allExercises.forEach((ex) => {
      exerciseCount[ex.name] = (exerciseCount[ex.name] || 0) + 1;
      totalSets += Number(ex.sets) || 0;
      totalReps += Number(ex.reps) || 0;
      totalWeight += Number(ex.weight) || 0;
    });
    const mostUsedExercise = Object.keys(exerciseCount).reduce(
      (a, b) => (exerciseCount[a] > exerciseCount[b] ? a : b),
      Object.keys(exerciseCount)[0] || "-"
    );

    content = (
      <>
        <div className="welcome-section">
          <h1>Welcome to Fitness Tracker</h1>
          <p>Start your fitness journey today!</p>
        </div>
        <div className="stats-section">
          <h2>Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-label">Total Workouts</span>
              <span className="stat-value">{totalWorkouts}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Total Exercises</span>
              <span className="stat-value">{totalExercises}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Most Used Exercise</span>
              <span className="stat-value">{mostUsedExercise || "-"}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Total Sets</span>
              <span className="stat-value">{totalSets}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Total Reps</span>
              <span className="stat-value">{totalReps}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Total Weight</span>
              <span className="stat-value">{totalWeight}</span>
            </div>
          </div>
        </div>
      </>
    );
  } else if (activePage === "exercises") {
    content = (
      <>
        {workout.length > 0 && (
          <div className="current-workout-section">
            <h2>Current Workout</h2>
            {error && <div className="error">{error}</div>}
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
            <button className="save-workout-btn" onClick={handleSaveWorkout}>
              Save Workout
            </button>
          </div>
        )}
        <ExerciseList onAddToWorkout={handleAddToWorkout} />
      </>
    );
  } else if (activePage === "workouts") {
    content = (
      <div className="workout-history-section">
        <h2>Workout History</h2>
        {savedWorkouts.length === 0 ? (
          <p>No workouts saved yet.</p>
        ) : (
          <ul className="workout-history-list">
            {savedWorkouts.map((workout) => (
              <li key={workout.id} className="workout-history-item">
                <div className="workout-history-date">{workout.date}</div>
                <ul className="workout-history-ex-list">
                  {workout.exercises.map((ex) => (
                    <li key={ex.id} className="workout-history-ex-item">
                      <img
                        src={ex.gifUrl}
                        alt={ex.name}
                        className="workout-ex-img"
                      />
                      <div className="workout-ex-info">
                        <span className="workout-ex-name">{ex.name}</span>
                        <span>Sets: {ex.sets}</span>
                        <span>Reps: {ex.reps}</span>
                        <span>Weight: {ex.weight}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
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
