"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const publicWebsocket_1 = __importDefault(require("./sockets/publicWebsocket"));
const roomWebsockets_1 = __importDefault(require("./sockets/roomWebsockets"));
const publicRoutes_1 = __importDefault(require("./routes/publicRoutes"));
const roomRoutes_1 = __importDefault(require("./routes/roomRoutes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, { cors: { origin: '*' } });
const port = process.env.PORT || 4000;
// =========== REST API LISTENER =========== //
app.get('/', (req, res) => {
    res.send('<h1>Websocket by Najim</h1>');
});
app.use("/", publicRoutes_1.default);
app.use("/room", roomRoutes_1.default);
// =========== END OF API LISTENER =========== //
// =========== WEBSOCKETS LISTENER =========== //
io.on("connection", publicWebsocket_1.default);
io.of("/room").on("connection", roomWebsockets_1.default);
// =========== END OF WEBSOCKETS LISTENER =========== //
server.listen(port, () => {
    console.log('listening on *:4000');
});
exports.default = app;
