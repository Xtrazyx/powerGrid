import { SandPileValueType } from "../default/cells/sandpile";
import { CellCoordinates, GridDataType, UiComponentProps } from "../powerGrid";

export function SandpileGenerator( 
    gridWidth: number, 
    gridHeight: number,
    setState: (coordinates: CellCoordinates, value: SandPileValueType) => void)
    : GridDataType 
    {
        let gridData = {};

        const dataArray = new Array(gridHeight * gridWidth).fill(null);

        dataArray.forEach((item, index) => 
            {
                const coordinates = { row: Math.floor(Math.fround( index / gridWidth)), column: index % gridWidth };
                
                gridData[`${coordinates.row}_${coordinates.column}`] = 
                { 
                    value: 0, 
                    setValue: setState, 
                    mode: 'display', 
                    display: 'sandpile',
                    coordinates
                }
            }
        );

        return { grid: gridData };
}