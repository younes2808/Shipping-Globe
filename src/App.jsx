import { useState, useEffect } from 'react';
import Globe from 'react-globe.gl';
import * as THREE from 'three';  // Import THREE for 3D objects
import './App.css';

function App() {
  // State for globe size
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const [shipPositions, setShipPositions] = useState([]);  // State to store ship position data
  const [pathData, setPathData] = useState([]);  // State for the path data between ships

  const handleResize = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };

  const handleZoomChange = (zoomLevel) => {
    const altitude = zoomLevel.altitude; // Get altitude from zoomLevel
    console.log('Current Altitude:', altitude);
  
    // Calculate the base scale based on altitude
    const baseScale = 0.1;
    const adjustedScale = Math.max(0.05, baseScale / altitude); // Adjust scale dynamically
  
    console.log('Adjusted Scale:', adjustedScale);
  };

  // Load the texture once to prevent reloading on every zoom
  let boatTexture;
  const loadTexture = () => {
    if (!boatTexture) {
      const textureLoader = new THREE.TextureLoader();
      boatTexture = textureLoader.load('/icons8-ship-100.png', (texture) => {
        texture.minFilter = THREE.LinearMipMapLinearFilter;  // Enable mipmaps
        texture.generateMipmaps = true;  // Generate mipmaps for smoother zooming
      });
    }
    return boatTexture;
  };

  // Function to create a 3D boat model with a consistent scale
  const createBoatObject = () => {
    const texture = loadTexture();  // Load the texture once

    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const boatSprite = new THREE.Sprite(spriteMaterial);
    
    // Set a consistent size for the sprites to prevent flickering
    boatSprite.scale.set(0.02, 0.02, 0.02);  // Consistent scale for the boats
    
    return boatSprite;
  };

  const generateRandomPaths = (ships) => {
    const maxPaths = 40;
    const randomPaths = [];
    
    // Helper function to generate a random color
    const getRandomColor = () => {
      const r = Math.floor(Math.random() * 256); // Random red value (0-255)
      const g = Math.floor(Math.random() * 256); // Random green value (0-255)
      const b = Math.floor(Math.random() * 256); // Random blue value (0-255)
      return `rgba(${r}, ${g}, ${b}, 0.5)`; // RGBA color with opacity 0.5
    };
  
    for (let i = 0; i < maxPaths; i++) {
      // Pick two random ships
      const shipA = ships[Math.floor(Math.random() * ships.length)];
      const shipB = ships[Math.floor(Math.random() * ships.length)];
      
      // Create a path between them with a random color
      randomPaths.push({
        coords: [
          [shipA.Longitude, shipA.Latitude],  // Longitude, Latitude of Ship A
          [shipB.Longitude, shipB.Latitude]   // Longitude, Latitude of Ship B
        ],
        properties: {
          color: getRandomColor(),  // Assign a random color to the path
          name: `Path ${i + 1}`  // Optionally add a label to each path
        }
      });
    }
    
    setPathData(randomPaths);  // Set the generated path data to state
  };
  
  useEffect(() => {
    // Add event listener for resizing
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Fetch the ship position data (ship_positions.json)
    fetch('/src/ship_positions.json')  // Ensure the correct path to your JSON file
      .then((res) => res.json())
      .then((data) => {
        setShipPositions(data);  // Store the fetched data in state
        generateRandomPaths(data);  // Generate random paths between ships
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
        objectAltitude={0.000009}
        objectLabel={(d) => `${d.ShipId}`}  
        onZoom={handleZoomChange}  
        objectThreeObject={createBoatObject}  // Use the boat-creation function
        pathsData={pathData}  // Set the path data
        pathPoints="coords"
        pathPointLat={(d) => d[1]}  // Latitude of path points
        pathPointLng={(d) => d[0]}  // Longitude of path points
        pathColor={(d) => d.properties.color}
        pathDashLength={0.1}
        pathDashGap={0.008}
        pathStroke={0.5} // Reduce stroke width
        pathDashAnimateTime={12000}
      />
    </div>
  );
}

export default App;
