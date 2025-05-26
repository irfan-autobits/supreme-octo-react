// src/socket.js
import { io } from "socket.io-client";
const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) throw new Error('VITE_API_URL is not defined'); //|| "http://localhost:5757";
const socket = io(API_URL, { transports: ["websocket"] });
export default socket;
