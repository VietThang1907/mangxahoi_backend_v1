const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if(!authHeader) {
        return res.status(401).json({msg: 'Không có token, truy cập bị từ chối.'});
    }

    const token = authHeader.split(' ')[1];

    if(!token) {
        return res.status(401).json({msg: 'Định dạng token không hợp lệ, truy cập bị từ chối.'});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({msg: 'Token không hợp lệ.'});
    }
}

module.exports = auth;
