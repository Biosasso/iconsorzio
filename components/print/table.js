import { DateTime } from "datetime-next";
import { useEffect, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import it from 'date-fns/locale/it';
import "react-datepicker/dist/react-datepicker.css"
import { CalendarIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function Table({
    events,
    selectedDay,
    setSelectedDay,
    selectedType,
    setSelectedType,
}) {

    return (
        <div>
            <div className="grid grid-cols-4 gap-6">
                <div className="col-span-2 sm:col-span-2 print:hidden">
                    <label htmlFor="immatricolazione" className="block text-sm font-medium text-gray-700">
                        Seleziona data
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm ">
                        {selectedDay &&
                            <DatePicker
                                locale={it}
                                selected={selectedDay}
                                onChange={(e) => setSelectedDay(e)}
                                dateFormat="P"
                                className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                            />
                        }

                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <CalendarIcon className="h-5 w-5 text-gray-700 z-40" aria-hidden="true" />
                        </div>
                    </div>
                </div>
                <div className="col-span-2 sm:col-span-2 print:hidden">
                    <label htmlFor="tipo" className="block text-sm font-medium text-gray-700">
                        Tipo
                    </label>
                    <select
                        id="tipo"
                        name="tipo"
                        className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        defaultValue={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                    >
                        <option value={'guida'}>Guida</option>
                        <option value={'esame'}>Esame</option>
                    </select>
                </div>
            </div>
            <div className="mt-2 flex flex-col ">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-xs font-semibold text-gray-900 sm:pl-6">
                                            Tipo
                                        </th>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-xs font-semibold text-gray-900 sm:pl-6">
                                            Patente
                                        </th>
                                        <th scope="col" className="px-2 py-3.5 text-left text-xs font-semibold text-gray-900">
                                            Nominativo
                                        </th>
                                        <th scope="col" className="px-2 py-3.5 text-left text-xs font-semibold text-gray-900">
                                            Tel.
                                        </th>
                                        {/* <th scope="col" className="px-2 py-3.5 text-left text-xs font-semibold text-gray-900">
                                            Email
                                        </th> */}
                                        <th scope="col" className="px-2 py-3.5 text-left text-xs font-semibold text-gray-900">
                                            Ora inizio
                                        </th>
                                        <th scope="col" className="px-2 py-3.5 text-left text-xs font-semibold text-gray-900">
                                            Durata
                                        </th>
                                        <th scope="col" className="px-2 py-3.5 text-left text-xs font-semibold text-gray-900">
                                            Istruttore
                                        </th>
                                        <th scope="col" className="px-2 py-3.5 text-left text-xs font-semibold text-gray-900">
                                            Veicolo
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">

                                    {events.length ?
                                        events.map((event, eventIdx) => (

                                            <tr key={event.id} className={eventIdx % 2 === 0 ? undefined : 'bg-gray-50'}>

                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs font-medium text-gray-900 sm:pl-6">
                                                    <Link href={`/allievi/servizi/edit/${event.originalData.id}?allievoId=${event.originalData.AllievoIstruzione.allievo.id}`}>
                                                        {event.originalData.tariffa.tipo.tipo}
                                                    </Link>
                                                </td>
                                                <td className="whitespace-nowrap px-2 py-4 text-xs text-gray-500 capitalize">
                                                    <Link href={`/allievi/servizi/edit/${event.originalData.id}?allievoId=${event.originalData.AllievoIstruzione.allievo.id}`}>
                                                        {event.originalData.AllievoIstruzione.patente.nome}
                                                    </Link>
                                                </td>
                                                <td className="whitespace-nowrap px-2 py-4 text-xs text-gray-500 capitalize">
                                                    <Link href={`/allievi/servizi/edit/${event.originalData.id}?allievoId=${event.originalData.AllievoIstruzione.allievo.id}`}>
                                                        {event.originalData.AllievoIstruzione.allievo.cognome} {event.originalData.AllievoIstruzione.allievo.nome}
                                                    </Link>
                                                </td>
                                                <td className="whitespace-nowrap px-2 py-4 text-xs text-gray-500">
                                                    <Link href={`/allievi/servizi/edit/${event.originalData.id}?allievoId=${event.originalData.AllievoIstruzione.allievo.id}`}>
                                                        {event.originalData.AllievoIstruzione.allievo.tel}
                                                    </Link>
                                                </td>
                                                {/* <td className="whitespace-nowrap px-2 py-4 text-xs text-gray-500 lowercase">{event.originalData.AllievoIstruzione.allievo.email}</td> */}
                                                <td className="whitespace-nowrap px-2 py-4 text-xs text-gray-500 lowercase">
                                                    <Link href={`/allievi/servizi/edit/${event.originalData.id}?allievoId=${event.originalData.AllievoIstruzione.allievo.id}`}>
                                                        {new Date(event.startAt).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                                                    </Link>
                                                </td>
                                                <td className="whitespace-nowrap px-2 py-4 text-xs text-gray-500 lowercase">
                                                    <Link href={`/allievi/servizi/edit/${event.originalData.id}?allievoId=${event.originalData.AllievoIstruzione.allievo.id}`}>
                                                        {event.originalData.durataMinuti} minuti
                                                    </Link>
                                                </td>
                                                <td className="whitespace-nowrap px-2 py-4 text-xs text-gray-500 capitalize">
                                                    <Link href={`/allievi/servizi/edit/${event.originalData.id}?allievoId=${event.originalData.AllievoIstruzione.allievo.id}`}>
                                                        {event.originalData.istruttore.profile.lastname} {event.originalData.istruttore.profile.firstname}
                                                    </Link>
                                                </td>
                                                <td className="whitespace-nowrap px-2 py-4 text-xs text-gray-500 uppercase">
                                                    <Link href={`/allievi/servizi/edit/${event.originalData.id}?allievoId=${event.originalData.AllievoIstruzione.allievo.id}`}>
                                                        {event.originalData.veicolo.modello}: {event.originalData.veicolo.targa}
                                                    </Link>
                                                </td>

                                            </tr>


                                        ))
                                        :
                                        <tr>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                <p className="py-4">
                                                    {selectedType.includes('guida') ? 'Nessuna guida trovata' : 'Nessun esame trovato'} per il giorno {new DateTime(selectedDay).getString('DD/MM/YYYY')}
                                                </p>
                                            </td>
                                        </tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}