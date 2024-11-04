import PropTypes from "prop-types";
import { useContext } from "react";
import { AppContext } from "../store/app.context";
import { useLocation, Navigate } from "react-router-dom";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebase-config';

export default function Authenticated({ children }) {
    const { user } = useContext(AppContext);
    const location = useLocation();
    const [firebaseUser, loading] = useAuthState(auth);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!firebaseUser) {
        return <Navigate replace to="/login" state={{ from: location }} />;
    }

    return <>{children}</>;
}

Authenticated.propTypes = {
    children: PropTypes.any
};
