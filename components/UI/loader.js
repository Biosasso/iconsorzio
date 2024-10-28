import { ArrowPathIcon } from '@heroicons/react/24/outline'

export default function Loader() {

    return (
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
                    </div>
                </div>
            </div>
        </div>
    )
}
