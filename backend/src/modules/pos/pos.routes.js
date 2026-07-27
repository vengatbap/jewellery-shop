"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pos_controller_1 = require("./pos.controller");
const router = (0, express_1.Router)();
router.post("/invoice", pos_controller_1.POSController.createInvoice);
exports.default = router;
