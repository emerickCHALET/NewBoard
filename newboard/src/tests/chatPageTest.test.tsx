import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import {BrowserRouter, MemoryRouter, Route, Routes} from 'react-router-dom';
import { io, Socket } from "socket.io-client";
import '@testing-library/jest-dom';
import Chat from "../pages/Chat";
import mocked = jest.mocked;


jest.mock("socket.io-client");

const mockedIO = mocked(io);

const setup = () => {
    const mockedSocket: Partial<Socket> = {
        emit: jest.fn(),
        on: jest.fn(),
    };
    mockedIO.mockReturnValue(mockedSocket as Socket);
    render(
        <MemoryRouter initialEntries={["/chat/1"]}>
            <Routes>
                <Route path="/chat/:roomId" element={<Chat />} />
            </Routes>
        </MemoryRouter>
    );

    return { mockedSocket };
};

describe("ChatPage", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should render chat page", () => {
        setup();
        expect(screen.getByText("Live Chat")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Type your message...")).toBeInTheDocument();
        expect(screen.getByLabelText("Send")).toBeInTheDocument();
    });

    it("should join the room on mount", () => {
        const { mockedSocket } = setup();
        expect(mockedSocket.emit).toHaveBeenCalledWith("join_room", "1");
    });



    it("should display received messages", async () => {
        const { mockedSocket     } = setup();
        const message = {
            id: "1",
            sentBy: "123",
            fullNameSender: "John Doe",
            message: "Test message",
            created: "2023-03-28",
            roomId: "1",
        };

        // Simulate receiving a new message
        (mockedSocket.on as jest.Mock).mock.calls[0][1](message);

        await waitFor(() => screen.getByText("Test message"));
        expect(screen.getByText("Test message")).toBeInTheDocument();
        expect(screen.getByText("John Doe")).toBeInTheDocument();
        expect(screen.getByText("2023-03-28")).toBeInTheDocument();
    });
});
