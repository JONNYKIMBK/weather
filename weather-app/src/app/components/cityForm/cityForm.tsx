"use client";

import { useState } from "react";

interface CityFormProps {
  onAddCity: (city: string) => void;
}

export default function CityForm({ onAddCity }: CityFormProps) {
  const [city, setCity] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onAddCity(city);
    setCity("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex"
    >
      <input
        type="text"
        value={city}
        onChange={(event) => setCity(event.target.value)}
        placeholder="Enter city name"
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Add city
      </button>
    </form>
  );
}
