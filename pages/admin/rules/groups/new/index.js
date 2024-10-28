import React, { useState, useContext } from 'react'
import fetcher from '@/lib/fetch'
import useSWR from "swr";
import NotificationsContext from '../../../../../store/notifications';

import Layout from '../../../../../components/layout/layout'
import RulesGroupNew from '../../../../../components/admin/rules/group/new';
import { useRouter } from 'next/router';
import Loader from '../../../../../components/UI/loader';

const pageInfo = {
    page: 'admin/rules/groups/list',
    createLink: '',
    title: 'Crea nuovo gruppo di ruoli utente'
}

export default function GroupsNew() {

    const notify = useContext(NotificationsContext);
    const router = useRouter();

    const { data: isActive, error } = useSWR('/api/admin/company/isActive', fetcher);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const createRulesGroups = async () => {
        notify.loading.setShow(true)
        const data = {
            name: name,
            description: description,
            companyId: isActive.isActive
        }
        const res = await fetch('/api/admin/rules/groups/new', {
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        });

        const result = await res.json();

        if (result.statusCode === 200) {
            notify.success.setTitle(`Gruppo creato correttamente`);
            notify.loading.setShow(false)
            notify.success.setShow(true)

            setTimeout(() => {
                router.push(`/admin/rules/groups/edit/${result.createdGroup.id}`);
            }, 1000)

        }
        if (result.statusCode === 400) {
            notify.error.setTitle(`Errore, controlla i dati inseriti`);
            notify.error.setShow(true)
            notify.loading.setShow(false)
        }
    }

    const Button1 = (data) => {
        return (
            <button
                onClick={() => createRulesGroups()}
                className="order-0 mx-6 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:order-1 sm:ml-3">
                Salva
            </button>
        )
    }

    return (
        <Layout
            page={pageInfo.page}
            createLink={pageInfo.createLink}
            title={pageInfo.title}
            Button1={Button1}
        >
            {isActive && <RulesGroupNew name={name} setName={setName} description={description} setDescription={setDescription} />}
            {!isActive && <Loader />}
            {error && 'Errore nel caricamento, prova a ricaricare la pagina! Ci scusiamo per il disguido'}
        </Layout>
    )
}
