import { ChevronRightIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'

export default function Table({ tableData, selectedRow, notModified }) {

    return (
        <>
            {/* Projects list (only on smallest breakpoint) rimosso mt-10*/}
            <div className="mt-10 sm:hidden">
                <div className="px-4 sm:px-6">
                    <h2 className="text-gray-500 text-xs font-medium uppercase tracking-wide">Tariffe</h2>
                </div>
                <ul role="list" className="mt-3 border-t border-gray-200 divide-y divide-gray-100">
                    {tableData ? tableData.map((item) => (
                        <li key={item.id}>
                            <Link href={`/tariffe/edit/${item.id}`} className="group flex items-center justify-between px-4 py-4 hover:bg-gray-50 sm:px-6">
                                <span className="flex items-center truncate space-x-3">
                                    <span
                                        className={'w-2.5 h-2.5 flex-shrink-0 rounded-full'}
                                        aria-hidden="true"
                                    />
                                    <span className="font-medium truncate text-sm leading-6 capitalize">
                                        {item.patente.nome} <span className="ml-6 truncate font-normal text-gray-500">  {item.prezzo} €</span>
                                    </span>
                                </span>
                                <ChevronRightIcon
                                    className="ml-4 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                    aria-hidden="true"
                                />
                            </Link>
                        </li>
                    ))
                        : <li>Caricamento dati in corso...</li>}
                </ul>
            </div>

            {/* Projects table (small breakpoint and up) rimosso mt-8 */}
            <div className="hidden sm:block">
                <div className="align-middle inline-block min-w-full border-b border-gray-200">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-t border-gray-200">
                                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <span className="lg:pl-2">Nome Tariffa</span>
                                </th>
                                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Prezzo
                                </th>
                                <th className="pr-6 py-3 border-b border-gray-200 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider" />
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {tableData ? tableData.map((item) => (
                                <tr key={item.id} className={selectedRow === item.id ? notModified ? 'bg-yellow-100' : 'bg-green-100' : ''}>

                                    <td className="px-6 py-3 max-w-0 w-full whitespace-nowrap text-sm font-medium text-gray-900">

                                        <div className="flex items-center space-x-3 lg:pl-2">
                                            <div
                                                className={'flex-shrink-0 w-2.5 h-2.5 rounded-full'}
                                                aria-hidden="true"
                                            />
                                            <Link href={`/tariffe/edit/${item.id}`} className="truncate hover:text-gray-600 capitalize">
                                                {item.patente.nome}<span className="text-gray-500 font-normal"> </span>
                                            </Link>
                                        </div>

                                    </td>
                                    <td className="px-6 py-3 text-sm text-gray-500 font-medium">
                                        <Link href={`/tariffe/edit/${item.id}`}>
                                            {item.prezzo.replace('.', ',')} €
                                        </Link>
                                    </td>
                                    <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
                                        <Link href={`/tariffe/edit/${item.id}`} className="text-indigo-600 hover:text-indigo-900">
                                            <ChevronRightIcon
                                                className="ml-4 h-5 w-5 text-indigo-400 group-hover:text-gray-500"
                                                aria-hidden="true"
                                            />
                                        </Link>
                                    </td>

                                </tr>
                            ))
                                :
                                <tr>
                                    <td className="px-6 py-3 max-w-0 w-full whitespace-nowrap text-sm font-medium text-gray-900">
                                        <div className="flex items-center space-x-3 lg:pl-2">
                                            <div
                                                className={'flex-shrink-0 w-2.5 h-2.5 rounded-full'}
                                                aria-hidden="true"
                                            />
                                            <p>Caricamento dati in corso...</p>
                                        </div>
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}