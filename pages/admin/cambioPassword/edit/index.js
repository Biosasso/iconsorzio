import React, { useState, useContext } from 'react'
import NotificationsContext from '../../../../store/notifications'
import Layout from '@/components/layout/layout'
import fetcher from '@/lib/fetch'
import { ShieldCheckIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import Loader from '@/components/UI/loader'
import Form from '../../../../components/admin/cambioPassword/form'

const pageInfo = {
    page: 'admin/cambioPassword/edit',
    createLink: false,
    title: 'Cambio password'
}

export default function CompanySwitch() {

    const router = useRouter();

    const notify = useContext(NotificationsContext);

    const { data: isActive } = useSWR('/api/admin/company/isActive', fetcher)

    const [password, setPassword] = useState('')
    const [checkPassword, setCheckPassword] = useState('')
    const [validatePassword, setValidatePassword] = useState()


    async function updatePassword() {
        const update = await fetch('/api/admin/cambioPassword/update', {
            method: 'POST',
            body: JSON.stringify({
                isActive: isActive,
                password: password
            }),
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const updated = await update.json();
        if (updated.statusCode === 200) {
            notify.success.setTitle(updated.message)
            notify.success.setShow(true)
            setPassword('')
            setCheckPassword('')
            setValidatePassword(undefined)
        }
        else {
            notify.error.setTitle(updated.message)
            notify.error.setShow(true)
        }
    }
    const Button1 = () => {
        return <ButtonWithIconLeft
            clicked={() => { updatePassword() }}
            icon={ShieldCheckIcon}
            text="Cambia password"
            disabled={!validatePassword}
            color={validatePassword ? 'indigo' : 'gray'}
        />;
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
                    <Form
                        password={password}
                        setPassword={setPassword}
                        checkPassword={checkPassword}
                        setCheckPassword={setCheckPassword}
                        validatePassword={validatePassword}
                        setValidatePassword={setValidatePassword}
                    />
                    :
                    <Loader />
                }
            </div>
        </Layout>
    )
}

export function ButtonWithIconLeft({ icon, clicked, text, color, disabled }) {

    const item = { icon: icon };


    return (
        <button
            onClick={clicked}
            type="button"
            disabled={disabled}
            className={`w-full inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-${color ? color : 'indigo'}-600 hover:bg-${color ? color : 'indigo'}-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${color ? color : 'indigo'}-500 ${!disabled ? 'cursor-pointer' : 'cursor-not-allowed'}`}
        >

            <item.icon className="-ml-1 mr-3 h-5 w-5" aria-hidden="true" />
            {text ? text : 'Copy to clipboard'}
        </button>
    )
}
