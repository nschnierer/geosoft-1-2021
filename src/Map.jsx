import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import routeUebung4 from "./assets/Route_Uebung4.geo.json";
import { MarkerWeather } from "./MarkerWeather";
import { cutLineStringByPolygon } from "./utils/geo";

export const Map = () => {
  const map = useRef(null);
  const drawnItems = useRef(null);
  const layerMarkers = useRef(null);
  const [markers, setMarkers] = useState([]);

  /**
   * Create markers on map.
   * @param latLngs
   */
  const createMarkers = useCallback(
    async (latLngs) => {
      const [feature] = routeUebung4.features;

      // calculate positions of the cut
      const cuts = cutLineStringByPolygon(
        {
          geometry: {
            coordinates: feature.geometry.coordinates[0],
          },
        },
        {
          geometry: {
            coordinates: latLngs[0].map(({ lat, lng }) => [lng, lat]),
          },
        }
      );

      const markers = [];
      layerMarkers.current.clearLayers();

      // skip first cut
      cuts.slice(1).forEach((cut) => {
        // get only the first element
        const [lng, lat] = cut.section.geometry.coordinates[0];
        // add marker with div
        // The div is empty and will be rendered by react (see above)
        const element = document.createElement("div");
        layerMarkers.current.addLayer(
          L.marker([lat, lng], {
            icon: L.divIcon({
              className: "",
              html: element,
              iconSize: [60, 60],
              iconAnchor: [30, 70],
            }),
          })
        );
        markers.push({ element, props: { lat, lng } });
      });

      setMarkers(markers);
    },
    [setMarkers]
  );

  // Handling created draw event
  const onDrawCreated = useCallback(
    (event) => {
      const { layer } = event;
      drawnItems.current.addLayer(layer);
      // Remove rectangle after a second
      setTimeout(() => {
        drawnItems.current.removeLayer(layer);
      }, 1000);
      createMarkers(layer.getLatLngs());
    },
    [createMarkers]
  );

  const setMap = useCallback(
    (ref) => {
      if (!ref) {
        return;
      }

      map.current = L.map(ref);

      map.current.setView([51.951, 10.36], 7);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map.current);

      // Add draw feature
      drawnItems.current = new L.FeatureGroup();
      map.current.addLayer(drawnItems.current);
      const drawControl = new L.Control.Draw({
        draw: {
          polyline: false,
          polygon: false,
          marker: false,
          circle: false,
        },
        edit: {
          featureGroup: drawnItems.current,
        },
      });
      map.current.addControl(drawControl);

      // Add route
      L.geoJSON(routeUebung4).addTo(map.current);

      // Handling events
      map.current.on(L.Draw.Event.CREATED, onDrawCreated);

      // Add feature group to add weather markers on it.
      layerMarkers.current = new L.FeatureGroup();
      map.current.addLayer(layerMarkers.current);
    },
    [onDrawCreated]
  );

  useEffect(() => {
    return () => {
      // cleanup map
      map.current.remove();
    };
  }, []);

  return (
    <>
      <div ref={setMap} style={{ flex: "1", zIndex: 1 }}></div>
      {markers.map(({ element, props }) =>
        ReactDOM.createPortal(<MarkerWeather {...props} />, element)
      )}
    </>
  );
};
