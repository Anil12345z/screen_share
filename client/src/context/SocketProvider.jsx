import React, { createContext, useMemo, useContext } from "react";
import { io } from "socket.io-client";

// Create a context for the socket
const SocketContext = createContext(null);

// Hook to access the socket
export const useSocket = () => {
  return useContext(SocketContext);
};

// SocketProvider component
export const SocketProvider = (props) => {
  const socket = useMemo(() => {
    const serverURL =
      process.env.REACT_APP_SOCKET_URL || "http://localhost:8008"; // Fallback to localhost if environment variable is not set

    return io(serverURL, {
      transports: ["websocket", "polling"], // Ensure compatibility across environments
    });
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {props.children}
    </SocketContext.Provider>
  );
};
