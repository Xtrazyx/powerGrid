import * as React from 'react';
import { FunctionComponent, ComponentType } from 'react';
import defaultRegistry from './registry';

interface CellData<T> {
    display: string; // used to call component from display registry
    value: T;
    coordinates?: { row: number, column: number };
}

export type UiComponentProps<T> = {
    value: T,
    mode: 'display' | 'error',
    format?: string,
};

interface DisplayRegistry {
    text: ComponentType<UiComponentProps<string>>;
    number: ComponentType<UiComponentProps<number>>;
    [key: string]: ComponentType<any>;
}

interface Data {
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
    data?: Data;
    registry?: RegistryType;
}

export const PowerGrid: FunctionComponent<Props> = props => {
    const { data, registry = defaultRegistry, rows, columns } = props;

    const [grid, setGrid] = React.useState([[]]);

    const classes = {
        grid: {
            display: 'grid',
        },
        row: {
            display: 'flex',
        },
        cell: {
            width: '120px',
            border: 'solid 1px grey',
        },
    };

    React.useEffect(() => {
        generateGrid(rows, columns);
    }, [rows, columns]);

    function generateGrid(rows: number, columns: number) {
        let grid: Array<any> = new Array(rows).fill(null).map(() => new Array(columns).fill(null));

        for (let i = 0; i < rows; ) {
            for (let j = 0; j < columns; j++) {
                grid[i][j] = getCell(i, j);
            }
            i++;
        }

        setGrid(grid);
    }

    function getCell(x: number, y: number): CellData<any> {
        if (data.grid.hasOwnProperty(`${x}_${y}`)) {
            return { ...data.grid[`${x}_${y}`], coordinates: { row: x, column: y } };
        }

        return {
            display: 'text',
            value: `${x}_${y}`,
            coordinates: { row: x, column: y },
        };
    }

    function Cell({ display, value, mode }) {
        const Component = registry.display?.[display];

        return <Component value={value} mode={mode} />;
    }

    return (
        <div style={classes.grid}>
            {grid &&
                grid.map((rows, index) => (
                    <div style={classes.row} key={index}>
                        {rows.map((cell, index) => (
                            <div style={classes.cell} key={index}>
                                <Cell {...cell}/>
                            </div>
                        ))}
                    </div>
                ))}
        </div>
    );
};
