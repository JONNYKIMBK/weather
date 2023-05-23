import { useState } from "react";

interface CityFormProps {
  onAddCity: (city: string) => void;
  theme: string;
}

export default function CityForm({ onAddCity, theme }: CityFormProps) {
  const [city, setCity] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onAddCity(city);
    setCity("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`shadow-lg rounded px-8 pt-6 pb-8 mb-4 flex ${
        theme === "light" ? "bg-blue-300" : "bg-gray-800"
      }`}
    >
      <input
        type="text"
        value={city}
        onChange={(event) => setCity(event.target.value)}
        placeholder="Enter city name"
        className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${
          theme === "light"
            ? "bg-blue-100 text-gray-700"
            : "bg-gray-800 text-white"
        }`}
      />
      <button
        type="submit"
        className={`font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
          theme === "light"
            ? "bg-blue-500 hover:bg-blue-700 text-white"
            : "bg-gray-700 hover:bg-gray-600 text-white"
        }`}
      >
        Add city
      </button>
    </form>
  );
}
