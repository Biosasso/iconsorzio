import React, { useState, useEffect, useRef } from 'react'
import Layout from '../../components/layout/layout';
import { getSession } from 'next-auth/react';
import useSWR from "swr";
import fetcher, { fetcherWithData } from '@/lib/fetch'
import Kalend,
{
    CalendarView,
    OnEventClickData,
    OnNewEventClickData,
    ShowMoreMonthData,
    OnPageChangeData,
    OnSelectViewData
} from 'kalend' // import component

import 'kalend/dist/styles/index.css'; // import styles
import AppuntamentoModal from '../../components/dashboard/appuntamentoModal';
import { DateTime } from 'datetime-next';

// Funzione per aggiungere icone per situazioni critiche
const getEventIcon = (item) => {
  // Parsing dell'esito se è JSON
  let esitoValue = item.esito || '';
  if (typeof esitoValue === 'string' && esitoValue.startsWith('{')) {
    try {
      const esitoData = JSON.parse(esitoValue);
      esitoValue = esitoData.tipo || esitoValue;
    } catch (e) {
      // Se non è JSON valido, usa il valore originale
    }
  }
  const esitoLower = esitoValue.toLowerCase().trim();
  const tipoServizio = item.tariffa?.tipo?.tipo || '';
  
  // Per gli ESAMI
  if (tipoServizio.toLowerCase().includes('esame')) {
    // Simbolo per esami assenti
    if (esitoLower.includes('assente')) {
      return '⚠️ ';
    }
  }
  
  // Per le GUIDE
  if (tipoServizio.toLowerCase().includes('guida')) {
    // Controllo se la guida è passata o futura
    const now = Math.floor(Date.now() / 1000); // Timestamp attuale in secondi
    const isPast = item.fineServizio < now; // La guida è finita
    
    // PUNTO INTERROGATIVO per guide effettuate e non valutate
    if (isPast && (!item.esito || item.esito === '')) {
      return '❓ '; // Punto interrogativo per guide effettuate e non valutate
    }
    
    // Simbolo per guide assenti normali
    if (esitoLower.includes('assente')) {
      return '⚠️ ';
    }
    
    // Simbolo per guide incomplete - USO VALORI ESATTI
    if (esitoLower === 'guida_incompleta') {
      return '⏸️ '; // Simbolo di pausa/interruzione per guide incomplete
    }
    
    // Simboli per guide annullate - USO VALORI ESATTI
    if (esitoLower === 'guida_annullata_1') {
      return '🌦️⚡ '; // Nuvola con pioggia + fulmine
    }
    if (esitoLower === 'guida_annullata_2') {
      return '🔧 '; // Guasto meccanico
    }
  }
  
  return ''; // Nessun simbolo per situazioni normali
};

const getEventColor = (item) => {
  // Uso item.tariffa.tipo.tipo per distinguere guide/esami
  const tipoServizio = item.tariffa?.tipo?.tipo || '';
  
  // Se è un esame, usa colori specifici per esiti
  if (tipoServizio.toLowerCase().includes('esame')) {
    // Rendo case-insensitive il confronto
    const esitoLower = (item.esito || '').toLowerCase();
    switch (esitoLower) {
      case 'idoneo':
        return '#059669'; // Verde smeraldo più intenso (migliore contrasto)
      case 'respinto':
        return '#DC2626'; // Rosso più scuro (migliore accessibilità)
      case 'assente':
        return '#374151'; // Grigio scuro (mantiene buon contrasto)
      case 'seleziona':
        return '#FCD34D'; // Giallo-arancione molto chiaro per esami in attesa
      default:
        return '#FCD34D'; // Giallo-arancione molto chiaro di default per esami
    }
  }
  
  // Se è una guida, usa colori specifici per esiti
  if (tipoServizio.toLowerCase().includes('guida')) {
    // Controllo se la guida è passata o futura
    const now = Math.floor(Date.now() / 1000); // Timestamp attuale in secondi
    const isPast = item.fineServizio < now; // La guida è finita
    
    // Se esito è vuoto o null
    if (!item.esito || item.esito === '') {
      if (isPast) {
        return '#6B7280'; // Grigio scuro per guide effettuate e non valutate
      } else {
        return '#93C5FD'; // Azzurro più chiaro per guide future in attesa
      }
    }
    
    // Se ha un esito specifico - Rendo case-insensitive e robusto
    // Parsing dell'esito se è JSON
    let esitoValue = item.esito || '';
    if (typeof esitoValue === 'string' && esitoValue.startsWith('{')) {
      try {
        const esitoData = JSON.parse(esitoValue);
        esitoValue = esitoData.tipo || esitoValue;
      } catch (e) {
        // Se non è JSON valido, usa il valore originale
      }
    }
    const esitoLower = esitoValue.toLowerCase().trim();
    
    // Check per guide presenti (varie forme)
    if (esitoLower.includes('presente')) {
      return '#3B82F6'; // Blu più chiaro per guide presenti
    }
    
    // Check per guide assenti (solo normali, grigio)
    if (esitoLower.includes('assente')) {
      return '#374151'; // Grigio scuro per guide assenti normali
    }
    
    // Check per guide incomplete - USO VALORI ESATTI
    if (esitoLower === 'guida_incompleta') {
      return '#D97706'; // Marrone chiaro per guide incomplete
    }
    
    // Check per guide annullate - USO VALORI ESATTI
    if (esitoLower === 'guida_annullata_1') {
      return '#6D28D9'; // Viola molto più intenso per maltempo (massima differenza dal blu)
    }
    if (esitoLower === 'guida_annullata_2') {
      return '#F97316'; // Arancione per guasto meccanico (con simbolo 🔧)
    }
    
    // Default
    return '#6B7280'; // Grigio default
  }
  
  // Default per altri tipi di servizio
  return '#6B7280'; // Grigio default
};

