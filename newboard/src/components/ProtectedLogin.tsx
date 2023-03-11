import React, { useEffect, useState } from 'react';
import {useNavigate} from "react-router";

const useProtectedLogin = () => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkToken = async () => {
            const token = localStorage.getItem('token');

            if (token) {
                navigate('/workspaces');
            }
            setLoading(false);
        };

        checkToken();
    }, [navigate]);

    return { loading };
};

export default useProtectedLogin;
