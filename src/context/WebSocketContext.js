import React, {
    createContext,
    useContext,
    useEffect
} from 'react';
import io from 'socket.io-client';

const WebSocketContext = createContext();

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({
    children
}) => {
    const socket = io("https://along-app-1.onrender.com"); // Your backend URL

    useEffect(() => {
        return () => {
            socket.disconnect();
        };
    }, [socket]);

    return ( 
        <WebSocketContext.Provider value = {
            {
                socket
            }
        } > {
            children
        } </WebSocketContext.Provider>
    );
};