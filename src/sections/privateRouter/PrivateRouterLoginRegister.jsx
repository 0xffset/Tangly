import { Navigate } from 'react-router-dom';


// eslint-disable-next-line react/prop-types
const PrivateRouterLoginRegister = ({ component, isAuthenticated }) => isAuthenticated ? <Navigate to="/"/> : component  

export default PrivateRouterLoginRegister