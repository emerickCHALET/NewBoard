import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import InscriptionPage, { postRegister } from "../pages/Inscription";
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import '@testing-library/jest-dom';
import * as Yup from 'yup';
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('InscriptionPage', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('simulation test api', () => {
        render(
            <BrowserRouter>
                <InscriptionPage />
            </BrowserRouter>
        );

        const nomElement = screen.getByLabelText(/^Nom$/i);
        expect(nomElement).toBeInTheDocument();

        const prenomElement = screen.getByLabelText(/^Prénom:$/i);
        expect(prenomElement).toBeInTheDocument();

        const emailElement = screen.getByLabelText(/Email/i);
        expect(emailElement).toBeInTheDocument();

        const passwordElement = screen.getByLabelText(/Password/i);
        expect(passwordElement).toBeInTheDocument();

        const submitButton = screen.getByText(/Inscription/i);
        expect(submitButton).toBeInTheDocument();
    });

    it('test formulaire ', async () => {
        mockedAxios.post.mockResolvedValue({ status: 200 });

        render(
            <BrowserRouter>
                <InscriptionPage />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText('Nom'), { target: { value: 'vaudeleau' } });
        fireEvent.change(screen.getByLabelText('Prénom:'), { target: { value: 'quentin' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'qvaudeleau@gmail.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });

        fireEvent.click(screen.getByText('Inscription'));

        await waitFor(() => {
            //post est bien appelée
            expect(mockedAxios.post).toHaveBeenCalledTimes(1);
        });
    });

    const validationSchema = Yup.object().shape({
        firstname: Yup.string()
            .min(2, "Trop petit")
            .max(25, "Trop long!")
            .required("Ce champ est obligatoire"),

    });


    it('test formulaire with missing field', async () => {
        mockedAxios.post.mockResolvedValue({ status: 200 });

        render(
            <BrowserRouter>
                <InscriptionPage />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText('Nom'), { target: { value: 'vaudeleau' } });
        // fireEvent.change(screen.getByLabelText('Prénom:'), { target: { value: 'quentin' } }); // Ligne supprimée pour omettre le champ "Prénom"
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'qvaudeleau@gmail.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });

        fireEvent.click(screen.getByText('Inscription'));

        await waitFor(() => {
            // La fonction post ne devrait pas être appelée, car un champ est manquant
            expect(mockedAxios.post).toHaveBeenCalledTimes(0);
        });
    });


});
