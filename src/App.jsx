import { useState, useEffect } from 'react';
import Globe from 'react-globe.gl';
import globeImage from './assets/earth-dark.jpg';
import './App.css';

function App() {
  const myData = [
    {
      lat: 29.953204744601763,
      lng: -90.08925929478903,
      altitude: 0.4,
      color: '#00ff33',
    },
    {
      lat: 28.621322361013092,
      lng: 77.20347613099612,
      altitude: 0.4,
      color: '#ff0000',
    },
    {
      lat: -43.1571459086602,
      lng: 172.72338919659848,
      altitude: 0.4,
      color: '#ffff00',
    },
  ];

  // Handle resizing and maintaining the size of the globe
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  const handleResize = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="cursor-move">
      <Globe
        globeImageUrl={globeImage}
        pointsData={myData}
        pointAltitude="altitude"
        pointColor="color"
        width={width}  // Set the width dynamically
        height={height} // Set the height dynamically
      />
    </div>
  );
}

export default App;
