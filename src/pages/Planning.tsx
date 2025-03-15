import React, { useEffect, useState, useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ColDef, ColGroupDef, ModuleRegistry } from "ag-grid-community";
import * as XLSX from "xlsx";

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

// Define the structure of row data
interface RowData {
  store: string;
  sku: string;
  [key: string]: string | number;
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
        const response = await fetch("/sample.xlsx"); // Fetch the Excel file from the public folder
        const blob = await response.blob();
        const file = new File([blob], "sample.xlsx");
        const data = await readExcelFile(file); // Read and parse Excel file
        setRowData(data); // Update state with parsed data
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

        // Extract store IDs from the "Store" sheet
        const storeSheet = workbook.Sheets["Store"];
        if (!storeSheet) return reject("Sheet 'Store' not found!");
        const storeData: { ID: string }[] = XLSX.utils.sheet_to_json(storeSheet);
        const validStoreIDs = new Set(storeData.map((row) => row.ID)); // Create a set of valid store IDs

        // Extract and filter data from the "Planning" sheet
        const planningSheet = workbook.Sheets["Planning"];
        if (!planningSheet) return reject("Sheet 'Planning' not found!");
        let planningData: RowData[] = XLSX.utils.sheet_to_json(planningSheet);

        // Filter rows to include only stores present in the "Store" sheet
        planningData = planningData.filter((row) => validStoreIDs.has(row.store));

        console.log("Filtered Planning Data:", planningData); // Debugging log
        resolve(planningData);
      };

      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  // Define AG Grid column structure
  const columnDefs: (ColDef | ColGroupDef)[] = useMemo(() => [
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
          { field: `sales_units_${i + 1}`, headerName: "Sales Units", width: 120 },
          { field: `sales_dollars_${i + 1}`, headerName: "Sales Dollars", width: 120 },
          { field: `cost_dollars_${i + 1}`, headerName: "Cost Dollars", width: 120 },
          { field: `gm_dollars_${i + 1}`, headerName: "GM Dollars", width: 120 },
          { field: `gm_percent_${i + 1}`, headerName: "GM %", width: 120 },
        ],
      })),
    },
  ], []);

  // Default column properties for AG Grid
  const defaultColDef = useMemo<ColDef>(() => ({
    resizable: true, // Allow resizing columns
    sortable: true,  // Enable sorting on all columns
    filter: true,    // Enable filtering
  }), []);

  return (
    <div className="planning-container" style={{ width: "100%", height: "100%" }}>
      <AgGridReact
        ref={gridRef}
        rowData={rowData}         // Provide data to AG Grid
        columnDefs={columnDefs}   // Define column structure
        defaultColDef={defaultColDef} // Apply default column properties
        domLayout="autoHeight"    // Automatically adjust grid height
      />
    </div>
  );
};

export default Planning;
