import React from 'react'
import fetcher from '@/lib/fetch'
import Layout from '../../../../../components/layout/layout'

import useSWR from "swr";
import List from '../../../../../components/admin/rules/group/list';
import Loader from '../../../../../components/UI/loader';

// import fg from 'fast-glob'

const pageInfo = {
    page: 'admin/rules/groups',
    createLink: 'new',
    title: 'Lista gruppi ruoli utente'
}

export default function GroupsList() {

    const { data: isActive } = useSWR('/api/admin/company/isActive', fetcher);
    const { data: groups, error } = useSWR(isActive ? '/api/admin/rules/groups/list?isActive=' + isActive.isActive : null, fetcher);

    return (
        <Layout
            page={pageInfo.page}
            createLink={pageInfo.createLink}
            title={pageInfo.title}
        >
            {groups && <List groups={groups} />}
            {!groups && <Loader />}
            {error && 'Errore nel caricamento, prova a ricaricare la pagina! Ci scusiamo per il disguido'}
        </Layout>
    )
}
