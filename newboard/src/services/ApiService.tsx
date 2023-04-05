import axios from 'axios';
import { toast } from 'react-toastify';
import {urlApi} from "../App";
import {useNavigate} from "react-router";

export function useNavigateHook() {
    const navigate = useNavigate();

    function navigateTo(path: string) {
        navigate(path);
    }

    return { navigate: navigateTo };
}
class ApiService {
    private navigate = useNavigateHook().navigate;
    public async get(endpoint: string, token?: string) {
        const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
        try {
            const response = await axios.get(urlApi + endpoint, { headers: headers });
            return response;
        } catch (error:any) {
            if (error.response) {
                toast.error(error.response.data.message, {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        }
    }

    public async post(endpoint: string, body?: any, token?: string){
        const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
        try {
            const response = await axios.post(urlApi + endpoint, body, { headers: headers });
            return response;
        } catch (error:any) {
            if (error.response) {
                toast.error(error.response.data.message, {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
            if(error.response.data.disconnect === true){
                localStorage.clear()
                this.navigate('/login')
            }
        }
    }
}

export default ApiService;
