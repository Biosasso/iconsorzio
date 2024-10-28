import Image from "next/image";
import React from "react";
import { useRouter } from "next/router";
import logoPic from '../../public/logo.png'
import { ArrowPathIcon } from '@heroicons/react/24/outline'

export default function RecoveryForm({ submitHandler, email, setEmail, message, emailSend }) {

    const router = useRouter();

    return (
        <>
            <div className="min-h-full flex flex-col justify-center py-12 px-0 sm:px-6 lg:px-8 w-full">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <Image
                        className="mx-auto h-12 w-auto"
                        src={logoPic}
                        alt="iConsorzio"
                        priority={true}
                    />
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900"> Recupero password</h2>
                </div>

                <div className="mt-8 sm:mx-auto w-full sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <form method="POST" className="space-y-6">
                            <div className="">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Indirizzo Email
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        onChange={(e) => setEmail(e.target.value)}
                                        value={email}
                                        required
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                </div>
                            </div>
                            {emailSend === 'error' &&
                                <div className={`rounded-md bg-red-50 p-4 `}>
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        </div>

                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-red-800">
                                                {message}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            }
                            {emailSend === 'sended' &&
                                <div className={`rounded-md bg-green-50 p-4 `}>
                                    <div className="flex">
                                        <div>
                                            <h3 className="text-sm font-medium text-green-800">
                                                {message}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            }
                            <div>
                                <button
                                    type={`${emailSend === 'sended' ? 'button' : 'submit'}`}
                                    disabled={email === '' ? true : false}
                                    onClick={(e) => emailSend === 'sended' ? router.push('/') : submitHandler(e)}
                                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}>
                                    {emailSend === 'sending'
                                        ?
                                        <ArrowPathIcon className="animate-spin w-5">
                                            Richiesta in corso
                                        </ArrowPathIcon>
                                        :
                                        `${emailSend === 'sended' ? 'Torna al Login' : 'Richiedi nuova password'}`
                                    }
                                </button>
                                <button
                                    type='button'
                                    onClick={() => router.push('/')}
                                    className="mt-6"
                                >
                                    Torna al login
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}