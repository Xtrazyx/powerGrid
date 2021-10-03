import { RegistryType } from '../powerGrid';
import { Number } from './cells/number';
import { Sandpile } from './cells/sandpile';
import { Text } from './cells/text';

const Registry: RegistryType = {
    display: {
        text: Text,
        number: Number,
        sandpile: Sandpile
    },
};

export default Registry;
