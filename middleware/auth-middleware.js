const jwt = require("jsonwebtoken");

module.exports = (req,res,next) => {
    try {
        const token = req.headers?.authorization?.split(" ")[1];
        const parsedToken = jwt.verify(token,'secret_key');
        req.userId = parsedToken.userId;
        next();
    }catch (e) {
        res.status(401).json({
            message: 'Authorization not found!!!',
            error: e.message
        })
    }
}
