"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const pos_routes_1 = __importDefault(require("./modules/pos/pos.routes"));
const request_id_middleware_1 = require("./middleware/request-id.middleware");
const error_middleware_1 = require("./middleware/error.middleware");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use(request_id_middleware_1.requestIdMiddleware);
app.get("/health", (req, res) => {
    res.json({
        status: "OK",
        service: "Jewellery ERP API"
    });
});
app.use("/api/pos", pos_routes_1.default);
app.use(error_middleware_1.errorMiddleware);
exports.default = app;
