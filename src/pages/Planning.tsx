/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useRef, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  AllCommunityModule,
  ColDef,
  ModuleRegistry,
} from "ag-grid-community";
import * as XLSX from "xlsx";

// Register AG Grid modules

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

// Define the structure of row data
interface RowData {
  store: string;
  sku: string;
  [key: string]: any;
}

const Planning: React.FC = () => {
  // Reference to the AG Grid instance
  const gridRef = useRef<AgGridReact>(null);

  // State to store row data
  const [rowData, setRowData] = useState<RowData[]>([]);

  // Fetch and read Excel data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/sample.xlsx"); // Fetch Excel file
        const blob = await response.blob();
        const file = new File([blob], "sample.xlsx");
        const data = await readExcelFile(file); // Read and parse Excel file
        setRowData(data); // Update state with parsed data
        console.log("Final rowData for AG Grid:", data); // Debugging
      } catch (error) {
        console.error("Error loading Excel file:", error);
      }
    };
    fetchData();
  }, []);

  /**
   * Reads and parses an Excel file, extracting and filtering data from "Store" and "Planning" sheets.
   * @param file - The Excel file to be read.
   * @returns A promise that resolves to an array of filtered row data.
   */
  const readExcelFile = async (file: File): Promise<RowData[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (!event.target) return;
        const data = new Uint8Array(event.target.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });

        // Extract store and SKU data
        const storeSheet = workbook.Sheets["Stores"];
        const skuSheet = workbook.Sheets["SKUs"];
        if (!storeSheet) return reject("Sheet 'Stores' not found!");
        if (!skuSheet) return reject("Sheet 'SKUs' not found!");

        const storeData: { ID: string; Label: string }[] =
          XLSX.utils.sheet_to_json(storeSheet);
        const skuData: { ID: string; Label: string }[] =
          XLSX.utils.sheet_to_json(skuSheet);

        // Create maps for quick ID-to-Label lookup
        const storeMap = new Map(storeData.map((row) => [row.ID, row.Label]));
        const skuMap = new Map(skuData.map((row) => [row.ID, row.Label]));

        console.log("Valid Store Map:", storeMap);
        console.log("Valid SKU Map:", skuMap);

        // Extract and filter data from the "Calculations" sheet
        const calculationsSheet = workbook.Sheets["Calculations"];
        if (!calculationsSheet) return reject("Sheet 'Calculations' not found!");

        let calculationsData: RowData[] = XLSX.utils.sheet_to_json(calculationsSheet);

        // Replace Store and SKU IDs with their corresponding Labels
        calculationsData = calculationsData.map((row) => ({
          ...row,
          store: storeMap.get(row.Store) || row.Store, // Use lowercase "store"
          sku: skuMap.get(row.SKU) || row.SKU, // Use lowercase "sku"
        }));

        console.log("Processed Calculations Data:", calculationsData); // Debugging log
        resolve(calculationsData);
      };

      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  // Define AG Grid column structure
  const columnDefs: ColDef[] = useMemo(
    () => [
      {
        headerName: "Store Info",
        children: [
          { field: "store", headerName: "Store", width: 150 },
          { field: "sku", headerName: "SKU", width: 150 },
        ],
      },
      {
        headerName: "Weekly Data",
        children: Array.from({ length: 12 }, (_, i) => ({
          headerName: `Week ${i + 1}`,
          children: [
            { field: `Sales Units`, headerName: "Sales Units", width: 120 },
            { field: `Sales Dollars`, headerName: "Sales Dollars", width: 120 },
            { field: `Cost Dollars`, headerName: "Cost Dollars", width: 120 },
            { field: `GM Dollars`, headerName: "GM Dollars", width: 120 },
            { field: `GM %`, headerName: "GM %", width: 120 },
          ],
        })),
      },
    ],
    []
  );

  // Default column properties for AG Grid
  const defaultColDef = useMemo<ColDef>(
    () => ({
      resizable: true, // Allow resizing columns
      sortable: true, // Enable sorting on all columns
      filter: true, // Enable filtering
    }),
    []
  );

  return (
    <div className="planning-container" style={{ width: "100%", height: "100%" }}>
      <AgGridReact
        ref={gridRef}
        rowData={rowData} // Provide data to AG Grid
        columnDefs={columnDefs} // Define column structure
        defaultColDef={defaultColDef} // Apply default column properties
        domLayout="autoHeight" // Automatically adjust grid height
      />
    </div>
  );
};

export default Planning;
