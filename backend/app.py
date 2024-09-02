from fastapi import FastAPI, HTTPException
import joblib
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import os

app = FastAPI()

# Path to models directory
MODELS_DIR = "/Users/carol/Documents/School/3rd Year/2nd Sem/Forecast/Heat Index Forecasting App/backend/models"

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
    X_scaled = scalers['scaler_X'].transform(X_input)
    predictions = {
        'linear_regression': scalers['scaler_y'].inverse_transform(models['linear_regression'].predict(X_scaled).reshape(-1, 1)).flatten(),
        'knn': scalers['scaler_y'].inverse_transform(models['knn'].predict(X_scaled).reshape(-1, 1)).flatten(),
        'random_forest': scalers['scaler_y'].inverse_transform(models['random_forest'].predict(X_scaled).reshape(-1, 1)).flatten(),
        'decision_tree': scalers['scaler_y'].inverse_transform(models['decision_tree'].predict(X_scaled).reshape(-1, 1)).flatten()
    }

    # Calculate consensus or mean
    values, counts = np.unique(list(predictions.values()), return_counts=True)
    if np.any(counts >= 2):
        final_prediction = round(values[counts >= 2][0])
    else:
        final_prediction = round(np.mean(list(predictions.values())))

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
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")

@app.get("/forecast/7days/{city_name}")
def get_7_day_forecast(city_name: str):
    """
    Endpoint to get the next 7-day forecast for a city.
    """
    try:
        # Load models and scalers
        models, scalers = load_models_and_scalers(city_name)

        # Create a date range for the next 7 days
        date_range = pd.date_range(start=datetime.now() + timedelta(days=1), periods=7).to_pydatetime().tolist()
        
        predictions = []
        for date in date_range:
            X_input = np.array([[date.year, date.month, date.day]])
            prediction = get_prediction(models, scalers, X_input)
            predictions.append({
                'date': date.strftime('%Y-%m-%d'),
                'predicted_value': prediction
            })

        return predictions

    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
