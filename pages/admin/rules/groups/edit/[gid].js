import React, { useEffect, useState, useContext } from 'react'
import NotificationsContext from '@/store/notifications';
import { useRouter } from 'next/router';
import useSWR from 'swr'
import fetcher, { fetcherWithData } from '@/lib/fetch'


import Layout from '../../../../../components/layout/layout';
import RulesGroupEdit from '../../../../../components/admin/rules/group/edit';
import Loader from '../../../../../components/UI/loader';



const pageInfo = {
    page: 'admin/rules/groups/list',
    createLink: '',
    title: 'Modifica gruppo di ruoli'
}


export default function User() {

    const router = useRouter();

    const notify = useContext(NotificationsContext);

    // RECUPERO I RUOLI ASSEGNATI AL GRUPPO
    const { data: ruleGroup, error } = useSWR(`/api/admin/rules/groups/getRuleGroup/${router.query.gid}`, fetcher);
    //RECUPERO I RUOLI ASSEGNATI ALL'AZIENDA
    const { data: rules } = useSWR(ruleGroup ? '/api/admin/rules/list?isActive=' + ruleGroup.companyId : null, fetcher);
    // MATCH DATA 
    const { data: rulesWithActive } = useSWR(rules ? {
        url: `/api/admin/rules/groups/utils/getGroupListWithActiveRules`,
        data: { rules: rules, ruleGroup: ruleGroup },
    } : null, fetcherWithData)

    const [checkboxList, setCheckboxList] = useState();
    const [ruleGroupData, setRuleGroupData] = useState(ruleGroup ? ruleGroup : null);

    useEffect(() => {
        setRuleGroupData(ruleGroup)
    }, [ruleGroup]);

    useEffect(() => {
        setCheckboxList(rulesWithActive?.dataForPage)
    }, [rulesWithActive]);


    const updateRulesGroup = async () => {
        notify.loading.setShow(true)
        let checkbox = checkboxList;
        const rulesToCreate = [];
        const rulesToDelete = [];
        checkbox.map((item) => {
            if (item.isChecked) {
                rulesToCreate.push({
                    ruleId: item.id,
                    companyId: item.companyId,
                    rulesGroupId: ruleGroupData.id
                })
            }
            else {
                rulesToDelete.push({
                    ruleId: item.id,
                    companyId: item.companyId,
                    rulesGroupId: ruleGroupData.id
                })
            }
        })

        const data = {
            id: ruleGroupData.id,
            name: ruleGroupData.name,
            description: ruleGroupData.description,
            companyId: ruleGroupData.companyId,
            rulesId: ruleGroupData.id,
            originalData: ruleGroup,
            rulesToCreate: rulesToCreate,
            rulesToDelete: rulesToDelete
        }

        try {
            const res = await fetch('/api/admin/rules/groups/update', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            const result = await res.json();

            if (result.statusCode === 200) {
                notify.success.setTitle('Aggiornamento completato');
                notify.success.setMessage('');
                notify.loading.setShow(false)
                notify.success.setShow(true);
            }
            else {
                notify.error.setTitle('Errore generico, riprova più tardi');
                notify.error.setMessage('');
                notify.loading.setShow(false)
                notify.error.setShow(true);
            }


        } catch (err) {
            console.log(err)
        }
    }

    const Button1 = (data) => {
        return (
            <button
                onClick={() => updateRulesGroup()}
                className="order-0 mx-6 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:order-1 sm:ml-3">
                Salva
            </button>
        )
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



    return (
        <Layout
            page={pageInfo.page}
            createLink={pageInfo.createLink}
            title={pageInfo.title}
            Button1={Button1}
        >
            {checkboxList &&
                <RulesGroupEdit
                    data={ruleGroupData}
                    setData={setRuleGroupData}
                    rules={checkboxList}
                    onChange={handleOnChange}
                />}
            {!checkboxList && <Loader />}
            {error && 'Errore nel caricamento, prova a ricaricare la pagina! Ci scusiamo per il disguido'}
        </Layout>
    )
}