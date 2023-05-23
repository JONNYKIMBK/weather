import { useState } from "react";
import LightModeIcon from "@mui/icons-material/LightMode";
import NightsStayIcon from "@mui/icons-material/NightsStay";

interface ThemeButtonProps {
  onThemeChange: (theme: string) => void;
}

export default function ThemeButton({ onThemeChange }: ThemeButtonProps) {
  const [theme, setTheme] = useState("light");

  const handleThemeChange = () => {
    if (theme === "light") {
      setTheme("dark");
      document.body.classList.remove("bg-white", "text-black");
      document.body.classList.add("bg-black", "text-white", "dark");
      onThemeChange("dark");
    } else {
      setTheme("light");
      document.body.classList.remove("bg-black", "text-white", "dark");
      document.body.classList.add("bg-white", "text-black");
      onThemeChange("light");
    }
  };

  return (
    <button
      className={`p-2 rounded mb-2 ${
        theme === "light" ? "bg-yellow-300" : "bg-gray-800"
      }`}
      onClick={handleThemeChange}
    >
      {theme === "light" ? <LightModeIcon /> : <NightsStayIcon />}
    </button>
  );
}
