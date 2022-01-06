import * as React from 'react';
import { useContext, FunctionComponent } from 'react';
import { GridContext } from '../../context/gridContext';
import { UiComponentProps } from '../../powerGrid';
import styled from '@emotion/styled';

export type SandPileValueType = { sand: number, fallout: number, owner: 'blue' | 'red' | 'neutral' };

const SandPileColor = styled.div`
    height: 100%;
    width: 100%;
    text-align: center;
    background-color: ${({ color }) => color};
`;

export const Sandpile: FunctionComponent<UiComponentProps<SandPileValueType>> = (props) => {
    const { coordinates, setValue, getValue } = props;

    const grid = useContext(GridContext);
    const cellValue = grid?.[`${coordinates.row}_${coordinates.column}`]?.value;

    const color = {
        3: '#fd7200',
        2: '#ffab5c',
        1: '#fbd0b3',
        0: '#fdeac2',
    };

    return (
        <SandPileColor
            color={color[cellValue.sand]}
        >
           
        </SandPileColor>
    );
};
