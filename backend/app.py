from fastapi import FastAPI, HTTPException
import joblib
import os
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from keras.models import load_model
import logging

app = FastAPI()

data_directory = '/Users/carol/Documents/School/3rd Year/2nd Sem/Forecast/Heat Index Forecasting App/backend/Data'
model_directory = '/Users/carol/Documents/School/3rd Year/2nd Sem/Forecast/Heat Index Forecasting App/backend/models'

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def load_city_models():
    city_models = {}
    for model_file in os.listdir(model_directory):
        if model_file.endswith('_heat_index_model.keras'):
            city_name = model_file.replace('_heat_index_model.keras', '')
            model_path = os.path.join(model_directory, model_file)
            scaler_path = os.path.join(model_directory, f"{city_name}_scaler.pkl")
            
            try:
                model = load_model(model_path)
            except Exception as e:
                logger.error(f"Error loading model for {city_name}: {e}")
                continue
            
            if os.path.exists(scaler_path):
                try:
                    scaler = joblib.load(scaler_path)
                    city_models[city_name] = (model, scaler)
                except Exception as e:
                    logger.error(f"Error loading scaler for {city_name}: {e}")
            else:
                logger.warning(f"Scaler file for {city_name} not found. Skipping...")
    
    return city_models

city_models = load_city_models()

def update_csv(city: str, predictions: dict):
    file_path = os.path.join(data_directory, f"{city}.csv")
    
    if os.path.exists(file_path):
        df = pd.read_csv(file_path)
    else:
        df = pd.DataFrame(columns=["Year", "Month", "Day", "HeatIndex"])
    
    for date_str, heat_index in predictions.items():
        date_obj = datetime.strptime(date_str, "%Y-%m-%d")
        new_row = {
            "Year": date_obj.year,
            "Month": date_obj.month,
            "Day": date_obj.day,
            "HeatIndex": heat_index
        }
        df = pd.concat([df, pd.DataFrame([new_row])], ignore_index=True)
    
    df.to_csv(file_path, index=False)

@app.get("/cities")
def get_cities():
    return list(city_models.keys())

@app.get("/forecast/current/{city}")
def get_current_forecast(city: str):
    if city not in city_models:
        raise HTTPException(status_code=404, detail="City not found")
    
    model, scaler = city_models[city]
    today = datetime.today()
    today_str = today.strftime("%Y-%m-%d")
    
    latest_date = np.array([[today.day]]).reshape(-1, 1)
    
    try:
        latest_scaled = scaler.transform(latest_date)
        predicted_heat_index = model.predict(latest_scaled)
        predicted_heat_index = scaler.inverse_transform(predicted_heat_index)[0, 0]
        
        # Clamp predicted value to a reasonable range
        predicted_heat_index = max(20, min(60, predicted_heat_index))
    except Exception as e:
        logger.error(f"Error making prediction for {city}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
    update_csv(city, {today_str: float(predicted_heat_index)})
    
    return {
        "city": city,
        "current_heat_index": float(predicted_heat_index),
        "date": today_str
    }

@app.get("/forecast/7days/{city}")
def get_7_day_forecast(city: str):
    if city not in city_models:
        raise HTTPException(status_code=404, detail="City not found")
    
    model, scaler = city_models[city]
    predictions = {}
    today = datetime.today()
    
    for day in range(7):
        future_date = today + timedelta(days=day + 1)
        date_str = future_date.strftime("%Y-%m-%d")
        
        future_date_array = np.array([[future_date.day]]).reshape(-1, 1)
        
        try:
            future_scaled = scaler.transform(future_date_array)
            future_prediction = model.predict(future_scaled)
            future_prediction = scaler.inverse_transform(future_prediction)[0, 0]
            
            # Clamp predicted value to a reasonable range
            future_prediction = max(20, min(60, future_prediction))
        except Exception as e:
            logger.error(f"Error making prediction for {city} on {date_str}: {e}")
            raise HTTPException(status_code=500, detail="Internal Server Error")
        predictions[date_str] = float(future_prediction)
    
    update_csv(city, predictions)
    
    return {
        "city": city,
        "7_day_forecast": predictions
    }

if __name__ == "__main__":
    import uvicorn
    print("Starting FastAPI server...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
