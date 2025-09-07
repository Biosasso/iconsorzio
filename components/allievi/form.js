import React, { useEffect, useState } from 'react'
import useSWR from 'swr';
import { fetcherWithData, fetcherDisponibilitaVeicoli } from '@/lib/fetch'
import { DateTime } from 'datetime-next';
import DatePicker, { registerLocale } from "react-datepicker";
import it from 'date-fns/locale/it';
import "react-datepicker/dist/react-datepicker.css"
import { CalendarIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import ButtonWithIconLeft from '@/components/UI/button/buttonWithIconLeft'

// import Kalend, { CalendarView } from 'kalend' // import component
import 'kalend/dist/styles/index.css'; // import styles
// import calIt from '../../utils/it.json'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Form({
    sid,
    router,
    notify,
    data,
    setData,
    istruzioneData,
    setIstruzioneData,
    serviziData,
    setServiziData,
    autoscuole,
    patenti,
    tariffe,
    step,
    allievoId,
    veicoli,
    userIsAdmin
}) {


    // DateTime.setDefaultLocale('it-IT');

    registerLocale('it', it)

    const [startDate, setStartDate] = useState(router?.asPath.includes('servizi/edit') ? new Date(serviziData.inizioServizio * 1000) : new Date());

    //Field necessario per proporre una data vecchia di 14 anni come data di nascita
    const quattordiciAnniFa = new DateTime(`${new DateTime().getYear() - 14}-01-01`);

    const filterPassedTime = (time) => {
        const currentDate = new Date();
        const selectedDate = new Date(time);

        return currentDate.getTime() < selectedDate.getTime();

    };

    const title = router.asPath.includes('new') ? 'Nuovo' : 'Modifica'

    const readonly = router.query?.readonly === 'true'

    const [tariffaTipo, setTariffaTipo] = useState(serviziData?.Tariffa?.tipo?.id ? serviziData.Tariffa.tipo.id : 'Seleziona')
    const [patenteId, setPatenteId] = useState(serviziData?.tariffa?.patenteId ? serviziData.tariffa.patenteId : '');
    const [istruzioneId, setIstruzioneId] = useState('');
    const [tariffeList, setTariffeList] = useState([]);
    const [veicoliList, setVeicoliList] = useState([]);
    const [events, setEvents] = useState([]);

    const { data: istruttori } = useSWR({
        url: '/api/admin/users/getUsersWithSpecificRolesGroup',
        data: { rulesGroupDescription: 'Istruttore' }
    }, fetcherWithData,
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false
        }
    )

    const { data: insegnanti } = useSWR(istruttori ? {
        url: '/api/admin/users/getUsersWithSpecificRolesGroup',
        data: { rulesGroupDescription: 'Insegnante' }
    } : null, fetcherWithData,
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false
        }
    )

    const { data: istruttoriinsegnanti } = useSWR(insegnanti ? {
        url: '/api/admin/users/getUsersWithSpecificRolesGroup',
        data: { rulesGroupDescription: 'Insegnante & Istruttore' }
    } : null, fetcherWithData, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    }
    )

    //Per pagina crea servizio
    const { data: istruzioni } = useSWR(allievoId && istruttoriinsegnanti ? {
        url: '/api/allievi/istruzioni/list',
        data: { allievoId: allievoId, servizioCompletato: readonly }
    } : null, fetcherWithData, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    }
    )

    //Controllo se è un corso teorico, e nel caso permetto di effettuare più prenotazioni lo stesso giorno alla stessa ora
    const { data: checkIfEsameTeorico } = useSWR(allievoId && istruzioni && tariffaTipo ? {
        url: '/api/allievi/servizi/checkIfCorsoTeorico',
        data: { tariffaTipo: tariffaTipo }
    } : null, fetcherWithData, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    }
    )

    useEffect(() => {
        if (checkIfEsameTeorico) {
            if (checkIfEsameTeorico.tipo_cod === 'corso_teorico') {
                setServiziData({ ...serviziData, veicoloId: undefined })
            }
        }
    }, [checkIfEsameTeorico, data])

    const { data: disponibilita } = useSWR(serviziData && serviziData?.veicoloId ? {
        url: '/api/allievi/servizi/getUsedTime',
        data: {
            companyId: serviziData.companyId,
            veicoloId: serviziData.veicoloId,
            istruttoreId: serviziData.istruttoreId,
            selectedData: startDate,
            tariffaTipo: tariffaTipo,
            tariffe: tariffe,
        }
    } : null, fetcherDisponibilitaVeicoli, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    }
    )

    useEffect(() => {

        const arr = [];

        if (tariffe) {
            tariffe.map(item => {
                if (item.id === tariffaTipo) {
                    item.Tariffe.map(el => {
                        if (el.patenteId === patenteId) {
                            setServiziData({ ...serviziData, tariffaId: el.id })
                            arr.push({ id: el.id, nome: el.patente.nome, patenteId: el.patente.id, prezzo: el.prezzo })
                        }
                    })
                    setTariffeList(arr)
                }
            })
        }

    }, [tariffaTipo])

    useEffect(() => {

        const arr = [];
        if (serviziData?.tariffaId) {
            tariffeList.map(item => {
                if (item.id === serviziData.tariffaId) {
                    veicoli.map(el => {
                        el.Patenti.map(element => {
                            if (element.patente.id === item.patenteId) {
                                arr.push(el)
                            }
                        })
                        setVeicoliList(arr)
                    })
                }
            })
        }

    }, [serviziData])
    // }, router.asPath.includes('servizi/new') ? [serviziData] : [serviziData, tariffeList])

    useEffect(() => {
        if (serviziData?.tariffa?.tipo?.id) {
            setTariffaTipo(serviziData.tariffa.tipo.id)
        }
    }, [])

    useEffect(() => {

        if (serviziData?.allievoIStruzioneId && istruzioni) {
            istruzioni.map(item => {
                if (item.id === serviziData.allievoIStruzioneId) {
                    setIstruzioneId(JSON.stringify({ id: serviziData.allievoIStruzioneId, patenteId: serviziData.tariffa.patenteId }))
                }
            })
        }

    }, [istruzioni])

    const handleChange = (e) => {
        const inizio = Math.floor(new Date(e) / 1000)
        const fine = inizio + (serviziData.durataMinuti * 60)
        setStartDate(new Date(e));
        setServiziData({ ...serviziData, inizioServizio: inizio, fineServizio: fine });

    };

    const selectMaxTime = () => {
        const tariffaSelezionata = tariffe.find(el => el.id === tariffaTipo)

        if (tariffaSelezionata && tariffaSelezionata.tipo_cod === "corso_teorico") {
            return new Date('July 1, 1999, 23:30:00')
        }
        else {
            return new Date('July 1, 1999, 18:30:00')
        }
    }

    const handleChangeIstruzione = (e) => {
        const multiValue = JSON.parse(e.target.options[e.target.selectedIndex].value);
        setPatenteId(multiValue.patenteId);
        setServiziData({ ...serviziData, allievoIStruzioneId: multiValue.id });
        setIstruzioneId(JSON.stringify(multiValue));
        setTariffaTipo('Seleziona');
        setTariffeList([]);
        setVeicoliList([]);
    };

    return (
        <>
            <div className="space-y-6 p-6 mb-12">
                <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                    {/* SCHEDA 1 */}
                    {step === 'anagrafica' &&
                        <div className="md:grid md:grid-cols-3 md:gap-6">
                            <div className="md:col-span-1">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">{title} allievo</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    {title} allievo, compila tutti i campi per migliorare l'usabilità
                                </p>
                            </div>
                            <div className="mt-5 md:mt-0 md:col-span-2">
                                <form className="space-y-6" action="#" method="POST">
                                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-6">
                                        <div className="col-span-3 sm:col-span-4">
                                            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                                                Seleziona autoscuola *
                                            </label>
                                            <select
                                                name="autoscuola"
                                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                value={data?.autoscuolaId ? data.autoscuolaId : ''}
                                                onChange={(e) => setData({ ...data, autoscuolaId: e.target.options[e.target.selectedIndex].value })}
                                            >
                                                <option value={'Seleziona'}>Seleziona...</option>
                                                {autoscuole.map(item => (
                                                    <option key={item.id} value={item.id}>{item.denominazione}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-span-3 sm:col-span-2">
                                            <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                                                Nome *
                                            </label>
                                            <div className="mt-1 flex rounded-md shadow-sm">
                                                <input
                                                    type="text"
                                                    name="nome"
                                                    value={data?.nome ? data.nome : ''}
                                                    onChange={(e) => setData({ ...data, nome: e.target.value })}
                                                    className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                                    placeholder="Es. Mario"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-span-3 sm:col-span-2">
                                            <label htmlFor="cognome" className="block text-sm font-medium text-gray-700">
                                                Cognome *
                                            </label>
                                            <div className="mt-1 flex rounded-md shadow-sm">
                                                <input
                                                    type="text"
                                                    name="cognome"
                                                    value={data?.cognome ? data.cognome : ''}
                                                    onChange={(e) => setData({ ...data, cognome: e.target.value })}
                                                    className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                                    placeholder="Es. Rossi"
                                                />
                                            </div>
                                        </div>

                                        <div className="col-span-3 sm:col-span-4">
                                            <label htmlFor="codFisc" className="block text-sm font-medium text-gray-700">
                                                Codice Fiscale *
                                            </label>
                                            <div className="mt-1 flex rounded-md shadow-sm">
                                                <input
                                                    type="text"
                                                    name="codFisc"
                                                    maxLength={16}
                                                    value={data?.codFisc ? data.codFisc : ''}
                                                    onChange={(e) => setData({ ...data, codFisc: e.target.value })}
                                                    className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                                    placeholder=""
                                                />
                                            </div>
                                        </div>
                                        <div className="col-span-3 sm:col-span-2">
                                            <label htmlFor="iscrizioneNumero" className="block text-sm font-medium text-gray-700">
                                                Numero di iscrizione
                                            </label>
                                            <div className="mt-1 flex rounded-md shadow-sm">
                                                <input
                                                    type="text"
                                                    name="iscrizioneNumero"
                                                    value={data?.iscrizioneNumero ? data.iscrizioneNumero : ''}
                                                    onChange={(e) => setData({ ...data, iscrizioneNumero: e.target.value })}
                                                    className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                                    placeholder=""
                                                />
                                            </div>
                                        </div>
                                        <div className="col-span-3 sm:col-span-2">
                                            <label htmlFor="iscrizioneData" className="block text-sm font-medium text-gray-700">
                                                Data di iscrizione
                                            </label>
                                            <div className="mt-1 relative rounded-md shadow-sm">
                                                <DatePicker
                                                    locale={'it'}
                                                    selected={data?.iscrizioneData ? new Date(new DateTime(data.iscrizioneData).getString('YYYY-MM-DD')) : ''}
                                                    onChange={(e) => setData({ ...data, iscrizioneData: e })}
                                                    dateFormat="P"
                                                    placeholderText={new DateTime(new Date()).getString('DD/MM/YYYY')}
                                                    className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                                />
                                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                    <CalendarIcon className="h-5 w-5 text-gray-700 z-1" aria-hidden="true" />
                                                </div>
                                            </div>

                                        </div>
                                        <div className="col-span-3 sm:col-span-4">
                                            <label htmlFor="codiceMeccanografico" className="block text-sm font-medium text-gray-700">
                                                Codice Meccanografico
                                            </label>
                                            <div className="mt-1 flex rounded-md shadow-sm">
                                                <input
                                                    type="text"
                                                    name="codiceMeccanografico"
                                                    value={data?.codiceMeccanografico ? data.codiceMeccanografico : ''}
                                                    onChange={(e) => setData({ ...data, codiceMeccanografico: e.target.value })}
                                                    className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                                    placeholder=""
                                                />
                                            </div>
                                        </div>
                                        <div className="col-span-3 sm:col-span-2">
                                            <label htmlFor="nascitaLuogo" className="block text-sm font-medium text-gray-700">
                                                Luogo di nascita
                                            </label>
                                            <div className="mt-1 flex rounded-md shadow-sm">
                                                <input
                                                    type="text"
                                                    name="nascitaLuogo"
                                                    value={data?.nascitaLuogo ? data.nascitaLuogo : ''}
                                                    onChange={(e) => setData({ ...data, nascitaLuogo: e.target.value })}
                                                    className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                                    placeholder="Pistoia"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-span-3 sm:col-span-2">
                                            <label htmlFor="nascitaData" className="block text-sm font-medium text-gray-700">
                                                Data di nascita
                                            </label>
                                            <div className="mt-1 relative rounded-md shadow-sm">
                                                <DatePicker
                                                    locale={'it'}
                                                    selected={data?.nascitaData ? new Date(new DateTime(data.nascitaData).getString('YYYY-MM-DD')) : ''}
                                                    onChange={(e) => setData({ ...data, nascitaData: e })}
                                                    dateFormat="P"
                                                    placeholderText={new DateTime(new Date(quattordiciAnniFa)).getString('DD/MM/YYYY')}
                                                    className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                                />
                                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                    <CalendarIcon className="h-5 w-5 text-gray-700 z-1" aria-hidden="true" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-3 sm:col-span-4">
                                            <label htmlFor="genere" className="block text-sm font-medium text-gray-700">
                                                Genere
                                            </label>
                                            <select
                                                name="genere"
                                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                value={data?.genere ? data.genere : ''}
                                                onChange={(e) => setData({ ...data, genere: e.target.options[e.target.selectedIndex].value })}
                                            >
                                                <option value={'Seleziona'}>Seleziona...</option>
                                                <option value={'M'}>M</option>
                                                <option value={'F'}>F</option>
                                                <option value={'Altro'}>Altro</option>

                                            </select>
                                        </div>
                                        <div className="col-span-3 sm:col-span-2">
                                            <label htmlFor="indirizzo" className="block text-sm font-medium text-gray-700">
                                                Indirizzo
                                            </label>
                                            <div className="mt-1 flex rounded-md shadow-sm">
                                                <input
                                                    type="text"
                                                    name="indirizzo"
                                                    value={data?.indirizzo ? data.indirizzo : ''}
                                                    onChange={(e) => setData({ ...data, indirizzo: e.target.value })}
                                                    className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                                    placeholder=""
                                                />
                                            </div>
                                        </div>
                                        <div className="col-span-3 sm:col-span-2">
                                            <label htmlFor="provincia" className="block text-sm font-medium text-gray-700">
                                                Provincia
                                            </label>
                                            <div className="mt-1 flex rounded-md shadow-sm">
                                                <input
                                                    type="text"
                                                    name="provincia"
                                                    value={data?.provincia ? data.provincia : ''}
                                                    onChange={(e) => setData({ ...data, provincia: e.target.value })}
                                                    className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                                    placeholder=""
                                                />
                                            </div>
                                        </div>
                                        <div className="col-span-3 sm:col-span-2">
                                            <label htmlFor="comune" className="block text-sm font-medium text-gray-700">
                                                Comune
                                            </label>
                                            <div className="mt-1 flex rounded-md shadow-sm">
                                                <input
                                                    type="text"
                                                    name="comune"
                                                    value={data?.comune ? data.comune : ''}
                                                    onChange={(e) => setData({ ...data, comune: e.target.value })}
                                                    className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                                    placeholder=""
                                                />
                                            </div>
                                        </div>
                                        <div className="col-span-3 sm:col-span-2">
                                            <label htmlFor="cap" className="block text-sm font-medium text-gray-700">
                                                Cap
                                            </label>
                                            <div className="mt-1 flex rounded-md shadow-sm">
                                                <input
                                                    type="text"
                                                    name="cap"
                                                    value={data?.cap ? data.cap : ''}
                                                    onChange={(e) => setData({ ...data, cap: e.target.value })}
                                                    className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                                    placeholder="E. 55017"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-span-3 sm:col-span-4">
                                            <label htmlFor="tel" className="block text-sm font-medium text-gray-700">
                                                Telefono
                                            </label>
                                            <div className="mt-1 flex rounded-md shadow-sm">
                                                <input
                                                    type="text"
                                                    name="tel"
                                                    value={data?.tel ? data.tel : ''}
                                                    onChange={(e) => setData({ ...data, tel: e.target.value })}
                                                    className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                                    placeholder=""
                                                />
                                            </div>
                                        </div>
                                        <div className="col-span-3 sm:col-span-4">
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                                Email
                                            </label>
                                            <div className="mt-1 flex rounded-md shadow-sm">
                                                <input
                                                    type="text"
                                                    name="email"
                                                    value={data?.email ? data.email : ''}
                                                    onChange={(e) => setData({ ...data, email: e.target.value })}
                                                    className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                                    placeholder=""
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    }
                    {/* SCHEDA 2 */}
                    {step === 'istruzione' &&
                        <>
                            <div className="md:grid md:grid-cols-3 md:gap-6">
                                <div className="md:col-span-1">
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">{router.asPath.includes('new') ? 'Inserisci' : 'Modifica'} l'istruzione</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        L'istruzione dell'allievo fa riferimento al motivo dell'iscrizione, quindi i dati del corso o del folgio rosa
                                    </p>
                                </div>
                                <div className="mt-5 md:mt-0 md:col-span-2">
                                    <form className="space-y-6" action="#" method="POST">
                                        <div className="grid grid-cols-1 sm:grid-cols-5 gap-6">
                                            <div className="col-span-3 sm:col-span-4">
                                                <label htmlFor="patenteId" className="block text-sm font-medium text-gray-700">
                                                    Seleziona patente
                                                </label>
                                                <select
                                                    name="patenteId"
                                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md uppercase"
                                                    value={istruzioneData?.patenteId ? istruzioneData.patenteId : ''}
                                                    onChange={(e) => setIstruzioneData({ ...istruzioneData, patenteId: e.target.options[e.target.selectedIndex].value })}
                                                >
                                                    <option value={'Seleziona'}>Seleziona...</option>
                                                    {patenti?.map(item => (
                                                        <option key={item.id} value={item.id}>{item.nome}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="col-span-3 sm:col-span-4">
                                                <label htmlFor="dataEsame" className="block text-sm font-medium text-gray-700">
                                                    Data esame (Se corso di rinnovo inserire la data di fine corso)
                                                </label>
                                                <div className="mt-1 relative rounded-md shadow-sm">
                                                    <DatePicker
                                                        locale={'it'}
                                                        selected={istruzioneData?.dataEsame ? new Date(istruzioneData.dataEsame) : ''}
                                                        onChange={(e) => setIstruzioneData({ ...istruzioneData, dataEsame: e })}
                                                        dateFormat="P"
                                                        className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                                    />
                                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                        <CalendarIcon className="h-5 w-5 text-gray-700 z-1" aria-hidden="true" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-span-3 sm:col-span-2">
                                                <label htmlFor="foglioRosaRilascio" className="block text-sm font-medium text-gray-700">
                                                    Rilascio foglio rosa
                                                </label>
                                                <div className="mt-1 relative rounded-md shadow-sm">
                                                    <DatePicker
                                                        locale={'it'}
                                                        selected={istruzioneData?.foglioRosaRilascio ? new Date(istruzioneData.foglioRosaRilascio) : ''}
                                                        onChange={(e) => setIstruzioneData({ ...istruzioneData, foglioRosaRilascio: e })}
                                                        dateFormat="P"
                                                        className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                                    />
                                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                        <CalendarIcon className="h-5 w-5 text-gray-700 z-1" aria-hidden="true" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-span-3 sm:col-span-2">
                                                <label htmlFor="foglioRosaScadenza" className="block text-sm font-medium text-gray-700">
                                                    Scadenza foglio rosa
                                                </label>
                                                <div className="mt-1 relative rounded-md shadow-sm">
                                                    <DatePicker
                                                        locale={'it'}
                                                        selected={istruzioneData?.foglioRosaScadenza ? new Date(istruzioneData.foglioRosaScadenza) : ''}
                                                        onChange={(e) => setIstruzioneData({ ...istruzioneData, foglioRosaScadenza: e })}
                                                        dateFormat="P"
                                                        className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                                    />
                                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                        <CalendarIcon className="h-5 w-5 text-gray-700 z-1" aria-hidden="true" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-span-3 sm:col-span-4">
                                                <label htmlFor="marcaOperativa" className="block text-sm font-medium text-gray-700">
                                                    Marca Operativa                                        </label>
                                                <div className="mt-1 flex rounded-md shadow-sm">
                                                    <input
                                                        type="text"
                                                        name="marcaOperativa"
                                                        value={istruzioneData?.marcaOperativa ? istruzioneData.marcaOperativa : ''}
                                                        onChange={(e) => setIstruzioneData({ ...istruzioneData, marcaOperativa: e.target.value })}
                                                        className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                                        placeholder=""
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-span-3 sm:col-span-4">
                                                <label htmlFor="codiceStatino" className="block text-sm font-medium text-gray-700">
                                                    Codice Statino
                                                </label>
                                                <div className="mt-1 flex rounded-md shadow-sm">
                                                    <input
                                                        type="text"
                                                        name="codiceStatino"
                                                        value={istruzioneData.codiceStatino ? istruzioneData.codiceStatino : ''}
                                                        onChange={(e) => setIstruzioneData({ ...istruzioneData, codiceStatino: e.target.value })}
                                                        className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                                        placeholder=""
                                                    />
                                                </div>
                                            </div>

                                        </div>

                                    </form>

                                </div>

                            </div>
                            <div className="md:grid md:grid-cols-3 md:gap-6 mt-12">
                                <div className="md:col-span-1">
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">Istruzione completata?</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Se l'allievo ha completato il percorso, sia in esito positivo che in esito negativo spunta questo bottone.
                                    </p>
                                </div>
                                <div className="mt-5 md:mt-0 md:col-span-2">
                                    <form className="space-y-6" action="#" method="POST">
                                        <div className="grid grid-cols-1 sm:grid-cols-5 gap-6">
                                            <div className="col-span-3 sm:col-span-4 mt-12">

                                                <label htmlFor="istruzioneCompletata" className="block text-sm font-medium text-gray-700">
                                                    Seleziona per l'allievo selezionato(NO / SI)
                                                </label>
                                                <select
                                                    name="istruzioneCompletata"
                                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md uppercase"
                                                    value={istruzioneData.istruzioneCompletata}
                                                    onChange={(e) => {
                                                        setIstruzioneData({ ...istruzioneData, istruzioneCompletata: e.target.value === 'true' })
                                                    }

                                                    }
                                                >
                                                    <option value={true}>SI</option>
                                                    <option value={false}>NO</option>
                                                </select>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </>
                    }
                    {/* SCHEDA 3 */}
                    {step === 'servizi' &&
                        <div className="md:grid md:grid-cols-3 md:gap-6">
                            <div className="md:col-span-1">
                                <h3 className={`text-lg font-medium leading-6 ${readonly ? 'text-green-900' : 'text-gray-900 '}`}>
                                    {readonly ?
                                        `Servizio concluso`
                                        :
                                        `Inserisci il primo servizio per l'allievo`
                                    }
                                </h3>
                                <p className={`mt-1 text-sm ${readonly ? 'text-green-500' : 'text-gray-500 '}`}>
                                    {readonly ?
                                        `Questo è un servizio passato quindi non modificabile nei suoi dettagli. È comunque possibile modificare e salvare l'esito del servizio svolto `
                                        :
                                        `Il primo servizio corrisponde al motivo dell'iscrizione, quindi seleziona guida, esame, corso o altro`
                                    }
                                </p>
                            </div>
                            <div className="mt-5 md:mt-0 md:col-span-2">
                                <form className="space-y-6" action="#" method="POST">
                                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-6">
                                        {/* {(router.asPath.includes('servizi/new') && istruzioni) && */}
                                        <div className="col-span-3 sm:col-span-4">
                                            <label htmlFor="allievoIStruzioneId" className="block text-sm font-medium text-gray-700">
                                                Seleziona istruzione di riferimento
                                            </label>
                                            <select
                                                name="allievoIStruzioneId"
                                                disabled={readonly}
                                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md uppercase"
                                                value={istruzioneId}
                                                onChange={handleChangeIstruzione}
                                            >
                                                {!istruzioneId && <option value={'Seleziona'}>Seleziona...</option>}
                                                {istruzioni && istruzioni.map((item, index) => (
                                                    <option key={`${item.patenteId}-${index}`} value={JSON.stringify({ id: item.id, patenteId: item.patenteId })}>Patente: {item.patente.nome} - Marca operativa: {item.marcaOperativa}</option>
                                                ))}
                                            </select>
                                        </div>
                                        {/* } */}

                                        {istruzioneId &&
                                            <>
                                                <div className="col-span-3 sm:col-span-4">
                                                    <label htmlFor="tariffaTipo" className="block text-sm font-medium text-gray-700">
                                                        Tipologia di servizio
                                                    </label>
                                                    <select
                                                        disabled={readonly}
                                                        name="tariffaTipo"
                                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md uppercase"
                                                        value={tariffaTipo}
                                                        onChange={(e) => setTariffaTipo(e.target.options[e.target.selectedIndex].value)}
                                                    >
                                                        <option value={'Seleziona'}>Seleziona...</option>
                                                        {istruzioneId && tariffe.map(item => (
                                                            <option key={item.id} value={item.id}>{item.tipo}</option>
                                                        ))}
                                                    </select>
                                                </div>


                                                <div className="col-span-3 sm:col-span-4">
                                                    <label htmlFor="tariffaId" className="block text-sm font-medium text-gray-700">
                                                        Tariffa
                                                    </label>
                                                    <select
                                                        name="tariffaId"
                                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md uppercase"
                                                        disabled={true}
                                                        value={serviziData?.tariffaId ? serviziData?.tariffaId : ''}
                                                        onChange={(e) => setServiziData({ ...serviziData, tariffaId: e.target.options[e.target.selectedIndex].value })}
                                                    >
                                                        <option value={'Seleziona'}>Seleziona...</option>
                                                        {tariffeList.map(item => (
                                                            <option value={item.id} key={item.id}>Tariffa per: {item.nome} Prezzo: {item.prezzo} €</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </>
                                        }
                                        {istruzioneId && tariffaTipo !== 'Seleziona' &&
                                            <>
                                                {checkIfEsameTeorico?.tipo_cod !== 'corso_teorico' &&
                                                    <div className="col-span-3 sm:col-span-4">
                                                        <label htmlFor="tariffaId" className="block text-sm font-medium text-gray-700">
                                                            Seleziona veicoli
                                                        </label>
                                                        <select
                                                            disabled={readonly}
                                                            name="tariffaId"
                                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md uppercase"
                                                            value={serviziData?.veicoloId ? serviziData.veicoloId : ''}
                                                            onChange={(e) => setServiziData({ ...serviziData, veicoloId: e.target.options[e.target.selectedIndex].value })}
                                                        >
                                                            <option value={'Seleziona'}>Seleziona...</option>
                                                            {veicoliList.map(item => (
                                                                <option value={item.id} key={item.id}>{item.nome} - {item.modello}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                }

                                                <div className="col-span-3 sm:col-span-4">
                                                    <label htmlFor="durataMinuti" className="block text-sm font-medium text-gray-700">
                                                        Durata (minuti)
                                                    </label>
                                                    <div className="mt-1 flex rounded-md shadow-sm">
                                                        <select
                                                            disabled={readonly}
                                                            name="durataMinuti"
                                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md uppercase"
                                                            value={serviziData?.durataMinuti ? serviziData.durataMinuti : 30}
                                                            onChange={(e) => setServiziData({ ...serviziData, durataMinuti: Number(e.target.options[e.target.selectedIndex].value) })}
                                                        >
                                                            <option value={30}>30 minuti</option>
                                                            <option value={60}>60 minuti</option>

                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="col-span-3 sm:col-span-4">
                                                    <label htmlFor="istruttoreId" className="block text-sm font-medium text-gray-700">
                                                        Seleziona istruttore / insegnante
                                                    </label>
                                                    <select
                                                        disabled={readonly}
                                                        name="istruttoreId"
                                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md uppercase"
                                                        value={serviziData?.istruttoreId ? serviziData.istruttoreId : ''}
                                                        onChange={(e) => setServiziData({ ...serviziData, istruttoreId: e.target.options[e.target.selectedIndex].value })}
                                                    >
                                                        <option value={'Seleziona'}>Seleziona...</option>
                                                        {istruttori && istruttori?.map(item => (
                                                            <option value={item.user.id} key={item.id}>{item.user.profile.firstname + ' ' + item.user.profile.lastname}</option>
                                                        ))}
                                                        {insegnanti && insegnanti?.map(item => (
                                                            <option value={item.user.id} key={item.id}>{item.user.profile.firstname + ' ' + item.user.profile.lastname}</option>
                                                        ))}
                                                        {istruttoriinsegnanti && istruttoriinsegnanti?.map(item => (
                                                            <option value={item.user.id} key={item.id}>{item.user.profile.firstname + ' ' + item.user.profile.lastname}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </>
                                        }

                                        <div className="col-span-3 sm:col-span-4">
                                            <label htmlFor="inizioServizio" className="block text-sm font-medium text-gray-700">
                                                Inizio servizio
                                            </label>
                                            <div className="mt-1 relative rounded-md shadow-sm">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <CalendarIcon className="h-5 w-5 text-gray-400 z-10" aria-hidden="true" />
                                                </div>
                                                <DatePicker
                                                    locale={'it'}
                                                    selected={startDate}
                                                    onChange={handleChange}
                                                    showTimeSelect
                                                    filterTime={!userIsAdmin ? filterPassedTime : null}
                                                    excludeTimes={disponibilita}
                                                    minDate={!userIsAdmin ? new Date() : null}
                                                    minTime={new Date('July 1, 1999, 09:00:00')}
                                                    maxTime={new Date('July 1, 1999, 23:30:00')}
                                                    timeFormat="p"
                                                    dateFormat="Pp"
                                                    timeIntervals={30}
                                                    disabledKeyboardNavigation
                                                    withPortal
                                                    disabled={!readonly ? (serviziData?.tariffaId ? false : true) : true}
                                                    placeholderText={serviziData?.tariffaId ? 'Seleziona una data' : "Seleziona prima un veicolo"}
                                                    className={`focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md ${!serviziData.inizioServizio && 'text-gray-300'}`}
                                                />

                                            </div>
                                        </div>


                                        {router.asPath.includes('edit') &&
                                            <>
                                                <div className="col-span-3 sm:col-span-4">
                                                    <label htmlFor="istruttoreId" className="block text-sm font-medium text-gray-700">
                                                        Esito servizio
                                                    </label>
                                                    <select
                                                        name="esito"
                                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md uppercase"
                                                        value={serviziData.esito}
                                                        onChange={(e) => setServiziData({ ...serviziData, esito: e.target.options[e.target.selectedIndex].value })}
                                                    >
                                                        <option value={''}>Seleziona</option>
                                                        <option value={'idoneo'}>Idoneo</option>
                                                        <option value={'respinto'}>Respinto</option>
                                                        <option value={'assente'}>Assente</option>
                                                        <option value={'presente'}>Presente (solo per le guide)</option>
                                                        <option value={'guida_incompleta'}>Guida incompleta</option>
                                                        <option value={'guida_annullata_1'}>Guida annullata per maltempo</option>
                                                        <option value={'guida_annullata_2'}>Guida annullata per guasto meccanico</option>
                                                    </select>
                                                </div>
                                                
                                                {/* Campi valutazione - solo per servizi guida con esito presente */}
                                                {serviziData?.tariffa?.tipo?.tipo?.toLowerCase().includes('guida') && serviziData?.esito === 'presente' && (
                                                    <>
                                                        <div className="col-span-3 sm:col-span-4">
                                                            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Valutazione Allievo</h3>
                                                        </div>
                                                        
                                                        <div className="col-span-1 sm:col-span-1">
                                                            <label className="block text-sm font-medium text-gray-700">
                                                                Teoria
                                                            </label>
                                                            <select
                                                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                                value={serviziData.valutazioneTeoria || 0}
                                                                onChange={(e) => setServiziData({ ...serviziData, valutazioneTeoria: parseInt(e.target.value) })}
                                                            >
                                                                <option value={0}>Non effettuata</option>
                                                                <option value={1}>1 - Insufficiente</option>
                                                                <option value={2}>2 - Sufficiente</option>
                                                                <option value={3}>3 - Buono</option>
                                                                <option value={4}>4 - Molto Buono</option>
                                                                <option value={5}>5 - Eccellente</option>
                                                            </select>
                                                        </div>
                                                        
                                                        <div className="col-span-1 sm:col-span-1">
                                                            <label className="block text-sm font-medium text-gray-700">
                                                                Lento
                                                            </label>
                                                            <select
                                                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                                value={serviziData.valutazioneLento || 0}
                                                                onChange={(e) => setServiziData({ ...serviziData, valutazioneLento: parseInt(e.target.value) })}
                                                            >
                                                                <option value={0}>Non effettuata</option>
                                                                <option value={1}>1 - Insufficiente</option>
                                                                <option value={2}>2 - Sufficiente</option>
                                                                <option value={3}>3 - Buono</option>
                                                                <option value={4}>4 - Molto Buono</option>
                                                                <option value={5}>5 - Eccellente</option>
                                                            </select>
                                                        </div>
                                                        
                                                        <div className="col-span-1 sm:col-span-1">
                                                            <label className="block text-sm font-medium text-gray-700">
                                                                Veloce
                                                            </label>
                                                            <select
                                                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                                value={serviziData.valutazioneVeloce || 0}
                                                                onChange={(e) => setServiziData({ ...serviziData, valutazioneVeloce: parseInt(e.target.value) })}
                                                            >
                                                                <option value={0}>Non effettuata</option>
                                                                <option value={1}>1 - Insufficiente</option>
                                                                <option value={2}>2 - Sufficiente</option>
                                                                <option value={3}>3 - Buono</option>
                                                                <option value={4}>4 - Molto Buono</option>
                                                                <option value={5}>5 - Eccellente</option>
                                                            </select>
                                                        </div>
                                                        
                                                        <div className="col-span-1 sm:col-span-1">
                                                            <label className="block text-sm font-medium text-gray-700">
                                                                Guida su Strada
                                                            </label>
                                                            <select
                                                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                                value={serviziData.valutazioneGuida || 0}
                                                                onChange={(e) => setServiziData({ ...serviziData, valutazioneGuida: parseInt(e.target.value) })}
                                                            >
                                                                <option value={0}>Non effettuata</option>
                                                                <option value={1}>1 - Insufficiente</option>
                                                                <option value={2}>2 - Sufficiente</option>
                                                                <option value={3}>3 - Buono</option>
                                                                <option value={4}>4 - Molto Buono</option>
                                                                <option value={5}>5 - Eccellente</option>
                                                            </select>
                                                        </div>
                                                    </>
                                                )}
                                                
                                                <div className="col-span-3 sm:col-span-4">
                                                    <div className="bg-white shadow  py-5 sm:rounded-lg sm:p-1">
                                                        <div className="md:grid md:grid-cols-1">
                                                            {/* <div className="md:col-span-1">
                                                                <h3 className="text-lg font-medium leading-6 text-gray-900">Elimina</h3>
                                                               
                                                            </div> */}
                                                            <div className="mt-5 md:mt-0 md:col-span-2">
                                                                <div className="space-y-6">
                                                                    <ButtonWithIconLeft clicked={() => router.push(`/allievi/servizi/delete/${sid}?allievoId=${allievoId ? allievoId : false}`)} icon={ExclamationTriangleIcon} text={'Elimina servizio'} color={'red'} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        }

                                    </div>
                                </form>

                            </div>
                        </div>
                    }
                </div>
            </div>
        </>
    )
}