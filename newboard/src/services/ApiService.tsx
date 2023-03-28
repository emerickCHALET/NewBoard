import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import {urlApi} from "../App";

interface ApiResponse<T> {
    data: T;
    message?: string;
    error?: string;
}

class ApiService<T> {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: urlApi,
        });
    }

    private handleResponse = (response: AxiosResponse<ApiResponse<T>>) => {
        console.log(response.status)
        const { data, error } = response.data;
        if (response.status === 200 && !error) {
            console.log(response.data.message)
            toast.success(response.data.message, {
                position: toast.POSITION.TOP_RIGHT,
            });
            return response;
        } else if (response.status === 201 && !error) {
            toast.success(response.data.message, {
                position: toast.POSITION.TOP_RIGHT,
            });
            return response;
        }
        else if (response.status === 401) {
            toast.error(response.data.message, {
                position: toast.POSITION.TOP_RIGHT
            });
            throw new Error('Unauthorized');
        }
        else if (response.status === 400) {
            toast.error(response.data.message, {
                position: toast.POSITION.TOP_RIGHT
            });
            throw new Error('Error');
        }else {
            toast.error(response.data.message, {
                position: toast.POSITION.TOP_RIGHT
            });
            throw new Error(error || 'Error');
        }
    };

    public async get(endpoint: string, token?: string): Promise<AxiosResponse<ApiResponse<T>>> {
        try {
            const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
            const response = await this.axiosInstance.get<ApiResponse<T>>(endpoint, { headers });
            return this.handleResponse(response);
        } catch (error) {
            console.error(error);
            toast.error('Error');
            throw error;
        }
    }

    public async post(endpoint: string, body?: any, token?: string): Promise<AxiosResponse<ApiResponse<T>>> {
        try {
            const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
            const response = await this.axiosInstance.post<ApiResponse<T>>(endpoint, body, { headers });
            return this.handleResponse(response);
        } catch (error) {
            toast.error('Une erreur est survenue', {
                position: toast.POSITION.TOP_RIGHT
            });
            throw error;
        }
    }
}

export default ApiService;
