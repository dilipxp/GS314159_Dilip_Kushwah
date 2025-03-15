/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useCallback } from "react";
import "../styles/Store.css";
import * as XLSX from "xlsx";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { MdDelete } from "react-icons/md";
import { IconButton } from "@mui/material";
import { AgGridReact } from "ag-grid-react";

// Register ag-Grid community modules
ModuleRegistry.registerModules([AllCommunityModule]);

const Store: React.FC = () => {
  // State to store the row data from Excel file
  const [rowData, setRowData] = useState<any[]>([]);

  // Fetch and read the Excel file when the component mounts
  useEffect(() => {
    fetch("/sample.xlsx")
      .then((response) => response.blob()) // Convert response to a blob
      .then((blob) => {
        const file = new File([blob], "sample.xlsx");
        return readExcelFile(file, "Stores"); // Read the Excel sheet named "Stores"
      })
      .then((data) => setRowData(data)) // Store the parsed data in state
      .catch((error) => console.error("Error loading Excel file:", error));
  }, []);

  /**
   * Reads an Excel file and extracts data from the given sheet.
   * @param file - The Excel file to read.
   * @param sheetName - The name of the sheet to extract data from.
   * @returns A promise resolving to an array of objects representing the sheet data.
   */
  const readExcelFile = async (file: File, sheetName: string): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (!event.target) return;
        const data = new Uint8Array(event.target.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[sheetName];

        if (!sheet) return reject(`Sheet "${sheetName}" not found!`);

        // Convert the sheet data to JSON format
        const jsonData: any = XLSX.utils.sheet_to_json(sheet);
        
        if (jsonData.length > 0) {
          console.log("Excel Parsed Column Names:", Object.keys(jsonData[0])); // Log column names
        } else {
          console.warn("Excel sheet is empty or not parsed correctly!");
        }

        // Add a sequential number column (Seq) for indexing
        resolve(
          jsonData.map((row: any, index: any) => ({ ...row, Seq: index + 1 }))
        );
      };

      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file); // Read file as an ArrayBuffer
    });
  };

  /**
   * Deletes a row from the table based on its ID.
   * @param id - The ID of the row to be deleted.
   */
  const deleteRow = useCallback((id: any) => {
    setRowData((prevData) => prevData.filter((row) => row.ID !== id));
  }, []);

  // Column definitions for the ag-Grid
  const columnDefs = [
    {
      headerName: "Action",
      field: "delete",
      cellRenderer: (params: any) => (
        <IconButton onClick={() => deleteRow(params.data.ID)} color="error" size="small">
          <MdDelete />
        </IconButton>
      ),
      width: 100,
    },
    { headerName: "Seq", field: "Seq", rowDrag: true, sortable: true, width: 100 },
    { headerName: "ID", field: "ID", sortable: true, width: 120 },
    { headerName: "Label", field: "Label", sortable: true, width: 150 },
    { headerName: "City", field: "City", sortable: true, width: 150 },
    { headerName: "State", field: "State", sortable: true, width: 150 },
  ];

  // Default column properties
  const defaultColDef = { resizable: true };

  return (
    <div className="page store-page" style={{ width: "100%", height: "100%" }}>
      {/* ag-Grid component to display data */}
      <AgGridReact
        rowData={rowData} // Data to display
        columnDefs={columnDefs} // Column definitions
        defaultColDef={defaultColDef} // Default column settings
        rowDragManaged={true} // Enable row drag
        animateRows={true} // Enable row animation
      />
    </div>
  );
};

export default Store;
