import pandas as pd
from sklearn.preprocessing import MinMaxScaler
import numpy as np
import os
import joblib
from keras.models import Sequential
from keras.layers import LSTM, Dense, Input
from keras.optimizers import Adam

def load_and_preprocess_data(file_path):
    # Load the CSV data
    df = pd.read_csv(file_path)
    
    # Extract the HeatIndex values
    heat_index = df[['HeatIndex']].values
    
    # Normalize the HeatIndex values
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(heat_index)
    
    return scaled_data, scaler

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
        Input(shape=(X.shape[1], 1)),
        LSTM(50, return_sequences=True),
        LSTM(50),
        Dense(1)
    ])
    model.compile(optimizer=Adam(learning_rate=0.001), loss='mse')
    model.fit(X, y, epochs=20, batch_size=32)
    return model

def process_and_train_all_cities(data_dir, model_dir):
    for filename in os.listdir(data_dir):
        if filename.endswith('.csv'):
            city_name = filename.replace('.csv', '').replace('_heat_index', '')
            file_path = os.path.join(data_dir, filename)
            print(f"Processing {city_name}...")

            scaled_data, scaler = load_and_preprocess_data(file_path)
            model = train_lstm_model(scaled_data)

            # Save using the recommended format
            model_path = os.path.join(model_dir, f'{city_name}_heat_index_model.keras')
            scaler_path = os.path.join(model_dir, f'{city_name}_scaler.pkl')
            
            model.save(model_path)
            joblib.dump(scaler, scaler_path)
            print(f"Model and scaler saved for {city_name}")

# Run the preprocessing and training
data_directory = '/Users/carol/Documents/School/3rd Year/2nd Sem/Forecast/Heat Index Forecasting App/backend/Data'
model_directory = 'backend/models'
process_and_train_all_cities(data_directory, model_directory)
