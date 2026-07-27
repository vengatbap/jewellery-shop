"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateBarcodeCode = void 0;
const generateBarcodeCode = (prefix, lastNumber, padding) => {
    const next = lastNumber + 1;
    const number = String(next).padStart(padding, "0");
    return {
        code: `${prefix}${number}`,
        next
    };
};
exports.generateBarcodeCode = generateBarcodeCode;
