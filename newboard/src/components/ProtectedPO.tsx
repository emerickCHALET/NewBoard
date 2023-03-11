import {useEffect, useState} from 'react';
import {useNavigate} from "react-router";

const useProtectedPO = () => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkToken = async () => {
            const token = localStorage.getItem('token');
            const role = localStorage.getItem('permissions_role');

            if (token && role === "ROLE_ADMIN") {
                setLoading(false);
            } else {
                localStorage.clear();
                navigate('/login');
            }
        };

        checkToken();
    }, [navigate]);

    return {loading};
};

export default useProtectedPO;
