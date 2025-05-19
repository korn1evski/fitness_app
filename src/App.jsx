import React, { useState, useEffect } from "react";
import "./App.css";
import Layout from "./components/Layout";
import ExerciseList from "./components/ExerciseList";
import CustomExerciseForm from "./components/CustomExerciseForm"; // Import CustomExerciseForm
import { API_CONFIG } from "./config"; // Import API config

function App() {
  const [activePage, setActivePage] = useState("home");
  const [workout, setWorkout] = useState([]);
  const [error, setError] = useState("");
  const [savedWorkouts, setSavedWorkouts] = useState(() => {
    const stored = localStorage.getItem("savedWorkouts");
    return stored ? JSON.parse(stored) : [];
  });
  const [apiExercises, setApiExercises] = useState([]); // State for API exercises
  const [customExercises, setCustomExercises] = useState(() => {
    // State for custom exercises
    const stored = localStorage.getItem("customExercises");
    return stored ? JSON.parse(stored) : [];
  });
  const [loadingExercises, setLoadingExercises] = useState(true); // Loading state for exercises
  const [fetchError, setFetchError] = useState(null); // State for fetch errors

  // Load saved workouts from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("savedWorkouts");
    if (stored) {
      setSavedWorkouts(JSON.parse(stored));
    }
  }, []);

  // Save workouts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("savedWorkouts", JSON.stringify(savedWorkouts));
  }, [savedWorkouts]);

  // Save custom exercises to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("customExercises", JSON.stringify(customExercises));
  }, [customExercises]);

  // Fetch API exercises on mount
  useEffect(() => {
    const fetchExercises = async () => {
      if (!API_CONFIG.RAPID_API_KEY) {
        setFetchError(
          "API key is not configured. Please add your RapidAPI key to the config file or .env file."
        );
        setLoadingExercises(false);
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
        setApiExercises(data);
        setLoadingExercises(false);
      } catch (err) {
        setFetchError(err.message);
        setLoadingExercises(false);
      }
    };
    fetchExercises();
  }, []);

  // Combine API and custom exercises
  const allExercises = [...apiExercises, ...customExercises];

  // Handler to add custom exercise
  const handleAddCustomExercise = (newExercise) => {
    setCustomExercises((prevCustomExercises) => [
      ...prevCustomExercises,
      newExercise,
    ]);
  };

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
    const allExercisesInHistory = savedWorkouts.flatMap((w) => w.exercises);
    const totalExercisesInHistory = allExercisesInHistory.length;
    const exerciseCount = {};
    let totalSets = 0,
      totalReps = 0,
      totalWeight = 0;
    allExercisesInHistory.forEach((ex) => {
      exerciseCount[ex.name] = (exerciseCount[ex.name] || 0) + 1;
      totalSets += Number(ex.sets) || 0;
      totalReps += Number(ex.reps) || 0;
      totalWeight += Number(ex.weight) || 0;
    });
    let mostUsedExercise = null;
    let mostUsedExerciseGif = null;
    if (Object.keys(exerciseCount).length > 0) {
      mostUsedExercise = Object.keys(exerciseCount).reduce((a, b) =>
        exerciseCount[a] > exerciseCount[b] ? a : b
      );
      const found = allExercisesInHistory.find(
        (ex) => ex.name === mostUsedExercise
      );
      mostUsedExerciseGif = found ? found.gifUrl : null;
    }

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
              <span className="stat-value stat-center">{totalWorkouts}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Total Exercises</span>
              <span className="stat-value stat-center">
                {totalExercisesInHistory}
              </span>
            </div>
            <div className="stat-card most-used-ex-card">
              <span className="stat-label">Most Used Exercise</span>
              {mostUsedExerciseGif && (
                <img
                  src={mostUsedExerciseGif}
                  alt={mostUsedExercise}
                  className="stat-ex-gif"
                />
              )}
              <span className="stat-ex-name">{mostUsedExercise || "-"}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Total Sets</span>
              <span className="stat-value stat-center">{totalSets}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Total Reps</span>
              <span className="stat-value stat-center">{totalReps}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Total Weight</span>
              <span className="stat-value stat-center">{totalWeight}</span>
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
        {/* Add Custom Exercise Form */}
        <CustomExerciseForm onAddCustomExercise={handleAddCustomExercise} />

        {loadingExercises ? (
          <div className="loading">Loading exercises...</div>
        ) : fetchError ? (
          <div className="error">Error fetching exercises: {fetchError}</div>
        ) : API_CONFIG.RAPID_API_KEY ? (
          <ExerciseList
            exercises={allExercises}
            onAddToWorkout={handleAddToWorkout}
          />
        ) : (
          <div className="error">
            API key is not configured. Please add your RapidAPI key to the
            config file or .env file.
          </div>
        )}
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
