import NextAuth from "next-auth"
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from "../../../lib/db.ts"
import { verifyPassword } from '../../../lib/auth';


export default NextAuth({
    providers: [
        CredentialsProvider({
            name: "Acceedi con le credenziali",
            credentials: {
                username: {
                    label: "email",
                    type: "text"
                },
                password: {
                    label: "Password",
                    type: "password"
                }
            },
            authorize: async (credentials) => {

                if (credentials) {
                    try {
                        const user = await prisma.user.findUnique({
                            where: {
                                email: credentials.email.toLowerCase(),
                            },
                            include: {
                                userPassword: true,
                                profile: true,
                                companies: true,
                                activeCompany: true
                            }
                        });

                        if (!user) {
                            console.log('Utente non trovato')
                            throw new Error('Utente non trovato!');
                        }
                        const isValid = await verifyPassword(
                            credentials.password,
                            user.userPassword.password
                        );


                        if (!isValid) {
                            console.log('Password sbagliata')
                            throw new Error('Login non riuscito!');
                        }
                        // if (user.forceResetPassword) {

                        //     return { email: user.email, forceResetPassword: true };
                        // }

                        if (!user.activeCompany) {
                            try {
                                const activeCompany = await prisma.activeCompany.create({
                                    data: {
                                        userId: user.id,
                                        isActive: user.companies[0].companyId,
                                    }
                                })
                            }
                            catch (err) {
                                console.log(err)
                            }
                        }
                        return {
                            id: user.id,
                            email: user.email,
                            name: user.profile?.firstname + ' ' + user.profile?.lastname,
                            image: user.companies[0].companyId,
                        };

                    }
                    catch (err) {
                        console.log(err)
                        return null
                    }
                }
                return null
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            session.user.id = token.sub
            session.user.company = session.user.image;
            session.user.image = '';
            return session
        },
    },
    secret: process.env.SECRET,
    pages: {
        signIn: '/',
        error: '/'
    },
});
