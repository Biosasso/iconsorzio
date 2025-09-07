import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { DateTime } from 'datetime-next';

export default function ServiziList({
    tableData,
    selectedRow,
    notModified,
    allievoId
}) {

    //Ordino dal più recente al meno recente
    tableData.sort((a, b) => b.inizioServizio - a.inizioServizio);

    const isoNow = new DateTime(new Date()).getUnixTimestamp()

    const link = '/allievi/servizi/edit';

    return (
        <div className="hidden sm:block capitalize">
            <div className="align-middle inline-block min-w-full border-b border-gray-200">
                <table className="min-w-full">
                    <thead>
                        <tr className="border-t border-gray-200">
                            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <span className="lg:pl-2">Tipo Servizio</span>
                            </th>
                            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <span className="lg:pl-2">Patente</span>
                            </th>
                            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <span className="lg:pl-2">Data servizio</span>
                            </th>
                            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <span className="lg:pl-2">Durata</span>
                            </th>
                            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <span className="lg:pl-2">Esito</span>
                            </th>
                            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <span className="lg:pl-2">Valutazione</span>
                            </th>
                            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <span className="lg:pl-2">Istruttore</span>
                            </th>
                            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <span className="lg:pl-2">Insegnante</span>
                            </th>
                            <th className="pr-6 py-3 border-b border-gray-200 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider" />
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {(tableData && tableData.length > 0) ? tableData.map((item) => {
                            // Calcola il colore della riga basato sulla valutazione
                            let rowColor = '';
                            if (item.tariffa?.tipo?.tipo?.toLowerCase().includes('guida')) {
                                try {
                                    const esitoData = JSON.parse(item.esito || '{}');
                                    if (esitoData.tipo === 'presente' && esitoData.valutazioni) {
                                        const valutazioni = [
                                            esitoData.valutazioni.teoria || 0,
                                            esitoData.valutazioni.lento || 0,
                                            esitoData.valutazioni.veloce || 0,
                                            esitoData.valutazioni.guida || 0
                                        ];
                                        const fasiEffettuate = valutazioni.filter(v => v > 0);
                                        const media = fasiEffettuate.length > 0 ? 
                                            (fasiEffettuate.reduce((a, b) => a + b, 0) / fasiEffettuate.length) : 0;
                                        
                                        // 7 livelli di colore con bordi - TONI PIÙ SATURI
                                        if (media >= 4.6) rowColor = 'bg-green-400 border-2 border-green-700'; // OTTIMO
                                        else if (media >= 4.1) rowColor = 'bg-green-300 border-2 border-green-600'; // MOLTO BUONO
                                        else if (media >= 3.3) rowColor = 'bg-green-200 border-2 border-green-500'; // BUONO
                                        else if (media >= 2.6) rowColor = 'bg-yellow-300 border-2 border-yellow-600'; // SUFFICIENTE
                                        else if (media >= 1.9) rowColor = 'bg-orange-300 border-2 border-orange-600'; // SCARSO
                                        else if (media >= 1.3) rowColor = 'bg-red-300 border-2 border-red-600'; // INSUFFICIENTE
                                        else if (media > 0) rowColor = 'bg-red-400 border-2 border-red-700'; // MOLTO INSUFFICIENTE
                                    } else if (esitoData.tipo === 'presente') {
                                        rowColor = 'bg-gray-200'; // Presente ma non valutato
                                    } else {
                                        rowColor = 'bg-gray-200'; // Altri esiti
                                    }
                                } catch (e) {
                                    if (item.esito === 'presente') {
                                        rowColor = 'bg-gray-200'; // Presente ma non valutato
                                    } else {
                                        rowColor = 'bg-gray-200'; // Altri esiti
                                    }
                                }
                            } else {
                                rowColor = 'bg-gray-200'; // Non guida
                            }
                            
                            // Guide future rimangono bianche
                            if (isoNow - item.inizioServizio <= 0) {
                                rowColor = 'bg-white';
                            }
                            
                            return (
                            <tr key={item.id} className={`${rowColor}${selectedRow === item.id ? notModified ? 'bg-yellow-200' : 'bg-green-200' : ''}`}>

                                <td className="px-3 py-3 max-w-0 whitespace-nowrap text-sm font-medium text-gray-900">

                                    <div className="flex items-center space-x-3 ">
                                        <div
                                            className={'flex-shrink-0 w-2.5 h-2.5 rounded-full'}
                                            aria-hidden="true"
                                        />
                                        <Link href={`${link}/${item.id}?allievoId=${allievoId}${isoNow - item.inizioServizio > 0 ? '&readonly=true' : '&readonly=false'}`} className="truncate hover:text-gray-600 uppercase">
                                            {item.tariffa.tipo.tipo}
                                        </Link>
                                    </div>

                                </td>
                                <td className="px-3 py-3 max-w-0 whitespace-nowrap text-sm font-medium text-gray-900">

                                    <div className="flex items-center space-x-3 ">
                                        <div
                                            className={'flex-shrink-0 w-2.5 h-2.5 rounded-full'}
                                            aria-hidden="true"
                                        />
                                        <Link href={`${link}/${item.id}?allievoId=${allievoId}${isoNow - item.inizioServizio > 0 ? '&readonly=true' : '&readonly=false'}`} className="truncate hover:text-gray-600 capitalize">
                                            {item.tariffa.patente.nome}
                                        </Link>
                                    </div>

                                </td>
                                <td className="px-3 py-3 max-w-0 whitespace-nowrap text-sm font-medium text-gray-900">

                                    <div className="flex items-center space-x-3 ">
                                        <div
                                            className={'flex-shrink-0 w-2.5 h-2.5 rounded-full'}
                                            aria-hidden="true"
                                        />
                                        <Link href={`${link}/${item.id}?allievoId=${allievoId}${isoNow - item.inizioServizio > 0 ? '&readonly=true' : '&readonly=false'}`} className="truncate hover:text-gray-600">
                                            {item.inizioServizio ? new Date(item.inizioServizio * 1000).toLocaleString('it-IT') : ''}
                                        </Link>
                                    </div>

                                </td>
                                <td className="px-3 py-3 max-w-0 whitespace-nowrap text-sm font-medium text-gray-900">

                                    <div className="flex items-center space-x-3">
                                        <div
                                            className={'flex-shrink-0 w-2.5 h-2.5 rounded-full'}
                                            aria-hidden="true"
                                        />
                                        <Link href={`${link}/${item.id}?allievoId=${allievoId}${isoNow - item.inizioServizio > 0 ? '&readonly=true' : '&readonly=false'}`} className="truncate hover:text-gray-600">
                                            {item.durataMinuti}{' '} Minuti
                                        </Link>
                                    </div>

                                </td>
                                <td className="px-3 py-3 max-w-0 whitespace-nowrap text-sm font-medium text-gray-900">

                                    <div className="flex items-center space-x-3">
                                        <div
                                            className={'flex-shrink-0 w-2.5 h-2.5 rounded-full'}
                                            aria-hidden="true"
                                        />
                                        <Link href={`${link}/${item.id}?allievoId=${allievoId}${isoNow - item.inizioServizio > 0 ? '&readonly=true' : '&readonly=false'}`} className="truncate hover:text-gray-600">
                                            {(() => {
                                                try {
                                                    const esitoData = JSON.parse(item.esito || '{}');
                                                    if (esitoData.tipo) {
                                                        return esitoData.tipo;
                                                    }
                                                } catch (e) {
                                                    // Se non è JSON valido, mostra il valore originale
                                                }
                                                return item.esito || '-';
                                            })()}
                                        </Link>
                                    </div>

                                </td>
                                <td className="px-3 py-3 max-w-0 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {(() => {
                                        if (item.tariffa?.tipo?.tipo?.toLowerCase().includes('guida')) {
                                            try {
                                                const esitoData = JSON.parse(item.esito || '{}');
                                                if (esitoData.tipo === 'presente' && esitoData.valutazioni) {
                                                    const valutazioni = [
                                                        esitoData.valutazioni.teoria || 0,
                                                        esitoData.valutazioni.lento || 0,
                                                        esitoData.valutazioni.veloce || 0,
                                                        esitoData.valutazioni.guida || 0
                                                    ];
                                                    const fasiEffettuate = valutazioni.filter(v => v > 0);
                                                    const media = fasiEffettuate.length > 0 ? 
                                                        (fasiEffettuate.reduce((a, b) => a + b, 0) / fasiEffettuate.length).toFixed(1) : 0;
                                                    
                                                    return (
                                                        <div className="font-medium text-gray-900">
                                                            {media > 0 ? `${media}/5 (${fasiEffettuate.length}/4 fasi)` : 'Non valutato'}
                                                        </div>
                                                    );
                                                }
                                            } catch (e) {
                                                if (item.esito === 'presente') {
                                                    return <div className="text-gray-400">Presente (non valutato)</div>;
                                                }
                                            }
                                        }
                                        return <div className="text-gray-400">-</div>;
                                    })()}
                                </td>
                                <td className="px-3 py-3 max-w-0 whitespace-nowrap text-sm font-medium text-gray-900">

                                    <div className="flex items-center space-x-3">
                                        <div
                                            className={'flex-shrink-0 w-2.5 h-2.5 rounded-full'}
                                            aria-hidden="true"
                                        />
                                        <Link href={`${link}/${item.id}?allievoId=${allievoId}${isoNow - item.inizioServizio > 0 ? '&readonly=true' : '&readonly=false'}`} className="truncate hover:text-gray-600">
                                            {item.istruttore ? item.istruttore.profile.firstname + ' ' + item.istruttore.profile.lastname : ''}
                                        </Link>
                                    </div>

                                </td>
                                <td className="px-3 py-3 max-w-0 whitespace-nowrap text-sm font-medium text-gray-900">

                                    <div className="flex items-center space-x-3">
                                        <div
                                            className={'flex-shrink-0 w-2.5 h-2.5 rounded-full'}
                                            aria-hidden="true"
                                        />
                                        <Link href={`${link}/${item.id}?allievoId=${allievoId}${isoNow - item.inizioServizio > 0 ? '&readonly=true' : '&readonly=false'}`} className="truncate hover:text-gray-600">
                                            {item.insegnante ? item.insegnante.profile.firstname + ' ' + item.insegnante.profile.lastname : ''}
                                        </Link>
                                    </div>

                                </td>

                                <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
                                    <Link href={`${link}/${item.id}?allievoId=${allievoId}${isoNow - item.inizioServizio > 0 ? '&readonly=true' : '&readonly=false'}`} className="text-indigo-600 hover:text-indigo-900">
                                        <ChevronRightIcon
                                            className="ml-4 h-5 w-5 text-indigo-400 group-hover:text-gray-500"
                                            aria-hidden="true"
                                        />
                                    </Link>
                                </td>

                            </tr>
                            );
                        }) : (
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
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}