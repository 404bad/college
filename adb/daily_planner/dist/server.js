"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_config_1 = __importDefault(require("./config/env.config"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const PORT = env_config_1.default.PORT || 3000;
console.log("Starting server...");
app.get("/", (req, res) => {
    res.send("Hello, World!");
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
