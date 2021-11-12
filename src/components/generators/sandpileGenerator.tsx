import { GridDataType } from '../powerGrid';

const INITIAL_SAND_DROP = { coordinates: { x: 106, y: 106 }, size: 80000 };

export function SandpileGenerator(gridWidth: number, gridHeight: number, sand: number, fallout: number): GridDataType {
    let gridData = {};
    let gridSetup = {};

    const dataArray = new Array(gridHeight * gridWidth).fill(null);

    dataArray.forEach((item, index) => {
        const coordinates = { row: Math.floor(Math.fround(index / gridWidth)), column: index % gridWidth };

        gridData[`${coordinates.row}_${coordinates.column}`] = {
            value: { sand, fallout, owner: 'neutral' },
            mode: 'display',
            display: 'sandpile',
            coordinates,
        };
    });

    gridSetup[`${INITIAL_SAND_DROP.coordinates.x}_${INITIAL_SAND_DROP.coordinates.y}`] = {
            value: { sand: INITIAL_SAND_DROP.size, fallout, owner: 'neutral' },
            mode: 'display',
            display: 'sandpile',
            coordinates: { row: INITIAL_SAND_DROP.coordinates.x, column: INITIAL_SAND_DROP.coordinates.y },
        
    };

    return {...gridData, ...gridSetup};
}
