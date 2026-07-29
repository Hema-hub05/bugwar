const jwt = require("jsonwebtoken");

module.exports = function requireAdmin(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "No token provided. Please log in." });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded;
        next();
    }
    catch (err) {
        return res.status(401).json({ success: false, message: "Invalid or expired session. Please log in again." });
    }

};