"use client";
import CsvFrom, {FormCsvResult} from "@/components/csvFrom";
import {useState} from "react";
import {Label} from "@/components/ui/label";
import {Checkbox} from "@/components/ui/checkbox";
import Papa from 'papaparse';
import FormCsv from "@/components/formCsv";
import CSVFilterForm from "@/components/csvFilterForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"



export interface FilterCsv {
    nbRows: number;
}

export default function Home() {
    const [selectedFile, setSelectedFile] = useState<FormCsvResult | null>(null);
    const [csvData, setCsvData] = useState<string[][]>([]);
    const [filtres, setFiltres] = useState<FilterCsv>({
        nbRows: 10
    });

    const handleFiltresChange = (newFiltres: FilterCsv) => {
        console.log("Updating filters to:", newFiltres);
        setFiltres(newFiltres);
    };

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
        <Tabs defaultValue="account" className="w-[400px]">
            <TabsList>
                <TabsTrigger value="cleanRows">Clean Rows</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
            <TabsContent value="cleanRows">
                {csvData.length > 0 && (
                    <>
                        <CSVFilterForm filtres={filtres} onFiltresChange={handleFiltresChange}/>
                        <FormCsv data={csvData} rowDisplay={filtres.nbRows}/>
                    </>
                )}
            </TabsContent>
            <TabsContent value="password">Change your password here.</TabsContent>
        </Tabs>

    </div>
}
