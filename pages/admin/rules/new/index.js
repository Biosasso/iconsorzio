import React from 'react'
import fetcher from '../../../../lib/fetch'
import NewRules from '../../../../components/admin/rules/new'
import Layout from '../../../../components/layout/layout'

import useSWR from "swr";
import Loader from '../../../../components/UI/loader';

// import fg from 'fast-glob'

const pageInfo = {
    page: 'admin/rules/list',
    createLink: '',
    title: 'Crea nuovo ruolo utente'
}

export default function New() {

    // const { data, error } = useSWR('/api/admin/rules/list', fetcher);
    const { data: isActive } = useSWR('/api/admin/company/isActive', fetcher);
    const { data: rules } = useSWR(isActive ? '/api/admin/rules/list?isActive=' + isActive.isActive : null, fetcher)

    const { data: serverPages, error } = useSWR(rules ? '/api/admin/rules/getPages' : null, fetcher);

    return (
        <Layout
            page={pageInfo.page}
            createLink={pageInfo.createLink}
            title={pageInfo.title}
        >
            {serverPages && <NewRules rules={rules} companyId={isActive.isActive} pages={serverPages} />}
            {!serverPages && <Loader />}
            {error && 'Errore nel caricamento, prova a ricaricare la pagina! Ci scusiamo per il disguido'}
        </Layout>
    )
}
