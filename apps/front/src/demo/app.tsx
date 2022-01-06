import * as React from 'react';
import { CellCoordinates, PowerGrid, ValidationCallbackType, GridDataType } from 'powergrid';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import { ownerColor } from 'powergrid';
import { generateLevel, LevelName } from './levels';

const Main = styled('div')`
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    background-color: #ffbd66;
`;

const COL_OFFSET = 256;

const LeftColumn = styled('div')`
    position: absolute;
    left: -${COL_OFFSET}px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    height: 100%;
    width: ${COL_OFFSET}px;
    border-right: solid 1px #fba22e;
`;

const RightColumn = styled('div')`
    position: absolute;
    right: -${COL_OFFSET}px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    align-items: flex-start;
    justify-content: center;
    height: 100%;
    width: ${COL_OFFSET}px;
    border-left: solid 1px #fba22e;
`;

const Tools = styled('div')`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    padding-right: 24px;
    font-size: 24px;
`;

const Board = styled('div')`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-basis: 640px;
`;

const Message = styled('div')`
    display: flex;
    flex-direction: column;
    font-size: 24px;
    padding-left: 24px;
    align-items: flex-start;
    justify-content: center;
`;

const Button = styled('div')`
    text-decoration: underline;
    cursor: pointer;
`;

const Choose = styled('div')`
    flex-direction: column;
    align-items: center;
    text-align: center;
    font-size: 150%;
`

type PlayerColorType = {
    turn: string;
};

const PlayerColor = styled('span')<PlayerColorType>`
    color: ${({ turn }) => ownerColor[turn].select};
    font-weight: 700;
`;

export default function App() {
    // Nombre de sables par tour
    const SAND_PER_TURN = 3;

    // Game states
    const [turn, setTurn] = useState('blue');
    const [sandStock, setSandStock] = useState(SAND_PER_TURN);
    const [victory, setVictory] = useState('none');
    const [game, nextGame] = useState(0);
    const [level, setLevel] = useState('square');
    const [started, setStarted] = useState(false);

    // Level
    const [ROWS, COLUMNS, data, redCastle, blueCastle] = generateLevel(level as LevelName);

    function handleReset() {
        nextGame(game + 1);
        setTurn('blue');
        setSandStock(SAND_PER_TURN);
        setVictory('none');
        setStarted(false);
    }

    function handleLevel(levelName: LevelName) {
        setLevel(levelName);
        setStarted(true);
    }

    function checkVictory(gridState: GridDataType): string {
        if (
            gridState[redCastle[0]].value.owner === 'blue' &&
            gridState[redCastle[1]].value.owner === 'blue' &&
            gridState[redCastle[2]].value.owner === 'blue' &&
            gridState[redCastle[3]].value.owner === 'blue'
        ) {
            setVictory('blue');
        }

        if (
            gridState[blueCastle[0]].value.owner === 'red' &&
            gridState[blueCastle[1]].value.owner === 'red' &&
            gridState[blueCastle[2]].value.owner === 'red' &&
            gridState[blueCastle[3]].value.owner === 'red'
        ) {
            setVictory('red');
        }

        return 'none';
    }

    const checkGrid: ValidationCallbackType = (props, states) => {
        const { rows, columns } = props;
        const { gridState, setIsValid } = states;

        if (victory !== 'none') {
            return;
        }

        function setCellValue(coordinates: string, depth: number) {
            const cellCoordinates = gridState[coordinates].coordinates;
            gridState[coordinates].value.sand -= 4;

            const targets = [
                { row: cellCoordinates.row + 1, column: cellCoordinates.column },
                { row: cellCoordinates.row - 1, column: cellCoordinates.column },
                { row: cellCoordinates.row, column: cellCoordinates.column + 1 },
                { row: cellCoordinates.row, column: cellCoordinates.column - 1 },
            ];

            targets.forEach((item) => {
                const cellCoord = stringifyCoordinates(item);

                if (gridState[cellCoord]?.value?.isHole) {
                    return;
                }

                if (gridState[cellCoord]) {
                    if (gridState[cellCoord].value.sand + 1 >= gridState[cellCoord].value.fallout) {
                        gridState[cellCoord].value.sand += 1;
                        gridState[cellCoord].value.owner = turn;

                        depth < 20 && setCellValue(cellCoord, depth + 1);
                    } else {
                        gridState[cellCoord].value.sand += 1;
                        gridState[cellCoord].value.owner = turn;
                    }
                }
            });

            setIsValid(false);
        }

        for (let i = 0; i < rows; ) {
            for (let j = 0; j < columns; ) {
                const coordinates = `${i}_${j}`;

                if (gridState[coordinates].value.sand >= gridState[coordinates].value.fallout) {
                    setCellValue(coordinates, 0);
                }
                j++;
            }
            i++;
        }

        if (checkVictory(gridState) !== 'none') {
            setVictory(checkVictory(gridState));
            return;
        }

        if (sandStock === 0) {
            setSandStock(SAND_PER_TURN);
            setTurn(turn === 'red' ? 'blue' : 'red');
        }
    };

    function handleTurn() {
        if (sandStock !== 0) {
            setSandStock(sandStock - 1);
        }
    }

    function stringifyCoordinates(coordinates: CellCoordinates): string {
        return `${coordinates.row}_${coordinates.column}`;
    }

    return (
        <Main>
            {
                <Board>
                    {started ? (
                        <>
                            <LeftColumn>
                                <Tools>
                                    <div>
                                        Player is <PlayerColor turn={turn}>{turn}</PlayerColor>
                                    </div>
                                    <div>
                                        Sand stock is <PlayerColor turn={turn}>{sandStock}</PlayerColor>
                                    </div>
                                    <br/>
                                    <div>
                                        Level is <b>{level}</b>
                                    </div>
                                </Tools>
                            </LeftColumn>
                            <PowerGrid
                                key={game}
                                rows={ROWS}
                                columns={COLUMNS}
                                data={data}
                                validationCallback={checkGrid}
                                externalHandler={handleTurn}
                                externalState={{ turn, sandStock, victory }}
                            />
                            <RightColumn>
                                {victory !== 'none' && (
                                    <Message>
                                        <div>
                                            Player <PlayerColor turn={victory}>{victory}</PlayerColor> won !
                                        </div>
                                        <Button onClick={handleReset}>
                                            <b>Reset</b> the game.
                                        </Button>
                                    </Message>
                                )}
                            </RightColumn>
                        </>
                    ) : (
                        <Choose>
                            <div>
                                <b>Choose a level</b>
                            </div>
                            <div>
                                <Button onClick={() => handleLevel('square')}>Square</Button>
                            </div>
                            <div>
                                <Button onClick={() => handleLevel('pile')}>Pile</Button>
                            </div>
                        </Choose>
                    )}
                </Board>
            }
        </Main>
    );
}