export default function Dashboard({ }) {

    DateTime.setDefaultLocale('it-IT');

    const [events, setEvents] = useState([]);
    const [dataRange, setDataRange] = useState({})
    const [open, setOpen] = useState(false)
    const [data, setData] = useState();
    const [ids, setIds] = useState();
    const [selectedFilter, setSelectedFilter] = useState('mostra-tutti')
    const [selectedWorkplace, setSelectedWorkplace] = useState('')
    const [selectedIstruttore, setSelectedIstruttore] = useState('')
    const [selectedInsegnante, setSelectedInsegnante] = useState('')
    
    // Stato per filtri salvati in sessione
    const [savedFilters, setSavedFilters] = useState({
        selectedFilter: 'mostra-tutti',
        selectedWorkplace: '',
        selectedIstruttore: '',
        selectedInsegnante: ''
    })
    const [filtersSaved, setFiltersSaved] = useState(false)

    // Funzioni per salvare e caricare filtri in sessionStorage
    const saveFilters = () => {
        const currentFilters = {
            selectedFilter: selectedFilter,
            selectedWorkplace: selectedWorkplace,
            selectedIstruttore: selectedIstruttore,
            selectedInsegnante: selectedInsegnante
        }
        
        // Salva in sessionStorage per persistenza durante la sessione
        if (typeof window !== 'undefined') {
            try {
                sessionStorage.setItem('dashboard-savedFilters', JSON.stringify(currentFilters))
                setSavedFilters(currentFilters)
                setFiltersSaved(true)
                console.log('✅ Filtri salvati in sessionStorage:', currentFilters)
            } catch (error) {
                console.warn('Errore nel salvare filtri in sessionStorage:', error)
            }
        }
    }

    const resetFilters = () => {
        // Reset filtri attuali
        setSelectedFilter('mostra-tutti')
        setSelectedWorkplace('')
        setSelectedIstruttore('')
        setSelectedInsegnante('')
        
        // Reset filtri salvati
        setSavedFilters({
            selectedFilter: 'mostra-tutti',
            selectedWorkplace: '',
            selectedIstruttore: '',
            selectedInsegnante: ''
        })
        setFiltersSaved(false)
        
        // Rimuovi da sessionStorage
        if (typeof window !== 'undefined') {
            try {
                sessionStorage.removeItem('dashboard-savedFilters')
                console.log('🔄 Filtri resettati e rimossi da sessionStorage')
            } catch (error) {
                console.warn('Errore nel rimuovere filtri da sessionStorage:', error)
            }
        }
    }

    // Funzioni per gestire localStorage in modo sicuro
    const validateFilterData = (data) => {
        const validFilters = ['mostra-tutti', 'workplace', 'istruttore', 'insegnante'];
        return validFilters.includes(data);
    };

    const getSavedFilter = () => {
        if (typeof window === 'undefined') {
            return 'mostra-tutti';
        }
        
        try {
            const saved = localStorage.getItem('dashboard-selectedFilter');
            return validateFilterData(saved) ? saved : 'mostra-tutti';
        } catch (error) {
            console.warn('Errore nel leggere localStorage per selectedFilter:', error);
            return 'mostra-tutti';
        }
    };

    const getSavedWorkplace = () => {
        if (typeof window === 'undefined') {
            return '';
        }
        
        try {
            const saved = localStorage.getItem('dashboard-selectedWorkplace');
            return saved || '';
        } catch (error) {
            console.warn('Errore nel leggere localStorage per selectedWorkplace:', error);
            return '';
        }
    };

    const getSavedIstruttore = () => {
        if (typeof window === 'undefined') {
            return '';
        }
        
        try {
            const saved = localStorage.getItem('dashboard-selectedIstruttore');
            return saved || '';
        } catch (error) {
            console.warn('Errore nel leggere localStorage per selectedIstruttore:', error);
            return '';
        }
    };

    const getSavedInsegnante = () => {
        if (typeof window === 'undefined') {
            return '';
        }
        
        try {
            const saved = localStorage.getItem('dashboard-selectedInsegnante');
            return saved || '';
        } catch (error) {
            console.warn('Errore nel leggere localStorage per selectedInsegnante:', error);
            return '';
        }
    };

    // DISABILITATO: Caricamento automatico da localStorage per evitare conflitti con sessionStorage
    // I filtri vengono ora gestiti solo tramite sessionStorage e pulsanti manuali
    /*
    useEffect(() => {
        if (typeof window !== 'undefined') {
            console.log('DEBUG: Caricando filtri salvati...');
            const savedFilter = getSavedFilter();
            const savedWorkplace = getSavedWorkplace();
            const savedIstruttore = getSavedIstruttore();
            const savedInsegnante = getSavedInsegnante();
            
            console.log('DEBUG: Filtri salvati:', {
                selectedFilter: savedFilter,
                selectedWorkplace: savedWorkplace,
                selectedIstruttore: savedIstruttore,
                selectedInsegnante: savedInsegnante
            });
            
            setSelectedFilter(savedFilter);
            setSelectedWorkplace(savedWorkplace);
            setSelectedIstruttore(savedIstruttore);
            setSelectedInsegnante(savedInsegnante);
        }
    }, []);
    */

    // Carica automaticamente i filtri salvati da sessionStorage al caricamento della pagina
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = sessionStorage.getItem('dashboard-savedFilters')
            if (saved) {
                try {
                    const parsedFilters = JSON.parse(saved)
                    setSelectedFilter(parsedFilters.selectedFilter)
                    setSelectedWorkplace(parsedFilters.selectedWorkplace)
                    setSelectedIstruttore(parsedFilters.selectedIstruttore)
                    setSelectedInsegnante(parsedFilters.selectedInsegnante)
                    setSavedFilters(parsedFilters)
                    setFiltersSaved(true)
                    console.log('🔄 Filtri caricati automaticamente da sessionStorage:', parsedFilters)
                } catch (error) {
                    console.warn('Errore nel caricare filtri da sessionStorage:', error)
                }
            }
        }
    }, []);

    // Carica i filtri salvati ogni volta che la pagina si carica (anche al ritorno da altre pagine)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = sessionStorage.getItem('dashboard-savedFilters')
            if (saved && filtersSaved) {
                try {
                    const parsedFilters = JSON.parse(saved)
                    // Solo se i filtri attuali sono diversi da quelli salvati
                    if (selectedIstruttore !== parsedFilters.selectedIstruttore) {
                        setSelectedFilter(parsedFilters.selectedFilter)
                        setSelectedWorkplace(parsedFilters.selectedWorkplace)
                        setSelectedIstruttore(parsedFilters.selectedIstruttore)
                        setSelectedInsegnante(parsedFilters.selectedInsegnante)
                        console.log('🔄 Filtri ripristinati da sessionStorage:', parsedFilters)
                    }
                } catch (error) {
                    console.warn('Errore nel ripristinare filtri da sessionStorage:', error)
                }
            }
        }
    }, [filtersSaved, selectedIstruttore]);

    // DISABILITATO: Salvataggio automatico in localStorage per evitare conflitti con sessionStorage
    // I filtri vengono ora gestiti solo tramite sessionStorage e pulsanti manuali
    /*
    useEffect(() => {
        if (typeof window !== 'undefined') {
            console.log('DEBUG: Salvataggio selectedFilter:', selectedFilter);
            try {
                localStorage.setItem('dashboard-selectedFilter', selectedFilter);
            } catch (error) {
                console.warn('Errore nel salvare selectedFilter in localStorage:', error);
            }
        }
    }, [selectedFilter]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            console.log('DEBUG: Salvataggio selectedWorkplace:', selectedWorkplace);
            try {
                localStorage.setItem('dashboard-selectedWorkplace', selectedWorkplace);
            } catch (error) {
                console.warn('Errore nel salvare selectedWorkplace in localStorage:', error);
            }
        }
    }, [selectedWorkplace]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            console.log('DEBUG: Salvataggio selectedIstruttore:', selectedIstruttore);
            try {
                localStorage.setItem('dashboard-selectedIstruttore', selectedIstruttore);
            } catch (error) {
                console.warn('Errore nel salvare selectedIstruttore in localStorage:', error);
            }
        }
    }, [selectedIstruttore]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            console.log('DEBUG: Salvataggio selectedInsegnante:', selectedInsegnante);
            try {
                localStorage.setItem('dashboard-selectedInsegnante', selectedInsegnante);
            } catch (error) {
                console.warn('Errore nel salvare selectedInsegnante in localStorage:', error);
            }
        }
    }, [selectedInsegnante]);
    */

    const { data: companyId } = useSWR('/api/admin/company/isActive', fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    }
    )

    const { data: disponibilitaCalendar } = useSWR(companyId && dataRange ? {
        url: '/api/dashboard/getEventsForCalendar',
        data: {
            companyId: companyId.isActive,
            dataRange: dataRange,
            selectedFilter: selectedFilter,
            selectedWorkplace: selectedWorkplace,
            selectedIstruttore: selectedIstruttore,
            selectedInsegnante: selectedInsegnante,
        }
    } : null, fetcherWithData);

    const { data: filteredListForSelectedBox } = useSWR(companyId ? {
        url: '/api/dashboard/getFilteredList',
        data: {
            companyId: companyId.isActive,
            selectedFilter: selectedFilter,
            selectedWorkplace: selectedWorkplace,
            selectedIstruttore: selectedIstruttore,
            selectedInsegnante: selectedInsegnante,
        }
    } : null, fetcherWithData);

    // DISABILITATO: Inizializzazione automatica per evitare conflitti con sessionStorage
    // I filtri vengono ora gestiti solo tramite sessionStorage e pulsanti manuali
    /*
    useEffect(() => {
        //inizializzo al primo caricamento SOLO se non ci sono filtri salvati (solo lato client)
        if (typeof window !== 'undefined') {
            // Controlla se ci sono filtri salvati in localStorage
            const hasSavedFilters = localStorage.getItem('dashboard-selectedFilter') !== null;
            
            if (!hasSavedFilters) {
                if (filteredListForSelectedBox && filteredListForSelectedBox.length > 0 && selectedFilter === 'workplace' && selectedWorkplace === '') {
                    setSelectedWorkplace(filteredListForSelectedBox[0].id)
                }
                if (filteredListForSelectedBox && filteredListForSelectedBox.length > 0 && selectedFilter === 'istruttore' && selectedIstruttore === '') {
                    setSelectedIstruttore(filteredListForSelectedBox[0].user.profile.id)
                }
                if (filteredListForSelectedBox && filteredListForSelectedBox.length > 0 && selectedFilter === 'insegnante' && selectedInsegnante === '') {
                    setSelectedInsegnante(filteredListForSelectedBox[0].user.profile.id)
                }
            }
        }

    }, [filteredListForSelectedBox])
    */

    useEffect(() => {
        if (disponibilitaCalendar) {
            let filteredArray = [];
            if (selectedFilter === 'mostra-tutti') {
                filteredArray = disponibilitaCalendar
                // NON resettare i filtri se sono stati salvati in sessionStorage
                if (!filtersSaved) {
                    setSelectedWorkplace('');
                    setSelectedInsegnante('')
                    setSelectedIstruttore('')
                }
            }
            else if (selectedFilter === 'workplace' && selectedWorkplace !== '') {
                filteredArray = disponibilitaCalendar.filter(el => el.veicolo?.workplaceId === selectedWorkplace)
                // NON resettare i filtri se sono stati salvati in sessionStorage
                if (!filtersSaved) {
                    setSelectedInsegnante('')
                    setSelectedIstruttore('')
                }
            }
            else if (selectedFilter === 'insegnante' && selectedInsegnante) {
                filteredArray = disponibilitaCalendar.filter(el => {
                    // Controllo sicuro: verifica che istruttore e profile esistano
                    if (!el.istruttore || !el.istruttore.profile || !el.istruttore.profile.id) return false;
                    // Converti entrambi a stringhe per confronto sicuro
                    return String(el.istruttore.profile.id) === String(selectedInsegnante);
                })
                // NON resettare i filtri se sono stati salvati in sessionStorage
                if (!filtersSaved) {
                    setSelectedWorkplace('');
                    setSelectedIstruttore('')
                }
            }
            else if (selectedFilter === 'istruttore' && selectedIstruttore) {
                filteredArray = disponibilitaCalendar.filter(el => {
                    // Controllo sicuro: verifica che istruttore e profile esistano
                    if (!el.istruttore || !el.istruttore.profile || !el.istruttore.profile.id) return false;
                    // Converti entrambi a stringhe per confronto sicuro (risolve problema string vs number)
                    return String(el.istruttore.profile.id) === String(selectedIstruttore);
                })
                // NON resettare i filtri se sono stati salvati in sessionStorage
                if (!filtersSaved) {
                    setSelectedWorkplace('');
                    setSelectedInsegnante('')
                }
            }

            const arr = [];
            filteredArray && filteredArray.length > 0 && filteredArray.map(item => {
                arr.push({
                    id: item.id,
                    startAt: new Date(item.inizioServizio * 1000).toISOString(),
                    endAt: new Date(item.fineServizio * 1000).toISOString(),
                    timezoneStartAt: 'Europe/Rome', // optional
                    summary: item.AllievoIstruzione.allievo.cognome === 'Amdinistrator' ? 'BLOCCO ESAME' : `${getEventIcon(item)}${item.tariffa.tipo.tipo_cod.includes('esame') ? 'Esame' : item.tariffa.tipo.tipo} ${item.AllievoIstruzione.allievo.cognome} ${item.AllievoIstruzione.allievo.nome} ${item.AllievoIstruzione.allievo.tel} - ${item.AllievoIstruzione.allievo?.autoscuola?.denominazione} - Istruttore: ${item.istruttore?.profile?.firstname} ${item.istruttore?.profile?.lastname} - Veicolo: ${item.veicolo?.modello.toUpperCase()} Targa: ${item.veicolo?.targa.toUpperCase()}`,
                    color: getEventColor(item),
                    calendarID: 'work',
                    originalData: item
                })
            });
            setEvents(arr);
        }

    }, [disponibilitaCalendar, selectedFilter, selectedWorkplace, selectedIstruttore, selectedInsegnante])

    const onEventClick = (e) => {

        if (e.summary === "BLOCCO ESAME") {
            return
        }

        setIds({
            servizioId: e.originalData.id,
            allievoId: e.originalData.AllievoIstruzione.allievo.id,
        })
        setData({
            Allievo: e.originalData.AllievoIstruzione.allievo?.nome + ' ' + e.originalData.AllievoIstruzione.allievo?.cognome,
            Telefono_allievo: e.originalData.AllievoIstruzione.allievo?.tel,
            Email_allievo: e.originalData.AllievoIstruzione.allievo.email ? e.originalData.AllievoIstruzione.allievo.email.toLowerCase() : '',
            Tipo_Servizio: e.originalData.tariffa?.tipo?.tipo,
            Durata: e.originalData.durataMinuti + ' Minuti',
            // Data_e_ora_di_inizio: new DateTime(new Date(e.originalData.inizioServizio * 1000)).addHour(1).getString('DD/MM/YYYY HH:mm'),
            Data_e_ora_di_inizio: new Date(e.originalData.inizioServizio * 1000).toLocaleDateString('it-IT') + ' ' + new Date(e.originalData.inizioServizio * 1000).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),
            Nome_veicolo: e.originalData.veicolo?.nome,
            Marca_e_modello: e.originalData.veicolo?.modello,
            Targa: e.originalData.veicolo.targa ? e.originalData.veicolo?.targa.toUpperCase() : '',
            Istruttore: e.originalData.istruttore.profile.firstname + ' ' + e.originalData.istruttore.profile.lastname,
            Telefono_istruttore: e.originalData.istruttore.profile.phone
        })
        setOpen(true)

    }

    const Filter1 = ({ selectedFilter, setSelectedFilter, events }) => {
        return (
            <>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Filtra per
                </label>
                <select
                    id="location"
                    name="location"
                    className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    defaultValue={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                >
                    <option value={'mostra-tutti'}>Mostra tutti</option>
                    <option value={'workplace'}>Workplace</option>
                    <option value={'insegnante'}>Insegnante</option>
                    <option value={'istruttore'}>Istruttore</option>
                </select>
            </>
        )
    }
    const Filter2 = ({ selectedFilter, filteredListForSelectedBox, events }) => {
        return (
            <>
                {selectedFilter === 'workplace' &&
                    <div>
                        <label htmlFor="workplace" className="block text-sm font-medium text-gray-700">
                            Seleziona
                        </label>
                        <select
                            id="workplace"
                            name="workplace"
                            defaultValue={selectedWorkplace}
                            onChange={(e) => setSelectedWorkplace(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm capitalize"
                        >
                            {filteredListForSelectedBox && filteredListForSelectedBox.length > 0 &&
                                filteredListForSelectedBox.map((el) =>
                                    <option key={el.nome} value={el.id}>{el.nome}</option>
                                )
                            }
                        </select>
                    </div>
                }
                {selectedFilter === 'istruttore' &&
                    <div>
                        <label htmlFor="istruttore" className="block text-sm font-medium text-gray-700">
                            Seleziona
                        </label>
                        <select
                            id="istruttore"
                            name="istruttore"
                            value={selectedIstruttore || ''}
                            onChange={(e) => setSelectedIstruttore(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm capitalize"
                        >
                            <option value="">Seleziona istruttore</option>
                            {filteredListForSelectedBox && filteredListForSelectedBox.length > 0 &&
                                filteredListForSelectedBox.map((el) =>
                                    <option key={el.user.profile.id} value={String(el.user.profile.id)}>{el.user.profile.lastname} {el.user.profile.firstname}</option>
                                )
                            }
                        </select>
                    </div>
                }
                {selectedFilter === 'insegnante' &&
                    <div>
                        <label htmlFor="insegnante" className="block text-sm font-medium text-gray-700">
                            Seleziona
                        </label>
                        <select
                            id="insegnante"
                            name="insegnante"
                            defaultValue={selectedInsegnante}
                            onChange={(e) => setSelectedInsegnante(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm capitalize"
                        >
                            {filteredListForSelectedBox && filteredListForSelectedBox.length > 0 &&
                                filteredListForSelectedBox.map((el) =>
                                    <option key={el.user.profile.id} value={el.user.profile.id}>{el.user.profile.lastname} {el.user.profile.firstname}</option>
                                )
                            }
                        </select>
                    </div>
                }
            </>
        )
    }
    const Button1 = () => {
        return (
            <div className="flex space-x-2">
                <button
                    onClick={saveFilters}
                    className="order-0 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    💾 Salva Filtri
                </button>
                <button
                    onClick={resetFilters}
                    className="order-0 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    🔄 Reset Filtri
                </button>
                <button
                    onClick={() => window.print()}
                    className="order-0 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    🖨️ Stampa
                </button>
            </div>
        )
    }

    const onPageChange = (OnPageChangeData) => {
        setDataRange(OnPageChangeData)
    }
    const onSelectView = (OnSelectViewData) => {
        // console.log(OnSelectViewData)
    }
    const showMoreMonth = (ShowMoreMonthData) => {
        // console.log(ShowMoreMonthData)
    }

    return (

        <Layout
            page="dashboard"
            createLink={false}
            title="Dashboard - Calendario appuntamenti"
            Button1={Button1}
            Filter1={Filter1}
            Filter2={Filter2}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            filteredListForSelectedBox={filteredListForSelectedBox}
            events={events}
        >
            <style jsx>{`
                        @media print {
                            @page {
                                size: A3 portrait;
                            }
                        }
                    `}</style>
            <div className='bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 h-full block'>
                <div className='h-full'>
                    <Kalend
                        onEventDragFinish={null}
                        onEventClick={onEventClick}
                        // onNewEventClick={() => setOpen(true)}
                        events={events}
                        initialDate={new Date().toISOString()}
                        hourHeight={60}
                        initialView={CalendarView.MONTH}
                        timeFormat={'24'}
                        weekDayStart={'Monday'}
                        calendarIDsHidden={['work']}
                        timezone={'Europe/Rome'}
                        showTimeLine={true}
                        focusHour={8}
                        autoScroll={true}
                        isDark={false}
                        disabledDragging={true}
                        // isNewEventOpen={false}
                        language={'it'}
                        onPageChange={onPageChange}
                        onSelectView={onSelectView}
                        showMoreMonth={showMoreMonth}
                    // OnNewEventClickData={() => { return false }}
                    />
                </div>
                <AppuntamentoModal open={open} setOpen={setOpen} data={data} ids={ids} />
            </div>
        </Layout>
    )
}


export async function getServerSideProps(context) {

    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }

    return {
        props: {

        }
    }
}
