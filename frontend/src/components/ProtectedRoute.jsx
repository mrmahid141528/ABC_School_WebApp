import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '../context/authStore';

const ProtectedRoute = ({ allowedRoles }) => {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Role not authorized. Redirect to an unauthorized page or their respective default dashboard
        if (user.role === 'Parent') return <Navigate to="/parent/dashboard" replace />;
        if (user.role === 'Teacher') return <Navigate to="/teacher/classes" replace />;
        return <Navigate to="/unauthorized" replace />;
    }

    // Authorized: Render the children child routes
    return <Outlet />;
};

export default ProtectedRoute;
