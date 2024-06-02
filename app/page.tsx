"use client";
import CsvFrom, {FormCsvResult} from "@/components/csvFrom";
import {useState} from "react";
import {Label} from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Papa from 'papaparse';


export default function Home() {
    const [selectedFile, setSelectedFile] = useState<FormCsvResult | null>(null);
    const [csvData, setCsvData] = useState<string[][]>([]);
    const handleFileChange = (res: FormCsvResult) => {
        setSelectedFile(res);
        if (res.file) {
            Papa.parse(res.file, {
                complete: (result) => {
                    if (res.hasHeader) {
                        const data = result.data as any[];
                        const headers = Object.keys(data[0]);
                        const rows = data.map(row => headers.map(header => row[header]));
                        setCsvData([headers, ...rows]);
                    } else {
                        setCsvData(result.data as string[][]);
                    }
                },
                header: res.hasHeader,
            });
        }
    };
    return <div>
        <div>
            <h1>Upload CSV File</h1>
            <div className="flex items-center space-x-2">
                <Checkbox id="terms"/>
                <Label htmlFor="terms">With Header ?</Label>
            </div>
            <CsvFrom onFileChange={handleFileChange}/>
            {selectedFile && (
                <div>
                    <h2>Selected File:</h2>
                    {selectedFile.file ? (
                        <p>{selectedFile.file.name}</p>
                    ) : (
                        <p>No file selected</p>
                    )}
                    <p>Marketing Emails: {selectedFile.hasHeader ? 'Yes' : 'No'}</p>
                </div>
            )}
        </div>
        {csvData.length > 0 && (
            <table className="min-w-full mt-10 bg-white">
                <thead>
                <tr>
                    {csvData[0].map((header, index) => (
                        <th key={index} className="py-2 px-4 border-b border-gray-200 bg-gray-100">
                            {header}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {csvData.slice(1).map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className="py-2 px-4 border-b border-gray-200">
                                {cell}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        )}
    </div>
}
