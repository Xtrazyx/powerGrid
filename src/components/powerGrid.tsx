import * as React from 'react';
import { ComponentType, FunctionComponent } from "react";

interface CellData {
    display: string, // used to call component from display registry
    value: any,
    coordinates: { row: number, column: number}
}

type DisplayComponent<T> = ComponentType <{
    value: T,
    mode: 'display' | 'error',
    format: string
}>

interface DisplayRegistry {
    text: DisplayComponent<string>
    number: DisplayComponent<number>
}

interface Data {
    grid: [CellData]
    rowNames: Array<String>
}

interface Registry {
    display: DisplayRegistry
}

interface Props {
    data?: Data;
    registry?: Registry;
}

export const PowerGrid: FunctionComponent<Props> = (props)  => {
    const { data, registry } = props;

    // TODO encode coordinates in format [row]:[column] as string for map key

    return (
      <div>
          Toto
      </div>
    )
};
