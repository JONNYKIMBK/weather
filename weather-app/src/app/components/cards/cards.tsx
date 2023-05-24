"use client";

import { useEffect, useRef, useState } from "react";
import Card, { WeatherData } from "../card/card";
import CityForm from "../cityForm/cityForm";
import Swal from "sweetalert2";
import ThemeButton from "../themeButton/themeButton";

const KEY = process.env.NEXT_PUBLIC_KEY;

interface CardsProps {
  cities: string[];
}

export default function Cards({ cities: initialCities }: CardsProps) {
  const [cities, setCities] = useState(initialCities);
  const [weatherData, setWeatherData] = useState<WeatherData[] | null>(null);
  const [error, setError] = useState("");
  const errorShown = useRef(false);
  const [location, setLocation] = useState(false);
  const [message, setMessage] = useState("Loading...");
  const [theme, setTheme] = useState("light");

  const fetchWeatherData = () => {
    Promise.all([
      ...cities.map((city) =>
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=en&APPID=${KEY}`
        ).then((response) => response.json())
      ),
    ]).then((data) => {
      const validData = data.filter((d) => d.cod !== "404");
      const errorIndex = data.findIndex((d) => d.cod === "404");
      if (errorIndex !== -1 && !errorShown.current) {
        setError(`The city ${cities[errorIndex]} is not valid!`);
        setCities((cities) =>
          cities.filter((_, index) => index !== errorIndex)
        );
        errorShown.current = true;
      } else if (errorIndex === -1 && errorShown.current) {
        setError("");
        errorShown.current = false;
      } else {
        if (location && weatherData) {
          setWeatherData([weatherData[0], ...validData]);
        } else {
          setWeatherData([...validData]);
        }
      }
    });
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        setLocation(true);

        fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=en&APPID=${KEY}`
        )
          .then((response) => response.json())
          .then((data) => {
            setWeatherData((weatherData) => [data, ...(weatherData || [])]);
          });
      });
    }
    setMessage("Location not provided - Enter a city");
  }, []);

  useEffect(() => {
    if (cities.length) {
      fetchWeatherData();
    }
  }, [cities]);

  const handleAddCity = (city: string) => {
    if (cities.length >= 4) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "The maximum number of cities has been reached!",
      });
    } else if (
      cities
        .map((c) => removeAccents(c.toLowerCase()))
        .includes(removeAccents(city.toLowerCase()))
    ) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "The city is already in the list!",
      });
    } else if (
      weatherData &&
      removeAccents(weatherData[0].name.toLowerCase()) ===
        removeAccents(city.toLowerCase())
    ) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "The city is the same as your current location!",
      });
    } else {
      setCities([...cities, city]);
    }
  };

  const handleDelete = (cityName: string) => {
    setWeatherData(
      (data) =>
        data?.filter(
          (data) =>
            removeAccents(data.name.toLowerCase()) !==
            removeAccents(cityName.toLowerCase())
        ) || null
    );
    setCities((cities) =>
      cities.filter(
        (city) =>
          removeAccents(city.toLowerCase()) !==
          removeAccents(cityName.toLowerCase())
      )
    );
  };

  const removeAccents = (str: string) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  if (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: error,
    })
      .then(() => {
        setError("");
        errorShown.current = false;
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setError("");
        errorShown.current = false;
      });
  }

  if (!weatherData) {
    return (
      <div className="flex justify-center flex-col items-center mt-3">
        <ThemeButton onThemeChange={setTheme} />

        <CityForm onAddCity={handleAddCity} theme={theme} />

        <div
          className={`m-2 w-full md:w-64 h-20 rounded-lg shadow-lg p-4 flex flex-col items-center relative justify-center ${
            theme === "light" ? "bg-blue-300" : "bg-gray-800"
          }`}
        >
          <b>{message}</b>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center flex-col items-center mt-3">
      <ThemeButton onThemeChange={setTheme} />
      <CityForm onAddCity={handleAddCity} theme={theme} />

      <div className="flex  justify-center mt-2 w-full">
        <div className="flex flex-wrap justify-center gap-4 w-full">
          {weatherData.map((data, index) => (
            <Card
              key={data.name}
              weatherData={data}
              onDelete={() => handleDelete(data.name)}
              showDelete={location ? index !== 0 : true} // no mostrar el botón de eliminar en la primera tarjeta
              theme={theme}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
