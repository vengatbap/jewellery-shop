"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customers_controller_1 = require("./customers.controller");
const router = (0, express_1.Router)();
router.post("/", customers_controller_1.CustomerController.createCustomer);
exports.default = router;
