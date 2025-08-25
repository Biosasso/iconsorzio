import { ChevronRightIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import { DateTime } from 'datetime-next';
import { useState, useEffect } from 'react';
import ColumnSelector from './columnSelector';

// Funzione utility per calcolare il colore della scadenza
const getScadenzaColor = (scadenzaDate) => {
    if (!scadenzaDate) return 'text-gray-500 bg-gray-50'; // Nessuna data
    
    const oggi = new Date();
    const scadenza = new Date(scadenzaDate);
    const giorniRimanenti = Math.ceil((scadenza - oggi) / (1000 * 60 * 60 * 24));
    
    if (giorniRimanenti <= 0) return 'text-red-800 font-semibold bg-red-100'; // Scaduta
    if (giorniRimanenti <= 30) return 'text-red-700 font-medium bg-red-50'; // ≤ 30 giorni
    if (giorniRimanenti <= 90) return 'text-orange-600 font-medium bg-orange-50'; // ≤ 90 giorni
    if (giorniRimanenti <= 180) return 'text-yellow-700 font-medium bg-yellow-50'; // ≤ 180 giorni
    return 'text-green-700 bg-green-50'; // > 180 giorni
};

// Funzione utility per normalizzare la formattazione dei nomi
const formatName = (cognome, nome) => {
    if (!cognome || !nome) return '';
    
    // Converte in minuscolo e poi capitalizza solo la prima lettera
    const formatWord = (word) => {
        if (!word) return '';
        return word.toLowerCase().charAt(0).toUpperCase() + word.toLowerCase().slice(1);
    };
    
    return `${formatWord(cognome)} ${formatWord(nome)}`;
};

export default function Table({ tableData, setTableData, selectedRow, notModified, sorting, setSorting }) {

    const link = '/allievi/edit';
    
    // State per colonne visibili
    const [visibleColumns, setVisibleColumns] = useState(() => {
        // Carica preferenze da localStorage se disponibili
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('allievi-table-columns');
            if (saved) {
                try {
                    return JSON.parse(saved);
                } catch (e) {
                    console.warn('Errore nel parsing delle colonne salvate:', e);
                }
            }
        }
        // Default columns se non ci sono preferenze salvate - TUTTE LE COLONNE VISIBILI
        return ['contatore', 'nome', 'autoscuola', 'patente', 'scadenzaFr', 'ultimaGuida', 'prossimaGuida'];
    });

    // Funzioni per gestire colonne
    const handleColumnToggle = (columnKey) => {
        setVisibleColumns(prev => {
            const newColumns = prev.includes(columnKey) 
                ? prev.filter(col => col !== columnKey)
                : [...prev, columnKey];
            
            // Salva automaticamente in localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('allievi-table-columns', JSON.stringify(newColumns));
            }
            
            return newColumns;
        });
    };

    const handleResetColumns = () => {
        const defaultColumns = ['contatore', 'nome', 'autoscuola', 'patente', 'scadenzaFr', 'ultimaGuida', 'prossimaGuida'];
        setVisibleColumns(defaultColumns);
        
        // Salva le colonne default in localStorage
        if (typeof window !== 'undefined') {
            localStorage.setItem('allievi-table-columns', JSON.stringify(defaultColumns));
        }
    };

    // Sincronizza con localStorage quando cambia la finestra
    useEffect(() => {
        const handleStorageChange = () => {
            const saved = localStorage.getItem('allievi-table-columns');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    setVisibleColumns(parsed);
                } catch (e) {
                    console.warn('Errore nel parsing delle colonne salvate:', e);
                }
            }
        };

        // Ascolta cambiamenti in localStorage (per sincronizzazione tra tab)
        window.addEventListener('storage', handleStorageChange);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

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
                                                                         <span className="font-medium  text-sm leading-6">
                                         {formatName(item.cognome, item.nome)}
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
                                 {/* Column Selector */}
                 <div className="mb-4 flex justify-end mr-12">
                                         <ColumnSelector 
                         columns={[
                             { key: 'contatore', label: 'N.' },
                             { key: 'nome', label: 'COGNOME E NOME' },
                             { key: 'autoscuola', label: 'AUTOSCUOLA' },
                             { key: 'patente', label: 'PATENTE' },
                             { key: 'scadenzaFr', label: 'SCADENZA' },
                             { key: 'ultimaGuida', label: 'ULTIMA GUIDA' },
                             { key: 'prossimaGuida', label: 'PROSSIMA GUIDA' },
                 
                         ]}
                         visibleColumns={visibleColumns}
                         onColumnToggle={handleColumnToggle}
                         onResetColumns={handleResetColumns}
                         onSave={() => {
                             // Le preferenze sono già salvate automaticamente in localStorage
                             // Questo pulsante serve solo per chiudere il menu
                             console.log('Preferenze colonne salvate automaticamente');
                         }}
                     />
                </div>
                <div className="align-middle inline-block min-w-full border-b border-gray-200">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-t border-gray-200">
                                                                 {visibleColumns.includes('contatore') && (
                                     <th className="px-3 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                                         <span className="lg:pl-2">N.</span>
                                     </th>
                                 )}
                                {visibleColumns.includes('nome') && (
                                    <th scope="col" className="px-3 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                                        <button onClick={() => changeSorting('cognome')} className="group inline-flex uppercase">
                                            <span className="lg:pl-2">Cognome e nome</span>
                                            <span className="ml-1 flex-none rounded bg-gray-100 text-gray-900 group-hover:bg-gray-200">
                                                <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
                                            </span>
                                        </button>
                                    </th>
                                )}
                                {visibleColumns.includes('autoscuola') && (
                                    <th className="px-3 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                                        <button onClick={() => changeSorting('autoscuola')} className="group inline-flex uppercase">
                                            <span className="lg:pl-2">Autoscuola</span>
                                            <span className="ml-1 flex-none rounded bg-gray-100 text-gray-900 group-hover:bg-gray-200">
                                                <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
                                            </span>
                                        </button>
                                    </th>
                                )}
                                {visibleColumns.includes('patente') && (
                                    <th className="px-3 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                                        <button onClick={() => changeSorting('patente')} className="group inline-flex uppercase">
                                            <span className="lg:pl-2">Patente</span>
                                            <span className="ml-1 flex-none rounded bg-gray-100 text-gray-900 group-hover:bg-gray-200">
                                                <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
                                            </span>
                                        </button>
                                    </th>
                                )}
                                {visibleColumns.includes('scadenzaFr') && (
                                    <th className="px-3 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                                        <button onClick={() => changeSorting('foglioRosa')} className="group inline-flex uppercase">
                                            <span className="lg:pl-2">Scadenza</span>
                                            <span className="ml-1 flex-none rounded bg-gray-100 text-gray-900 group-hover:bg-gray-200">
                                                <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
                                            </span>
                                        </button>
                                    </th>
                                )}
                                                                 {visibleColumns.includes('ultimaGuida') && (
                                     <th className="px-3 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-36">
                                         <span className="lg:pl-2">Ultima Guida</span>
                                     </th>
                                 )}
                                 {visibleColumns.includes('prossimaGuida') && (
                                     <th className="px-3 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-36">
                                         <span className="lg:pl-2">Prossima Guida</span>
                                     </th>
                                 )}
                                 {visibleColumns.includes('dataEsame') && (
                                     <th className="px-3 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                                         <button onClick={() => changeSorting('esame')} className="group inline-flex uppercase">
                                             <span className="lg:pl-2">Data esame</span>
                                             <span className="ml-1 flex-none rounded bg-gray-100 text-gray-900 group-hover:bg-gray-200">
                                                 <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
                                             </span>
                                         </button>
                                     </th>
                                 )}
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

                                                                         {visibleColumns.includes('contatore') && (
                                         <td className={`px-3 py-3 max-w-0 whitespace-nowrap text-sm font-medium ${getScadenzaColor(item.AllievoIstruzioni[0]?.foglioRosaScadenza)} w-16`}>
                                             <div className="flex items-center space-x-3">
                                                 <div
                                                     className={'flex-shrink-0 w-2.5 h-2.5 rounded-full'}
                                                     aria-hidden="true"
                                                 />
                                                 <span className="text-gray-900 font-medium">
                                                     {/* Contatore progressivo - index + 1 per iniziare da 1 */}
                                                     {tableData.indexOf(item) + 1}
                                                 </span>
                                             </div>
                                         </td>
                                     )}
                                    {visibleColumns.includes('nome') && (
                                        <td className={`px-3 py-3 max-w-0 whitespace-nowrap text-sm font-medium ${getScadenzaColor(item.AllievoIstruzioni[0]?.foglioRosaScadenza)} w-48`}>

                                            <div className="flex items-center space-x-3 ">
                                                <div
                                                    className={'flex-shrink-0 w-2.5 h-2.5 rounded-full'}
                                                    aria-hidden="true"
                                                />
                                                <Link href={`${link}/${item.id}`} className="text-gray-900 hover:text-gray-600">
                                                    {formatName(item.cognome, item.nome)}
                                                </Link>
                                            </div>

                                        </td>
                                    )}
                                    {visibleColumns.includes('autoscuola') && (
                                        <td className={`px-3 py-3 max-w-0 whitespace-nowrap text-sm font-medium ${getScadenzaColor(item.AllievoIstruzioni[0]?.foglioRosaScadenza)} w-40`}>

                                            <div className="flex items-center space-x-3 truncate ">
                                                <div
                                                    className={'flex-shrink-0 w-2.5 h-2.5 rounded-full'}
                                                    aria-hidden="true"
                                                />
                                                <Link href={`${link}/${item.id}`} className="text-gray-900 hover:text-gray-600">
                                                    {item.autoscuola?.denominazione.replace('Autoscuola', '')}
                                                </Link>
                                            </div>

                                        </td>
                                    )}
                                    {visibleColumns.includes('patente') && (
                                        <td className={`px-3 py-3 max-w-0 whitespace-nowrap text-sm font-medium ${getScadenzaColor(item.AllievoIstruzioni[0]?.foglioRosaScadenza)} w-32`}>

                                            <div className="flex items-center space-x-0">
                                                <div
                                                    className={'flex-shrink-0 w-2.5 h-2.5 rounded-full'}
                                                    aria-hidden="true"
                                                />
                                                <Link href={`${link}/${item.id}`} className="text-gray-600 hover:text-gray-900">
                                                    {item.AllievoIstruzioni[0]?.patente?.nome}
                                                </Link>
                                            </div>

                                        </td>
                                    )}
                                    {visibleColumns.includes('scadenzaFr') && (
                                        <td className={`px-3 py-3 max-w-0 whitespace-nowrap text-sm font-medium ${getScadenzaColor(item.AllievoIstruzioni[0]?.foglioRosaScadenza)} w-32`}>

                                            <div className="flex items-center space-x-3">
                                                <div
                                                    className={'flex-shrink-0 w-2.5 h-2.5 rounded-full'}
                                                    aria-hidden="true"
                                                />
                                                <Link 
                                                    href={`${link}/${item.id}`} 
                                                    className="hover:opacity-80 capitalize"
                                                >
                                                    {item.AllievoIstruzioni[0]?.foglioRosaScadenza ? new DateTime(item.AllievoIstruzioni[0]?.foglioRosaScadenza).getString('DD/MM/YYYY') : ''}
                                                </Link>
                                            </div>

                                        </td>
                                    )}
                                                                         {visibleColumns.includes('ultimaGuida') && (
                                        <td className="px-3 py-3 max-w-0 whitespace-nowrap text-sm font-medium text-gray-900 w-36">
                                             <div className="flex items-center space-x-3">
                                                 <div
                                                     className={'flex-shrink-0 w-2.5 h-2.5 rounded-full'}
                                                     aria-hidden="true"
                                                 />
                                                <Link href={`${link}/${item.id}`} className="text-gray-900 hover:text-gray-600">
                                                    {(() => {
                                                        const guide = item.AllievoIstruzioni[0]?.AllievoServizi;
                                                        
                                                        if (guide && guide.length > 0) {
                                                            // Trova l'ultima guida completata (passata)
                                                            const ultimaGuida = guide
                                                                .filter(g => 
                                                                    g.fineServizio && 
                                                                    g.esito && 
                                                                    !g.esito.toLowerCase().includes('annullata') &&
                                                                    !g.esito.toLowerCase().includes('annullato')
                                                                )
                                                                .sort((a, b) => {
                                                                    // Converti timestamp in Date per il confronto
                                                                    const dateA = new Date(parseInt(a.fineServizio) * 1000);
                                                                    const dateB = new Date(parseInt(b.fineServizio) * 1000);
                                                                    return dateB - dateA; // Ordine decrescente (più recente prima)
                                                                })[0];
                                                            
                                                            if (ultimaGuida && ultimaGuida.fineServizio) {
                                                                try {
                                                                    // Converti timestamp Unix in Date
                                                                    const timestamp = parseInt(ultimaGuida.fineServizio);
                                                                    const data = new Date(timestamp * 1000);
                                                                    
                                                                    if (!isNaN(data.getTime())) {
                                                                        return new DateTime(data).getString('DD/MM/YYYY');
                                                                    }
                                                                } catch (error) {
                                                                    console.error('Errore parsing data ultima guida:', error);
                                                                }
                                                            }
                                                        }
                                                        return '-';
                                                    })()}
                                                </Link>
                                             </div>
                                         </td>
                                     )}
                                     {visibleColumns.includes('prossimaGuida') && (
                                        <td className="px-3 py-3 max-w-0 whitespace-nowrap text-sm font-medium text-gray-900 w-36">
                                             <div className="flex items-center space-x-3">
                                                 <div
                                                     className={'flex-shrink-0 w-2.5 h-2.5 rounded-full'}
                                                     aria-hidden="true"
                                                 />
                                                <Link href={`${link}/${item.id}`} className="text-gray-900 hover:text-gray-600">
                                                    {(() => {
                                                        const guide = item.AllievoIstruzioni[0]?.AllievoServizi;
                                                        if (guide && guide.length > 0) {
                                                            // Trova la prossima guida programmata (futura e non annullata)
                                                            const oggi = new Date();
                                                            const prossimaGuida = guide
                                                                .filter(g => 
                                                                    g.inizioServizio &&
                                                                    !g.esito?.toLowerCase().includes('annullata') &&
                                                                    !g.esito?.toLowerCase().includes('annullato')
                                                                )
                                                                .sort((a, b) => {
                                                                    // Converti timestamp in Date per il confronto
                                                                    const dateA = new Date(parseInt(a.inizioServizio) * 1000);
                                                                    const dateB = new Date(parseInt(b.inizioServizio) * 1000);
                                                                    return dateA - dateB; // Ordine crescente (più vicina prima)
                                                                })
                                                                .find(g => {
                                                                    try {
                                                                        const data = new Date(parseInt(g.inizioServizio) * 1000);
                                                                        return !isNaN(data.getTime()) && data > oggi;
                                                                    } catch (error) {
                                                                        return false;
                                                                    }
                                                                });
                                                            
                                                            if (prossimaGuida && prossimaGuida.inizioServizio) {
                                                                try {
                                                                    // Converti timestamp Unix in Date
                                                                    const timestamp = parseInt(prossimaGuida.inizioServizio);
                                                                    const data = new Date(timestamp * 1000);
                                                                    
                                                                    if (!isNaN(data.getTime())) {
                                                                        return new DateTime(data).getString('DD/MM/YYYY');
                                                                    }
                                                                } catch (error) {
                                                                    console.error('Errore parsing data prossima guida:', error);
                                                                }
                                                            }
                                                        }
                                                        return '-';
                                                    })()}
                                                 </Link>
                                             </div>
                                         </td>
                                     )}

                                    

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