import { DateTime } from "datetime-next";

export default function Table({
    listaBlocchi,
    eliminaBlocco,
}) {

    DateTime.setDefaultLocale('it-IT');

    return (
        <div>
            <div className="mt-8 grid grid-cols-4 gap-6">
                <div className="col-span-2 sm:col-span-2 print:hidden">
                    <label htmlFor="immatricolazione" className="block text-sm font-medium text-gray-700">
                        Lista dei blocchi attivi
                    </label>
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
                                            Tipo Blocco
                                        </th>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-xs font-semibold text-gray-900 sm:pl-6">
                                            Data Blocco
                                        </th>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-xs font-semibold text-gray-900 sm:pl-6">
                                            Istruttore
                                        </th>
                                        <th scope="col" className="px-2 py-3.5 text-left text-xs font-semibold text-gray-900">
                                            Workplace
                                        </th>
                                        <th scope="col" className="px-2 py-3.5 text-left text-xs font-semibold text-gray-900">

                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {
                                        listaBlocchi && listaBlocchi.map((item, index) => {
                                            return (
                                                <tr key={item.id} className={index % 2 === 0 ? undefined : 'bg-gray-50'}>
                                                    <td className="whitespace-nowrap py-2 pl-4 pr-3 text-xs font-medium text-gray-900 sm:pl-6">
                                                        {item.tariffa.tipo.tipo_cod === 'preesame' ? 'Pre Esame' : 'Esame'}
                                                    </td>{console.log(item.inizioServizio)}
                                                    <td className="whitespace-nowrap py-2 pl-4 pr-3 text-xs font-medium text-gray-900 sm:pl-6">
                                                        {new Date(item.inizioServizio * 1000).toLocaleDateString('it-IT')}  {new Date(item.inizioServizio * 1000).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                                                    </td>
                                                    <td className="whitespace-nowrap py-2 pl-4 pr-3 text-xs font-medium text-gray-900 sm:pl-6 capitalize">
                                                        {item.istruttore?.profile.firstname} {item.istruttore?.profile.lastname}
                                                    </td>
                                                    <td className="whitespace-nowrap py-2 pl-4 pr-3 text-xs font-medium text-gray-900 sm:pl-6 capitalize">
                                                        {item.veicolo?.workplace?.nome}
                                                    </td>
                                                    <td className="whitespace-nowrap px-2 py-2 text-xs text-red-500 capitalize">
                                                        <button
                                                            onClick={() => eliminaBlocco(item.id)}
                                                        >
                                                            Elimina blocco
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        })
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