"use client";
import CsvFrom, {FormCsvResult} from "@/components/csvFrom";
import {useState} from "react";
import Papa from 'papaparse';
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {ColumnDef} from "@tanstack/react-table";
import {DataTable} from "@/components/table-data/data-table";
import CSVFilterForm from "@/components/csvFilterForm";

export interface FilterCsv {
    nbRows: number;
}
type CSVData = { [key: string]: string | number }

export default function Home() {
    const [selectedFile, setSelectedFile] = useState<FormCsvResult | null>(null);
    const [data, setData] = useState<CSVData[]>([]);
    const [columns, setColumns] = useState<ColumnDef<CSVData>[]>([]);

    const [filtres, setFiltres] = useState<FilterCsv>({
        nbRows: 300
    });

    const handleFiltresChange = (newFiltres: FilterCsv) => {
        console.log("Updating filters to:", newFiltres);
        setFiltres(newFiltres);
    };

    const handleFileChange = (res: FormCsvResult) => {
        setSelectedFile(res);
        if (res.file) {
            Papa.parse<CSVData>(res.file, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    console.log("Parsing complete", results);
                    const h = results.meta.fields as string[];

                    const parsedData = results.data.map((row) => {
                        console.log("rows: ", row);
                        const rowObject: CSVData = {};
                        h.forEach((header) => {
                            rowObject[header.replace(".", "-")] = row[header] !== undefined ? row[header] : '';
                        });
                        return rowObject;
                    });
                    const headers = h.map(x => x.replace(".", "-"))
                    console.log("Parsed Data:", parsedData);

                    setData(parsedData);

                    const generatedColumns = headers.map((header) => ({
                        accessorKey: header,
                        header: header,
                    }));
                    setColumns(generatedColumns);
                },
            });
        }
    };

    return (
        <div>
            <Tabs defaultValue="cleanRows">
                <TabsList>
                    <TabsTrigger value="cleanRows">Clean Rows</TabsTrigger>
                    <TabsTrigger value="password">Password</TabsTrigger>
                </TabsList>
                <div>
                    <h1>Upload CSV File</h1>
                    <CsvFrom onFileChange={handleFileChange} />
                </div>
                <TabsContent value="cleanRows">
                    {data.length > 0 && (
                        <>
                            <CSVFilterForm filtres={filtres} onFiltresChange={handleFiltresChange}/>
                            <DataTable dataT={{ data, columns }} rowDisplay={filtres.nbRows} />
                        </>
                    )}
                </TabsContent>
                <TabsContent value="password">Change your password here.</TabsContent>
            </Tabs>
        </div>
    );
}