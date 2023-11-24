import React from 'react';
import { Navigate } from 'react-router-dom';

import { useLocalStorage } from 'src/utils/local-storage';

// eslint-disable-next-line react/prop-types
const PrivateRouterLoginRegister = ({children}) => {
    const jwt = useLocalStorage();
    return !jwt.includes("null") ? <Navigate to="/" /> : children;
}

export default PrivateRouterLoginRegister