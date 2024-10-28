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

export default function Dashboard({ }) {

    DateTime.setDefaultLocale('it-IT');

    const [events, setEvents] = useState([]);
    const [dataRange, setDataRange] = useState({})
    const [open, setOpen] = useState(false)
    const [data, setData] = useState();
    const [ids, setIds] = useState();
    const [selectedFilter, setSelectedFilter] = useState('mostra-tutti')
    const [selectedWorkplace, setSelectedWorkplace] = useState('')
    const [selectedIstruttore, setSelectedIstruttore] = useState()
    const [selectedInsegnante, setSelectedInsegnante] = useState()

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

    useEffect(() => {
        //inizializzo al primo caricamento
        if (filteredListForSelectedBox && filteredListForSelectedBox.length > 0 && selectedFilter === 'workplace' && selectedWorkplace === '') {
            setSelectedWorkplace(filteredListForSelectedBox[0].id)
        }
        if (filteredListForSelectedBox && filteredListForSelectedBox.length > 0 && selectedFilter === 'istruttore' && selectedIstruttore === '') {
            setSelectedIstruttore(filteredListForSelectedBox[0].user.profile.id)
        }
        if (filteredListForSelectedBox && filteredListForSelectedBox.length > 0 && selectedFilter === 'insegnante' && selectedInsegnante === '') {
            setSelectedInsegnante(filteredListForSelectedBox[0].user.profile.id)
        }

    }, [filteredListForSelectedBox])

    useEffect(() => {
        if (disponibilitaCalendar) {
            let filteredArray = [];
            if (selectedFilter === 'mostra-tutti') {
                filteredArray = disponibilitaCalendar
                setSelectedWorkplace('');
                setSelectedInsegnante('')
                setSelectedIstruttore('')
            }
            else if (selectedFilter === 'workplace' && selectedWorkplace !== '') {
                filteredArray = disponibilitaCalendar.filter(el => el.veicolo?.workplaceId === selectedWorkplace)
                setSelectedInsegnante('')
                setSelectedIstruttore('')
            }
            else if (selectedFilter === 'insegnante') {
                filteredArray = disponibilitaCalendar.filter(el => el.istruttore.profile.id === selectedInsegnante)
                setSelectedWorkplace('');
                setSelectedIstruttore('')
            }
            else if (selectedFilter === 'istruttore') {
                filteredArray = disponibilitaCalendar.filter(el => el.istruttore.profile.id === selectedIstruttore)
                setSelectedWorkplace('');
                setSelectedInsegnante('')
            }

            const arr = [];
            filteredArray && filteredArray.length > 0 && filteredArray.map(item => {
                arr.push({
                    id: item.id,
                    startAt: new Date(item.inizioServizio * 1000).toISOString(),
                    endAt: new Date(item.fineServizio * 1000).toISOString(),
                    timezoneStartAt: 'Europe/Rome', // optional
                    summary: item.AllievoIstruzione.allievo.cognome === 'Amdinistrator' ? 'BLOCCO ESAME' : `${item.tariffa.tipo.tipo_cod.includes('esame') ? 'Esame' : item.tariffa.tipo.tipo} ${item.AllievoIstruzione.allievo.cognome} ${item.AllievoIstruzione.allievo.nome} ${item.AllievoIstruzione.allievo.tel} - ${item.AllievoIstruzione.allievo?.autoscuola?.denominazione} - Istruttore: ${item.istruttore?.profile?.firstname} ${item.istruttore?.profile?.lastname} - Veicolo: ${item.veicolo?.modello.toUpperCase()} Targa: ${item.veicolo?.targa.toUpperCase()}`,
                    color: `${item.tariffa.tipo.tipo_cod.includes('esame') ? 'yellow' : 'blue'}`,
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
                            defaultValue={selectedIstruttore}
                            onChange={(e) => setSelectedIstruttore(e.target.value)}
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
            <button
                onClick={() => window.print()}
                className="order-0 mx-6 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:order-1 sm:ml-3">
                Stampa
            </button>
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
