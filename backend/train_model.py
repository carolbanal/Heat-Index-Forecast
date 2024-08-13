import os
import numpy as np
import pandas as pd
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Input
from tensorflow.keras.optimizers import Adam
from sklearn.preprocessing import MinMaxScaler
import joblib

def create_sequences(data, seq_length=30):
    X, y = [], []
    for i in range(seq_length, len(data)):
        X.append(data[i-seq_length:i, 0])
        y.append(data[i, 0])
    return np.array(X), np.array(y)

def train_lstm_model(scaled_data, seq_length=30):
    X, y = create_sequences(scaled_data, seq_length)
    X = X[:, :, np.newaxis]  # Add a new dimension for LSTM input
    model = Sequential([
        Input(shape=(X.shape[1], X.shape[2])),  # Use Input layer to specify input shape
        LSTM(50, return_sequences=True),
        LSTM(50),
        Dense(1)
    ])
    model.compile(optimizer=Adam(learning_rate=0.001), loss='mse')
    model.fit(X, y, epochs=20, batch_size=32)
    return model

def process_and_train_all_cities(data_dir, model_dir):
    if not os.path.exists(model_dir):
        os.makedirs(model_dir)

    for filename in os.listdir(data_dir):
        if filename.endswith('.csv'):
            city_name = filename.replace('.csv', '')
            file_path = os.path.join(data_dir, filename)
            print(f"Training model for {city_name}...")

            df = pd.read_csv(file_path)
            heat_index = df[['HeatIndex']].values

            # Scale data without strict range
            scaler = MinMaxScaler()  # Default scaling
            scaled_data = scaler.fit_transform(heat_index)

            model = train_lstm_model(scaled_data)

            # Save model and scaler
            model_path = os.path.join(model_dir, f'{city_name}_heat_index_model.keras')
            scaler_path = os.path.join(model_dir, f'{city_name}_scaler.pkl')
            
            model.save(model_path)
            joblib.dump(scaler, scaler_path)
            print(f"Model and scaler saved for {city_name}")

# Train models for all cities
data_directory = '/Users/carol/Documents/School/3rd Year/2nd Sem/Forecast/Heat Index Forecasting App/backend/Data'
model_directory = '/Users/carol/Documents/School/3rd Year/2nd Sem/Forecast/Heat Index Forecasting App/backend/models'
process_and_train_all_cities(data_directory, model_directory)
