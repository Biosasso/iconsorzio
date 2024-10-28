import React, { useContext, useEffect, useState } from 'react'
import NotificationsContext from '@/store/notifications'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import fetcher, { fetcherWithData } from '@/lib/fetch'
import { DateTime } from 'datetime-next';

import Layout from '@/components/layout/layout'
import Loader from '@/components/UI/loader'
import Form from '@/components/veicoli/form'

const pageInfo = {
    page: 'veicoli/list',
    createLink: '',
    title: 'Modifica veicolo'
}

export default function VeicoliEdit({ vid }) {

    const router = useRouter();

    const notify = useContext(NotificationsContext)

    const { data: isActive } = useSWR('/api/admin/company/isActive', fetcher);

    const { data: veicolo } = useSWR(isActive ? `/api/veicoli/edit/${vid}` : null, fetcher);

    const { data: workplaces } = useSWR(veicolo ? {
        url: `/api/admin/workplace/list`,
        data: { companyId: isActive.isActive }
    } : null, fetcherWithData);

    const { data: patenti } = useSWR(workplaces ? {
        url: `/api/admin/patenti/list`,
        data: { companyId: isActive.isActive }
    } : null, fetcherWithData);

    const { data: checkboxData } = useSWR(patenti ? {
        url: `/api/veicoli/checkboxFormat`,
        data: { patentiAttive: veicolo.Patenti, patenti: patenti, veicoloId: vid },
    } : null, fetcherWithData
    )


    const [nome, setNome] = useState('');
    const [targa, setTarga] = useState('');
    const [modello, setModello] = useState('');
    const [immatricolazione, setImmatricolazione] = useState('');
    const [scadenzaRevisione, setScadenzaRevisione] = useState('');
    const [scadenzaAssicurazione, setScadenzaAssicurazione] = useState('');
    const [scadenzaBollo, setScadenzaBollo] = useState('');
    const [workplaceId, setWorkplaceId] = useState('');
    const [patentiAssociate, setPatentiAssociate] = useState();
    const [checkboxList, setCheckboxList] = useState();
    const [veicoloAttivo, setVeicoloAttivo] = useState(true)

    const deactivateRecord = async () => {

        const data = {
            id: vid
        }
        const res = await fetch('/api/veicoli/delete', {
            body: JSON.stringify(data),
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
                router.push(`/${pageInfo.page}?identifier=${vid}`)
            }, 1000)
        }
        if (result.statusCode === 400) {
            notify.error.set({
                title: result.title
            })
        }
    }
    const reactivateRecord = async () => {

        const data = {
            id: vid
        }
        const res = await fetch('/api/veicoli/reactivate', {
            body: JSON.stringify(data),
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
                router.push(`/${pageInfo.page}?identifier=${vid}`)
            }, 1000)
        }
        if (result.statusCode === 400) {
            notify.error.set({
                title: result.title
            })
        }
    }

    const updateRecord = async () => {

        const data = {
            id: vid,
            companyId: isActive.isActive,
            nome: nome.toLowerCase(),
            targa: targa.toLowerCase().replace(/\s+/g, ''),
            modello: modello.toLowerCase(),
            immatricolazione: new Date(immatricolazione),
            scadenzaRevisione: new Date(scadenzaRevisione),
            scadenzaAssicurazione: new Date(scadenzaAssicurazione),
            scadenzaBollo: new Date(scadenzaBollo),
            workplaceId: workplaceId
        }

        if ( // Controllo se non sono state effettuate modifiche
            nome === veicolo.nome
            && targa === veicolo.targa
            && modello === veicolo.modello
            && immatricolazione === veicolo.immatricolazione
            && scadenzaRevisione === veicolo.scadenzaRevisione
            && scadenzaAssicurazione === veicolo.scadenzaAssicurazione
            && scadenzaBollo === veicolo.scadenzaBollo
            && workplaceId === veicolo.workplaceId
        ) {
            notify.warning.set({
                title: 'Non è stata effettuata nessuna modifica, il nome non è cambiato'
            })
            return
        }

        if ( // Controllo campi obbligatori
            nome === ''
            || targa === ''
            || modello === ''
        ) {
            notify.error.set({
                title: 'Campi obbligatori: NOME, TARGA E MODELLO'
            })
            return
        }
        if (workplaceId === 'Seleziona') { // Controllo se selezionato workspace
            notify.error.set({
                title: 'Devi selezionare un workspace per il veicolo'
            })
            return
        }

        let checkbox = checkboxList;
        const toCreate = [];
        const toDeactivate = [];
        checkbox.map((item) => {
            if (item.isChecked) {
                toCreate.push({
                    companyId: item.companyId,
                    patenteId: item.id,
                    veicoloId: vid
                })
            }
            else {
                toDeactivate.push({
                    companyId: item.companyId,
                    patenteId: item.id,
                    veicoloId: vid
                })
            }
        })

        try {
            const res = await fetch('/api/veicoli/update', {
                body: JSON.stringify({ data: data, toCreate: toCreate, toDeactivate: toDeactivate, patentiAssociate: patentiAssociate }),
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
                    router.replace(`/${pageInfo.page}?identifier=${vid}`)
                }, 1000)
            }
            if (result.statusCode === 400) {
                notify.error.set({
                    title: result.title
                })
            }
        }
        catch (err) {
            notify.error.set({
                title: 'Errore nel collegamento con il server, riprova!'
            })
        }

    }

    const alertDeactivateRecord = () => {
        notify.alert.set({
            title: `Sei sicuro di voler disattivare il veicolo?`,
            message: `Disattivando il veicolo non sarà più utilizzabile in nessun'altra sezione del gestionale. Potrai comunque riattivarlo in un secondo momento`,
        })
    }
    const alertReactivateRecord = () => {
        notify.alert2.setTitle(`Sei sicuro di voler riattivare il veicolo?`);
        notify.alert2.setMessage(`Una volta riattivato il veicolo potrai comunque disattivarlo di nuovo in un secondo momento`);
        notify.alert2.setShow(true);
    }

    const handleOnChange = (event, option) => {
        let checkboxListTmp = checkboxList;
        checkboxListTmp.forEach(chkItem => {
            if (chkItem === option) {
                chkItem.isChecked = event.target.checked;
            }
        })
        setCheckboxList(checkboxListTmp);
    }

    useEffect(() => {
        if (veicolo && checkboxData) {
            setNome(veicolo.nome)
            setTarga(veicolo.targa)
            setModello(veicolo.modello)
            setImmatricolazione(new DateTime(veicolo.immatricolazione).getString('YYYY-MM-DD'))
            setScadenzaRevisione(new DateTime(veicolo.scadenzaRevisione).getString('YYYY-MM-DD'))
            setScadenzaAssicurazione(new DateTime(veicolo.scadenzaAssicurazione).getString('YYYY-MM-DD'))
            setScadenzaBollo(new DateTime(veicolo.scadenzaBollo).getString('YYYY-MM-DD'))
            setWorkplaceId(veicolo.workplaceId);
            setPatentiAssociate(veicolo.Patenti)
            setCheckboxList(checkboxData.dataForPage)
            setVeicoloAttivo(veicolo.isActive)
        }
    }, [veicolo, checkboxData]);

    const Button1 = () => {
        return (
            <button
                onClick={() => updateRecord()}
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
            {/* {(nome && targa && modello && immatricolazione && scadenzaRevisione && scadenzaAssicurazione && scadenzaBollo && workplaceId) && */}
            {workplaces &&
                <Form
                    router={router}
                    nome={nome}
                    setNome={setNome}
                    targa={targa}
                    setTarga={setTarga}
                    modello={modello}
                    setModello={setModello}
                    immatricolazione={immatricolazione}
                    setImmatricolazione={setImmatricolazione}
                    scadenzaRevisione={scadenzaRevisione}
                    setScadenzaRevisione={setScadenzaRevisione}
                    scadenzaAssicurazione={scadenzaAssicurazione}
                    setScadenzaAssicurazione={setScadenzaAssicurazione}
                    scadenzaBollo={scadenzaBollo}
                    setScadenzaBollo={setScadenzaBollo}
                    workplaceId={workplaceId}
                    setWorkplaceId={setWorkplaceId}
                    workplaces={workplaces}
                    patentiAssociate={patentiAssociate}
                    checkboxList={checkboxList}
                    veicoloAttivo={veicoloAttivo}
                    onChange={handleOnChange}
                    deactivateRecord={deactivateRecord}
                    alertDeactivateRecord={alertDeactivateRecord}
                    alertReactivateRecord={alertReactivateRecord}
                    reactivateRecord={reactivateRecord}
                />}
            {!workplaces && <Loader />}
        </Layout>
    )
}

export async function getServerSideProps(context) {

    const { vid } = context.query

    return {
        props: {
            vid: vid
        }
    }

}