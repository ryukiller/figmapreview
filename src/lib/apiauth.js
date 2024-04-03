import { verifyJwt } from "./jwt.js";

export async function verifyAccessToken(request) {
    const accessToken = request.headers.get("authorization").split(" ")[1];
    if (!accessToken || !verifyJwt(accessToken)) {
        return new Response(
            JSON.stringify({
                error: "unauthorized",
            }),
            {
                status: 401,
            }
        );
    }
    return null;
}
