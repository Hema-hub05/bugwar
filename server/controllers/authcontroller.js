const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {

    try {

        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Username and password are required."
            });
        }

        const validUsername = process.env.ADMIN_USERNAME;
        const validPasswordHash = process.env.ADMIN_PASSWORD_HASH;

        if (username !== validUsername) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password."
            });
        }

        const isMatch = await bcrypt.compare(password, validPasswordHash);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password."
            });
        }

        const token = jwt.sign(
            { username, role: "admin" },
            process.env.JWT_SECRET,
            { expiresIn: "8h" }
        );

        res.json({ success: true, token });

    }

    catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ success: false, message: "Server error during login." });
    }

};