import React, { createContext, useContext, useEffect, useState } from 'react';
import { initSocket, disconnectSocket } from '../services/socket';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (user) {
      const token = localStorage.getItem('token');
      const s = initSocket(token);
      setSocket(s);

      s.on('connect', () => console.log('🔌 Socket connected'));
      s.on('disconnect', () => console.log('🔌 Socket disconnected'));

      s.on('notification', (data) => {
        toast(data.message, { icon: '🔔', duration: 4000 });
      });

      return () => { disconnectSocket(); setSocket(null); };
    }
  }, [user]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);
