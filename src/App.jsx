import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CardGame from './CardDisplay';
import HomePage from './HomePage';
import HandsBehind from './HandsBehind';
import NavBar from './NavBar'

function App() {
    return (
        <Router>
            <div className="App">
                <NavBar/>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/game" element={<CardGame />} />
                    <Route path="/handbehind" element={<HandsBehind/>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
