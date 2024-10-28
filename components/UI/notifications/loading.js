/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useContext } from 'react'
import NotificationsContext from '../../../store/notifications'
import { Transition } from '@headlessui/react'
import { ArrowPathIcon } from '@heroicons/react/24/outline'

export default function Loading() {

    const notifications = useContext(NotificationsContext)

    return (
        <Transition
            show={notifications.loading.show}
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <div className="fixed z-10 inset-0 overflow-y-auto mt-10" >
                <div className="flex  justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">

                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span className="hidden sm:inline-block align-top sm:h-screen" aria-hidden="true">
                        &#8203;
                    </span>

                    <div className="inline-block align-bottom bg-transparent rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
                        <div>
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
                                <ArrowPathIcon className=" animate-spin h-6 w-6 text-indigo-600" aria-hidden="true" />
                            </div>
                            {/* <div className="mt-3 text-center sm:mt-5">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Attendi metre carichiamo la pagina
                                </h3>
                                <div className="mt-2">

                                </div>
                            </div> */}
                        </div>
                        {/* <div className="mt-5 sm:mt-6">
                            <button
                                type="button"
                                disabled
                                className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                            >
                                Grazie per la tua attesa!
                            </button>
                        </div> */}
                    </div>
                </div>
            </div>
        </Transition>
    )
}
