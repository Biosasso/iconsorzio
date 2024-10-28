import React, { useEffect, useState, useContext } from 'react'
import NotificationsContext from '../../../../store/notifications';
import useSWR from 'swr'
import fetcher from '@/lib/fetch'
import { useRouter } from 'next/router';

import Layout from '../../../../components/layout/layout';
import NewUser from '../../../../components/admin/user/new';
import Loader from '../../../../components/UI/loader';


export default function User() {

    const { data: isActive } = useSWR('/api/admin/company/isActive', fetcher);

    const { data: ifUserIsAdmin } = useSWR(`/api/admin/users/ifUserIsAdmin`, fetcher);

    const { data: autoscuole } = useSWR('/api/autoscuole/list', fetcher);

    const notify = useContext(NotificationsContext);

    const router = useRouter();

    const [userData, setUserData] = useState({
        email: '',
        profile: {
            firstname: '',
            lastname: '',
            address: '',
            zip: '',
            city: '',
            state: '',
            country: '',
            phone: '',
        }
    });
    const [selectedRule, setSelectedRule] = useState();
    const [appartenenza, setAppartenenza] = useState('consorzio');
    const [selectedAutoscuola, setSelectedAutoscuola] = useState('');

    useEffect(() => {
        if (autoscuole && appartenenza === 'consorzio') {
            setSelectedAutoscuola(autoscuole[0].id)
        }
    }, [autoscuole])

    const createUser = async () => {

        if (!userData.email) {
            notify.error.set({ title: 'Devi inserire il campo Email' });
            return
        }
        if (!userData.profile.firstname) {
            notify.error.set({ title: 'Devi inserire il campo Nome' });
            return
        }
        if (!userData.profile.lastname) {
            notify.error.set({ title: 'Devi inserire il campo Cognome' });
            return
        }
        if (!userData.profile.phone) {
            notify.error.set({ title: 'Devi inserire il campo Telefono' });
            return
        }
        if (!selectedRule) {
            notify.error.set({ title: `Devi assegnare un permesso all'utente` });
            return
        }

        notify.loading.setShow(true);

        try {
            const res = await fetch('/api/admin/users/new', {
                method: 'POST',
                body: JSON.stringify({
                    userData: userData,
                    selectedRule: selectedRule,
                    companyId: isActive.isActive,
                    appartenenza: appartenenza,
                    autoscuolaAppartenenza: appartenenza === 'autoscuola' ? (
                        appartenenza === 'autoscuola' && (selectedAutoscuola === '' || selectedAutoscuola === null)
                            ?
                            autoscuole[0]?.id
                            :
                            selectedAutoscuola
                    ) : null,
                }),
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            const result = await res.json();

            if (result.statusCode === 200) {
                try {

                    const sendEmail = await fetch('/api/admin/users/sendEmailNewUser', {
                        method: 'POST',
                        body: JSON.stringify({ emailTo: result.email, pass: result.password }),
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    });
                    const emailResult = await sendEmail.json();

                    if (emailResult.statusCode === 200) {
                        notify.success.set({
                            title: 'Utente creato con successo!',
                            message: `Un'email con la password di accesso è stata inviata al nuovo utente!`
                        });

                        setTimeout(() => {
                            router.push(`/admin/users/list?identifier=${result.id}`)
                        }, 500)
                    }
                }
                catch (err) {
                    notify.error.set({ title: `Errore nella creazione dell'utente` });
                }
            }
        } catch (err) {
            notify.error.set({ title: `Errore nella creazione dell'utente` });
        }
    }

    const Button1 = (data) => {

        return (
            <button
                onClick={() => createUser()}
                className="order-0 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:order-1 sm:ml-3">
                Salva
            </button>
        )
    }

    return (
        <Layout
            page={`admin/users/list`}
            createLink={'push'}
            title="Crea nuovo utente"
            Button1={Button1}
        >
            {isActive && autoscuole ?
                <NewUser
                    userData={userData}
                    setUser={setUserData}
                    selectedRule={selectedRule}
                    setSelectedRule={setSelectedRule}
                    isActive={isActive}
                    ifUserIsAdmin={ifUserIsAdmin}
                    appartenenza={appartenenza}
                    setAppartenenza={setAppartenenza}
                    selectedAutoscuola={selectedAutoscuola}
                    setSelectedAutoscuola={setSelectedAutoscuola}
                    autoscuole={autoscuole}
                />
                : <Loader />}

        </Layout>
    )


}
