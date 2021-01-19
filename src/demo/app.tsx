import * as React from 'react';
import { PowerGrid } from '../components/powerGrid';

export default function App() {
    const data = {
        grid: {
            '0_0': { display: 'text', value: 'hello' },
            '2_1': { display: 'number', value: 25 },
            '7_2': { display: 'number', value: 320 },
        },
    };

    const [rows, setRows] = React.useState(3);
    const [columns, setColumns] = React.useState(3);

    return (
        <div>
            <button onClick={() => setRows(rows + 1)}>add row</button>
            <button onClick={() => setColumns(columns + 1)}>add columns</button>
            <PowerGrid rows={rows} columns={columns} data={data} />
        </div>
    );
}
