"use client";
import CsvFrom, {FormCsvResult} from "@/components/csvFrom";
import {useState} from "react";
import {Label} from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";


export default function Home() {
    const [selectedFile, setSelectedFile] = useState<FormCsvResult | null>(null);

    const handleFileChange = (res: FormCsvResult) => {
        setSelectedFile(res);
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
                    <p>Marketing Emails: {selectedFile.marketing_emails ? 'Yes' : 'No'}</p>
                </div>
            )}
        </div>
    </div>
}
