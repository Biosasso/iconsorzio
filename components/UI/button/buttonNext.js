/* This example requires Tailwind CSS v2.0+ */
import { ArrowRightIcon } from '@heroicons/react/24/solid'

export default function ButtonNext({ clicked }) {
    return (
        <>
            <button
                onClick={clicked}
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
                Avanti
                <ArrowRightIcon className="ml-3 -mr-1 h-5 w-5" aria-hidden="true" />
            </button>
        </>
    )
}
