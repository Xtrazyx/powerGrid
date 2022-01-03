import { SandpileGenerator } from '../../components/generators/sandpileGenerator';
import { square } from './square';
import { pile } from './pile';
import { MapType } from '../../components/generators/sandpileGenerator';
import { GridDataType } from '../../components/powerGrid';

export type LevelName = 'square' | 'pile';
export type Castle = {};
export type LevelType = Record<LevelName, MapType>;

export type ConfigType = [rows: number, columns: number, data: GridDataType, red: Castle, blue: Castle];

export function generateLevel(name: LevelName): ConfigType {
    const level: LevelType = { square: square as MapType, pile: pile as MapType };

    let red = {};
    let blue = {};

    level[name][4].forEach((entry, index) => {
        red[index]= `${entry[0]}_${entry[1]}`;
    })

    level[name][5].forEach((entry, index) => {
        blue[index]= `${entry[0]}_${entry[1]}`;
    })

    return [
        level[name][0], 
        level[name][1], 
        SandpileGenerator(...level[name]),
        red,
        blue
    ];
}
