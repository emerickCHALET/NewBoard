import axios from 'axios';
import { toast } from 'react-toastify';
import {urlApi} from "../App";
import {NavigateFunction} from "react-router";


class ApiService {
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

    public async post(endpoint: string, body?: any, token?: string, navigate?: NavigateFunction){
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
                if (navigate) {
                    navigate('/login')
                }
            }
        }
    }
}

export default ApiService;
