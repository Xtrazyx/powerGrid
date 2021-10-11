import { GridDataType } from "../powerGrid";

export function SandpileGenerator( 
    gridWidth: number, 
    gridHeight: number,
    sand: number,
    fallout: number)
    : GridDataType 
    {
        let gridData = {};

        const dataArray = new Array(gridHeight * gridWidth).fill(null);

        dataArray.forEach((item, index) => 
            {
                const coordinates = { row: Math.floor(Math.fround( index / gridWidth)), column: index % gridWidth };
                
                gridData[`${coordinates.row}_${coordinates.column}`] = 
                { 
                    value: { sand, fallout }, 
                    mode: 'display', 
                    display: 'sandpile',
                    coordinates
                }
            }
        );

        return { grid: gridData };
}
