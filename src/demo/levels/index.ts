import { SandpileGenerator } from '../../components/generators/sandpileGenerator';
import { square } from './square';
import { pile } from './pile';
import { MapType } from '../../components/generators/sandpileGenerator';
import { GridDataType } from '../../components/powerGrid';

export type LevelName = 'square' | 'pile';

export type LevelType = Record<LevelName, MapType>;

export type ConfigType = [rows: number, columns: number, data: GridDataType];

export function generateLevel(name: LevelName): ConfigType {
    const level: LevelType = { square: square as MapType, pile: pile as MapType };

    return [level[name][0], level[name][1], SandpileGenerator(
        ...level[name]
    )];
}
