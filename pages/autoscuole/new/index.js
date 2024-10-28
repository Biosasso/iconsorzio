import React, { useState, useContext, useEffect } from 'react'

import Layout from '../../../components/layout/layout'
import NewAutoscuola from '../../../components/autoscuole/new';
import useSWR from 'swr';
import fetcher from '@/lib/fetch'
import Loader from '../../../components/UI/loader';
import { useRouter } from 'next/router';
import NotificationsContext from '../../../store/notifications';
import { ValidateEmailFormat } from '../../../utils/validateEmail';

export default function New() {

    const router = useRouter();

    const notify = useContext(NotificationsContext)

    const { data: activeCompany } = useSWR('/api/admin/company/isActive', fetcher);

    const [consorziato, setConsorziato] = useState(true);

    const [validationFields, setValidationFields] = useState([]);


    const [data, setData] = useState({
        companyId: activeCompany?.isActive,
        codMotorizzazione: '', //Primary Key
        denominazione: '',
        consorzioToggle: consorziato,
        ragSoc: '',
        provincia: '',
        comune: '',
        indirizzo: '',
        nCiv: '',
        codFisc: '',
        partIva: '',
        tel1: '',
        tel2: '',
        cel: '',
        fax: '',
        email: '',
        pec: '',
        sdi: '',
        iban: '',
        note: '',
    });

    const aggiungiAutoscuola = async () => {

        notify.loading.setShow(true)

        const validateEmail = await ValidateEmailFormat(data.email);

        if (!validateEmail) {
            notify.error.setTitle("Formato email errato");
            notify.error.setMessage(false);
            notify.loading.setShow(false)
            notify.error.setShow(true);
            setValidationFields('email')
            return
        }

        let validation = [];

        Object.keys(data).map(function (key, index) {
            if (
                key === 'denominazione'
                || key === 'ragSoc'
                || key === 'provincia'
                || key === 'comune'
                || key === 'indirizzo'
                || key === 'nCiv'
                || key === 'codFisc'
                || key === 'partIva'
                || key === 'codMotorizzazione'
                || key === 'tel1'
                || key === 'email'
            ) {
                if (!data[key] || data[key] === '') {
                    if (validation.length === 0) {
                        validation.push(key);
                        notify.error.setTitle("Devi compilare tutti i campi obbligatori");
                        notify.error.setMessage(false);
                        notify.loading.setShow(false)
                        notify.error.setShow(true);

                    }
                }
            }
        });
        if (validation.length === 0) {
            try {

                const res = await fetch('/api/autoscuole/new', {
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'POST'
                });

                const result = await res.json();

                if (result.statusCode === 400) {
                    notify.error.setTitle("Errore nell'aggiornamento");
                    notify.error.setMessage(false);
                    notify.loading.setShow(false)
                    notify.error.setShow(true);
                }

                if (result.statusCode === 200) {
                    notify.success.setTitle('Inserimento completato');
                    notify.success.setMessage(false);
                    notify.loading.setShow(false)
                    notify.success.setShow(true);
                    router.push('/autoscuole/list')
                }


            }
            catch (err) {
                notify.error.setTitle("Errore interno, riprova più tardi, ci scusiamo per il disguido.");
                notify.error.setMessage(false);
                notify.loading.setShow(false)
                notify.error.setShow(true);
            }
        }
        else {
            notify.loading.setShow(false)
            setValidationFields(validation)
        }

    }

    const Button1 = (data) => {
        return <button
            onClick={() => aggiungiAutoscuola()}
            className="order-0 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:order-1 sm:ml-3">
            Salva
        </button>
    }

    useEffect(() => {
        if (activeCompany) {
            setData({
                companyId: activeCompany.isActive,
                codMotorizzazione: '',
                denominazione: '',
                consorzioToggle: consorziato,
                ragSoc: '',
                provincia: '',
                comune: '',
                indirizzo: '',
                nCiv: '',
                codFisc: '',
                partIva: '',
                tel1: '',
                tel2: '',
                cel: '',
                fax: '',
                email: '',
                pec: '',
                sdi: '',
                iban: '',
                note: '',
            })
        }
    }, [activeCompany])

    return (
        <Layout
            page={'autoscuole/list'}
            createLink={'push'}
            title={'Autoscuole'}
            Button1={Button1}
        >
            {activeCompany
                ?
                <NewAutoscuola
                    activeCompany={activeCompany.isActive}
                    data={data}
                    setData={setData}
                    consorziato={consorziato}
                    setConsorziato={setConsorziato}
                    validationFields={validationFields}
                    notify={notify}
                />
                :
                <Loader />}
        </Layout>
    )
}
