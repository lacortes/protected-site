import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import Spinner from '../atoms/Spinner';

const LoadingScreen = ({ show }) => {
    return (
        <div className='loading-screen'>
            <div className='overlay'></div>
            <Spinner show={ show }/>
        </div>
    );
};

const RequireAuth = ({ children }) => {
    const auth = useAuth();
    const location = useLocation();
    const [ isLoggedIn, setLoggedIn ] = useState(false);
    const [ isLoading, setIsLoading ] = useState(true);
    
    useEffect(() => {
        if (auth.isLoggedIn() === false) {
            auth.refreshToken()
                .then(() => setLoggedIn(true))
                .catch(() => setLoggedIn(false))
                .finally(() => setIsLoading(false))
            ;
            return;
        }
        
        auth.isAuthorized()
            .then(() => { 
                setLoggedIn(true);
            })
            .catch(() => {
                setLoggedIn(false);
            })
            .finally(() => setIsLoading(false))
        ;
    }, [ auth ]);

    return (
        ( 
            isLoading === true ? <LoadingScreen show={isLoading} /> 
                : isLoggedIn === true ? children 
                    : <Navigate to="/login" state={{ from: location }} />
        )
    );
};

export default RequireAuth;