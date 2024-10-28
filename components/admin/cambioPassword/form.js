import React, { useEffect, useState } from "react";

export default function Form({
    password,
    setPassword,
    checkPassword,
    setCheckPassword,
    validatePassword,
    setValidatePassword
}) {

    useEffect(() => {

        if (password !== '' && checkPassword !== '') {
            if (password === checkPassword) {
                setValidatePassword(true)
            }
            else {
                setValidatePassword(false)
            }
        }

    }, [password, checkPassword])

    return (
        <div className="space-y-6 p-6">
            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Cambia la password</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Cambia periodicamente la tua password
                        </p>
                    </div>
                    <div className="mt-5 md:mt-0 md:col-span-2">
                        <form className="space-y-6" action="#" method="POST">
                            <div className="grid grid-cols-1 sm:grid-cols-5 gap-6">
                                <div className="col-span-3 sm:col-span-4">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        Nuova password
                                    </label>
                                    <div className="mt-1 flex rounded-md shadow-sm">
                                        <input
                                            type="password"
                                            name="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className={`focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300`}
                                            placeholder=""
                                        />
                                    </div>
                                </div>
                                <div className="col-span-3 sm:col-span-4">
                                    <label htmlFor="checkPassword" className="block text-sm font-medium text-gray-700">
                                        Reinserisci la password
                                    </label>
                                    <div className="mt-1 flex rounded-md shadow-sm">
                                        <input
                                            type="password"
                                            name="checkPassword"
                                            value={checkPassword}
                                            onChange={(e) => setCheckPassword(e.target.value)}
                                            className={` flex-1 block w-full rounded-none rounded-r-md sm:text-sm ${validatePassword === undefined ? 'border-gray-300 focus:ring-gray-500 focus:border-gray-500' : (validatePassword === false ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-green-500 focus:ring-green-500 focus:border-green-500')}`}
                                            placeholder=""
                                        />
                                    </div>
                                </div>
                            </div>

                        </form>

                    </div>

                </div>
            </div>
        </div>
    )
}