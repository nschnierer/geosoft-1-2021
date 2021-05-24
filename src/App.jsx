import React, { useCallback, useLayoutEffect, useRef } from "react";
import geoJSON from "./assets/Route_Uebung4.geo.json";

export const App = () => {
  const map = useRef(null);

  const onMapClick = useCallback(({ latlng: { lat, lng } }) => {
    console.log(lat, lng);
  }, []);

  const setMap = useCallback(
    (ref) => {
      map.current = L.map(ref);

      map.current.setView([51.951, 10.36], 7);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map.current);

      L.geoJSON(geoJSON).addTo(map.current);

      map.current.on("click", onMapClick);
    },
    [onMapClick]
  );

  return <div ref={setMap} style={{ flex: "1" }}></div>;
};
