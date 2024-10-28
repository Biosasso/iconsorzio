import { DateTime } from "datetime-next";
import { useEffect, useState, Fragment } from "react";
import DatePicker from "react-datepicker";
import { unixDateToIta } from "../../lib/utils";
import it from 'date-fns/locale/it';
import "react-datepicker/dist/react-datepicker.css"
import { CalendarIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function Table({
    esami,
    selectedDay,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    selectedType,
    setSelectedType,
}) {

    const [groupedEsami, setGroupedEsami] = useState(esami);

    useEffect(() => {

        if (esami && esami.length > 0) {
            const obj = {}
            const arr = []

            esami.map(item => {
                obj[unixDateToIta(item.inizioServizio)] = [];
            })

            esami.map(item => {
                obj[unixDateToIta(item.inizioServizio)].push(item);
            })

            arr.push(obj)

            setGroupedEsami(obj)
        }

    }, [esami])


    const onChange = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
    };
    return (
        <div>
            <div className="grid grid-cols-4 gap-6">
                <div className="col-span-2 sm:col-span-2 print:hidden">
                    <label htmlFor="immatricolazione" className="block text-sm font-medium text-gray-700">
                        Seleziona il periodo
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm ">
                        {selectedDay &&
                            <DatePicker
                                locale={it}
                                selected={selectedDay}
                                onChange={onChange}
                                startDate={startDate}
                                endDate={endDate}
                                dateFormat="P"
                                selectsRange
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
                                            Ora inizio
                                        </th>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-xs font-semibold text-gray-900 sm:pl-6">
                                            Autoscuola
                                        </th>
                                        <th scope="col" className="px-2 py-3.5 text-left text-xs font-semibold text-gray-900">
                                            Tipo esame
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {
                                        groupedEsami
                                            ?
                                            Object.keys(groupedEsami).map(function (key) {
                                                return (
                                                    <Fragment key={key}>
                                                        <tr key={key} className="border-t border-gray-200">
                                                            <td className=" py-2 pl-6 pr-3 text-left text-xs font-semibold text-gray-900 sm:pl-3">
                                                                Data: {key}
                                                            </td>
                                                        </tr>
                                                        {
                                                            groupedEsami[key].map((event, eventIdx) => {
                                                                return (
                                                                    <tr key={event.id} className={eventIdx % 2 === 0 ? undefined : 'bg-gray-50'}>

                                                                        <td className="whitespace-nowrap py-2 pl-4 pr-3 text-xs font-medium text-gray-900 sm:pl-6">
                                                                            <Link href={`/allievi/servizi/edit/${event.id}?allievoId=${event.AllievoIstruzione.allievo.id}`}>
                                                                                {new Date(event.inizioServizio * 1000).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                                                                                {/* {(new DateTime(new Date(event.inizioServizio * 1000)).getHour() + 1) < 10 ? `0${new DateTime(new Date(event.inizioServizio * 1000)).getHour() + 1}` : new DateTime(new Date(event.inizioServizio * 1000)).getHour() + 1}:{new DateTime(new Date(event.inizioServizio * 1000)).getMinute() < 10 ? `0${new DateTime(new Date(event.inizioServizio * 1000)).getMinute()}` : new DateTime(new Date(event.inizioServizio * 1000)).getMinute()} */}
                                                                            </Link>
                                                                        </td>
                                                                        <td className="whitespace-nowrap px-2 py-2 text-xs text-gray-500 capitalize">
                                                                            <Link href={`/allievi/servizi/edit/${event.id}?allievoId=${event.AllievoIstruzione.allievo.id}`}>
                                                                                {event.AllievoIstruzione.allievo.autoscuola.denominazione}
                                                                            </Link>
                                                                        </td>
                                                                        <td className="whitespace-nowrap px-2 py-2 text-xs text-gray-500 capitalize">
                                                                            <Link href={`/allievi/servizi/edit/${event.id}?allievoId=${event.AllievoIstruzione.allievo.id}`}>

                                                                                {event.tariffa.tipo.tipo}
                                                                            </Link>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })
                                                        }
                                                    </Fragment>
                                                )
                                            })
                                            :
                                            <tr>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                    <p className="py-4">
                                                        Nessun esame trovato
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