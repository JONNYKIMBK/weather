"use client";

import { useEffect, useRef, useState } from "react";
import Card, { WeatherData } from "../card/card";
import CityForm from "../cityForm/cityForm";
import Swal from "sweetalert2";

const KEY = process.env.NEXT_PUBLIC_KEY;

interface CardsProps {
  cities: string[];
}

export default function Cards({ cities: initialCities }: CardsProps) {
  const [cities, setCities] = useState(initialCities);
  const [weatherData, setWeatherData] = useState<WeatherData[] | null>(null);
  const [error, setError] = useState("");
  const errorShown = useRef(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        Promise.all([
          fetch(
            `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=en&APPID=${KEY}`
          ).then((response) => response.json()),
          ...cities.map((city) =>
            fetch(
              `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=en&APPID=${KEY}`
            ).then((response) => response.json())
          ),
        ]).then((data) => {
          const validData = data.filter((d) => d.cod !== "404");
          const errorIndex = data.findIndex((d) => d.cod === "404");
          if (errorIndex !== -1 && !errorShown.current) {
            setError(`The city ${cities[errorIndex - 1]} is not valid!`);
            setCities((cities) =>
              cities.filter((_, index) => index !== errorIndex - 1)
            );
            errorShown.current = true;
          } else if (errorIndex === -1 && errorShown.current) {
            setError("");
            errorShown.current = false;
          } else {
            setWeatherData(validData);
          }
        });
      });
    }
  }, [cities]);

  if (!weatherData) {
    return <div>Loading...</div>;
  }

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

  const handleAddCity = (city: string) => {
    setCities((cities) => {
      if (cities.length >= 4) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "The maximum number of cities has been reached!",
        });
        return cities;
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
        return cities;
      } else {
        return [...cities, city];
      }
    });
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

  return (
    <div className="flex justify-center flex-col items-center mt-3">
      <CityForm onAddCity={handleAddCity} />
      <div className="flex  justify-center mt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {weatherData.map((data, index) => (
            <Card
              key={data.name}
              weatherData={data}
              onDelete={() => handleDelete(data.name)}
              showDelete={index !== 0} // no mostrar el botón de eliminar en la primera tarjeta
            />
          ))}
        </div>
      </div>
    </div>
  );
}
