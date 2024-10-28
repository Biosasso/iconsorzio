import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import fetcher, { fetcherWithData } from '@/lib/fetch'

import Layout from '../../../components/layout/layout'
import Loader from '../../../components/UI/loader'
import Table from '../../../components/tariffe/table'
import Tabs from '../../../components/tariffe/tabs'
import TipologiaForm from '../../../components/tariffe/formTipologia'


const pageInfo = {
    page: 'tariffe',
    createLink: 'new',
    title: 'Tariffe'
}

export default function Autoscuole() {

    const { data: tariffaTipo } = useSWR('/api/tariffe/tariffeTipoList', fetcher);

    const router = useRouter();

    const [tableData, setTableData] = useState();

    const [activeTab, setActiveTab] = useState();

    useEffect(() => {

        if (tariffaTipo) {
            setTableData(tariffaTipo);
            setActiveTab(router.asPath.includes('#') ? () => { const tabs = router.asPath.split('#'); return tabs[1] } : tariffaTipo[0]?.tipo_cod)
        }

    }, [tariffaTipo]);

    return (
        <Layout
            page={pageInfo.page}
            createLink={pageInfo.createLink}
            title={pageInfo.title}
            tableData={tableData ? tableData : null}
            setTableData={setTableData}
        >
            {tableData &&
                <Tabs
                    tabs={tableData}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
            }
            {tableData &&
                <>
                    {activeTab === 'newTipo'
                        ?
                        <TipologiaForm router={router} tariffaTipo={tariffaTipo} />
                        :
                        tableData.map(item => {
                            if (item.tipo_cod === activeTab) {
                                return <Table key={item.id} tableData={item.Tariffe} selectedRow={router.query.identifier} />
                            }
                        })
                    }
                </>
            }



            {!tableData && <Loader />}
        </Layout>
    )

}
