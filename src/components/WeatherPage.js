import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

function WeatherPage() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const city = searchParams.get("city");

  useEffect(() => {
    fetchWeatherData();
  }, [city]);

  const fetchWeatherData = () => {
    const apiKey = "dadbc57efbf758c7dc77191a6325b312";
    console.log(city);
    if (!city) return; // Don't make the request if city is not provided

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
    )
      .then((response) => response.json())
      .then((data) => {
        setWeatherData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
        setLoading(false);
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!weatherData) {
    return <div>Error fetching weather data</div>;
  }

  return (
    <div className="bg-green-300 h-[647px] flex justify-center items-center">
  <div className="bg-white max-w-lg mt-10 rounded-xl shadow-2xl p-6">
    <h1 className="text-3xl font-bold mb-4">Weather for {city}</h1>
    <div className="grid grid-cols-2 gap-4">
      <div className="flex items-center">
        <span className="text-xl font-semibold">Temperature:</span>
        <span className="ml-2">{weatherData.main.temp}°C</span>
      </div>
      <div className="flex items-center">
        <span className="text-xl font-semibold">Description:</span>
        <span className="ml-2">{weatherData.weather[0].description}</span>
      </div>
      <div className="flex items-center">
        <span className="text-xl font-semibold">Humidity:</span>
        <span className="ml-2">{weatherData.main.humidity}%</span>
      </div>
      <div className="flex items-center">
        <span className="text-xl font-semibold">Wind Speed:</span>
        <span className="ml-2">{weatherData.wind.speed} m/s</span>
      </div>
      <div className="flex items-center">
        <span className="text-xl font-semibold">Pressure:</span>
        <span className="ml-2">{weatherData.main.pressure} hPa</span>
      </div>
    </div>
  </div>
</div>

  );
}

export default WeatherPage;
