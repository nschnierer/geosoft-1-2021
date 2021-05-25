import React, { useCallback, useEffect, useState } from "react";

const OPENWEATHERMAP_API_KEY = "2cae3b5c8aeb6eb80cdc91f42b36e557";

/**
 * Component to load weather.
 */
export const MarkerWeather = ({ lat, lng }) => {
  const [data, setData] = useState(null);

  const loadWeather = useCallback(async () => {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${OPENWEATHERMAP_API_KEY}`
    );
    const data = await response.json();
    setData(data);
  }, [lat, lng, setData]);

  useEffect(() => {
    loadWeather();
  }, [loadWeather]);

  return (
    <>
      <div className="marker-weather">
        <div className="marker-weather-content">
          {data ? (
            <>
              <div style={{ width: "40px", height: "40px" }}>
                <img
                  style={{ width: "100%", marginTop: "-10px" }}
                  src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
                />
              </div>
              <div style={{ marginTop: "-15px", fontSize: "12px" }}>
                {data.main.temp.toFixed(1)} C°
              </div>
            </>
          ) : (
            <Loading />
          )}
        </div>
      </div>
    </>
  );
};

// Loading SVG
// Source: https://icons8.com/preloaders/en/search/dots
const Loading = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={32}
      height={10}
      viewBox="0 0 128 35"
    >
      <rect width="100%" height="100%" fill="rgba(0,0,0,0)" />
      <g>
        <circle cx={17.5} cy={17.5} r={17.5} />
        <animate
          attributeName="opacity"
          dur="1200ms"
          begin="0s"
          repeatCount="indefinite"
          keyTimes="0;0.167;0.5;0.668;1"
          values="0.3;1;1;0.3;0.3"
        />
      </g>
      <g>
        <circle cx={110.5} cy={17.5} r={17.5} />
        <animate
          attributeName="opacity"
          dur="1200ms"
          begin="0s"
          repeatCount="indefinite"
          keyTimes="0;0.334;0.5;0.835;1"
          values="0.3;0.3;1;1;0.3"
        />
      </g>
      <g>
        <circle cx={64} cy={17.5} r={17.5} />
        <animate
          attributeName="opacity"
          dur="1200ms"
          begin="0s"
          repeatCount="indefinite"
          keyTimes="0;0.167;0.334;0.668;0.835;1"
          values="0.3;0.3;1;1;0.3;0.3"
        />
      </g>
    </svg>
  );
};
