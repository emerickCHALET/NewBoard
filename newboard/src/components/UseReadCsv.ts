import * as React from "react"
import Papa, { ParseResult } from "papaparse"

type Data = {
    Nom: string;
    Prenom: string;
    Classe: string;
    Email: string;
};

type Values = {
    data: Data[]
}

const useReadCSV = (url: string) => {

    const [values, setValues] = React.useState<Values | undefined>()

    const getCSV = () => {
        Papa.parse(url, {
            header: true,
            download: true,
            skipEmptyLines: true,
            delimiter: ",",
            complete: (results: ParseResult<Data>) => {
                setValues(results)
            },
        })
    }

    React.useEffect(() => {
        getCSV()
    }, [])

    return values;
}

export default useReadCSV

