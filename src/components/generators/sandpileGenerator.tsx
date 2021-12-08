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
    redCastle: [number, number][],
    blueCastle: [number, number][],
    holes?: [number, number][],
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
        if(!coords) return;

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

    generateCastle('red', redCastle);
    generateCastle('blue', blueCastle);
    generateHoles(holes);

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
