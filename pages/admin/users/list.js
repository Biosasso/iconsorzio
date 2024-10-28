import React, { useState, useEffect } from 'react'
import useSWR from 'swr'
import fetcher from '@/lib/fetch'
import Layout from '../../../components/layout/layout';
import Table from '../../../components/admin/user/table';
import Tabs from '../../../components/admin/user/tabs';
import Loader from '../../../components/UI/loader';

export default function List() {

    const { data: users, error } = useSWR('/api/admin/users/list', fetcher);
    const { data: userCount } = useSWR(users ? '/api/admin/users/counter' : null, fetcher)

    const [tableData, setTableData] = useState();
    const [activeTab, setActiveTab] = useState(true);

    const tabs = [
        { name: 'Utenti attivi', href: '#active', current: activeTab, count: userCount?.active },
        { name: 'Utenti disattivati', href: '#deactivated', current: !activeTab, count: userCount?.deactivated },
    ]

    useEffect(() => {
        if (users) {
            setTableData(users.active)
        }
    }, [users]);

    useEffect(() => {
        if (users) {
            if (activeTab) {
                setTableData(users.active)
            }
            else {
                setTableData(users.deactivated)
            }
        }
    }, [activeTab])

    return (
        <Layout
            page="admin/users"
            createLink={'new'}
            title={'Lista utenti'}
            tableData={tableData}
            setTableData={setTableData}
        >
            {userCount &&
                <Tabs
                    tabs={tabs}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
            }
            {!users && <Loader />}
            {users && <Table tableData={tableData} />}
            {error && <p>Errore nel caricamento dei dati, prova ad aggiornare la pagina</p>}

        </Layout>
    )
}
