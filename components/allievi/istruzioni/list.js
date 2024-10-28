import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { DateTime } from 'datetime-next';

export default function IstruzioniList({ //DA FARE
    tableData,
    selectedRow,
    notModified
}) {

    const link = '/allievi/istruzioni/edit';
    return (
        <div className="hidden sm:block capitalize">
            <div className="align-middle inline-block min-w-full border-b border-gray-200">
                <table className="min-w-full">
                    <thead>
                        <tr className="border-t border-gray-200">
                            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <span className="lg:pl-2">Patente</span>
                            </th>
                            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <span className="lg:pl-2">Marca Operativa</span>
                            </th>
                            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <span className="lg:pl-2">Codice Statino</span>
                            </th>
                            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <span className="lg:pl-2">Data esame</span>
                            </th>
                            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <span className="lg:pl-2">Rilascio FR</span>
                            </th>
                            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <span className="lg:pl-2">Scadenza FR</span>
                            </th>
                            <th className="pr-6 py-3 border-b border-gray-200 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider" />
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {(tableData && tableData.length > 0) ? tableData.map((item) => (
                            <tr key={item.id} className={`${item.istruzioneCompletata ? 'bg-green-300' : 'bg-yellow-300'} ${selectedRow === item.id ? notModified ? 'bg-yellow-100' : 'bg-green-100' : ''}`}>
                                <td className="px-3 py-3 max-w-0 whitespace-nowrap text-sm font-medium text-gray-900">

                                    <div className="flex items-center space-x-3 ">
                                        <div
                                            className={'flex-shrink-0 w-2.5 h-2.5 rounded-full'}
                                            aria-hidden="true"
                                        />
                                        <Link href={`${link}/${item.id}`} className=" hover:text-gray-600 uppercase">
                                            {item.patente.nome}
                                        </Link>
                                    </div>

                                </td>
                                <td className="px-3 py-3 max-w-0 whitespace-nowrap text-sm font-medium text-gray-900">

                                    <div className="flex items-center space-x-3 ">
                                        <div
                                            className={'flex-shrink-0 w-2.5 h-2.5 rounded-full'}
                                            aria-hidden="true"
                                        />
                                        <Link href={`${link}/${item.id}`} className="truncate hover:text-gray-600 capitalize">
                                            {item.marcaOperativa}
                                        </Link>
                                    </div>

                                </td>
                                <td className="px-3 py-3 max-w-0 whitespace-nowrap text-sm font-medium text-gray-900">

                                    <div className="flex items-center space-x-3 ">
                                        <div
                                            className={'flex-shrink-0 w-2.5 h-2.5 rounded-full'}
                                            aria-hidden="true"
                                        />
                                        <Link href={`${link}/${item.id}`} className="truncate hover:text-gray-600">
                                            {item.codiceStatino}
                                        </Link>
                                    </div>

                                </td>
                                <td className="px-3 py-3 max-w-0 whitespace-nowrap text-sm font-medium text-gray-900">

                                    <div className="flex items-center space-x-3">
                                        <div
                                            className={'flex-shrink-0 w-2.5 h-2.5 rounded-full'}
                                            aria-hidden="true"
                                        />
                                        <Link href={`${link}/${item.id}`} className="truncate hover:text-gray-600">
                                            {item.dataEsame ? new DateTime(item.dataEsame).getString('DD/MM/YYYY') : ''}
                                        </Link>
                                    </div>

                                </td>
                                <td className="px-3 py-3 max-w-0 whitespace-nowrap text-sm font-medium text-gray-900">

                                    <div className="flex items-center space-x-3">
                                        <div
                                            className={'flex-shrink-0 w-2.5 h-2.5 rounded-full'}
                                            aria-hidden="true"
                                        />
                                        <Link href={`${link}/${item.id}`} className="truncate hover:text-gray-600">
                                            {item.foglioRosaRilascio ? new DateTime(item.foglioRosaRilascio).getString('DD/MM/YYYY') : ''}
                                        </Link>
                                    </div>

                                </td>
                                <td className="px-3 py-3 max-w-0 whitespace-nowrap text-sm font-medium text-gray-900">

                                    <div className="flex items-center space-x-3">
                                        <div
                                            className={'flex-shrink-0 w-2.5 h-2.5 rounded-full'}
                                            aria-hidden="true"
                                        />
                                        <Link href={`${link}/${item.id}`} className="truncate hover:text-gray-600">
                                            {item.foglioRosaScadenza ? new DateTime(item.foglioRosaScadenza).getString('DD/MM/YYYY') : ''}
                                        </Link>
                                    </div>

                                </td>

                                <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
                                    <Link href={`${link}/${item.id}`} className="text-indigo-600 hover:text-indigo-900">
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
                                <td className=" py-3 max-w-0 w-full whitespace-nowrap text-sm font-medium text-gray-900">
                                    <div className="flex items-center space-x-3 lg:pl-2">
                                        <div
                                            className={'flex-shrink-0 w-2.5 h-2.5 rounded-full'}
                                            aria-hidden="true"
                                        />
                                        <p className='py-2'>{tableData?.length === 0 ? 'Nessun dato presente in archivio' : 'Caricamento dati in corso...'}</p>
                                    </div>
                                </td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}