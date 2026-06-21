import { io } from 'socket.io-client';

// Инициализация соединения
export const socket = io('<http://localhost:5002');

// const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:5002';

// export const socket = io(URL);

