type SandPileColorType = {
    0: string;
    1: string;
    2: string;
    3: string;
}

export type OwnerColorType = {
    blue: {
        sand: SandPileColorType;
        select: string;
    },
    red: {
        sand: SandPileColorType;
        select: string;
    },
    neutral: {
        sand: SandPileColorType;
        hole: string;
    },
    none: {
        sand: string;
    }
}

export const ownerColor: OwnerColorType = {
    blue: {
        sand: {
            3: '#3d85c6',
            2: '#6fa8dc',
            1: '#9fc5e8',
            0: '#cfe2f3',
        },
        select: '#0b5394'
    },
    red: {
        sand: {
            3: '#cc0000',
            2: '#e06666',
            1: '#ea9999',
            0: '#f4cccc',
        },
        select: '#990000'
    },
    neutral: {
        sand: {
            3: '#fd7200',
            2: '#ffab5c',
            1: '#fbd0b3',
            0: '#fdeac2',
        },
        hole: '#ffbd66'
    },
    none: { 
        sand: 'transparent'
     }
}
