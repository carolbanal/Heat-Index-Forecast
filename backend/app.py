from fastapi import FastAPI, HTTPException
import joblib
import os
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import logging

app = FastAPI()

data_directory = '/Users/carol/Documents/School/3rd Year/2nd Sem/Forecast/Heat Index Forecasting App/backend/Data'
model_directory = '/Users/carol/Documents/School/3rd Year/2nd Sem/Forecast/Heat Index Forecasting App/backend/models'

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def load_city_models():
    city_models = {}
    for model_file in os.listdir(model_directory):
        if model_file.endswith('_heat_index_model.pkl'):
            city_name = model_file.replace('_heat_index_model.pkl', '')
            model_path = os.path.join(model_directory, model_file)
            scaler_X_path = os.path.join(model_directory, f"{city_name}_scaler_X.pkl")
            scaler_y_path = os.path.join(model_directory, f"{city_name}_scaler_y.pkl")
            
            try:
                model = joblib.load(model_path)
            except Exception as e:
                logger.error(f"Error loading model for {city_name}: {e}")
                continue
            
            if os.path.exists(scaler_X_path) and os.path.exists(scaler_y_path):
                try:
                    scaler_X = joblib.load(scaler_X_path)
                    scaler_y = joblib.load(scaler_y_path)
                    city_models[city_name] = (model, scaler_X, scaler_y)
                except Exception as e:
                    logger.error(f"Error loading scalers for {city_name}: {e}")
            else:
                logger.warning(f"Scalers for {city_name} not found. Skipping...")
    
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
    
    model, scaler_X, scaler_y = city_models[city]
    today = datetime.today()
    today_str = today.strftime("%Y-%m-%d")
    
    latest_date = np.array([[today.year, today.month, today.day]])
    
    try:
        latest_scaled = scaler_X.transform(latest_date)
        predicted_heat_index = model.predict(latest_scaled)
        predicted_heat_index = scaler_y.inverse_transform(predicted_heat_index.reshape(-1, 1))[0, 0]
        predicted_heat_index = int(max(20, min(60, predicted_heat_index)))  # Convert to integer
    except Exception as e:
        logger.error(f"Error making prediction for {city}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
    update_csv(city, {today_str: predicted_heat_index})
    
    return {
        "city": city,
        "current_heat_index": predicted_heat_index,
        "date": today_str
    }

@app.get("/forecast/7days/{city}")
def get_7_day_forecast(city: str):
    if city not in city_models:
        raise HTTPException(status_code=404, detail="City not found")
    
    model, scaler_X, scaler_y = city_models[city]
    predictions = {}
    today = datetime.today()
    
    for day in range(7):
        future_date = today + timedelta(days=day + 1)
        date_str = future_date.strftime("%Y-%m-%d")
        future_date_array = np.array([[future_date.year, future_date.month, future_date.day]])
        
        try:
            future_scaled = scaler_X.transform(future_date_array)
            future_prediction = model.predict(future_scaled)
            future_prediction = scaler_y.inverse_transform(future_prediction.reshape(-1, 1))[0, 0]
            future_prediction = int(max(20, min(60, future_prediction)))  # Convert to integer
        except Exception as e:
            logger.error(f"Error making prediction for {city} on {date_str}: {e}")
            raise HTTPException(status_code=500, detail="Internal Server Error")
        predictions[date_str] = future_prediction
    
    update_csv(city, predictions)
    
    return {
        "city": city,
        "7_day_forecast": predictions
    }

if __name__ == "__main__":
    import uvicorn
    print("Starting FastAPI server...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
