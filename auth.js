import Credentials from 'next-auth/providers/credentials';
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

const url = process.env.SITE

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                try {
                    // Add logic here to look up the user from the credentials supplied
                    const res = await fetch(url + "/api/login", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            email: credentials?.email,
                            password: credentials?.password,
                        }),
                    });

                    // Check if the response is okay (status in the range 200-299)
                    if (!res.ok) {
                        // You can throw a custom error message or handle it differently
                        throw new Error("Failed to log in");
                    }

                    const user = await res.json();

                    if (user) {
                        // Any object returned will be saved in `user` property of the JWT
                        //console.log(user)
                        return user;
                    } else {
                        // If you return null then an error will be displayed advising the user to check their details.
                        return null;

                        // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
                    }
                } catch (error) {
                    // Handle errors that occurred during fetch or response processing
                    console.error("Login error:", error);
                    // You can decide how to handle the error, e.g., return null, throw the error, etc.
                    // Returning null for this example
                    return null;
                }

            }
        })
    ],
});