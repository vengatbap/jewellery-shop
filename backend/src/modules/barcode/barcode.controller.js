"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const generate = async (req, res) => {
    const barcode = 'JR000001';
    res.json({ success: true, barcode });
};
exports.generate = generate;
