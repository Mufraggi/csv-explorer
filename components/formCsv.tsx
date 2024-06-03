export interface CsvDataToDisplayed {
    data: string[][]
    rowDisplay: number
}

export default function FormCsv(csvData: CsvDataToDisplayed) {
    const data = csvData.data.slice(0, csvData.rowDisplay);
    return (
        <table className="min-w-full mt-10 bg-white">
            <thead>
            <tr>
                {data[0].map((header, index) => (
                    <th key={index} className="py-2 px-4 border-b border-gray-200 bg-gray-100">
                        {header}
                    </th>
                ))}
            </tr>
            </thead>
            <tbody>
            {data.slice(1).map((row, rowIndex) => (
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
    )
}