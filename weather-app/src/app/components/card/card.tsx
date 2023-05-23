"use client";

import { useState } from "react";

export interface WeatherData {
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

interface CardProps {
  weatherData: WeatherData;
  onDelete?: () => void;
  showDelete: boolean;
  theme: string;
}

export default function Card({
  weatherData,
  onDelete,
  showDelete,
  theme,
}: CardProps) {
  const iconUrl = `http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`;

  return (
    <div
      className={`m-2 w-full md:w-64 h-60 rounded-lg shadow-lg p-4 flex flex-col items-center relative ${
        theme === "light" ? "bg-blue-300" : "bg-gray-800"
      }`}
    >
      {showDelete && ( // condicionalmente renderizar el botón de eliminar
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
          onClick={onDelete}
        >
          <i className="fas fa-times">X</i>
        </button>
      )}
      <h1 className="text-xl font-bold">{weatherData.name}</h1>
      {!showDelete ? <p>(current location)</p> : null}
      <img className="my-2 w-16" src={iconUrl} alt="Ícono del clima" />
      <p>
        Temperature: <b>{weatherData.main.temp}° C</b>
      </p>
      <p>
        Humidity: <b>{weatherData.main.humidity}%</b>
      </p>
      <p>
        Wind: <b>{weatherData.wind.speed} m/s</b>
      </p>
    </div>
  );
}
