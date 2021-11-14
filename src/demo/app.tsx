import * as React from 'react';
import { SandpileGenerator } from '../components/generators/sandpileGenerator';
import { CellCoordinates, PowerGrid, ValidationCallbackType } from '../components/powerGrid';
import { styled } from '@mui/material/styles';
import { useState } from 'react';

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
    background-color: hsl(34, 100%, 70%);
`;

export default function App() {
    // Taille de la zone de jeu
    const ROWS = 311;
    const COLUMNS = 311;

    // Nombre de sables par tour
    const SAND_PER_TURN = 3;

    // Initial sandpiles configuration
    const INITIAL_SAND_DROP = { coordinates: { row: 155, column: 155 }, size: 100000 };

    // Grid configuration
    const SANDPILES = SandpileGenerator(ROWS, COLUMNS, 0, 4, INITIAL_SAND_DROP);

    const CALC_RATE = 5;

    const checkGrid: ValidationCallbackType = (props, states) => {
        const { rows, columns } = props;
        const { gridState, setIsValid } = states;

        function setCellValue(coordinates: string, depth: number) {
            const cellCoordinates = gridState[coordinates].coordinates;
            gridState[coordinates].value.sand -= 4;

            const targets = [
                { row: cellCoordinates.row + 1, column: cellCoordinates.column },
                { row: cellCoordinates.row - 1, column: cellCoordinates.column },
                { row: cellCoordinates.row, column: cellCoordinates.column + 1 },
                { row: cellCoordinates.row, column: cellCoordinates.column - 1 },
            ];

            targets.forEach((item) => {
                const cellCoord = stringifyCoordinates(item);

                if (gridState[cellCoord]) {
                   
                    if (gridState[cellCoord].value.sand + 1 >= gridState[cellCoord].value.fallout) {
                        gridState[cellCoord].value.sand += 1;
                        depth < 20 && setCellValue(cellCoord, depth + 1);
                    } else {
                        gridState[cellCoord].value.sand += 1;
                    }
                }
            });

            setIsValid(false);
        }

        for (let i = 0; i < rows; ) {
            for (let j = 0; j < columns; ) {
                const coordinates = `${i}_${j}`;

                if (gridState[coordinates].value.sand >= gridState[coordinates].value.fallout) {
                    setCellValue(coordinates, 0);
                }
                j++;
            }
            i++;
        }
    };

    function stringifyCoordinates(coordinates: CellCoordinates): string {
        return `${coordinates.row}_${coordinates.column}`;
    }

    const [turn, setTurn] = useState('blue');
    const [sandStock, setSandStock] = useState(SAND_PER_TURN);

    return (
        <Main>
            <Container>
                <PowerGrid
                    rows={ROWS}
                    columns={COLUMNS}
                    data={SANDPILES}
                    validationCallback={checkGrid}
                    infos={true}
                    calculationRate={CALC_RATE}
                />
            </Container>
        </Main>
    );
}
