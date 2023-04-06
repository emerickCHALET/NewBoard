import React from 'react';
import { render, screen, fireEvent, act ,waitFor  } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ChatPage from '../src/pages/Chat';
import Messages from '../src/classes/Messages';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';

jest.mock('axios');
jest.mock('socket.io-client', () => {
    const original = jest.requireActual('socket.io-client');

    return {
        ...original,
        default: jest.fn().mockImplementation((...args) => {
            const mockedSocket = original.default(...args) as jest.Mocked<Socket>;
            mockedSocket.on = jest.fn();
            mockedSocket.emit = jest.fn();
            return mockedSocket;
        }),
    };
});

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedIO = io as jest.MockedFunction<typeof io>;
const mockedSocket = mockedIO() as jest.Mocked<Socket>;



// ... Rest of your test code

describe('ChatPage', () => {
    beforeEach(() => {
        mockedAxios.get.mockReset();
        mockedSocket.emit = jest.fn(); // Reset the emit mock manually
        mockedSocket.on = jest.fn(); // Reset the on mock manually
    });

    test('affiche le titre Live Chat', async () => {
        mockedAxios.get.mockResolvedValue({ status: 200, data: { data: [] } });

        // eslint-disable-next-line testing-library/no-unnecessary-act
        await act(async () => {
            render(
                <BrowserRouter>
                    <ChatPage />
                </BrowserRouter>
            );
        });

        const titre = screen.getByText('Live Chat');
        expect(titre).toBeInTheDocument();
    });

    test("envoie un message lorsque l'utilisateur tape un message et appuie sur le bouton d'envoi", async () => {
        mockedAxios.get.mockResolvedValue({ status: 200, data: { data: [] } });

        // eslint-disable-next-line testing-library/no-unnecessary-act
        await act(async () => {
            render(
                <BrowserRouter>
                    <ChatPage />
                </BrowserRouter>
            );
        });

        const messageInput = screen.getByPlaceholderText('Type your message...');
        const message = 'Hello!';
        fireEvent.change(messageInput, { target: { value: message } });


        const sendButton = screen.getByRole('button', { name: 'Send' });
        fireEvent.submit(sendButton);

    });



});
