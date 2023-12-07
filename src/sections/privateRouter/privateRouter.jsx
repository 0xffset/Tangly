import { Navigate } from 'react-router-dom';


// eslint-disable-next-line react/prop-types
const PrivateRouter = ({ component, isAuthenticated }) => isAuthenticated ? component : <Navigate to="/login"/>


export default PrivateRouter;