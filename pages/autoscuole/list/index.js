import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import fetcher from '../../../lib/fetch'

import Layout from '../../../components/layout/layout'
import Table from '../../../components/autoscuole/table';
import Tabs from '../../../components/autoscuole/tabs'
import Loader from '../../../components/UI/loader'


const pageInfo = {
    page: 'autoscuole',
    createLink: 'new',
    title: 'Autoscuole'
}

export default function Autoscuole() {

    const { data: autoscuole } = useSWR('/api/autoscuole/list', fetcher)

    const { data: count } = useSWR(autoscuole ? '/api/autoscuole/counter' : null, fetcher);

    const router = useRouter();

    const [tableData, setTableData] = useState();

    const [activeTab, setActiveTab] = useState();

    const [autoscuoleActive, setAutoscuoleActive] = useState([]);
    const [autoscuoleDeactivated, setAutoscuoleDeactivated] = useState([]);

    const tabs = [
        { name: 'Autoscuole attive', href: '#active', current: activeTab, count: count?.active },
        { name: 'Autoscuole disattivate', href: '#deactivated', current: !activeTab, count: count?.deactivated },
    ]

    useEffect(() => {
        if (autoscuole) {
            const autoscuoleActiveTmp = [];
            const autoscuoleDeactivatedTmp = [];

            autoscuole.forEach(item => {
                if (item.isActive) {
                    autoscuoleActiveTmp.push(item);
                }
                else {
                    autoscuoleDeactivatedTmp.push(item)
                }
            })
            setAutoscuoleActive(autoscuoleActiveTmp);
            setAutoscuoleDeactivated(autoscuoleDeactivatedTmp)
            setTableData(autoscuoleActiveTmp)
        }
    }, [autoscuole]);

    useEffect(() => {
        if (autoscuole) {
            if (activeTab) {
                setTableData(autoscuoleActive)
            }
            else {
                setTableData(autoscuoleDeactivated)
            }
        }
    }, [activeTab])

    useEffect(() => {
        setActiveTab(true)
    }, [])

    return (
        <Layout
            page={pageInfo.page}
            createLink={pageInfo.createLink}
            title={pageInfo.title}
            tableData={tableData}
            setTableData={setTableData}
        >
            {count &&
                <Tabs
                    tabs={tabs}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
            }
            {autoscuole && <Table
                tableData={tableData}
                selectedRow={router.query.identifier}
                notModified={router.query.notModified} />
            }
            {!autoscuole && <Loader />}
        </Layout>
    )

}
