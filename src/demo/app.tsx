import * as React from 'react';
import { SandpileGenerator } from '../components/generators/sandpileGenerator';
import { PowerGrid } from '../components/powerGrid';
import { styled } from '@mui/material/styles';
import { useState } from 'react';

const Container = styled('div')`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Main = styled('div')`
    height: 100vh;
    width: 100vw;
    background-color: hsl(34, 100%, 70%);
`;

export default function App() {
    // Taille de la zone de jeu
    const ROWS = 11;
    const COLUMNS = 11;
    // Nombre de sables par tour
    const SAND_PER_TURN = 3;
    // Couleur des joueurs
    const Players = {
        blue: 'Player 1',
        red: 'Players 2'
    }

    const sandpiles = SandpileGenerator(ROWS, COLUMNS, 0, 5);

    const [turn, setTurn] = useState('blue');
    const [sandStock, setSandStock] = useState(SAND_PER_TURN);

    return (
        <Main>
            <Container>
                <PowerGrid rows={ROWS} columns={COLUMNS} data={sandpiles} />
            </Container>
        </Main>
    );
}
