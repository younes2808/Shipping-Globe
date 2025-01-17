import { useState, useEffect } from 'react';
import Globe from 'react-globe.gl';
import './App.css';

function App() {
  // State for globe size
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const [shipPositions, setShipPositions] = useState([]);  // State to store ship position data

  // Handle resizing and maintaining the size of the globe
  const handleResize = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };

  useEffect(() => {
    // Add event listener for resizing
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Fetch the ship position data (ship_positions.json)
    fetch('/src/ship_positions.json')  // Make sure to provide the correct path to your JSON file
      .then((res) => res.json())
      .then((data) => {
        setShipPositions(data);  // Store the fetched data in state
      })
      .catch((error) => {
        console.error('Error loading ship position data:', error);
      });
  }, []);

  return (
    <div className="cursor-move">
      <Globe
        globeTileEngineUrl={(x, y, l) => `https://tile.openstreetmap.org/${l}/${x}/${y}.png`}  // Set the globe tile URL
        width={width}  // Set width dynamically
        height={height} // Set height dynamically
        pointsData={shipPositions}  // Pass ship positions as points data
        pointLat="Latitude"  // The property from the JSON to use for latitude
        pointLng="Longitude" // The property from the JSON to use for longitude
        pointAltitude={() => 0.1}  // Set the altitude of the points (optional)
        pointRadius={0.1}  // Set the radius of the points
        pointColor={() => '#FF0000'}  // Customize the color of the points (e.g., red)
        pointLabel={(d) => `${d.ShipId}`}  // Customize the label for each point (e.g., show ShipId)
      />
    </div>
  );
}

export default App;
