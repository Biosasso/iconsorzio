import { ChevronRightIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import { DateTime } from 'datetime-next';
import { useState } from 'react';

export default function Table({ tableData, setTableData, selectedRow, notModified, sorting, setSorting }) {

    const link = '/allievi/edit';

    const changeSorting = (field) => {

        const objField = Object.keys(sorting)
        const order = Object.values(sorting)

        if (field === 'cognome') {
            if (objField[0] !== 'cognome') {
                setSorting({ cognome: 'asc' })
                return
            }
            if (field === objField[0]) {
                const order = Object.values(sorting)

                if (order[0] === 'asc') {
                    setSorting({ [field]: 'desc' })
                }
                else {
                    setSorting({ [field]: 'asc' })
                }
            }
        }

        if (field === 'autoscuola') {

            if (objField[0] !== 'autoscuola') {
                setSorting({ autoscuola: { denominazione: 'asc' } })
                return
            }
            if (sorting.autoscuola.denominazione === 'asc') {
                setSorting({ autoscuola: { denominazione: 'desc' } })
            }
            else {
                setSorting({ autoscuola: { denominazione: 'asc' } })
            }

        }

        if (field === 'patente') {
            if (sorting !== 'patenteAsc') {
                setSorting('patenteAsc')
            }
            else {
                setSorting('patenteDesc')
            }

        }

        if (field === 'foglioRosa') {
            if (sorting !== 'foglioRosaAsc') {
                setSorting('foglioRosaAsc')
            }
            else {
                setSorting('foglioRosaDesc')
            }

        }

        if (field === 'esame') {
            if (sorting !== 'esameAsc') {
                setSorting('esameAsc')
            }
            else {
                setSorting('esameDesc')
            }

        }

    }

    return (
        <>
            {/* Projects list (only on smallest breakpoint) rimosso mt-10*/}
            <div className="mt-10 sm:hidden capitalize">
                <div className="px-4 sm:px-6">
                    <h2 className="text-gray-500 text-xs font-medium uppercase tracking-wide">Patenti</h2>
                </div>
                <ul role="list" className="mt-3 border-t border-gray-200 divide-y divide-gray-100 ">
                    {(tableData && tableData.length > 0) ? tableData.map((item) => (
                        <li key={item.id}>
                            <Link href={`${link}/${item.id}`} className="group flex items-center justify-between px-4 py-4 hover:bg-gray-50 sm:px-6">
                                <span className="flex items-center  space-x-3">
                                    <span
                                        className={'w-2.5 h-2.5 flex-shrink-0 rounded-full'}
                                        aria-hidden="true"
                                    />
                                    <span className="font-medium  text-sm leading-6 capitalize">
                                        {item.nome} {' '} {item.cogmone}
                                    </span>
                                </span>
                                <ChevronRightIcon
                                    className="ml-4 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                    aria-hidden="true"
                                />
                            </Link>
                        </li>
                    ))
                        : <li className='p-4'>{tableData.length === 0 ? 'Nessun dato presente in archivio' : 'Caricamento dati in corso...'}</li>}
                </ul>
            </div>

            {/* Projects table (small breakpoint and up) rimosso mt-8 */}
            <div className="hidden sm:block capitalize">
                <div className="align-middle inline-block min-w-full border-b border-gray-200">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-t border-gray-200">
                                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <span className="lg:pl-2">N. iscrizione</span>
                                </th>
                                <th scope="col" className="px-3 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <button onClick={() => changeSorting('cognome')} className="group inline-flex uppercase">
                                        <span className="lg:pl-2">Cognome e nome</span>
                                        <span className="ml-1 flex-none rounded bg-gray-100 text-gray-900 group-hover:bg-gray-200">
                                            <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
                                        </span>
                                    </button>
                                </th>
                                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <button onClick={() => changeSorting('autoscuola')} className="group inline-flex uppercase">
                                        <span className="lg:pl-2">Autoscuola</span>
                                        <span className="ml-1 flex-none rounded bg-gray-100 text-gray-900 group-hover:bg-gray-200">
                                            <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
                                        </span>
                                    </button>
                                </th>
                                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <button onClick={() => changeSorting('patente')} className="group inline-flex uppercase">
                                        <span className="lg:pl-2">Patente</span>
                                        <span className="ml-1 flex-none rounded bg-gray-100 text-gray-900 group-hover:bg-gray-200">
                                            <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
                                        </span>
                                    </button>
                                </th>
                                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <button onClick={() => changeSorting('foglioRosa')} className="group inline-flex uppercase">
                                        <span className="lg:pl-2">Scadenza FR</span>
                                        <span className="ml-1 flex-none rounded bg-gray-100 text-gray-900 group-hover:bg-gray-200">
                                            <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
                                        </span>
                                    </button>
                                </th>
                                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <button onClick={() => changeSorting('esame')} className="group inline-flex uppercase">
                                        <span className="lg:pl-2">Data esame</span>
                                        <span className="ml-1 flex-none rounded bg-gray-100 text-gray-900 group-hover:bg-gray-200">
                                            <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
                                        </span>
                                    </button>
                                </th>
                                {/* <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    <a href="#" className="group inline-flex">
                                        Data esame
                                        <span className="ml-2 flex-none rounded bg-gray-100 text-gray-900 group-hover:bg-gray-200">
                                            <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
                                        </span>
                                    </a>
                                </th> */}

                                <th className="pr-6 py-3 border-b border-gray-200 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider" />
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {(tableData && tableData.length > 0) ? tableData.map((item) => (
                                <tr key={item.id} className={selectedRow === item.id ? notModified ? 'bg-yellow-100' : 'bg-green-100' : ''}>

                                    <td className="px-3 py-3 max-w-0 whitespace-nowrap text-sm font-medium text-gray-900">

                                        <div className="flex items-center space-x-3 ">
                                            <div
                                                className={'flex-shrink-0 w-2.5 h-2.5 rounded-full'}
                                                aria-hidden="true"
                                            />
                                            <Link href={`${link}/${item.id}`} className=" hover:text-gray-600 uppercase">
                                                {item.iscrizioneNumero}
                                            </Link>
                                        </div>

                                    </td>
                                    <td className="px-3 py-3 max-w-0 whitespace-nowrap text-sm font-medium text-gray-900">

                                        <div className="flex items-center space-x-3 ">
                                            <div
                                                className={'flex-shrink-0 w-2.5 h-2.5 rounded-full'}
                                                aria-hidden="true"
                                            />
                                            <Link href={`${link}/${item.id}`} className=" hover:text-gray-600 capitalize">
                                                {item.cognome + ' ' + item.nome}
                                            </Link>
                                        </div>

                                    </td>
                                    <td className="px-3 py-3 max-w-0 whitespace-nowrap text-sm font-medium text-gray-900">

                                        <div className="flex items-center space-x-3 truncate ">
                                            <div
                                                className={'flex-shrink-0 w-2.5 h-2.5 rounded-full'}
                                                aria-hidden="true"
                                            />
                                            <Link href={`${link}/${item.id}`} className=" hover:text-gray-600">
                                                {item.autoscuola?.denominazione.replace('Autoscuola', '')}
                                            </Link>
                                        </div>

                                    </td>
                                    <td className="px-3 py-3 max-w-0 whitespace-nowrap text-sm font-medium text-gray-900">

                                        <div className="flex items-center space-x-3">
                                            <div
                                                className={'flex-shrink-0 w-2.5 h-2.5 rounded-full'}
                                                aria-hidden="true"
                                            />
                                            <Link href={`${link}/${item.id}`} className=" hover:text-gray-600">
                                                {item.AllievoIstruzioni[0]?.patente?.nome}
                                            </Link>
                                        </div>

                                    </td>
                                    <td className="px-3 py-3 max-w-0 whitespace-nowrap text-sm font-medium text-gray-900">

                                        <div className="flex items-center space-x-3">
                                            <div
                                                className={'flex-shrink-0 w-2.5 h-2.5 rounded-full'}
                                                aria-hidden="true"
                                            />
                                            <Link href={`${link}/${item.id}`} className=" hover:text-gray-600">
                                                {item.AllievoIstruzioni[0]?.foglioRosaScadenza ? new DateTime(item.AllievoIstruzioni[0]?.foglioRosaScadenza).getString('DD/MM/YYYY') : ''}
                                            </Link>
                                        </div>

                                    </td>
                                    <td className="px-3 py-3 max-w-0 whitespace-nowrap text-sm font-medium text-gray-900">

                                        <div className="flex items-center space-x-3">
                                            <div
                                                className={'flex-shrink-0 w-2.5 h-2.5 rounded-full'}
                                                aria-hidden="true"
                                            />
                                            <Link href={`${link}/${item.id}`} className=" hover:text-gray-600">
                                                {item.AllievoIstruzioni[0]?.dataEsame ? new DateTime(item.AllievoIstruzioni[0]?.dataEsame).getString('DD/MM/YYYY') : ''}
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
                                            <p className='py-2'>{tableData.length === 0 ? 'Nessun dato presente in archivio' : 'Caricamento dati in corso...'}</p>
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