import * as React from 'react';
import { FunctionComponent, ComponentType } from 'react';
import { useEffect } from 'react';
import defaultRegistry from './default/registry';
import { GridContext } from '../context/gridContext';
import { isConstructorDeclaration } from 'typescript';

interface CellData<T> {
    display: string; // used to call component from display registry
    value: T;
    mode: 'display' | 'error';
    coordinates?: CellCoordinates;
    setValue?: (coordinates: CellCoordinates, value: T) => void;
    getValue?: (coordinates: CellCoordinates) => T;
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
    grid: { [coordinates: string]: CellData<any> };
    rowNames?: Array<String>;
    columnNames?: Array<String>;
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
    const [dataState, setDataState] = React.useState(data);

    const classes = {
        grid: {
            display: 'grid',
        },
        row: {
            display: 'flex',
        },
        cell: {
            width: '120px',
            height: '120px',
            border: 'solid 1px grey',
        },
    };

    useEffect(() => {
        generateGrid(rows, columns);
    }, [rows, columns]);

    useEffect(() => {
        setDataState(data);
    }, [data]);

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
        if (dataState.grid.hasOwnProperty(`${x}_${y}`)) {
            return { ...dataState.grid[`${x}_${y}`], coordinates: { row: x, column: y }, setValue, getValue };
        }

        return {
            display: 'text',
            mode: 'display',
            value: `empty ${x}_${y}`,
            coordinates: { row: x, column: y },
        };
    }

    function setValue(coordinates: CellCoordinates, value: any) {
        console.log('state to: ', { [`${coordinates.row}_${coordinates.column}`]: value });
        setDataState((previous) => {
            const retour = {
                ...previous,
                grid: {
                    ...previous.grid,
                    [`${coordinates.row}_${coordinates.column}`]: {
                        ...previous.grid[`${coordinates.row}_${coordinates.column}`],
                        value,
                    },
                },
            };
            console.log('retour', retour);
            return retour;
        });
    }

    function getValue(coordinates: CellCoordinates): any {
        getCell(coordinates.row, coordinates.column).value;
    }

    function Cell(props: CellData<any>) {
        const { display } = props;
        const Component = registry.display?.[display];

        return <Component {...props} />;
    }

    return (
        <GridContext.Provider value={dataState}>
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
