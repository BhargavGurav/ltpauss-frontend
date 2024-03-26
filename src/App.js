import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import "./App.css";
import btnSvg from "./btn.svg"; // Import your SVG image file
import viewSvg from "./view-btn.svg"; // Import your SVG image file

let previousMomsn = null; // Initialize previousMomsn outside the component

function App() {
  const [data, setData] = useState({});
  const [showPlot, setShowPlot] = useState(false); // Track if plot should be shown
  const [latestMessage, setLatestMessage] = useState(null); // Track the latest message
  const [showMessagePopup, setShowMessagePopup] = useState(false); // Track if message popup should be shown
  const [momsnStart, setMomsnStart] = useState(""); // Track the start momsn
  const [momsnEnd, setMomsnEnd] = useState(""); // Track the end momsn
  const [showInput, setShowInput] = useState(false); // Track if input should be shown

  useEffect(() => {
    fetchLatestMessage(); // Fetch initial latest message
    const interval = setInterval(fetchLatestMessage, 5000); // Fetch latest message every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const fetchLatestMessage = async () => {
    try {
      const response = await fetch("http://13.201.112.178:8000/latest/message/");
      const responseData = await response.json();
      console.log("Previous momsn:", previousMomsn);
      console.log("Latest momsn:", responseData.momsn);
      setLatestMessage(responseData);
      if (previousMomsn !== null && responseData.momsn > previousMomsn) {
        setShowMessagePopup(true);
        setTimeout(() => {
          setShowMessagePopup(false);
        }, 13000); // Hide popup after 13 seconds
      }
      previousMomsn = responseData.momsn; // Update previousMomsn
    } catch (error) {
      console.error("Error fetching latest message:", error);
    }
  };

  const fetchData = async () => {
    try {
      const data = {
        momsnStart: momsnStart,
        momsnEnd: momsnEnd,
      };

      const response = await fetch(
        "http://13.201.112.178:8000/rockblock/messages/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data from the server");
      }

      const responseData = await response.json();

      // Check if the response data is empty or invalid
      if (
        !responseData ||
        !responseData.T ||
        !responseData.F ||
        !responseData.Zxx_compressed_resized
      ) {
        setShowPlot(false); // Hide the plot
        alert("No valid data available in the database");
      }

      setData(responseData);
      setShowPlot(true); // Set showPlot to true after fetching data
    } catch (error) {
      alert("Error fetching data/No valid data available in the database");
      // Show error message or handle error state as needed
    }
  };

  const handleInputSubmit = () => {
    setShowInput(false);
    fetchData(); // Call fetchData function when input is submitted
  };

  function transposeMatrix(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
  }

  return (
    <div className="container">
      {showInput ? (
        <div className="input-container">
          <input
            type="text"
            placeholder="Enter momsn start"
            value={momsnStart}
            onChange={(e) => setMomsnStart(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter momsn end"
            value={momsnEnd}
            onChange={(e) => setMomsnEnd(e.target.value)}
          />
          <img
            src={viewSvg}
            alt="Show Plot"
            onClick={handleInputSubmit}
            className="plot-image"
          />
        </div>
      ) : (
        <img
          src={btnSvg}
          alt="Show Plot"
          onClick={() => setShowInput(true)}
          className="plot-image"
        />
      )}
      {showPlot && // Render plot only if showPlot is true
        (data.T && data.F && data.Zxx_compressed_resized ? (
          <div className="plot">
            <Plot
              data={[
                {
                  x: data.F.map((row) => row[0]), // Transpose of original data.T
                  y: data.T[0], // Transpose of original data.F
                  z: transposeMatrix(data.Zxx_compressed_resized), // Transpose of original data.Zxx_compressed_resized
                  type: "heatmap",
                  colorbar: {
                    title: {
                      text: "dB rms ref 1 μ Pa Per Square root of Hz",
                      side: "right",
                    },
                  },
                },
              ]}
              layout={{
                width: Math.max(800),
                height: Math.max(600),
                title: "Reconstructed STFT",
                font: {
                  color: "white",
                },
                plot_bgcolor: "none",
                paper_bgcolor: "transparent",
                xaxis: {
                  title: {
                    text: "Frequency (Hz)",
                    standoff: 25, // Adjust the padding as needed
                  },
                },
                yaxis: {
                  title: {
                    text: "Time (sec)",
                    standoff: 20, // Adjust the padding as needed
                  },
                },
              }}
              config={{ displayModeBar: false }}
            />
          </div>
        ) : (
          <p className="loading">Loading...</p>
        ))}
      {showMessagePopup && latestMessage && (
        <div className="message-popup">
          New message received at {latestMessage.transmit_time}.
          <span
            className="close-icon"
            onClick={() => setShowMessagePopup(false)}
          ></span>
        </div>
      )}
    </div>
  );
}

export default App;
