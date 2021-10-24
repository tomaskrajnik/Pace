import React from 'react';
import Routes from './routes/Routes';
import { BrowserRouter } from 'react-router-dom';
import 'tailwindcss/tailwind.css';

const App: React.FC = () => {
    // authenticate here and set to redux

    return (
        <BrowserRouter>
            <Routes authenticated={false} />
        </BrowserRouter>
    );
};

export default App;
