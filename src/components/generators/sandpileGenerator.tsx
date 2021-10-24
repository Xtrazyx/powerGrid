import { GridDataType } from '../powerGrid';

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

    gridSetup[`5_5`] = {
            value: { sand: 500, fallout, owner: 'neutral' },
            mode: 'display',
            display: 'sandpile',
            coordinates: { row: 5, column: 5 },
        
    };

    return {...gridData, ...gridSetup};
}
