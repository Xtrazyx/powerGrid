import * as React from 'react';
import { FunctionComponent } from 'react';
import { UiComponentProps } from '../../powerGrid';

export type SandPileValueType = number;

export const Sandpile: FunctionComponent<UiComponentProps<SandPileValueType>> = props => {
    const { value, coordinates, mode = 'display' } = props;

    return <div>
        <div>
            {coordinates?.row} - {coordinates?.column}
        </div>
        <div>
            {value}
        </div>
    </div>;
};
