import React from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
    return (
        <nav>
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/game">Game</Link>
                </li>
                <li>
                    <Link to="/handpicker"> </Link>
                </li>
            </ul>
        </nav>
    );
}

export default NavBar;