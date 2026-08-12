import React, { useEffect, useRef, useState } from 'react';
import { Workbook } from '@fortune-sheet/react';
import '@fortune-sheet/react/dist/index.css';
import LuckyExcel from 'luckyexcel';

export default function GhgCalculatorView({ onSave, onCancel }) {
  const [sheetData, setSheetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const workbookRef = useRef(null);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}GHG_Calculator_RECTIFIED_v6.xlsx`)
      .then(res => res.arrayBuffer())
      .then(buffer => {
        const file = new File([buffer], "GHG_Calculator_RECTIFIED_v6.xlsx", { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        
        LuckyExcel.transformExcelToLucky(
          file,
          (exportJson) => {
            if (exportJson.sheets == null || exportJson.sheets.length === 0) {
              console.error("Failed to read excel sheets");
              return;
            }
            setSheetData(exportJson.sheets);
            setLoading(false);
          },
          (err) => {
            console.error('Import excel error', err);
            setLoading(false);
          }
        );
      })
      .catch(err => {
        console.error("Failed to fetch excel file", err);
        setLoading(false);
      });
  }, []);

  const handleSave = () => {
    if (!workbookRef.current) return;
    
    const sheets = workbookRef.current.getAllSheets();
    const coverSheet = sheets.find(s => s.name === 'Cover_Boundary');
    const calcSheet = sheets.find(s => s.name === 'GHG_Master_Calculator');
    
    if (!calcSheet) {
       console.error("Could not find GHG_Master_Calculator sheet");
       return;
    }

    const getCellValue = (sheet, r, c) => {
       if (!sheet.data || !sheet.data[r] || !sheet.data[r][c]) return null;
       return sheet.data[r][c].v !== undefined ? sheet.data[r][c].v : sheet.data[r][c].m;
    };

    const coverBoundary = {
       consolidationApproach: '',
       reportingPeriod: '',
       baseYear: '',
       gwpVintage: '',
       materialityThreshold: ''
    };

    if (coverSheet && coverSheet.data) {
        for (let r = 0; r < coverSheet.data.length; r++) {
            const row = coverSheet.data[r];
            if (!row) continue;
            for (let c = 0; c < row.length; c++) {
                const cell = row[c];
                if (!cell) continue;
                const text = String(cell.m || cell.v || '').toLowerCase();
                if (text.includes('consolidation approach')) coverBoundary.consolidationApproach = getCellValue(coverSheet, r, c + 1);
                if (text.includes('reporting period')) coverBoundary.reportingPeriod = getCellValue(coverSheet, r, c + 1);
                if (text.includes('base year')) coverBoundary.baseYear = getCellValue(coverSheet, r, c + 1);
                if (text.includes('gwp vintage') || text.includes('gwp values used')) coverBoundary.gwpVintage = getCellValue(coverSheet, r, c + 1);
                if (text.includes('materiality threshold')) coverBoundary.materialityThreshold = getCellValue(coverSheet, r, c + 1);
            }
        }
    }

    const importedBOM = [];
    let currentScope = 'Scope 3';
    let currentScope2Method = null;
    let currentScope3Category = null;

    if (calcSheet.data) {
        for (let r = 0; r < calcSheet.data.length; r++) {
            const row = calcSheet.data[r];
            if (!row || !row[0]) continue;
            
            const colA = String(row[0].m || row[0].v || '').trim();
            const colB = row[1] ? (row[1].v !== undefined ? row[1].v : row[1].m) : null;
            const colC = row[2] ? (row[2].m || row[2].v) : '';
            const colD = row[3] ? (row[3].v !== undefined ? row[3].v : row[3].m) : 0;
            const colE = row[4] ? (row[4].m || row[4].v) : 'Not Yet Assessed';
            const colF = row[5] ? (row[5].v !== undefined ? row[5].v : row[5].m) : 0;
            
            if (!colA) continue;
            const upperA = colA.toUpperCase();
            
            if (upperA.includes('SCOPE 1')) {
                currentScope = 'Scope 1';
                currentScope2Method = null;
                currentScope3Category = null;
                continue;
            }
            if (upperA.includes('LOCATION-BASED SCOPE 2') || upperA.includes('LOCATION BASED SCOPE 2')) {
                currentScope = 'Scope 2';
                currentScope2Method = 'location';
                currentScope3Category = null;
                continue;
            }
            if (upperA.includes('MARKET-BASED SCOPE 2') || upperA.includes('MARKET BASED SCOPE 2')) {
                currentScope = 'Scope 2';
                currentScope2Method = 'market';
                currentScope3Category = null;
                continue;
            }
            if (upperA.includes('SCOPE 3')) {
                currentScope = 'Scope 3';
                currentScope2Method = null;
                continue;
            }
            if (upperA.startsWith('CATEGORY')) {
                currentScope = 'Scope 3';
                currentScope3Category = colA;
                currentScope2Method = null;
                continue;
            }

            if (upperA.includes('GRAND TOTAL')) continue;

            if (colB === null || colB === '' || isNaN(Number(colB))) continue;

            const dataQuality = String(colE);
            let risk = 'LOW';
            if (dataQuality.toLowerCase().includes('not yet assessed') || dataQuality.toLowerCase().includes('poor')) {
                risk = 'HIGH';
            } else if (dataQuality.toLowerCase().includes('fair')) {
                risk = 'MEDIUM';
            }

            importedBOM.push({
                id: `ghg_sheet_${r}`,
                name: colA,
                qty: Number(colB),
                unit: colC,
                process: colA,
                ef: Number(colD) || 0,
                scope: currentScope,
                scope2Method: currentScope2Method,
                scope3Category: currentScope3Category,
                gwpBasis: coverBoundary.gwpVintage || 'AR4',
                dataQuality: dataQuality,
                result_tco2e: Number(colF) || 0,
                ter: 1, ger: 1, tir: 1,
                risk: risk,
                status: 'Imported from GHG Calculator',
                approved: false
            });
        }
    }

    onSave(importedBOM, coverBoundary);
  };

  return (
    <div className="flex flex-col h-full absolute inset-0 bg-white z-50">
      <div className="flex justify-between items-center px-6 py-3 bg-slate-900 text-white shadow-md">
        <div>
          <h2 className="font-semibold text-lg">GHG Calculator</h2>
          <p className="text-xs text-slate-400">Live Engine - Edits will automatically calculate VLOOKUPs</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-md shadow-sm transition-colors"
          >
            Save to Workspace
          </button>
        </div>
      </div>
      
      <div className="flex-1 relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
            <div className="text-slate-500 font-medium animate-pulse">Loading Excel Workbook...</div>
          </div>
        ) : sheetData ? (
          <Workbook ref={workbookRef} data={sheetData} />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-50 text-red-500">
            Failed to load workbook data.
          </div>
        )}
      </div>
    </div>
  );
}
