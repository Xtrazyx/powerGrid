import * as React from 'react';
import { FunctionComponent, ComponentType } from 'react';
import { useEffect } from 'react';
import defaultRegistry from './default/registry';
import { GridContext } from '../context/gridContext';
import { ExternalContext } from '../context/externalContext';
import { omit } from 'lodash';
import './default/global.css';

interface CellData<T> {
    display: string; // used to call component from display registry
    value: T;
    mode: 'display' | 'error';
    coordinates?: CellCoordinates;
    setValue: (coordinates: CellCoordinates, value: T, event?: boolean) => void;
    getValue: (coordinates: CellCoordinates) => T;
    externalHandler?: () => void;
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
    rows: number; // TODO replace by rowStart, rowEnd to feature cell span
    columns: number; // TODO idem has rows
    data?: GridDataType;
    registry?: RegistryType;
    calculationRate?: number;
    className?: string;
    infos?: boolean;
    externalState?: Object;
    validationCallback?: ValidationCallbackType;
    setValueCallback?: SetValueCallbackType;
    externalHandler?: () => void;
}

interface StatesType {
    grid: any[][];
    setGrid: React.Dispatch<React.SetStateAction<any[][]>>;
    gridState: GridDataType;
    setGridState: React.Dispatch<React.SetStateAction<GridDataType>>;
    stateId: number;
    refreshState: React.Dispatch<React.SetStateAction<number>>;
    isValid: boolean;
    setIsValid: React.Dispatch<React.SetStateAction<boolean>>;
}

export type ValidationCallbackType = (props: Omit<Props, 'validationCallback'>, states: StatesType) => void;

export type SetValueCallbackType = (callBackValue: any) => void;

export const PowerGrid: FunctionComponent<Props> = (props) => {
    const {
        data,
        registry = defaultRegistry,
        rows,
        columns,
        validationCallback,
        setValueCallback,
        calculationRate = 1,
        className = 'default',
        infos,
        externalState,
        externalHandler
    } = props;

    const [grid, setGrid] = React.useState([[]]);
    const [gridState, setGridState] = React.useState(data);
    const [stateId, refreshState] = React.useState(0);
    const [isValid, setIsValid] = React.useState(true);

    useEffect(() => {
        generateGrid(rows, columns);
    }, [rows, columns]);

    useEffect(() => {
        setGridState(data);
        if (data) {
            setIsValid(false);
            refreshState(stateId + 1);
        }
    }, []);

    useEffect(() => {
        validate();
    }, [stateId]);

    function generateGrid(rows: number, columns: number) {
        let grid: Array<any> = new Array(rows).fill(null).map(() => new Array(columns).fill(null));

        for (let i = 0; i < rows;) {
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
                externalHandler
            };
        }

        return {
            display: 'text',
            mode: 'display',
            value: 'empty',
            coordinates: { row: x, column: y },
            setValue,
            getValue,
            externalHandler
        };;
    }

    function getValue(coordinates: CellCoordinates): any {
        return getCell(coordinates.row, coordinates.column)?.value;
    }

    function Cell(props: CellData<any>) {
        const { display } = props;
        const Component = registry.display?.[display];

        return <Component {...props} />;
    }

    function setValue(coordinates: CellCoordinates, value: any) {
        if (gridState.hasOwnProperty(`${coordinates.row}_${coordinates.column}`)) {
            setGridState((previous) => ({
                ...previous,
                [`${coordinates.row}_${coordinates.column}`]: {
                    ...previous[`${coordinates.row}_${coordinates.column}`],
                    value,
                },
            }));

            if (setValueCallback) {
                setValueCallback(value);
            }

            setIsValid(false);
            refreshState(stateId + 1);
        }
    }

    function validate() {
        if (isValid) return;

        setIsValid(true);

        for (let i = 0; i < calculationRate; i++) {
            validationCallback(omit(props, 'validationCallback'), {
                grid,
                setGrid,
                gridState,
                setGridState,
                stateId,
                refreshState,
                isValid,
                setIsValid,
            });
        }

        !isValid && refreshState(stateId + 1);
    }

    return (
        <GridContext.Provider value={gridState}>
            <ExternalContext.Provider value={externalState}>
                <div className={className}>
                    {grid &&
                        grid.map((rows, row) => (
                            <div className={'grid-row'} key={row}>
                                {rows.map((columns, column) => (
                                    <div className={'grid-cell'} key={column}>
                                        <Cell {...getCell(row, column)} />
                                    </div>
                                ))}
                            </div>
                        ))}
                </div>
                {infos && <div className={'infos'}>
                    <span className={!isValid ? 'pending' : undefined}>{!isValid ? 'calculating' : 'done'}</span>
                    <br />
                    [iterations] {stateId * calculationRate}
                </div>}
            </ExternalContext.Provider>
        </GridContext.Provider>
    );
};
