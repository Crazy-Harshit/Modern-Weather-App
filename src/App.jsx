import React, { useState, useEffect } from 'react';
import './App.css';

const staticBackgroundImages = {
    'default': 'https://images.unsplash.com/photo-1507525428034-b723cf961c3e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Default clear sky
    'clear': 'https://images.unsplash.com/photo-1559987114-6b27d42df2e6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Bright clear sky
    'clouds': 'https://images.unsplash.com/photo-1501630834882-9694116c49c7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Overcast clouds
    'rain': 'https://images.unsplash.com/photo-1534082161706-e27419c8f615?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Rainy street
    'snow': 'https://images.unsplash.com/photo-1491002052184-c5a4b16279f0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Snowy landscape
    'mist': 'https://images.unsplash.com/photo-1443694935401-cc3f44383637?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Foggy/misty scene
    'drizzle': 'https://images.unsplash.com/photo-1433874797534-192931a3162b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Light rain/drizzle
    'thunderstorm': 'https://images.unsplash.com/photo-1605723547849-c1285657805d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Stormy sky
};


function App() {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState('');
    const [backgroundImage, setBackgroundImage] = useState(staticBackgroundImages.default); // Start with default

    const getBackgroundImage = (weatherCondition) => {
        if (!weatherCondition) return staticBackgroundImages.default;

        const lowerCaseCondition = weatherCondition.toLowerCase();
        if (lowerCaseCondition.includes('snow')) return staticBackgroundImages.snow;
        if (lowerCaseCondition.includes('rain') || lowerCaseCondition.includes('drizzle')) return staticBackgroundImages.rain;
        if (lowerCaseCondition.includes('cloud')) return staticBackgroundImages.clouds;
        if (lowerCaseCondition.includes('clear')) return staticBackgroundImages.clear;
        if (lowerCaseCondition.includes('mist') || lowerCaseCondition.includes('fog') || lowerCaseCondition.includes('haze')) return staticBackgroundImages.mist;
        if (lowerCaseCondition.includes('thunderstorm')) return staticBackgroundImages.thunderstorm;

        return staticBackgroundImages.default;
    };

    useEffect(() => {
        setBackgroundImage(staticBackgroundImages.default);
    }, []);

    const fetchWeatherData = async () => {
        setError('');
        setWeatherData(null); 
        if (!city) {
            setError('Please enter a city name.');
            setBackgroundImage(staticBackgroundImages.default); 
            return;
        }

        const apiKey = 'f5d9a4f39f48fe7d316557fc80b41e7a';
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (response.ok) {
                setWeatherData(data);
                setBackgroundImage(getBackgroundImage(data.weather[0].description));
            } else {
                setError(data.message || 'No such place exists!');
                setBackgroundImage(staticBackgroundImages.default); 
            }
        } catch (err) {
            setError('Failed to fetch weather data. Please try again.');
            setBackgroundImage(staticBackgroundImages.default); 
            console.error("Fetching error:", err);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault(); 
        fetchWeatherData();
    };

    return (
        <div className="App" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div className="glass-container">
                <h1 className="app-title">Weather App by Harshit</h1>

                <form onSubmit={handleSearch} className="search-form">
                    <label htmlFor="city-name" className="sr-only">City Name</label>
                    <input
                        id="city-name"
                        type="text"
                        placeholder="City Name *"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="city-input"
                    />
                    <button type="submit" className="search-button">SEARCH</button>
                </form>

                {error && (
                    <div className="error-message">
                        <span role="img" aria-label="cross">❌</span> {error}
                    </div>
                )}

                {weatherData && (
                    <div className="weather-display">
                        <img
                            src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                            alt={weatherData.weather[0].description}
                            className="weather-icon"
                        />
                        <h2 className="location-name">{weatherData.name}</h2>
                        <div className="weather-details-grid">
                            <div className="weather-card">feelsLike = {weatherData.main.feels_like}°C</div>
                            <div className="weather-card">Humidity = {weatherData.main.humidity}</div>
                            <div className="weather-card">Temp = {weatherData.main.temp}°C</div>
                            <div className="weather-card">Max Temp = {weatherData.main.temp_max}°C</div>
                            <div className="weather-card">Min Temp = {weatherData.main.temp_min}°C</div>
                            {weatherData.wind && <div className="weather-card">Wind = {weatherData.wind.speed} m/s</div>}
                        </div>
                        <p className="weather-description">
                            The Weather can be described as {weatherData.weather[0].description} and feels like {weatherData.main.feels_like}°C
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;