const url = process.env.SITE
export const authConfig = {
    pages: {
        signIn: '/login',
    },
    secret: process.env.JWT_SECRET,
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/');
            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            } else if (isLoggedIn) {
                return Response.redirect(new URL('/', nextUrl));
            }
            return true;
        },
        async jwt({ token, user }) {
            return { ...token, ...user };
        },

        async session({ session, token }) {
            try {
                const response = await fetch(`${url}/api/login/${token._id}`, {
                    headers: {
                        Authorization: `Bearer ${token.accessToken}`, // Ensure you're using token.accessToken correctly
                    },
                });

                if (!response.ok) {
                    throw new Error(`API call failed with status: ${response.status}`);
                }

                const userData = await response.json();

                // If userData is an object and has an _id property, it's likely valid
                if (typeof userData === 'object' && userData._id) {
                    // If userData.options is a string, parse it. Otherwise, assume it's already in object form
                    if (typeof userData.options === 'string') {
                        userData.options = JSON.parse(userData.options);
                    }

                    // Since userData is directly the user object, no need to access userData[0]
                    userData.accessToken = token.accessToken;
                    session.user = { ...session.user, ...userData };

                    return session;
                } else {
                    throw new Error("User data is empty or not in expected format");
                }


                // Safely access and parse options if they exist
                // if (userData[0]?.options) {
                //     userData[0].options = JSON.parse(userData[0].options);
                // } else {
                //     console.warn("No options found in userData, proceeding without them.");
                // }

                // userData[0].accessToken = token.accessToken;
                // session.user = { ...session.user, ...userData[0] };

                // return session;
            } catch (error) {
                console.error("Error in session callback:", error.message);
                // Handle the error appropriately. You might want to return a modified session or handle the error differently
                return session;
            }
        },

        // redirect: async (url, baseUrl) => {
        //     return Promise.resolve('/')
        // }
    },
    providers: [], // Add providers with an empty array for now
}