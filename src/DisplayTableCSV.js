import React, { useState, useEffect } from 'react';
import Papa from 'papaparse'; 

const TableComponent = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/public/data.csv')
      .then(response => response.text())
      .then(csvData => {
        // Parse CSV data
        const parsedData = Papa.parse(csvData, { header: true }).data;
        setData(parsedData.slice(0, 20));
      })
      .catch(error => console.error('Error fetching CSV:', error));
  }, []);

  return (
    <div>
      <h2>First 20 rows from CSV:</h2>
      <table>
        <thead>
          <tr>
            {Object.keys(data[0]).map(key => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {Object.values(row).map((value, index) => (
                <td key={index}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;