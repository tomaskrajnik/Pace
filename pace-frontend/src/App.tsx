import React from 'react';
import Routes from './routes/Routes';
import { BrowserRouter } from 'react-router-dom';
import 'tailwindcss/tailwind.css';
import { useFirebase } from './hooks/firebase/useFirbase';

const App: React.FC = () => {
    useFirebase();

    return (
        <BrowserRouter>
            <Routes />
        </BrowserRouter>
    );
};

export default App;
