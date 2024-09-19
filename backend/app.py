from fastapi import FastAPI, HTTPException
import joblib
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import os
import uvicorn
from google.cloud import storage

app = FastAPI()

# Google Cloud Storage configuration
BUCKET_NAME = "backend-api"
MODELS_DIR = "/app/models"

# Create the models directory if it does not exist
os.makedirs(MODELS_DIR, exist_ok=True)

def download_blob(bucket_name, blob_name, destination_file_name):
    """Downloads a blob from the bucket."""
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(blob_name)
    blob.download_to_filename(destination_file_name)
    print(f"Downloaded storage object '{blob_name}' to local file '{destination_file_name}'.")

def download_models():
    """Download all model files from the Google Cloud Storage bucket."""
    blobs = [
        'models/linear_regression_model.pkl',
        'models/knn_model.pkl',
        'models/random_forest_model.pkl',
        'models/decision_tree_model.pkl',
        'models/scaler_X.pkl',
        'models/scaler_y.pkl',
    ]
    
    for blob_name in blobs:
        destination_file_name = os.path.join(MODELS_DIR, os.path.basename(blob_name))
        download_blob(BUCKET_NAME, blob_name, destination_file_name)

download_models()

def load_models_and_scalers(city_name):
    """
    Load models and scalers for a specific city.
    """
    try:
        models = {
            'linear_regression': joblib.load(os.path.join(MODELS_DIR, f'{city_name}_linear_regression_model.pkl')),
            'knn': joblib.load(os.path.join(MODELS_DIR, f'{city_name}_knn_model.pkl')),
            'random_forest': joblib.load(os.path.join(MODELS_DIR, f'{city_name}_random_forest_model.pkl')),
            'decision_tree': joblib.load(os.path.join(MODELS_DIR, f'{city_name}_decision_tree_model.pkl')),
        }

        scalers = {
            'scaler_X': joblib.load(os.path.join(MODELS_DIR, f'{city_name}_scaler_X.pkl')),
            'scaler_y': joblib.load(os.path.join(MODELS_DIR, f'{city_name}_scaler_y.pkl')),
        }

        return models, scalers
    except Exception as e:
        raise FileNotFoundError(f"Error loading models or scalers: {e}")

def get_prediction(models, scalers, X_input):
    """
    Get predictions from all models and return the consensus or mean.
    """
    X_input_df = pd.DataFrame(X_input, columns=['Year', 'Month', 'Day'])
    X_scaled = scalers['scaler_X'].transform(X_input_df)
    predictions = {
        'linear_regression': scalers['scaler_y'].inverse_transform(models['linear_regression'].predict(X_scaled).reshape(-1, 1)).flatten(),
        'knn': scalers['scaler_y'].inverse_transform(models['knn'].predict(X_scaled).reshape(-1, 1)).flatten(),
        'random_forest': scalers['scaler_y'].inverse_transform(models['random_forest'].predict(X_scaled).reshape(-1, 1)).flatten(),
        'decision_tree': scalers['scaler_y'].inverse_transform(models['decision_tree'].predict(X_scaled).reshape(-1, 1)).flatten()
    }

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
        models, scalers = load_models_and_scalers(city_name)
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
        models, scalers = load_models_and_scalers(city_name)
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

@app.get("/")
async def root():
    return {"message": "Hello, Vercel!"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)