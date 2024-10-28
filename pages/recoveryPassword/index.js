import React, { useState } from 'react';
import { getSession } from 'next-auth/react';
import Head from 'next/head'
import Script from 'next/script';
import RecoveryForm from '../../components/auth/recoveryForm';

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITEKEY;

export default function RecoveryPassword(props) {

    const [email, setEmail] = useState('');
    const [message, setMessage] = useState();
    const [emailSend, setEmailSend] = useState();

    const submitHandler = async (e) => {

        e.preventDefault();

        setEmailSend('sending');
        window.grecaptcha.ready(() => {
            window.grecaptcha
                .execute(SITE_KEY, { action: "submit" })
                .then(async (token) => {

                    const body = {
                        email: email,
                        recaptchaResponse: token,
                    };

                    try {
                        const response = await fetch("api/recoveryPassword/sendEmail", {
                            method: "POST",
                            headers: { "Content-Type": "application/json;charset=utf-8" },
                            body: JSON.stringify(body),
                        });
                        if (response.ok) {
                            const json = await response.json();
                            setMessage(json.message)
                            if (json.statusCode === 200) {
                                setEmailSend('sended');
                            } else if (json.statusCode === 400) {
                                setEmailSend('error');
                            } else {
                                throw new Error();
                            }
                        }

                    } catch (error) {
                        setEmailSend('error')

                    }
                })
                .catch((error) => {
                    console.log(error)
                });
        });
    }


    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <Head>
                <title>iConsorzio.it Recovery Password</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Script
                src={`https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`}
            />

            <main className="flex flex-col items-center justify-center w-full flex-1 px-1 md:px-20 text-center">
                <RecoveryForm
                    email={email}
                    setEmail={setEmail}
                    submitHandler={submitHandler}
                    message={message}
                    emailSend={emailSend}
                />
            </main>

            <footer className="flex items-center justify-center w-full h-24 border-t">
                <p className="block items-center justify-center" >
                    Powered by{' '} Parsec S.r.l.
                </p>

            </footer>
        </div >
    )
}

export async function getServerSideProps(context) {

    const userSession = await getSession(context);

    if (userSession) {
        return {
            redirect: {
                destination: '/dashboard',
                permanent: false,
            },
        };
    }


    return {
        props: {

        }
    }
}
