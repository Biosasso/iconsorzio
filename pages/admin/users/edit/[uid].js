import React, { useEffect, useState, useContext } from 'react'
import useSWR from 'swr'
import fetcher, { fetcherWithData } from '@/lib/fetch'
import NotificationsContext from '../../../../store/notifications';

import Layout from '../../../../components/layout/layout';
import EditUser from '../../../../components/admin/user/edit';
import Loader from '../../../../components/UI/loader';

export default function User({ uid }) {

    const notify = useContext(NotificationsContext);

    const { data: fetchUserData } = useSWR(uid ? `/api/admin/users/${uid}` : null, fetcher);

    const { id, user, rulesGroup, companyId, isActive } = fetchUserData ? fetchUserData : { id: null, user: null, rulesGroup: null, companyId: null, isActive: null };

    const { data: ifUserIsAdmin } = useSWR(`/api/admin/users/ifUserIsAdmin`, fetcher);

    const { data: autoscuole } = useSWR('/api/autoscuole/list', fetcher);

    const [userData, setUserData] = useState();
    const [selectedRule, setSelectedRule] = useState();
    const [appartenenza, setAppartenenza] = useState('consorzio');
    const [selectedAutoscuola, setSelectedAutoscuola] = useState('');

    useEffect(() => {
        setAppartenenza(fetchUserData ? fetchUserData.appartenenza : 'consorzio')
        setSelectedAutoscuola(fetchUserData ? fetchUserData.autoscuolaAppartenenza : '')
    }, [fetchUserData])

    useEffect(() => {
        setUserData(user)
        setSelectedRule(rulesGroup?.id)
    }, [fetchUserData]);

    const updateUser = async () => {

        notify.loading.setShow(true)

        if (appartenenza === 'autoscuola' && (selectedAutoscuola === '' || selectedAutoscuola === null)) {
            setSelectedAutoscuola
        }
        try {
            const res = await fetch('/api/admin/users/update', {
                method: 'POST',
                body: JSON.stringify({
                    userData: userData,
                    selectedRule: selectedRule,
                    userCompanyId: id,
                    appartenenza: appartenenza,
                    selectedAutoscuola: appartenenza === 'autoscuola' ? (
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
                notify.success.setTitle('Aggiornamento completato');
                notify.success.setMessage('');
                notify.loading.setShow(false)
                notify.success.setShow(true);
            }
            if (result.statusCode === 400) {
                notify.error.setTitle("Errore nell'aggiornamento");
                notify.error.setMessage(false);
                notify.loading.setShow(false)
                notify.error.setShow(true);
            }

        } catch (err) {
            notify.error.setTitle("Errore interno, riprova più tardi");
            notify.error.setMessage(false);
            notify.loading.setShow(false)
            notify.error.setShow(true);
        }
    }

    const Button1 = (data) => {

        return (
            <button
                onClick={() => updateUser()}
                className="order-0 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:order-1 sm:ml-3">
                Salva
            </button>
        )
    }

    return (
        <Layout
            page={`admin/users/list`}
            createLink={'push'}
            title="Modifica utente"
            Button1={Button1}
        >
            {(userData && rulesGroup && autoscuole)
                ?
                < EditUser
                    userCompanyId={id}
                    userData={userData}
                    setUser={setUserData}
                    companyId={companyId}
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
                :
                <Loader />
            }
        </Layout>
    )


}

export async function getServerSideProps(context) {

    const { uid } = context.query;

    return {
        props: {
            uid: uid
        }
    }
}