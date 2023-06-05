import { useEffect, useRef } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat, toLonLat } from 'ol/proj';
import { MapBrowserEvent, Overlay } from 'ol';
import './App.css';
import { fetchPlace } from './api/layer_api';

const styles = {
  width: "100%",
  height: "100vh",
  display: "flex",
  alignItems: "end"

}

function App(): JSX.Element {
  const mapRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapRef.current) {
      const map = new Map({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          center: fromLonLat([0, 0]),
          zoom: 3,
        }),
      });


      // Add 'click' event listener to the map
      map.on('click', async (event: MapBrowserEvent<MouseEvent>) => {
        const [longitude, latitude] = toLonLat(event.coordinate);

        // Create overlay with popup
        popupRef.current!.innerHTML = 'fetching...'
        const popup = new Overlay({
          element: popupRef.current!,
          positioning: 'top-center',
          stopEvent: false,
          offset: [0, 15],
        });
        // Set the position and content of the popup
        popup.setPosition(event.coordinate);
        map.addOverlay(popup);

        try {
          const fetchedPlace = await fetchPlace(latitude, longitude);
          popupRef.current!.innerHTML = `${fetchedPlace?.display_name ?? 'No name specified'}`;
        } catch (error) {
          popupRef.current!.innerHTML = 'Error fetching data';
        }
      });

      // clear the map instance when app unmounts
      return () => {
        map.setTarget('');
      };
    }
  }, []);

  return (
    <div>
      <div ref={mapRef} style={styles} />
      <div ref={popupRef} className="popup" />
    </div>
  );
}

export default App;
