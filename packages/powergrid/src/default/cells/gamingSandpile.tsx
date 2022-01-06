import * as React from 'react';
import { useContext, FunctionComponent } from 'react';
import { GridContext } from '../../context/gridContext';
import { UiComponentProps } from '../../powerGrid';
import styled from '@emotion/styled';
import { ownerColor, OwnerColorType } from '../../templates/sandpileColor';
import { ExternalContext } from '../../context/externalContext';

export type SandPileValueType = {
    sand: number,
    fallout: number,
    isHole?: boolean,
    isCastle?: boolean,
    owner: 'blue' | 'red' | 'neutral',
};

export type SandPileColorType = {
    selectColor?: string,
    bgColor?: string,
    hasPointer?: boolean,
    isWhite?: boolean,
    isHole?: boolean,
    isCastle?: boolean,
    isEmpty?: boolean,
    borderSize?: number,
    colors?: OwnerColorType,
    owner: 'blue' | 'red' | 'neutral',
};

type SandGridContextType = {
    turn?: string,
    sandStock?: number,
    victory?: 'none' | 'red' | 'blue',
};

const SandPileColor = styled.button <SandPileColorType>`
    height: 100%;
    width: 100%;
    text-align: center;
    background-color: ${({ bgColor }) => bgColor};
    ${({ owner, colors }) =>
        `
            border-top-color: ${colors[owner].sand[0]};
            border-right-color: ${colors[owner].sand[2]};
            border-bottom-color: ${colors[owner].sand[3]};
            border-left-color: ${colors[owner].sand[1]};
        `};
    ${({ isCastle }) =>
        isCastle &&
        `
            border-top-color: #ffec66;
            border-right-color: #c3c781;
            border-bottom-color: #a9a257;
            border-left-color: #ffdc7a;
        `};
    cursor: ${({ hasPointer }) => (hasPointer ? 'pointer' : 'not-allowed')};
    color: ${({ isWhite, isEmpty }) => (isWhite ? 'white' : isEmpty ? '#ffbd66' : undefined)};
    font-weight: ${({ isWhite, isEmpty }) => (isWhite && 700) || (isEmpty && 700)};
    ${({ isHole }) => isHole && `border: none`};
    ${({ borderSize }) => `border-width: ${borderSize}px`};
    padding: 0;
    margin: 0;

    &:hover {
        border: 3px dashed ${({ selectColor }) => selectColor};
    }
`;

export const GamingSandpile: FunctionComponent<UiComponentProps<SandPileValueType>> = (props) => {
    const { coordinates, setValue, externalHandler } = props;

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
        setValue(coordinates, {
            ...grid?.[`${coordinates.row}_${coordinates.column}`]?.value,
            sand: sand + 1,
            owner: external.turn,
        });
        externalHandler();
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
