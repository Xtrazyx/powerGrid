import { CellCoordinates, GridDataType } from '../powerGrid';

export type MapType = [
    gridWidth: number,
    gridHeight: number,
    sand: number,
    fallout: number,
    redCastle: [number, number][],
    blueCastle: [number, number][],
    holes?: [number, number][],
    initialDrop?: { coordinates: CellCoordinates, size: number }
];

export function SandpileGenerator(
    gridWidth: number,
    gridHeight: number,
    sand: number,
    fallout: number,
    initialDrop?: { coordinates: CellCoordinates, size: number }
): GridDataType {
    let gridData = {};
    let gridSetup = {};

    const dataArray = new Array(gridHeight * gridWidth).fill(null);

    dataArray.forEach((item, index) => {
        const coordinates = { row: index % gridWidth, column: Math.floor(Math.fround(index / gridWidth)) };
        
        gridData[`${coordinates.row}_${coordinates.column}`] = {
            value: { sand, fallout, owner: 'neutral' },
            mode: 'display',
            display: 'gamingSandpile',
            coordinates,
        };
    });

    if (initialDrop) {
        gridSetup[`${initialDrop.coordinates.row}_${initialDrop.coordinates.column}`] = {
            value: { sand: initialDrop.size, fallout, owner: 'red' },
            mode: 'display',
            display: 'gamingSandpile',
            coordinates: { row: initialDrop.coordinates.row, column: initialDrop.coordinates.column },
        };
    }

    return { ...gridData, ...gridSetup };
}
