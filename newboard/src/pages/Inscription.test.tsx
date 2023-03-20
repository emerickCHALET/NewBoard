import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import InscriptionPage, { postRegister } from './InscriptionPage';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('InscriptionPage', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly', () => {
        const { getByLabelText, getByText } = render(<InscriptionPage />);
        expect(getByLabelText('Nom')).toBeInTheDocument();
        expect(getByLabelText('Prénom:')).toBeInTheDocument();
        expect(getByLabelText('Email')).toBeInTheDocument();
        expect(getByLabelText('Password')).toBeInTheDocument();
        expect(getByText('Inscription')).toBeInTheDocument();
    });

    it('should submit form with valid data', async () => {
        mockedAxios.post.mockResolvedValue({ status: 200 });

        const { getByLabelText, getByText } = render(<InscriptionPage />);
        fireEvent.change(getByLabelText('Nom'), { target: { value: 'Doe' } });
        fireEvent.change(getByLabelText('Prénom:'), { target: { value: 'John' } });
        fireEvent.change(getByLabelText('Email'), { target: { value: 'john.doe@example.com' } });
        fireEvent.change(getByLabelText('Password'), { target: { value: 'password123' } });

        fireEvent.click(getByText('Inscription'));

        await waitFor(() => {
            expect(mockedAxios.post).toHaveBeenCalledTimes(1);
        });
    });
});
