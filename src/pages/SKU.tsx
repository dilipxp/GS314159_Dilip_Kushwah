/* eslint-disable @typescript-eslint/no-explicit-any */
import "../styles/SKU.css";
import React, { useEffect, useState, useCallback } from "react";
import * as XLSX from "xlsx";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { MdDelete } from "react-icons/md";
import { IconButton } from "@mui/material";
import { AgGridReact } from "ag-grid-react";

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

// Define the structure of SKU data
interface SKUData {
  ID: string;
  Label: string;
  Class: string;
  Department: string;
  Price: number;
  Cost: number;
  Seq: number; // Sequential index
}

const SKU: React.FC = () => {
  // State to store row data
  const [rowData, setRowData] = useState<SKUData[]>([]);

  // Fetch and read Excel file on component mount
  useEffect(() => {
    fetch("/sample.xlsx")
      .then((response) => response.blob()) // Convert response to blob
      .then((blob) => {
        const file = new File([blob], "sample.xlsx");
        return readExcelFile(file, "SKUs"); // Read "SKUs" sheet from Excel file
      })
      .then((data) => setRowData(data)) // Update state with parsed data
      .catch((error) => console.error("Error loading Excel file:", error));
  }, []);

  /**
   * Reads an Excel file and extracts data from the specified sheet.
   * @param file - The Excel file to read.
   * @param sheetName - The name of the sheet to extract data from.
   * @returns A promise that resolves to an array of SKUData.
   */
  const readExcelFile = async (file: File, sheetName: string): Promise<SKUData[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (!event.target) return;
        const data = new Uint8Array(event.target.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });

        // Extract sheet data
        const sheet = workbook.Sheets[sheetName];
        if (!sheet) return reject(`Sheet "${sheetName}" not found!`);

        // Convert sheet data to JSON and add sequential numbers
        const jsonData: SKUData[] = XLSX.utils.sheet_to_json(sheet);
        resolve(jsonData.map((row, index) => ({ ...row, Seq: index + 1 })));
      };

      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  /**
   * Deletes a row from the grid based on ID.
   * @param id - The ID of the row to be deleted.
   */
  const deleteRow = useCallback((id: string) => {
    setRowData((prevData) => prevData.filter((row) => row.ID !== id));
  }, []);

  // Define AG Grid column structure
  const columnDefs: any[] = [
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
    { headerName: "Seq", field: "Seq", rowDrag: true, sortable: true, width: 80 },
    { headerName: "ID", field: "ID", sortable: true, width: 120 },
    { headerName: "Label", field: "Label", sortable: true, width: 150 },
    { headerName: "Class", field: "Class", sortable: true, width: 150 },
    { headerName: "Department", field: "Department", sortable: true, width: 150 },
    { headerName: "Price", field: "Price", sortable: true, width: 100 },
    { headerName: "Cost", field: "Cost", sortable: true, width: 100 },
  ];

  // Default column properties
  const defaultColDef = { resizable: true };

  return (
    <div className="page sku-page" style={{ width: "100%", height: "100%", overflow: "auto" }}>
      <AgGridReact
        rowData={rowData} // Provide data to AG Grid
        columnDefs={columnDefs} // Define column structure
        defaultColDef={defaultColDef} // Apply default column properties
        rowDragManaged={true} // Enable drag-and-drop reordering
        animateRows={true} // Animate row updates
      />
    </div>
  );
};

export default SKU;
