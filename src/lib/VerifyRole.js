import jwt from 'jsonwebtoken';

export const verifyRole = (req, requiredRoles) => {
    const token = req.headers.get("authorization").split(" ")[1];
    if (!token) return false;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return requiredRoles.includes(decoded.role);
    } catch (error) {
        return false;
    }
};


export const getUserInfo = async (req) => {
    const token = req.headers.get("authorization").split(" ")[1];
    if (!token) return false;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (error) {
        return false;
    }
};

