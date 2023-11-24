import React from 'react';
import { Navigate } from 'react-router-dom';

import { useLocalStorage } from 'src/utils/local-storage';

// eslint-disable-next-line react/prop-types
const PrivateRouter = ({ children }) => {
    const jwt = useLocalStorage();
    return !jwt.includes("null")  ? children : <Navigate to="/login" />
}


export default  PrivateRouter ;