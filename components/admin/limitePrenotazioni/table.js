
import { PlusIcon as PlusIconMini, MinusIcon as MinusIconMini } from '@heroicons/react/24/outline'

export default function Table({ autoscuole, updateLimite }) {
    return (
        <div className="px-6 lg:px-8">
            <div className="mt-8 flow-root">
                <div className="-my-2 -mx-6 overflow-x-auto lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                                <tr>
                                    <th scope="col" className="py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-gray-900 lg:pl-8">
                                        Autoscuola
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Limite di prenotazioni mensili
                                    </th>
                                    <th scope="col" className="relative py-3.5 pl-3 pr-6 lg:pr-8">
                                        <span className="sr-only">Salva</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {autoscuole.map((autoscuola, index) => (
                                    <tr key={index}>
                                        <td className="whitespace-nowrap py-2 pl-6 pr-3 text-sm font-medium text-gray-900 lg:pl-8">
                                            {autoscuola.denominazione}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500">
                                            {autoscuola.limitePrenotazioni}
                                        </td>
                                        <td className="relative whitespace-nowrap py-2 pl-3 pr-6 text-right text-sm font-medium lg:pr-8">
                                            <button
                                                type="button"
                                                onClick={(e) => updateLimite({ id: autoscuola.id, newLimite: Number(autoscuola.limitePrenotazioni) - 1 })}
                                                className="mr-4 inline-flex items-center rounded-full border border-transparent bg-red-600 p-1.5 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                            >
                                                <MinusIconMini className="h-5 w-5" aria-hidden="true" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={(e) => updateLimite({ id: autoscuola.id, newLimite: Number(autoscuola.limitePrenotazioni) + 1 })}
                                                className="inline-flex items-center rounded-full border border-transparent bg-green-600 p-1.5 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                            >
                                                <PlusIconMini className="h-5 w-5" aria-hidden="true" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
