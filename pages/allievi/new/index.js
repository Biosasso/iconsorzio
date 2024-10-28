import React, { useEffect, useState, useContext } from 'react'
import NotificationsContext from '@/store/notifications'
import { ObjectIsEmpty, ValidateEmailFormat } from '../../../utils/inputForm';

import Layout from '@/components/layout/layout';
import Form from '@/components/allievi/form';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import fetcher, { fetcherWithData } from '@/lib/fetch'

export default function AllievoCrea() {

    const { data: companyId } = useSWR('/api/admin/company/isActive', fetcher);
    const { data: autoscuole } = useSWR(companyId ? `/api/autoscuole/list` : null, fetcher);
    const { data: patenti } = useSWR(companyId ? {
        url: '/api/admin/patenti/list',
        data: companyId.isActive
    } : null, fetcherWithData);
    const { data: tariffe } = useSWR(companyId ? `/api/tariffe/tariffeTipoList` : null, fetcher);

    const router = useRouter();
    const notify = useContext(NotificationsContext)
    const [data, setData] = useState();
    const [istruzioneData, setIstruzioneData] = useState();
    const [serviziData, setServiziData] = useState();

    const [step, setStep] = useState('anagrafica');

    const pageInfo = {
        page: step.includes('anagrafica') ? 'allievi/list' : (step.includes('istruzione') ? 'allievi/new#anagrafica' : 'allievi/new#istruzione'),
        createLink: false,
        title: 'Crea Allievo'
    }

    useEffect(() => {
        if (autoscuole) {
            setData({
                companyId: companyId.isActive,
                autoscuolaId: autoscuole.length === 1 ? autoscuole[0].id : 'Seleziona',
                nome: '',
                cognome: '',
                iscrizioneNumero: '',
                iscrizioneData: undefined,
                codiceMeccanografico: '',
                nascitaLuogo: '',
                nascitaData: undefined,
                genere: '',
                codFisc: '',
                indirizzo: '',
                provincia: '',
                comune: '',
                cap: '',
                tel: '',
                email: '',
            });
        }
    }, [autoscuole]);

    useEffect(() => {
        if (autoscuole && patenti && data) {
            setIstruzioneData({
                companyId: companyId.isActive,
                patenteId: 'Seleziona',
                marcaOperativa: '',
                dataEsame: undefined,
                foglioRosaRilascio: undefined,
                foglioRosaScadenza: undefined,
                codiceStatino: '',
                istruzioneCompletata: '' === 'true'
            });
        }
    }, [autoscuole, patenti, data]);

    useEffect(() => {
        if (autoscuole && patenti && data && istruzioneData) {
            setServiziData({
                companyId: companyId.isActive,
                tariffaId: 'Seleziona',
                dataServizio: undefined,
                durataMinuti: 0,
                istruttoreId: undefined,
                insegnanteId: undefined,
                esito: '',
            })
        }
    }, [autoscuole, patenti, data, istruzioneData])


    const addNewRecord = async () => {

        let dataForDb = data;

        dataForDb = {
            ...dataForDb,
            AllievoIstruzioni: {
                create: {
                    ...istruzioneData,
                    // AllievoServizi: {
                    //     create: {
                    //         ...serviziData
                    //     }
                    // }
                }

            }
        }

        if (!companyId) {
            notify.error.set({
                title: 'Abbiamo riscontrato un problema interno, ti preghiamo di ricaricare la pagina',
                message: 'Se il problema persiste ti preghiamo di contattare il supporto tecnico, grazie!'
            })
            return
        }

        try {
            const res = await fetch(`/api/allievi/new`, {
                body: JSON.stringify(dataForDb),
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST'
            });

            const result = await res.json();

            if (result.statusCode === 200) {
                notify.success.set({
                    title: result.title
                })

                setTimeout(() => {
                    router.push(`/allievi/list?identifier=${result.allievoId}`)
                }, 500)
            }
            if (result.statusCode === 400) {
                notify.error.set({
                    title: result.title
                })
            }
        }
        catch (err) {
            notify.error.set({
                title: "Errore nell'inserimento, prego riprova!"
            })
        }

    }

    const verifyStep1AndContinue = async () => {
        // Numero di iscrizione NON più obbligatorio
        data.iscrizioneNumero = '0'
        console.log(data)
        if (data.nome === '' || data.cognome === '' || data.codFisc === '') {
            notify.error.set({
                title: `Compila i campi obbligatori contrassegnati con asterisco (NOME, COGNOME, CODICE FISCALE)`
            })
            return
        }
        // Verifico che tutti i campi siano compilati, nessuno vuoto
        // if (ObjectIsEmpty(data)) {
        //     notify.error.set({
        //         title: 'Tutti i campi con asterisco sono obbligatori',
        //     })
        //     return
        // }

        if (data.autoscuolaId === 'Seleziona') {
            notify.error.set({
                title: `Devi selezionare un'autoscuola`
            })
            return
        }
        // if (data.genere === 'Seleziona') {
        //     notify.error.set({
        //         title: `Devi selezionare un genere per l'allievo`
        //     })
        //     return
        // }
        // if (!await ValidateEmailFormat(data.email)) {
        //     notify.error.set({
        //         title: 'Devi inserire un indirizzo email valido'
        //     })
        //     return
        // }
        setStep('istruzione')
    }

    const verifyStep2AndContinue = async () => {

        if (istruzioneData.patenteId === 'Seleziona') {
            notify.error.set({
                title: `Devi selezionare una patente`
            })
            return
        }
        await addNewRecord();

    }

    const Button1 = () => {
        return (
            <button
                onClick={() => { step === 'anagrafica' ? verifyStep1AndContinue() : (step === 'istruzione' ? verifyStep2AndContinue() : addNewRecord()) }}
                className="order-0 mx-6 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:order-1 sm:ml-3">
                {step === 'anagrafica' ? 'Avanti' : 'Salva e concludi'}
            </button>
        )
    }

    const Button2 = () => {
        return (
            <button
                onClick={() => { step === 'anagrafica' ? router.push('/allievi/list') : (step === 'istruzione' ? setStep('anagrafica') : setStep('istruzione')) }}
                className="order-0 mx-6 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:order-1 sm:ml-3">
                Indietro
            </button>
        )
    }

    return (
        <Layout
            page={pageInfo.page}
            createLink={pageInfo.createLink}
            title={pageInfo.title}
            Button1={Button1}
            Button2={Button2}
        >
            {(autoscuole && patenti && data && istruzioneData && tariffe) &&
                <Form
                    router={router}
                    data={data}
                    setData={setData}
                    autoscuole={autoscuole}
                    istruzioneData={istruzioneData}
                    setIstruzioneData={setIstruzioneData}
                    serviziData={serviziData}
                    setServiziData={setServiziData}
                    tariffe={tariffe}
                    patenti={patenti}
                    step={step}
                />
            }

        </Layout>
    )
}