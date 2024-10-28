import React, { useContext, useEffect, useState } from 'react'
import NotificationsContext from '../../../../store/notifications'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import Layout from '../../../../components/layout/layout'
import Loader from '../../../../components/UI/loader'
import fetcher from '@/lib/fetch'
import { TrashIcon } from '@heroicons/react/24/solid'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const pageInfo = {
    page: 'admin/rules',
    createLink: 'new',
    title: 'Ruoli utente attivi'
}

export default function Rules() {

    const router = useRouter();
    const notify = useContext(NotificationsContext)

    const { data: isActive } = useSWR('/api/admin/company/isActive', fetcher);
    const { data: rules } = useSWR(isActive ? '/api/admin/rules/list?isActive=' + isActive.isActive : null, fetcher)

    const [tableData, setTableData] = useState();

    useEffect(() => {

        if (router.query?.history === 'back') {
            router.replace('/' + pageInfo.page + '/list');
            setTimeout(() => {
                router.reload();
            }, 500)
        }
    }, [])

    useEffect(() => {
        if (rules) {
            setTableData(rules)
        }

    }, [rules])


    const deleteRule = async (ruleId) => {

        const res = await fetch('/api/admin/rules/delete', {
            body: JSON.stringify({ id: ruleId }),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        });

        const result = await res.json();

        if (result.statusCode === 200) {
            notify.success.set({
                title: result.title
            })

            setTimeout(() => {
                router.reload()
            }, 1000)
        }
        if (result.statusCode === 400) {
            notify.error.set({
                title: result.message
            })
        }
    }

    return (
        <Layout
            page={pageInfo.page}
            createLink={pageInfo.createLink}
            title={pageInfo.title}
            tableData={tableData}
            setTableData={setTableData}
        >
            {!tableData ? <Loader />
                :
                <div className="p-6">
                    <ul role="list" className="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-1 lg:grid-cols-1">
                        {tableData.map((rule) => (
                            <li key={rule.accessCode} className="col-span-1 flex shadow-sm rounded-md">
                                <div
                                    className={classNames(
                                        rule.bgColor,
                                        'flex-shrink-0 flex items-center justify-center w-16 text-white text-sm font-medium rounded-l-md'
                                    )}
                                >
                                    {rule.description.substring(0, 2).toUpperCase()}
                                </div>
                                <div className="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate">
                                    <div className="flex-1 px-4 py-2 text-sm truncate">
                                        <span className="text-gray-900 font-medium hover:text-gray-600">
                                            {rule.description}
                                        </span>
                                        <p className="text-gray-500">Pagina: {rule.accessCode}</p>
                                    </div>
                                    <div className="flex-shrink-0 pr-2">
                                        <button
                                            type="button"
                                            onClick={() => deleteRule(rule.id)}
                                            className="w-8 h-8 bg-white inline-flex items-center justify-center text-gray-400 rounded-full bg-transparent hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            <span className="sr-only">Open options</span>
                                            <TrashIcon className="w-5 h-5" aria-hidden="true" />
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            }
        </Layout>
    )
}