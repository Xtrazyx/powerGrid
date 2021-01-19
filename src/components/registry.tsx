import * as React from 'react';
import { RegistryType } from './powerGrid';
import { Number } from '../demo/cells/number';
import { Text } from '../demo/cells/text';

const Registry: RegistryType = {
    display: {
        text: Text,
        number: Number,
    },
};

export default Registry;
