"use client";

import { useEffect, useState } from "react";

const KEY = process.env.NEXT_PUBLIC_KEY;

interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  weather: [
    {
      icon: string;
    }
  ];
}

export default function Card() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        // Aquí puedes pasar las variables lat y lon a tu API de clima
        fetch(
          `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&APPID=${KEY}&lon=${lon}&units=metric&lang=es`
        )
          .then((response) => response.json())
          .then((data) => setWeatherData(data));
        console.log("lat: ", lat, " lon: ", lon);
      });
    }
  }, []);

  if (!weatherData) {
    return (
      <div className="w-64 h-64 rounded-lg shadow-lg p-4 flex flex-col items-center">
        <h1 className="text-xl font-bold">Loading...</h1>
      </div>
    );
  }

  const iconUrl = `http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`;

  return (
    <div className="w-64 h-64 rounded-lg shadow-lg p-4 flex flex-col items-center">
      <h1 className="text-xl font-bold">{weatherData.name}</h1>
      <img className="my-2 w-16" src={iconUrl} alt="Ícono del clima" />
      <p className="text-gray-700">
        Temperature: <b>{weatherData.main.temp}° C</b>
      </p>
      <p className="text-gray-700">
        Humidity: <b>{weatherData.main.humidity}%</b>
      </p>
      <p className="text-gray-700">
        Wind: <b>{weatherData.wind.speed} m/s</b>
      </p>
    </div>
  );
}
