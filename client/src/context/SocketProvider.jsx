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
    const serverURL = process.env.REACT_APP_SOCKET_URL || "https://server-2eyv.onrender.com";

    return io(serverURL, {
      transports: ["websocket", "polling"], 
    });
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {props.children}
    </SocketContext.Provider>
  );
};
