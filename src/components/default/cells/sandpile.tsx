import * as React from 'react';
import { useContext, useState, useEffect, FunctionComponent } from 'react';
import { GridContext } from '../../../context/gridContext';
import { CellCoordinates, UiComponentProps } from '../../powerGrid';

export type SandPileValueType = { sand: number, fallout: number, owner: 'blue' | 'red' | 'neutral' };

export const Sandpile: FunctionComponent<UiComponentProps<SandPileValueType>> = (props) => {
    const { value, coordinates, mode = 'display', setValue, getValue } = props;

    const grid = useContext(GridContext);
    const cellValue = grid?.[`${coordinates.row}_${coordinates.column}`]?.value;

    const colors = {
        neutral: 34,
        blue: 217,
        red: 0
    }

    function handleClick() {
        setValue(coordinates, { ...cellValue, sand: cellValue.sand + 1 }, cellValue.sand + 1 === cellValue.fallout);
    }

    return (
        <div>
            <button
                style={{
                    height: '48px',
                    width: '48px ',
                    backgroundColor: `hsl(${colors[value.owner] + cellValue.sand * 10}, 100%, 70%)`,
                    border: 'none',
                }}
                onClick={handleClick}
            >
                {cellValue.sand}
            </button>
        </div>
    );
};
