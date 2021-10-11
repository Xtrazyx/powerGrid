import * as React from 'react';
import { useContext, useState, useEffect, FunctionComponent } from 'react';
import { GridContext } from '../../../context/gridContext';
import { UiComponentProps } from '../../powerGrid';

export type SandPileValueType = { sand: number, fallout: number };

export const Sandpile: FunctionComponent<UiComponentProps<SandPileValueType>> = (props) => {
    const { value, coordinates, mode = 'display', setValue, getValue } = props;

    const [innerValue, setInnerValue] = useState(value);

    const grid = useContext(GridContext).grid;
    const cellValue = grid?.[`${coordinates.row}_${coordinates.column}`]?.value;

    useEffect(() => {
        setInnerValue(cellValue)
    },[cellValue])

    return (
        <div>
            <button
                onClick={() =>
                    setValue({ row: coordinates.row, column: coordinates.column }, { ...value, sand: value.sand + 1 })
                }
            >
                {console.log('context', grid)}
                {innerValue?.sand || cellValue?.sand}
            </button>
        </div>
    );
};
