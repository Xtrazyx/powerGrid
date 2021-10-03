import * as React from 'react';
import { SandpileGenerator } from '../components/generators/sandpileGenerator';
import { PowerGrid } from '../components/powerGrid';

export default function App() {
    const data = {
        grid: {
            '0_0': { display: 'sandpile', value: 1 },
            '0_1': { display: 'sandpile', value: 2 },
            '0_2': { display: 'sandpile', value: 0 },
        },
    };

    const ROWS = 3;
    const COLUMNS = 3;

    const [rows, setRows] = React.useState(ROWS);
    const [columns, setColumns] = React.useState(COLUMNS);

    const sandpiles = SandpileGenerator(ROWS,COLUMNS,()=>{})
    console.log(sandpiles)

    return (
        <div>
            <button onClick={() => setRows(rows + 1)}>add row</button>
            <button onClick={() => setColumns(columns + 1)}>add columns</button>
            <PowerGrid rows={rows} columns={columns} data={sandpiles} />
        </div>
    );
}
