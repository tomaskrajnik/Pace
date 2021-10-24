import React from 'react';
import Routes from './routes/Routes';
import { BrowserRouter } from 'react-router-dom';
import 'tailwindcss/tailwind.css';
import { useFirebase } from './hooks/firebase/useFirbase';

const App: React.FC = () => {
    // authenticate here and set to redux
    useFirebase();
    return (
        <BrowserRouter>
            <Routes authenticated={false} />
        </BrowserRouter>
    );
};

export default App;
