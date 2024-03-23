// App.js

import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import "./App.css";
import btnSvg from "./btn.svg"; // Import your SVG image file

function App() {
  const [data, setData] = useState({});
  const [showPlot, setShowPlot] = useState(false); // Track if plot should be shown

  const fetchData = async () => {
    try {
      const response = await fetch(
        "http://13.201.112.178:8000/rockblock/messages/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const responseData = await response.json();
      console.log(responseData);
      setData(responseData);
      setShowPlot(true); // Set showPlot to true after fetching data
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleShowPlot = () => {
    fetchData(); // Call fetchData function when button is clicked
  };

  return (
    <div className="container">
      <div className="plot-container">
      <img
          src={btnSvg}
          alt="Show Plot"
          onClick={handleShowPlot}
          className="plot-image"
        />        {showPlot && // Render plot only if showPlot is true
          (data.T && data.F && data.Zxx_compressed_resized ? (
            <div className="plot">
              <Plot
                data={[
                  {
                    x: data.T[0], // Assuming T, F, and Zxx_compressed_resized are arrays of arrays
                    y: data.F.map((row) => row[0]), // Assuming F is an array of arrays
                    z: data.Zxx_compressed_resized,
                    type: "heatmap",
                  },
                ]}
                layout={{
                  width: Math.max(800),
                  height: Math.max(600),
                  title: "Reconstructed STFT",
                  scene: {
                    xaxis: { title: "T" },
                    yaxis: { title: "F" },
                    zaxis: { title: "Zxx Compressed Resized" },
                  },
                  font: {
                    color: "white",
                  },
                  plot_bgcolor: "none",
                  paper_bgcolor: "transparent",
                }}
                config={{ displayModeBar: false }}
              />
            </div>
          ) : (
            <p className="loading">Loading...</p>
          ))}
      </div>
    </div>
  );
}

export default App;
