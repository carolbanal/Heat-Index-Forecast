# Heat Index Forecasting App

## Overview

Welcome to the Heat Index Forecasting App repository! This application is designed to predict the heat index for various regions in the Philippines. Using historical weather data, our model forecasts the heat index for the current day and the next 7 days. This backend service provides predictions via a RESTful API for use in mobile applications and utilizes Linear Regression for modeling and forecasting based on historical weather data.

## Features

- **Predicts Heat Index:** Forecasts the heat index for selected regions based on historical data.
- **7-Day Forecast:** Provides heat index values for the next 7 days.
- **Region-Specific Models:** Utilizes machine learning models tailored to different regions in the Philippines.

## Project Structure

- **`backend/`**: Contains the backend code and model files.
  - **`app.py`**: Main application script for serving the API.
  - **`Data/`**: Historical weather data.
  - **`models/`**: Saved machine learning models and scalers.
- **`requirements.txt`**: Python dependencies for the project.

## Installation

To set up the project locally, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/heat-index-forecasting-app.git
   cd heat-index-forecasting-app

2. **Install dependencies:**
    It is recommended to create a virtual environment before installing dependencies.
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   pip install -r requirements.txt

3. **Set up the environment:**
   Ensure that you have the necessary environment variables and configuration files set up. Refer to .env.example for details.

4. **Run the application:**
   ```bash
   python backend/app.py






