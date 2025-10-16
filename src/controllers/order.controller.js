const Orders = require("../models/order.model");
const Crop = require("../models/crop.model");

exports.create = async (req, res, next) => {
    try {
        const { crop_id, buyer_id, quantity, status } = req.body;
        if (!crop_id || !buyer_id || !quantity) {
            return res.status(400).json({ message: "crop_id, buyer_id, quantity are required" });
        }

        const crop = await Crop.getById(crop_id);
        if (!crop) return res.status(404).json({ message: "Crop not found" });

        const availableQty = parseFloat(crop.quantity);
        const orderQty = parseFloat(quantity);
        if (isNaN(orderQty) || orderQty <= 0) {
            return res.status(400).json({ message: "quantity must be a positive number" });
        }
        if (orderQty > availableQty) {
            return res.status(400).json({ message: "Insufficient quantity available" });
        }

        // Create order
        const order = await Orders.create({ crop_id, buyer_id, quantity: orderQty, status: status || "Pending" });

        // Decrement stock and update status accordingly
        const newQty = availableQty - orderQty;
        await Crop.updateQuantityAndStatus(crop_id, newQty);

        return res.status(201).json({ message: "Order created", order, remaining_quantity: newQty });
    } catch (err) { next(err); }
};
exports.get = async (req, res, next) => { try { const o = await Orders.getById(req.params.id); if (!o) return res.status(404).json({ message: "Order not found" }); return res.json(o); } catch (err) { next(err); } };
exports.updateStatus = async (req, res, next) => { try { const ok = await Orders.updateStatus(req.params.id, req.body.status); if (!ok) return res.status(404).json({ message: "Order not found" }); return res.json({ message: "Order status updated" }); } catch (err) { next(err); } }; 

exports.listByBuyer = async (req, res, next) => {
    try {
        const { buyer_id } = req.params;
        const rows = await Orders.listByBuyer(buyer_id);
        return res.json(rows);
    } catch (err) { next(err); }
};