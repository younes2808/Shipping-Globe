import { useState, useEffect } from 'react';
import Globe from 'react-globe.gl';
import * as THREE from 'three';  // Import THREE for 3D objects
import './App.css';

function App() {
  // State for globe size
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const [shipPositions, setShipPositions] = useState([]);  // State to store ship position data

  const handleResize = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };

  const handleZoomChange = (zoomLevel) => {
    console.log('Current Zoom Level:', zoomLevel);  // Log the zoom level
  };

  // Function to create a 3D boat model
  const createBoatObject = () => {
    const boatGeometry = new THREE.ConeGeometry(0.0125, 0.05, 32);
    const boatMaterial = new THREE.MeshStandardMaterial({ color: 'blue' });
    const boat = new THREE.Mesh(boatGeometry, boatMaterial);
    boat.rotation.x = Math.PI / 2;  // Adjust orientation to stand upright
    return boat;
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
        globeTileEngineUrl={(x, y, l) => `https://tile.openstreetmap.org/${l}/${x}/${y}.png`} 
        width={width}  
        height={height}
        objectsData={shipPositions} 
        objectLat={(d) => d.Latitude}  // Use Latitude from data
        objectLng={(d) => d.Longitude}  // Use Longitude from data
        objectAltitude={0}
        objectColor={() => '#FF0000'}  
        objectLabel={(d) => `${d.ShipId}`}  
        onZoom={handleZoomChange}  
        objectThreeObject={createBoatObject}  
      />
    </div>
  );
}

export default App;
