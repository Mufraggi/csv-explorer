import {FilterCsv} from "@/app/page";
import {Input} from "@/components/ui/input";

export interface FilterCsvStart {
    filtres:FilterCsv
    onFiltresChange: (newFiltres: FilterCsv) => void
}

export default function  CSVFilterForm({ filtres, onFiltresChange }: FilterCsvStart) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const numericValue = parseInt(value, 10);
        console.log(numericValue)
        if (!isNaN(numericValue)) {
            onFiltresChange({
                ...filtres,
                [name]: numericValue
            });
        }
    };

    return (
        <div className="p-4 bg-gray-100 rounded-lg shadow-md">
            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                    Filtre 1:
                    <Input
                        type="number"
                        name="nbRows"
                        value={filtres.nbRows}
                        onChange={handleChange}
                        className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    />
                </label>
            </div>
        </div>
    );
}
