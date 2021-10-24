import * as React from 'react';
import { FunctionComponent, ComponentType } from 'react';
import { useEffect } from 'react';
import defaultRegistry from './default/registry';
import { GridContext } from '../context/gridContext';

interface CellData<T> {
    display: string; // used to call component from display registry
    value: T;
    mode: 'display' | 'error';
    coordinates?: CellCoordinates;
    setValue: (coordinates: CellCoordinates, value: T, event?: boolean) => void;
    getValue: (coordinates: CellCoordinates) => T;
}

export type CellCoordinates = { row: number, column: number };

export type UiComponentProps<T> = Omit<CellData<T>, 'display'> & {
    mode: 'display' | 'error',
    format?: string,
};

interface DisplayRegistry {
    text: ComponentType<UiComponentProps<string>>;
    number: ComponentType<UiComponentProps<number>>;
    [key: string]: ComponentType<UiComponentProps<any>>;
}

export interface GridDataType {
    [coordinates: string]: CellData<any>;
}

export interface RegistryType {
    display: DisplayRegistry;
}

interface Props {
    rows: number; // TODO replace by rowStart, rowEnd
    columns: number; // TODO idem has rows
    data?: GridDataType;
    registry?: RegistryType;
}

export const PowerGrid: FunctionComponent<Props> = (props) => {
    const { data, registry = defaultRegistry, rows, columns } = props;

    const [grid, setGrid] = React.useState([[]]);
    const [gridState, setGridState] = React.useState(data);
    const [stateId, refreshState] = React.useState(0);
    const [isValid, setIsValid] = React.useState(false);

    const classes = {
        grid: {
            display: 'grid',
            border: '2px #ffd86e dashed',
        },
        row: {
            display: 'flex',
        },
        cell: {
            width: '48px',
            height: '48px',
            border: 'none',
        },
    };

    useEffect(() => {
        generateGrid(rows, columns);
    }, [rows, columns]);

    useEffect(() => {
        setGridState(data);
    }, [data]);

    useEffect(() => {
        validate();
    }, [stateId]);

    function generateGrid(rows: number, columns: number) {
        let grid: Array<any> = new Array(rows).fill(null).map(() => new Array(columns).fill(null));

        for (let i = 0; i < rows; ) {
            for (let j = 0; j < columns; j++) {
                grid[i][j] = { coordinates: { row: i, column: j } };
            }
            i++;
        }

        setGrid(grid);
    }

    function getCell(x: number, y: number): CellData<any> {
        if (gridState.hasOwnProperty(`${x}_${y}`)) {
            return {
                ...gridState[`${x}_${y}`],
                coordinates: { row: x, column: y },
                setValue,
                getValue,
            };
        }

        return undefined;
    }

    function setValue(coordinates: CellCoordinates, value: any, refresh?: boolean) {
        if (gridState.hasOwnProperty(`${coordinates.row}_${coordinates.column}`)) {
            setGridState((previous) => ({
                ...previous,
                [`${coordinates.row}_${coordinates.column}`]: {
                    ...previous[`${coordinates.row}_${coordinates.column}`],
                    value,
                },
            }));

            setIsValid(false);

            refreshState(stateId + 1);
        }
    }

    function safeSet(coordinates: CellCoordinates) {
        const targets = [
            { row: coordinates.row + 1, column: coordinates.column },
            { row: coordinates.row - 1, column: coordinates.column },
            { row: coordinates.row, column: coordinates.column + 1 },
            { row: coordinates.row, column: coordinates.column - 1 },
        ];

        targets.forEach((item) => {
            if (getValue(item)) {
                setValue(item, {
                    ...getValue(item),
                    sand: getValue(item).sand + 1,
                });
            }
        });

        setValue(coordinates, {
            ...getValue(coordinates),
            sand: getValue(coordinates).sand -4,
        });
    }

    function validate() {

        function checkGrid() {
            if (isValid) return;

            setIsValid(true);
            
            for (const coordinates in gridState) {
                if (gridState[coordinates].value.sand >= gridState[coordinates].value.fallout) {
                    safeSet(gridState[coordinates].coordinates);
                    setIsValid(false);
                    return;
                }
            }

            !isValid && refreshState(stateId + 1);
        }

        checkGrid();
    }

    function getValue(coordinates: CellCoordinates): any {
        return getCell(coordinates.row, coordinates.column)?.value;
    }

    function Cell(props: CellData<any>) {
        const { display } = props;
        const Component = registry.display?.[display];

        return <Component {...props} />;
    }

    return (
        <GridContext.Provider value={gridState}>
            <div style={classes.grid}>
                {grid &&
                    grid.map((rows, row) => (
                        <div style={classes.row} key={row}>
                            {rows.map((columns, column) => (
                                <div style={classes.cell} key={column}>
                                    <Cell {...getCell(row, column)} />
                                </div>
                            ))}
                        </div>
                    ))}
            </div>
        </GridContext.Provider>
    );
};
