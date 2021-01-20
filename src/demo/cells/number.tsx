import * as React from 'react';
import { FunctionComponent } from 'react';
import { UiComponentProps } from '../../components/powerGrid';

export const Number: FunctionComponent<UiComponentProps<number>> = props => {
    const { value, mode = 'display', format } = props;

    return <div style={{color: 'blue', fontWeight: 'bold'}}>{value}</div>;
};
