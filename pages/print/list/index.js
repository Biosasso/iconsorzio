import React, { useState, useEffect } from 'react'
import Layout from '@/components/layout/layout'
import { getSession } from 'next-auth/react';
import useSWR from "swr";
import fetcher, { fetcherWithData } from '@/lib/fetch'
import { DateTime } from 'datetime-next';
import Table from '../../../components/print/table';

export default function AgendaGiorno({ }) {


    DateTime.setDefaultLocale('it-IT');

    const [events, setEvents] = useState([]);
    const [open, setOpen] = useState(false)
    const [data, setData] = useState();
    const [ids, setIds] = useState();
    const [errFound, setErrFound] = useState()

    const [selectedDay, setSelectedDay] = useState(new Date());
    const [selectedType, setSelectedType] = useState('guida')

    const { data: companyId } = useSWR('/api/admin/company/isActive', fetcher);

    const { data: listaGiornaliera } = useSWR(companyId && selectedDay && selectedType ? {
        url: '/api/print/list',
        data: {
            companyId: companyId.isActive,
            selectedDay: selectedDay,
            selectedType: selectedType
        }
    } : null, fetcherWithData);

    const pageInfo = {
        page: 'print/list',
        createLink: false,
        title: `Lista ${selectedType.includes('guida') ? 'guide' : 'esami'} del ${new DateTime(selectedDay).getString('DD/MM/YYYY')}`
    }

    useEffect(() => {
        if (listaGiornaliera) {

            const arr = [];
            listaGiornaliera.map(item => {
                arr.push({
                    id: item.id,
                    startAt: new Date(item.inizioServizio * 1000).toISOString(),
                    endAt: new Date(item.fineServizio * 1000).toISOString(),
                    timezoneStartAt: 'Europe/Rome', // optional
                    summary: `${item.tariffa.tipo.tipo} ${item.AllievoIstruzione.allievo.cognome} ${item.AllievoIstruzione.allievo.nome} ${item.AllievoIstruzione.allievo.tel} - Istruttore: ${item.istruttore?.profile?.firstname} ${item.istruttore?.profile?.lastname} - Veicolo: ${item.veicolo?.modello.toUpperCase()} Targa: ${item.veicolo?.targa.toUpperCase()}`,
                    color: 'blue',
                    calendarID: 'work',
                    originalData: item
                })
            });
            setEvents(arr);
        }

    }, [listaGiornaliera])

    const onEventClick = (e) => {

        setIds({
            servizioId: e.originalData.id,
            allievoId: e.originalData.AllievoIstruzione.allievo.id,
        })
        setData({
            Allievo: e.originalData.AllievoIstruzione.allievo.nome + ' ' + e.originalData.AllievoIstruzione.allievo.cognome,
            Telefono_allievo: e.originalData.AllievoIstruzione.allievo.tel,
            Email_allievo: e.originalData.AllievoIstruzione.allievo.email ? e.originalData.AllievoIstruzione.allievo.email.toLowerCase() : '',
            Tipo_Servizio: e.originalData.tariffa?.tipo?.tipo,
            Durata: e.originalData.durataMinuti + ' Minuti',
            Data_e_ora_di_inizio: new Date(e.originalData.inizioServizio * 1000).toLocaleDateString('it-IT') + ' ' + new Date(e.originalData.inizioServizio * 1000).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),
            Nome_veicolo: e.originalData.veicolo.nome,
            Marca_e_modello: e.originalData.veicolo.modello,
            Targa: e.originalData.veicolo.targa ? e.originalData.veicolo.targa.toUpperCase() : '',
            Istruttore: e.originalData.istruttore.profile.firstname + ' ' + e.originalData.istruttore.profile.lastname,
            Telefono_istruttore: e.originalData.istruttore.profile.phone
        })
        setOpen(true)

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
    return (

        <Layout
            page={pageInfo.page}
            createLink={pageInfo.createLink}
            title={pageInfo.title}
            Button1={Button1}
        >
            <div className='bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 h-full block'>
                <div className='h-full'>
                    {events && listaGiornaliera &&
                        <Table
                            events={events}
                            selectedDay={selectedDay}
                            setSelectedDay={setSelectedDay}
                            selectedType={selectedType}
                            setSelectedType={setSelectedType}
                        />
                    }
                    {listaGiornaliera === false && <p>Forse c'è stato un errore di ricaricamento. Prova a ricaricare la pagina, se il problema persiste contatta l'amministratore di sistema</p>}
                </div>
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


