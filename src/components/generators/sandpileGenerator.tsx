import { CellCoordinates, GridDataType } from '../powerGrid';

export function SandpileGenerator(
    gridWidth: number,
    gridHeight: number,
    sand: number,
    fallout: number,
    initialDrop?: { coordinates: CellCoordinates, size: number },
): GridDataType {
    let gridData = {};
    let gridSetup = {};

    const dataArray = new Array(gridHeight * gridWidth).fill(null);

    dataArray.forEach((item, index) => {
        const coordinates = { row: Math.floor(Math.fround(index / gridWidth)), column: index % gridWidth };

        gridData[`${coordinates.row}_${coordinates.column}`] = {
            value: { sand, fallout, owner: 'neutral' },
            mode: 'display',
            display: 'gamingSandpile',
            coordinates,
        };
    });

    function generateCastle(color: string, coords: [number, number][]) {
        const baseData = {
            mode: 'display',
            display: 'gamingSandpile',
        };

        coords.forEach((element) => {
            gridSetup[`${element[0]}_${element[1]}`] = {
                ...baseData,
                value: { sand: 3, fallout, owner: color, isCastle: true },
                coordinates: { row: element[0], column: element[1] },
            };
        });
    }

    function generateHoles(coords: [number, number][]) {
        const baseData = {
            mode: 'display',
            display: 'gamingSandpile',
        };

        coords.forEach((element) => {
            gridSetup[`${element[0]}_${element[1]}`] = {
                ...baseData,
                value: { sand: 3, fallout, owner: 'neutral', isHole: true },
                coordinates: { row: element[0], column: element[1] },
            };
        });
    }

    generateCastle('red', [
        [0, 4],
        [0, 5],
        [1, 4],
        [1, 5],
    ]);
    generateCastle('blue', [
        [9, 4],
        [9, 5],
        [8, 4],
        [8, 5],
    ]);
    generateHoles([
        [4, 4],
        [4, 5],
        [5, 4],
        [5, 5],
        [0, 0],
        [9, 9],
        [9, 0],
        [0, 9],
        [4, 3],
        [5, 6],
    ]);

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
