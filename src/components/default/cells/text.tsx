import * as React from 'react';
import { FunctionComponent } from 'react';
import { UiComponentProps } from '../../powerGrid';

export const Text: FunctionComponent<UiComponentProps<string>> = props => {
    const { value, format, mode = 'display' } = props;

    return <div>{value}</div>;
};
