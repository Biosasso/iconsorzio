import React, { useEffect, useState, useContext } from 'react'
import NotificationsContext from '../../../store/notifications';
import { ValidateEmailFormat } from '../../../utils/validateEmail';
import Layout from '../../../components/layout/layout'
import EditAutoscuola from '../../../components/autoscuole/edit';
import useSWR from 'swr';
import fetcher from '@/lib/fetch'
import Loader from '../../../components/UI/loader';

export default function Edit({ id }) {

    const notify = useContext(NotificationsContext);

    const { data: autoscuola } = useSWR(`/api/autoscuole/edit/${id}`, fetcher);

    const [data, setData] = useState();

    const [consorziato, setConsorziato] = useState();

    const [validationFields, setValidationFields] = useState([]);

    const modificaAutoscuola = async () => {

        notify.loading.setShow(true);

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

            data.consorzioToggle = consorziato

            try {
                const res = await fetch('/api/autoscuole/update', {
                    body: JSON.stringify({ data: data }),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'POST'
                })

                const result = await res.json();

                if (result.statusCode === 400) {
                    if (result.statusCode === 400) {
                        notify.error.setTitle("Errore nell'aggiornamento");
                        notify.error.setMessage(false);
                        notify.loading.setShow(false)
                        notify.error.setShow(true);
                    }
                }
                if (result.statusCode === 200) {
                    notify.success.setTitle('Aggiornamento completato');
                    notify.success.setMessage(false);
                    notify.loading.setShow(false)
                    notify.success.setShow(true);
                    setValidationFields([])
                }
            }
            catch (err) {
                notify.error.setTitle("Errore nell'aggiornamento");
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

        return (
            <button
                onClick={() => modificaAutoscuola()}
                className="order-0 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:order-1 sm:ml-3">
                Salva
            </button>
        )
    }

    useEffect(() => {
        if (autoscuola) {
            setData(autoscuola)
            setConsorziato(autoscuola.consorzioToggle);
        }
    }, [autoscuola]);

    return (
        <Layout
            page={'autoscuole/list'}
            createLink={''}
            title={'Autoscuole'}
            Button1={Button1}
        >
            {data ?
                <EditAutoscuola
                    id={id}
                    autoscuola={data}
                    setAutoscuola={setData}
                    consorziato={consorziato}
                    setConsorziato={setConsorziato}
                    notify={notify}
                    validationFields={validationFields}
                    setValidationFields={setValidationFields}
                />
                :
                <Loader />}
        </Layout>
    )
}

export async function getServerSideProps(context) {

    const { aid } = context.query

    return {
        props: {
            id: aid
        }
    }
}