from fastapi import FastAPI, HTTPException
import joblib
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import os
import uvicorn
from google.cloud import storage

app = FastAPI()

# Path to models directory in Google Cloud Storage
BUCKET_NAME = 'backend-api'

def load_models_and_scalers(city_name):
    """
    Load models and scalers for a specific city from Google Cloud Storage.
    """
    try:
        # Initialize a storage client
        client = storage.Client()
        bucket = client.get_bucket(BUCKET_NAME)

        models = {}
        scalers = {}

        # Load models
        for model_type in ['linear_regression', 'knn', 'random_forest', 'decision_tree']:
            model_blob = bucket.blob(f'models/{city_name}_{model_type}_model.pkl')
            model_blob.download_to_filename(f'/tmp/{city_name}_{model_type}_model.pkl')
            models[model_type] = joblib.load(f'/tmp/{city_name}_{model_type}_model.pkl')

        # Load scalers
        for scaler_type in ['scaler_X', 'scaler_y']:
            scaler_blob = bucket.blob(f'models/{city_name}_{scaler_type}.pkl')
            scaler_blob.download_to_filename(f'/tmp/{city_name}_{scaler_type}.pkl')
            scalers[scaler_type] = joblib.load(f'/tmp/{city_name}_{scaler_type}.pkl')

        return models, scalers
    except Exception as e:
        raise FileNotFoundError(f"Error loading models or scalers: {e}")

def get_prediction(models, scalers, X_input):
    """
    Get predictions from all models and return the consensus or mean.
    """
    # Convert to DataFrame with feature names
    X_input_df = pd.DataFrame(X_input, columns=['Year', 'Month', 'Day'])
    
    X_scaled = scalers['scaler_X'].transform(X_input_df)
    predictions = {
        'linear_regression': scalers['scaler_y'].inverse_transform(models['linear_regression'].predict(X_scaled).reshape(-1, 1)).flatten(),
        'knn': scalers['scaler_y'].inverse_transform(models['knn'].predict(X_scaled).reshape(-1, 1)).flatten(),
        'random_forest': scalers['scaler_y'].inverse_transform(models['random_forest'].predict(X_scaled).reshape(-1, 1)).flatten(),
        'decision_tree': scalers['scaler_y'].inverse_transform(models['decision_tree'].predict(X_scaled).reshape(-1, 1)).flatten()
    }

    # Calculate consensus or mean
    values, counts = np.unique(np.concatenate(list(predictions.values())), return_counts=True)
    if np.any(counts >= 2):
        final_prediction = round(values[counts >= 2][0])
    else:
        final_prediction = round(np.mean(np.concatenate(list(predictions.values()))))

    return final_prediction

@app.get("/forecast/today/{city_name}")
def get_today_forecast(city_name: str):
    """
    Endpoint to get today's forecast for a city.
    """
    try:
        # Load models and scalers
        models, scalers = load_models_and_scalers(city_name)

        # Prediction for today
        today = datetime.now()
        X_input = np.array([[today.year, today.month, today.day]])
        prediction = get_prediction(models, scalers, X_input)
        
        return {'date': today.strftime('%Y-%m-%d'), 'predicted_value': prediction}

    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/forecast/7days/{city_name}")
def get_7day_forecast(city_name: str):
    """
    Endpoint to get the 7-day forecast for a city.
    """
    try:
        # Load models and scalers
        models, scalers = load_models_and_scalers(city_name)

        # Prediction for the next 7 days
        today = datetime.now()
        dates = [today + timedelta(days=i) for i in range(1, 8)]
        predictions = []

        for date in dates:
            X_input = np.array([[date.year, date.month, date.day]])
            prediction = get_prediction(models, scalers, X_input)
            predictions.append({'date': date.strftime('%Y-%m-%d'), 'predicted_value': prediction})

        return predictions

    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Adding the root route
@app.get("/")
async def root():
    return {"message": "Hello, Vercel!"}

# Uvicorn server for local development
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)