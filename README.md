# Fitness Tracker Application

A client-side fitness tracking application built with React.js. This application allows users to browse a library of exercises, log their workouts with sets, reps, and weight, view their workout history, see statistics based on their logged workouts, and add their own custom exercises.

## Features

- **Exercise Library:** Browse a list of exercises fetched from the ExerciseDB API.
- **Workout Logging:** Add exercises from the library to a current workout, input sets, reps, and weight.
- **Workout History:** Save completed workouts and view a history of past training sessions.
- **Statistics:** See key metrics like total workouts, exercises performed, most used exercise, total sets, reps, and weight.
- **Custom Exercises:** Add your own exercises to the library.

## Setup and Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd fitness-tracker
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Get an ExerciseDB API Key:**

    - Sign up for a free account on [RapidAPI](https://rapidapi.com/).
    - Search for the "ExerciseDB" API and subscribe to a plan (a free tier is available).
    - Get your API key.

4.  **Configure API Key:**

    - Open the `fitness-tracker/src/config.js` file.
    - Replace `'YOUR_API_KEY'` with your actual RapidAPI key:
      ```javascript
      export const API_CONFIG = {
        RAPID_API_KEY: "a24f251453msh70494f82808084ep159758jsnb6bfe92f32cf", // Replace with your key
        RAPID_API_HOST: "exercisedb.p.rapidapi.com",
      };
      ```
      _(Note: Storing API keys directly in code is not recommended for production. For this lab assignment, it's acceptable, but in a real application, use environment variables or a backend.)_

5.  **Start the development server:**
    ```bash
    npm start
    # or if using Vite
    npm run dev
    ```
    The application should open in your browser at `http://localhost:5173` (or another port).

## How to Use

- **Home:** View a welcome message and your workout statistics.
- **Exercises:** Browse the exercise library, add exercises to your current workout, input sets, reps, and weight, and save your workout. You can also click "Add Custom Exercise" to add your own.
- **Workouts:** View your saved workout history.

## Data Persistence

Workout history and custom exercises are saved locally in your browser's `localStorage`. This data will persist across sessions in the same browser unless cleared.

## Technologies Used

- React.js
- JavaScript
- HTML
- CSS
- ExerciseDB API (via RapidAPI)
- Vite (for development environment)

## Potential Future Enhancements

- Edit or delete saved workouts.
- Add notes to workouts.
- Advanced statistics and progress tracking.
- User authentication and data synchronization.
- Improved UI/UX.
