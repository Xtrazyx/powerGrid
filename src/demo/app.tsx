import * as React from 'react';
import { SandpileGenerator } from '../components/generators/sandpileGenerator';
import { PowerGrid } from '../components/powerGrid';
import { styled } from '@mui/material/styles';

const Container = styled('div')`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Main = styled('div')`
    height: 100vh;
    width: 100vw;
`;

export default function App() {
    const ROWS = 3;
    const COLUMNS = 3;

    const [rows, setRows] = React.useState(ROWS);
    const [columns, setColumns] = React.useState(COLUMNS);

    // TODO mettre dans un useEffect
    const sandpiles = SandpileGenerator(ROWS, COLUMNS, 4, 5);
    sandpiles;

    return (
        <Main>
            <div>
                <button onClick={() => setRows(rows + 1)}>add row</button>
                <button onClick={() => setColumns(columns + 1)}>add columns</button>
            </div>
            <Container>
                <PowerGrid rows={rows} columns={columns} data={sandpiles} />
            </Container>
        </Main>
    );
}
