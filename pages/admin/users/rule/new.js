import { getSession } from 'next-auth/react'
import React from 'react'
import useSWR from 'swr'
import fetch from '../../../../lib/fetch'
import Layout from '../../../../components/layout/layout'
import NewUserRuleForm from '../../../../components/admin/user/rule/new'
import Loader from '../../../../components/UI/loader'

export default function NewUserRule({ userId }) {

    const { data, error } = useSWR('/api/admin/users/rule/getRules', fetch)

    return (
        <Layout
            page="admin/users"
            createLink={false}
            title="Aggiungi permesso utente"
        >
            {data ? <NewUserRuleForm rules={data} userId={userId} /> : <Loader />}
        </Layout>
    )
}

export async function getServerSideProps(context) {

    const query = context.query

    return {
        props: {
            userId: query.id
        }
    }
}