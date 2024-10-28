import { useContext, useState } from "react"
import NotificationsContext from "../../../store/notifications"
import useSWR from 'swr'
import fetcher from '@/lib/fetch'
import { useRouter } from 'next/router'
import { EnvelopeIcon, PhoneIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid'

import DeleteAlert from '../../../components/UI/modal/deleteAlert'
import ReactivateAlert from "../../UI/modal/reactivateAlert"
import ButtonWithIconLeft from "../../UI/button/buttonWithIconLeft"


export default function EditUser({
    userCompanyId,
    userData,
    companyId,
    setUser,
    selectedRule,
    setSelectedRule,
    isActive,
    ifUserIsAdmin,
    appartenenza,
    setAppartenenza,
    autoscuole,
    selectedAutoscuola,
    setSelectedAutoscuola
}) {

    const { data: rulesGroupList } = useSWR(`/api/admin/rules/groups/list?isActive=${companyId}`, fetcher)

    const router = useRouter();

    const notify = useContext(NotificationsContext);

    // To deactivate User
    const deactivateUser = async () => {

        notify.loading.setShow(true);

        try {
            const res = await fetch('/api/admin/users/delete', {
                method: 'POST',
                body: JSON.stringify(notify.alert.id),
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            const result = await res.json();

            if (result.statusCode === 200) {
                notify.success.setTitle(result.title);
                notify.success.setMessage(false);
                notify.loading.setShow(false);
                notify.success.setShow(true);
                router.push('/admin/users/list');
            }
            if (result.statusCode === 400) {
                notify.loading.setShow(false);
                notify.error.setTitle('Errore generico, riprova!')
                notify.error.setMessage("Se il problema persiste contatta l'amministratore del sito");
                notify.error.setShow(true)
            }


        } catch (err) {
            notify.loading.setShow(false);
            notify.error.setTitle('Errore generico, riprova!')
            notify.error.setMessage("Se il problema persiste contatta l'amministratore del sito");
            notify.error.setShow(true)
        }

    }

    const reactivateUser = async () => {

        notify.loading.setShow(true);

        try {
            const res = await fetch('/api/admin/users/reactivate', {
                method: 'POST',
                body: JSON.stringify(notify.alert2.id),
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            const result = await res.json();

            if (result.statusCode === 200) {
                notify.success.setTitle(result.title);
                notify.success.setMessage(false);
                notify.loading.setShow(false);
                notify.success.setShow(true);
                router.push('/admin/users/list');
            }
            if (result.statusCode === 400) {
                notify.loading.setShow(false);
                notify.error.setTitle('Errore generico, riprova!')
                notify.error.setMessage("Se il problema persiste contatta l'amministratore del sito");
                notify.error.setShow(true)
            }


        } catch (err) {
            notify.loading.setShow(false);
            notify.error.setTitle('Errore generico, riprova!')
            notify.error.setMessage("Se il problema persiste contatta l'amministratore del sito");
            notify.error.setShow(true)
        }

    }

    const alertDelete = async (id) => {
        notify.alert.setId({
            id: id
        });
        notify.alert.setTitle('Sei sicuro di voler disattivare questo utente?');
        notify.alert.setMessage("Una volta disattivato potrà comunque essere riattivato nell'apposita sezione.")
        notify.alert.setShow(true);
    }
    const alertReactivate = async (id) => {
        notify.alert2.setId({
            id: id
        });
        notify.alert2.setTitle('Sei sicuro di voler riattivare questo utente?');
        notify.alert2.setMessage("Una volta riattivato l'utente potrà accedere nuovamente alle sue sezioni.")
        notify.alert2.setShow(true);
    }

    const validateEmail = async (value) => {

        notify.loading.setShow(true);

        try {
            const res = await fetch('/api/admin/users/checkUserExist', {
                method: 'POST',
                body: JSON.stringify({ email: value, activeCompany: isActive }),
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            const result = await res.json();

            if (result.statusCode === 200) {
                notify.success.setTitle(result.title);
                notify.success.setMessage(false);
                notify.loading.setShow(false);
                notify.success.setShow(true);
                // router.push('/admin/users/list');
            }
            if (result.statusCode === 400) {
                notify.loading.setShow(false);
                notify.error.setTitle(result.title)
                notify.error.setMessage(result.message);
                notify.error.setShow(true);
                setTimeout(() => {
                    router.push(`/admin/users/edit/${result.userFound}`)
                }, 1500)
            }


        } catch (err) {
            notify.loading.setShow(false);
            notify.error.setTitle('Errore di comunicazione con il server, riprova!')
            notify.error.setMessage("Se il problema persiste contatta l'amministratore del sito");
            notify.error.setShow(true)
        }
    }

    return (
        <>
            {
                rulesGroupList ?
                    <div className="space-y-6 px-6 pt-6 pb-16">
                        <DeleteAlert clicked={deactivateUser} buttonName={'Disattiva'} />
                        <ReactivateAlert clicked={reactivateUser} buttonName={'Riattiva'} />
                        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                            <div className="md:grid md:grid-cols-3 md:gap-6">
                                <div className="md:col-span-1">
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">Profile</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Informazioni generali
                                    </p>
                                </div>
                                <div className="mt-5 md:mt-0 md:col-span-2">
                                    <form className="space-y-6" action="#" method="POST">
                                        <div className="grid grid-cols-3 gap-6">
                                            <div className="col-span-3 sm:col-span-2">
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                                    Email
                                                </label>
                                                <div className="mt-1 flex rounded-md shadow-sm">
                                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                                        <EnvelopeIcon className="w-5 h-5" aria-hidden="true" />
                                                    </span>
                                                    <input
                                                        type="text"
                                                        name="email"
                                                        value={userData.email}
                                                        onBlur={(e) => validateEmail(e.target.value)}
                                                        onChange={(e) => setUser({ ...userData, email: e.target.value })}
                                                        className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                                        placeholder="yourname@example.com"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-span-3 sm:col-span-2">
                                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                                    Telefono
                                                </label>
                                                <div className="mt-1 flex rounded-md shadow-sm">
                                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                                        <PhoneIcon className="w-5 h-5" aria-hidden="true" />
                                                    </span>
                                                    <input
                                                        type="text"
                                                        name="phone"
                                                        value={userData.profile?.phone}
                                                        onChange={(e) => setUser({ ...userData, profile: { ...userData.profile, phone: e.target.value } })}
                                                        className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                                        placeholder="333 33 33 333"
                                                    />
                                                </div>
                                            </div>
                                            {/* More fields here*/}
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                            <div className="md:grid md:grid-cols-3 md:gap-6">
                                <div className="md:col-span-1">
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">Appartenenza</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Seleziona se l'utente appartiene al consorzio oppure ad un'autoscuola
                                    </p>
                                </div>
                                <div className="mt-5 md:mt-0 md:col-span-2">
                                    <form className="space-y-6" action="#" method="POST">
                                        <div>
                                            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                                                Seleziona l'appartenenza
                                            </label>
                                            <select
                                                id="location"
                                                name="location"
                                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                defaultValue={appartenenza}
                                                onChange={(e) => setAppartenenza(e.target.value)}
                                            >
                                                <option value={'consorzio'}>Consorzio</option>
                                                <option value={'autoscuola'}>Autoscuola</option>
                                            </select>
                                        </div>
                                        {appartenenza === 'autoscuola' &&
                                            <div>
                                                <label htmlFor="autoscuola" className="block text-sm font-medium text-gray-700">
                                                    Seleziona l'autoscuola
                                                </label>
                                                <select
                                                    id="autoscuola"
                                                    name="autoscuola"
                                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                    defaultValue={selectedAutoscuola}
                                                    onChange={(e) => setSelectedAutoscuola(e.target.value)}
                                                >
                                                    {autoscuole && autoscuole.map(item =>
                                                        <option key={item.id} value={item.id}>{item.denominazione}</option>
                                                    )}
                                                </select>
                                            </div>
                                        }
                                    </form>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                            <div className="md:grid md:grid-cols-3 md:gap-6">
                                <div className="md:col-span-1">
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">Informazioni personali</h3>
                                    <p className="mt-1 text-sm text-gray-500">Informazioni personali</p>
                                </div>
                                <div className="mt-5 md:mt-0 md:col-span-2">
                                    <form action="#" method="POST">
                                        <div className="grid grid-cols-6 gap-6">
                                            <div className="col-span-6 sm:col-span-3">
                                                <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                                                    Nome
                                                </label>
                                                <input
                                                    type="text"
                                                    name="first-name"
                                                    id="first-name"
                                                    value={userData.profile?.firstname}
                                                    onChange={(e) => setUser({ ...userData, profile: { ...userData.profile, firstname: e.target.value } })}
                                                    autoComplete="given-name"
                                                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                />
                                            </div>

                                            <div className="col-span-6 sm:col-span-3">
                                                <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                                                    Cognome
                                                </label>
                                                <input
                                                    type="text"
                                                    name="last-name"
                                                    id="last-name"
                                                    value={userData.profile?.lastname}
                                                    onChange={(e) => setUser({ ...userData, profile: { ...userData.profile, lastname: e.target.value } })}
                                                    autoComplete="family-name"
                                                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                />
                                            </div>

                                            <div className="col-span-6 sm:col-span-3">
                                                <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                                                    Stato
                                                </label>
                                                <input
                                                    type="text"
                                                    name="country"
                                                    id="country"
                                                    value={userData.profile?.country}
                                                    onChange={(e) => setUser({ ...userData, profile: { ...userData.profile, country: e.target.value } })}
                                                    autoComplete="country"
                                                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                />
                                            </div>

                                            <div className="col-span-6">
                                                <label htmlFor="street-address" className="block text-sm font-medium text-gray-700">
                                                    Indirizzo
                                                </label>
                                                <input
                                                    type="text"
                                                    name="street-address"
                                                    id="street-address"
                                                    value={userData.profile?.address}
                                                    onChange={(e) => setUser({ ...userData, profile: { ...userData.profile, address: e.target.value } })}
                                                    autoComplete="street-address"
                                                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                />
                                            </div>

                                            <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                                                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                                                    Città
                                                </label>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    id="city"
                                                    value={userData.profile?.city}
                                                    onChange={(e) => setUser({ ...userData, profile: { ...userData.profile, city: e.target.value } })}
                                                    autoComplete="address-level2"
                                                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                />
                                            </div>

                                            <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                                                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                                                    Provincia
                                                </label>
                                                <input
                                                    type="text"
                                                    name="state"
                                                    id="state"
                                                    value={userData.profile?.state}
                                                    onChange={(e) => setUser({ ...userData, profile: { ...userData.profile, state: e.target.value } })}
                                                    autoComplete="address-level1"
                                                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                />
                                            </div>

                                            <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                                                <label htmlFor="postal-code" className="block text-sm font-medium text-gray-700">
                                                    Cap
                                                </label>
                                                <input
                                                    type="text"
                                                    name="postal-code"
                                                    id="postal-code"
                                                    value={userData.profile?.zip}
                                                    onChange={(e) => setUser({ ...userData, profile: { ...userData.profile, zip: e.target.value } })}
                                                    autoComplete="postal-code"
                                                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                />
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                            <div className="md:grid md:grid-cols-3 md:gap-6">
                                <div className="md:col-span-1">
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">Permessi</h3>
                                    <p className="mt-1 text-sm text-gray-500">Permessi utente</p>
                                </div>
                                <div className="mt-5 md:mt-0 md:col-span-2">
                                    <form className="space-y-6" action="#" method="POST">
                                        <fieldset>
                                            <legend className="text-base font-medium text-gray-900">Gruppo di permessi assegnato</legend>
                                            <div className="mt-4 space-y-4">
                                                <div className="flex items-start">
                                                    <div className=" w-full">

                                                        <div>
                                                            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                                                                Seleziona il ruolo dell'utente
                                                            </label>
                                                            <select
                                                                id="location"
                                                                name="location"
                                                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                                defaultValue={selectedRule}
                                                                onChange={(e) => setSelectedRule(e.target.value)}
                                                            >
                                                                {rulesGroupList && rulesGroupList.map(item => {
                                                                    if (item.name.includes('admin') || item.name.includes('Admin')) {
                                                                        if (ifUserIsAdmin) {
                                                                            return <option key={item.id} value={item.id}>{item.name}</option>
                                                                        }
                                                                    } else {
                                                                        return <option key={item.id} value={item.id}>{item.name}</option>
                                                                    }

                                                                })}
                                                            </select>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </form>
                                </div>
                            </div>
                        </div>
                        {isActive ?
                            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                                <div className="md:grid md:grid-cols-3 md:gap-6">
                                    <div className="md:col-span-1">
                                        <h3 className="text-lg font-medium leading-6 text-gray-900">Disattivazione account</h3>
                                        <p className="mt-1 text-sm text-gray-500">Sezione per disattivare l'account utente</p>
                                    </div>
                                    <div className="mt-5 md:mt-0 md:col-span-2">
                                        <form className="space-y-6" action="#" method="POST">
                                            <ButtonWithIconLeft clicked={() => alertDelete(userCompanyId)} icon={ExclamationTriangleIcon} text={'Disattiva account'} color={'red'} />
                                        </form>
                                    </div>
                                </div>
                            </div>
                            :
                            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                                <div className="md:grid md:grid-cols-3 md:gap-6">
                                    <div className="md:col-span-1">
                                        <h3 className="text-lg font-medium leading-6 text-gray-900">Riattivazione account</h3>
                                        <p className="mt-1 text-sm text-gray-500">Sezione per riattivare l'account utente</p>
                                    </div>
                                    <div className="mt-5 md:mt-0 md:col-span-2">
                                        <form className="space-y-6" action="#" method="POST">
                                            <ButtonWithIconLeft clicked={() => alertReactivate(userCompanyId)} icon={ExclamationTriangleIcon} text={'Riattiva account'} color={'green'} />
                                        </form>
                                    </div>
                                </div>
                            </div>
                        }

                    </div>
                    : 'Caricamento dati'
            }
        </>
    )
}
