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
    const altitude = zoomLevel.altitude; // Hent altitude fra zoomLevel
    console.log('Current Altitude:', altitude);
  
    // Beregn baseScale basert på altitude
    const baseScale = 0.1;
    const adjustedScale = Math.max(0.05, baseScale / altitude); // Juster skalaen dynamisk
  
    console.log('Adjusted Scale:', adjustedScale);
    
    // Oppdater skalaen på båtene (hvis nødvendig)
    // Du kan lagre dette i en state eller direkte på objektet hvis det er mulig i din implementasjon
  };
  

  // Function to create a 3D boat model
  const createBoatObject = (zoomLevel) => {
    const altitude = zoomLevel.altitude;
  
    // Beregn skalaen for ikonets høyde basert på altitude
    const baseScale = 0.005;  // Grunnleggende skala for x-aksen
    const yScale = Math.max(0.005, baseScale * altitude);  // Juster y-aksen med minimumsgrense for synlighet
  
    const textureLoader = new THREE.TextureLoader();
    const boatTexture = textureLoader.load('/icons8-ship-100.png'); // Path to your boat icon
    const spriteMaterial = new THREE.SpriteMaterial({ map: boatTexture });
    const boatSprite = new THREE.Sprite(spriteMaterial);
    // Sett skalaen separat for x- og y-aksen
    boatSprite.scale.set(0.05, 0.05);  // x-aksen bruker baseScale, y-aksen bruker tilpasset skala
    return boatSprite;
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
        objectLat={(d) => d.Latitude}  // Bruk Latitude fra data
        objectLng={(d) => d.Longitude}  // Bruk Longitude fra data
        objectAltitude={0}
        objectLabel={(d) => `${d.ShipId}`}  
        onZoom={handleZoomChange}  
        objectThreeObject={createBoatObject}  // Bruk den nye båt-ikon-funksjonen
      />

    </div>
  );
}

export default App;
