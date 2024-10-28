import React, { useState } from 'react'
import { DateTime } from "datetime-next";
import Layout from '@/components/layout/layout';
import useSWR from 'swr'
import { fetcherWithData } from '@/lib/fetch'
import Table from '@/components/esami/table';
// import Style from '@/components/esami/print.css'

export default function List() {

    const [selectedDay, setSelectedDay] = useState(new Date());
    const [selectedType, setSelectedType] = useState('primo_esame');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const pageInfo = {
        page: 'esami/list',
        createLink: false,
        title: `Esami dal ${new DateTime(startDate).getString('DD/MM/YYYY')} al ${new DateTime(endDate).getString('DD/MM/YYYY')}`
    }

    const { data: esami } = useSWR(startDate && endDate ? {
        url: '/api/esami/list',
        data: { startDate, endDate }
    } : null, fetcherWithData);

    const Button1 = () => {
        return (
            <button
                onClick={() => window.print()}
                className="order-0 mx-6 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:order-1 sm:ml-3">
                Stampa
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
            <div className='bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 h-full block'>
                <div className='h-full'>
                    <style jsx>{`
                        @media print {
                            @page {
                                size: A4 portrait
                            }
                        }
                    `}</style>
                    <Table
                        esami={esami}
                        selectedDay={selectedDay}
                        selectedType={selectedType}
                        setSelectedType={setSelectedType}
                        startDate={startDate}
                        setStartDate={setStartDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                    />

                </div>
            </div>
        </Layout>
    )
}