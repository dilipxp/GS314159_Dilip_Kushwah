// Disabling TypeScript's explicit `any` warnings

// Importing React and necessary hooks
import React, { useEffect, useState } from "react";

// Importing chart components from Recharts
import {
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ComposedChart,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

// Importing XLSX library for reading Excel files
import * as XLSX from "xlsx";

// Importing styles for the Charts page
import "../styles/Charts.css";

// Defining the structure of the chart data
interface ChartData {
  Week: string;
  "GM Dollars": number;
  "Sales Dollars": number;
  "GM %": number;
}

const Charts: React.FC = () => {
  // State to store chart data
  const [chartData, setChartData] = useState<ChartData[]>([]);

  // Fetch and process Excel file when the component mounts
  useEffect(() => {
    fetch("/sample.xlsx") // Fetching the sample Excel file
      .then((response) => response.blob()) // Converting response to a blob
      .then((blob) => {
        const file = new File([blob], "sample.xlsx"); // Creating a File object
        return readExcelFile(file, "Chart"); // Reading the "Chart" sheet from Excel
      })
      .then((data) => setChartData(data)) // Storing processed data in state
      .catch((error) => console.error("Error loading Excel file:", error)); // Handling errors
  }, []);

  // Function to read an Excel file and extract data from a specific sheet
  const readExcelFile = async (file: File, sheetName: string): Promise<ChartData[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader(); // Creating a FileReader instance

      reader.onload = (event) => {
        if (!event.target) return;
        
        // Converting file content to an array buffer
        const data = new Uint8Array(event.target.result as ArrayBuffer);

        // Reading the Excel workbook
        const workbook = XLSX.read(data, { type: "array" });

        // Getting the specified sheet from the workbook
        const sheet = workbook.Sheets[sheetName];

        if (!sheet) return reject(`Sheet "${sheetName}" not found!`);

        // Converting sheet data into JSON format
        const jsonData: ChartData[] = XLSX.utils.sheet_to_json(sheet);
        console.log(jsonData); // Logging the parsed data for debugging

        resolve(jsonData); // Returning the parsed data
      };

      reader.onerror = (error) => reject(error); // Handling file reading errors

      reader.readAsArrayBuffer(file); // Reading the file as an array buffer
    });
  };

  return (
    <div className="page charts-page">
      <h2>Charts Page</h2>
      <p>Welcome to the Charts section.</p>

      {/* Responsive container for the chart */}
      <ResponsiveContainer width="100%" height={600}>
        <ComposedChart
          data={chartData} // Setting the data for the chart
          margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
        >
          {/* Grid lines */}
          <CartesianGrid strokeDasharray="3 3" />

          {/* X-axis with week labels */}
          <XAxis dataKey="Week" />

          {/* Y-axis for GM Dollars (left side) */}
          <YAxis
            yAxisId="left"
            orientation="left"
            stroke="#8884d8"
            tickFormatter={(value) => `$${value}`} // Formatting values as currency
          />

          {/* Y-axis for GM % (right side) */}
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#82ca9d"
            tickFormatter={(value) => `${value}%`} // Formatting values as percentages
          />

          {/* Tooltip to show data on hover */}
          <Tooltip
            formatter={(value, name) => (name === "GM %" ? `${value}%` : `$${value}`)}
          />

          {/* Legend for chart elements */}
          <Legend />

          {/* Bar chart for GM Dollars */}
          <Bar yAxisId="left" dataKey="GM Dollars" fill="#8884d8" barSize={30} />

          {/* Line chart for GM % */}
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="GM %"
            stroke="#82ca9d"
            strokeWidth={2}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Charts;
