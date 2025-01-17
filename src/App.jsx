import { useState, useEffect } from 'react';
import Globe from 'react-globe.gl';
import './App.css';

function App() {
  //const myData = [
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
      globeTileEngineUrl={(x, y, l) => `https://tile.openstreetmap.org/${l}/${x}/${y}.png`}
        width={width}  // Set the width dynamically
        height={height} // Set the height dynamically
      />
    </div>
  );
}

export default App;
