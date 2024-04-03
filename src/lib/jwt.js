import jwt from "jsonwebtoken";


const DEFAULT_SIGN_OPTION = {
    expiresIn: "90d",
};

export function signJwtAccessToken(payload, options = DEFAULT_SIGN_OPTION) {
    const secret_key = process.env.JWT_SECRET;
    const token = jwt.sign(payload, secret_key, options);
    return token;
}

export function verifyJwt(token) {
    try {
        const secret_key = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, secret_key);
        return decoded;
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            return new Response(
                JSON.stringify({
                    error: "Token expired",
                }),
                {
                    status: 401,
                }
            );
        } else if (err instanceof jwt.JsonWebTokenError) {
            return new Response(
                JSON.stringify({
                    error: "Invalid token",
                }),
                {
                    status: 401,
                }
            );
        }
    }
}