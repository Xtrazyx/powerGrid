import * as React from 'react';
import { useContext, FunctionComponent } from 'react';
import { GridContext } from '../../../context/gridContext';
import { UiComponentProps } from '../../powerGrid';
import styled from '@emotion/styled';
import { ownerColor, OwnerColorType } from '../templates/sandpileColor';
import { ExternalContext } from '../../../context/externalContext';

export type SandPileValueType = {
    sand: number;
    fallout: number;
    isHole?: boolean;
    isCastle?: boolean;
    owner: 'blue' | 'red' | 'neutral';
};

export type SandPileColorType = {
    selectColor?: string;
    bgColor?: string;
    hasPointer?: boolean;
    isWhite?: boolean;
    isHole?: boolean;
    isCastle?: boolean;
    isEmpty?: boolean;
    borderSize?: number;
    colors?: OwnerColorType;
    owner: 'blue' | 'red' | 'neutral';
};

type SandGridContextType = {
    turn?: string;
    sandStock?: number;
    victory?: 'none' | 'red' | 'blue';
};
/*
            3: '#fd7200',
            2: '#ffab5c',
            1: '#fbd0b3',
            0: '#fdeac2',
*/
const SandPileColor = styled.button <SandPileColorType>`
    height: 100%;
    width: 100%;
    text-align: center;
    background-color: ${({ bgColor }) => bgColor};
    ${({ isHole }) =>
        !isHole &&
        `
            border-top-color: #fdeac2;
            border-right-color: #ffab5c;
            border-bottom-color: #fd7200;
            border-left-color: #fbd0b3
        `
    };
    ${({ owner, colors }) =>
        `
            border-top-color: ;
            border-right-color: #ffab5c;
            border-bottom-color: #fd7200;
            border-left-color: #fbd0b3
        `
    };
    cursor: ${({ hasPointer }) => (hasPointer ? 'pointer' : 'not-allowed')};
    color: ${({ isWhite, isEmpty }) => (isWhite ? 'white' : isEmpty ? '#ffbd66' : undefined)};
    font-weight: ${({ isWhite, isEmpty }) => (isWhite && 700) || (isEmpty && 700)};
    ${({ isHole }) => isHole && `border: none`};
    ${({ borderSize }) => `border-width: ${borderSize}px`};
    padding: 0;
    margin: 0;

    &:hover {
        border: 2px dashed ${({ selectColor }) => selectColor};
    }
`;

export const GamingSandpile: FunctionComponent<UiComponentProps<SandPileValueType>> = (props) => {
    const { coordinates, setValue, handleTurn } = props;

    const grid = useContext(GridContext);
    const external: SandGridContextType = useContext(ExternalContext);
    const { isHole, owner, sand, fallout, isCastle } = grid?.[`${coordinates.row}_${coordinates.column}`]?.value;

    const letter = {
        0: 'λ',
        1: 'α',
        2: 'β',
        3: 'Ω',
    };

    function handleClick() {
        setValue(coordinates, { ...grid?.[`${coordinates.row}_${coordinates.column}`]?.value, sand: sand + 1, owner: external.turn });
        handleTurn();
    }

    function isLegal() {
        if (external?.victory !== 'none' || external.sandStock === 0) {
            return false;
        }

        return owner === external.turn;
    }

    return (
        <SandPileColor
            bgColor={isHole ? ownerColor.neutral.hole : ownerColor[owner].sand[sand]}
            onClick={isLegal() ? handleClick : undefined}
            selectColor={isLegal() ? ownerColor[external.turn]?.select : 'none'}
            hasPointer={isLegal()}
            isWhite={sand === fallout - 1}
            isHole={isHole}
            isEmpty={sand === 0 && owner === 'neutral'}
            borderSize={sand * 2 + 1}
            isCastle={isCastle}
            colors={ownerColor}
            owner={owner}
        >
            {isHole ? '' : letter[sand]}
        </SandPileColor>
    );
};
