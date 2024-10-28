import React, { useEffect, useState, useContext } from 'react'
import NotificationsContext from '../../../../store/notifications'
import Layout from '../../../../components/layout/layout'
import fetcher from '@/lib/fetch'
import RadiobuttonChangeCompany from '../../../../components/admin/switchCompany/radiobuttonChangeCompany'
import ButtonWithIconLeft from '../../../../components/UI/button/buttonWithIconLeft'
import { ArrowsUpDownIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import Loader from '../../../../components/UI/loader'

const pageInfo = {
    page: 'admin/switchCompany',
    createLink: false,
    title: 'Cambia azienda'
}

function CompanySwitch() {

    const router = useRouter();

    const notify = useContext(NotificationsContext);

    const { data: companies } = useSWR('/api/admin/company/list', fetcher);

    const { data: isActive } = useSWR(() => companies ? '/api/admin/company/isActive' : null, fetcher)

    const [selected, setSelected] = useState('');

    useEffect(() => {
        if (isActive) { setSelected(isActive.isActive) }
    }, [isActive])

    async function switchToOtherCompany() {
        const update = await fetch('/api/admin/company/switch', {
            method: 'POST',
            body: JSON.stringify({ selected: selected }),
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const updated = await update.json();
        if (updated.statusCode === 200) {
            notify.success.setTitle(updated.message)
            notify.success.setShow(true)
            router.reload();
        }
        else {
            notify.error.setTitle(updated.message)
            notify.error.setShow(true)
        }
    }
    const Button1 = () => {
        return <ButtonWithIconLeft
            clicked={() => { switchToOtherCompany() }}
            icon={ArrowsUpDownIcon}
            text="Cambia azienda" />;
    }

    return (
        <Layout
            page={pageInfo.page}
            createLink={pageInfo.createLink}
            title={pageInfo.title}
            Button1={Button1}
        >
            <div className='p-6'>
                {isActive ?
                    <RadiobuttonChangeCompany selected={selected} setSelected={setSelected} companies={companies} />
                    :
                    <Loader />
                }
            </div>
        </Layout>
    )
}

export default CompanySwitch;
