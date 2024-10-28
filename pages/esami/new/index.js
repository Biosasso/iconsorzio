import React, { useState, useContext, useEffect } from 'react'
import NotificationsContext from '../../../store/notifications';
import Layout from '@/components/layout/layout';
import useSWR, { useSWRConfig } from 'swr'
import fetcher, { fetcherWithData } from '@/lib/fetch'
import Form from '@/components/esami/form';
import Table from '@/components/esami/tableBlocchi';
import { DateTime } from 'datetime-next';

export default function New() {

    DateTime.setDefaultLocale('it-IT');

    const notify = useContext(NotificationsContext);

    const { mutate } = useSWRConfig()

    const [selectedDay, setSelectedDay] = useState(new Date().setMinutes(0));
    const [startTime, setStartTime] = useState(new Date().setMinutes(0));
    const [endTime, setEndTime] = useState(new Date().setMinutes(30));
    const [selectedType, setSelectedType] = useState('primo_esame');
    const [selectedIstruttore, setSelectedIstruttore] = useState('Seleziona')
    const [selectedWorkplace, setSelectedWorkplace] = useState('Seleziona')

    const pageInfo = {
        page: 'esami/new',
        createLink: false,
        title: `Gestisci blocco esame`
    }

    const { data: companyId } = useSWR('/api/admin/company/isActive', fetcher);

    const { data: esameExist } = useSWR(startTime ? {
        url: '/api/esami/chechEsameExistInThisDay',
        data: { startTime }
    } : null, fetcherWithData);

    const { data: listaBlocchi } = useSWR('/api/esami/listBlocchiEsami', fetcher)

    const { data: istruttori } = useSWR({
        url: '/api/admin/users/getUsersWithSpecificRolesGroup',
        data: { rulesGroupDescription: 'Istruttore' }
    }, fetcherWithData)

    const { data: insegnanti } = useSWR({
        url: '/api/admin/users/getUsersWithSpecificRolesGroup',
        data: { rulesGroupDescription: 'Insegnante' }
    }, fetcherWithData)

    const { data: istruttoriinsegnanti } = useSWR(insegnanti ? {
        url: '/api/admin/users/getUsersWithSpecificRolesGroup',
        data: { rulesGroupDescription: 'Insegnante & Istruttore' }
    } : null, fetcherWithData)

    const { data: veicoli } = useSWR(companyId ? {
        url: '/api/veicoli/list',
        data: { companyId: companyId.isActive }
    } : null, fetcherWithData);

    const { data: workplaces } = useSWR(companyId ? {
        url: '/api/admin/workplace/list',
        data: { companyId: companyId.isActive }
    } : null, fetcherWithData)

    const { data: tariffaId } = useSWR(selectedType ? {
        url: '/api/tariffe/findOne',
        data: { tariffaTipo: selectedType }
    } : null, fetcherWithData)

    const { data: istruzioneId } = useSWR(selectedType ? {
        url: '/api/allievi/istruzioni/findOneFromAllievoName',
        data: { allievoName: 'admin' }
    } : null, fetcherWithData)

    const addNewBlocco = async () => {

        if (selectedIstruttore === 'Seleziona' || selectedWorkplace === 'Seleziona') {
            notify.error.set({
                title: 'Seleziona sia Istruttore che Workplace',
            })
            return
        }

        const getstartHour = new DateTime(new Date(startTime)).getHour();
        const getstartMinutes = new DateTime(new Date(startTime)).getMinute();
        const getEndHour = new DateTime(new Date(endTime)).getHour();
        const getEndMinutes = new DateTime(new Date(endTime)).getMinute();

        const inizioServizio = new DateTime(new Date(selectedDay)).setHour(getstartHour).setMinute(getstartMinutes).setMillisecond(0).getUnixTimestamp()

        const fineServizio = new DateTime(new Date(selectedDay)).setHour(getEndHour).setMinute(getEndMinutes).setMillisecond(0).getUnixTimestamp()

        const durata = fineServizio - inizioServizio;

        if (durata > (3600 * 4)) {
            notify.error.set({
                title: 'Non puoi selezionare un periodo superiore a 4 ore',
            })
            return
        }

        //Controllo quanti periodi di mezz'ora si devono creare
        const mezzoreSelezionate = durata / 1800;

        const veicolo = veicoli.find(el => el.workplaceId === selectedWorkplace);

        const arr = []
        for (let index = 0; index < durata; index = index + 1800) {
            //DA FINIRE
            const fineServizioMezzora = Number(inizioServizio) + Number(index) + 1800

            arr.push({
                companyId: companyId.isActive,
                inizioServizio: Number(inizioServizio) + Number(index),
                fineServizio: fineServizioMezzora,
                istruttoreId: selectedIstruttore,
                veicoloId: veicolo.id,
                tariffaId: tariffaId,
                allievoIStruzioneId: istruzioneId,
                durataMinuti: 30
            })
        }

        try {

            const sendRequest = await fetch(`/api/esami/new`, {
                body: JSON.stringify({
                    data: arr,
                }),
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST'
            });

            if (sendRequest) {
                mutate('/api/esami/listBlocchiEsami')
                notify.success.set({
                    title: 'Blocco creato con successo',
                })
            }
            else {
                notify.error.set({
                    title: 'Blocco non creato!',
                })
            }

        } catch (err) {
            console.log(err)
        }

    }

    const eliminaBlocco = async (id) => {

        try {
            const sendRequest = await fetch(`/api/esami/delete`, {
                body: JSON.stringify({
                    id: id,
                }),
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST'
            });

            if (sendRequest) {
                mutate('/api/esami/listBlocchiEsami')
                notify.success.set({
                    title: 'Blocco eliminato con successo',
                })
            }
            else {
                notify.error.set({
                    title: 'Blocco non eliminato!',
                })
            }

        } catch (err) {
            console.log(err)
        }

    }

    const Button1 = () => {
        return (
            <button
                onClick={() => addNewBlocco()}
                className="order-0 mx-6 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:order-1 sm:ml-3">
                Crea blocco
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
                    {istruttori && insegnanti && veicoli && workplaces &&
                        <Form
                            esameExist={esameExist}
                            selectedDay={selectedDay}
                            setSelectedDay={setSelectedDay}
                            startTime={startTime}
                            setStartTime={setStartTime}
                            endTime={endTime}
                            setEndTime={setEndTime}
                            selectedType={selectedType}
                            setSelectedType={setSelectedType}
                            selectedIstruttore={selectedIstruttore}
                            setSelectedIstruttore={setSelectedIstruttore}
                            istruttori={istruttori}
                            insegnanti={insegnanti}
                            istruttoriinsegnanti={istruttoriinsegnanti}
                            veicoli={veicoli}
                            workplaces={workplaces}
                            selectedWorkplace={selectedWorkplace}
                            setSelectedWorkplace={setSelectedWorkplace}
                        />
                    }
                    {listaBlocchi &&
                        <Table
                            listaBlocchi={listaBlocchi}
                            eliminaBlocco={eliminaBlocco}
                        />
                    }

                </div>
            </div>
        </Layout>
    )
}