import React, { useEffect, useState } from "react";
import { Cloud, CloudDrizzle, CloudLightning, CloudRain, CloudSnow, Sun, Thermometer } from "lucide-react";

type WeatherData = {
    temp: number;
    condition: string;
    icon: JSX.Element;
};

// Map WMO weather codes to icons and descriptions
const getWeatherInfo = (code: number) => {
    if (code === 0) return { condition: "Clear sky", icon: <Sun className="w-5 h-5 text-yellow-500" /> };
    if (code === 1 || code === 2 || code === 3) return { condition: "Partly cloudy", icon: <Cloud className="w-5 h-5 text-gray-400" /> };
    if (code === 45 || code === 48) return { condition: "Fog", icon: <Cloud className="w-5 h-5 text-gray-400" /> };
    if (code >= 51 && code <= 55) return { condition: "Drizzle", icon: <CloudDrizzle className="w-5 h-5 text-blue-400" /> };
    if (code >= 61 && code <= 65) return { condition: "Rain", icon: <CloudRain className="w-5 h-5 text-blue-500" /> };
    if (code >= 71 && code <= 77) return { condition: "Snow", icon: <CloudSnow className="w-5 h-5 text-white" /> };
    if (code >= 80 && code <= 82) return { condition: "Rain showers", icon: <CloudRain className="w-5 h-5 text-blue-500" /> };
    if (code >= 95 && code <= 99) return { condition: "Thunderstorm", icon: <CloudLightning className="w-5 h-5 text-yellow-500" /> };
    return { condition: "Unknown", icon: <Cloud className="w-5 h-5 text-gray-400" /> };
};

export default function WeatherWidget() {
    const [data, setData] = useState<WeatherData | null>(null);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const res = await fetch(
                    "https://api.open-meteo.com/v1/forecast?latitude=22.7196&longitude=75.8577&current=temperature_2m,weather_code&timezone=Asia%2FKolkata"
                );
                const json = await res.json();
                if (json.current) {
                    const info = getWeatherInfo(json.current.weather_code);
                    setData({
                        temp: Math.round(json.current.temperature_2m),
                        condition: info.condition,
                        icon: info.icon,
                    });
                }
            } catch (error) {
                console.error("Failed to fetch weather:", error);
            }
        };

        fetchWeather();
        // Refresh every 30 minutes
        const interval = setInterval(fetchWeather, 30 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    if (!data) {
        return (
            <div className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-background/50 h-[72px] animate-pulse">
                <div className="w-5 h-5 bg-muted rounded-full"></div>
                <div className="space-y-2">
                    <div className="h-3 w-16 bg-muted rounded"></div>
                    <div className="h-2 w-20 bg-muted rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-accent/5 transition-colors hover:bg-accent/10 h-[72px]">
            <div className="shrink-0">
                {data.icon}
            </div>
            <div className="flex flex-col justify-center flex-1 min-w-0 text-sm overflow-hidden">
                <span className="font-medium text-foreground truncate w-full">{data.temp}°C in Indore</span>
                <span className="text-xs text-muted-foreground truncate w-full">{data.condition}</span>
            </div>
        </div>
    );
}
