import { Fragment, useEffect, useState } from 'react'
import { signOut, useSession } from 'next-auth/react';
import { Dialog, Menu, Transition } from '@headlessui/react'
import { ClockIcon, HomeIcon, Bars3Icon, XMarkIcon, CalendarIcon, PresentationChartBarIcon, TruckIcon, CurrencyEuroIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline'
import { MagnifyingGlassIcon, ArrowDownIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import { useRouter } from 'next/router';
import Success from '../UI/notifications/success';
import Error from '../UI/notifications/error';
import Loading from '../UI/notifications/loading';
import useSWR from 'swr'
import fetcher, { fetcherWithData } from '@/lib/fetch'
import Warning from '../UI/notifications/warning';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

async function logoutHandler() {
    signOut({ redirect: true, callbackUrl: '/' });
}

export default function Layout({
    page,
    createLink,
    Button1,
    button1Data,
    Button2,
    button2Data,
    title,
    tableData,
    setTableData,
    children,
    activeTab,
    //Variabili per i filtri della dashboard
    Filter1,
    Filter2,
    selectedFilter,
    setSelectedFilter,
    filteredListForSelectedBox,
    events,
    //...
}) {

    const router = useRouter();

    const { data: session, status } = useSession();

    const { data: activeCompany } = useSWR(session ? `/api/admin/company/isActive` : null, fetcher)

    const { data: pagePermission } = useSWR(activeCompany ? {
        url: `/api/admin/rules/check`,
        data: { id: session.user.id, activeCompany: activeCompany },
    } : null, fetcherWithData
    )

    if (status === "unauthenticated") {
        router.push('/')
    }

    useEffect(() => {
        const checkPermission = () => {
            if (pagePermission && router) {
                let permissionAgree = false
                pagePermission.rulesListArray.map(item => {

                    const checkEditUpdate = router.asPath.replace('edit', 'update')
                    if (checkEditUpdate.includes(item.rule.accessCode) || item.rule.accessCode.includes(checkEditUpdate)) {
                        permissionAgree = true
                    }
                })
                if (!permissionAgree) {
                    router.push('/')
                }
                else {
                    console.log('PUOI STARE QUI')
                }

            }
        }
        checkPermission();

    }, [pagePermission !== undefined])

    const [sidebarOpen, setSidebarOpen] = useState(false)

    const [originalTableData, setOriginalTableData] = useState([]);
    const [isDataInitialized, setIsDataInitialized] = useState(false);
    const [currentPage, setCurrentPage] = useState(page);

    // Gestione intelligente di originalTableData
    useEffect(() => {
        // Se cambia la pagina, resetta tutto
        if (page !== currentPage) {
            setCurrentPage(page);
            setIsDataInitialized(false);
            setOriginalTableData([]);
            return;
        }
        
        // Solo se i dati sono validi e non sono stati ancora inizializzati per questa pagina
        if (tableData && Array.isArray(tableData) && tableData.length > 0 && !isDataInitialized) {
            setOriginalTableData([...tableData]);
            setIsDataInitialized(true);
        }
    }, [tableData, page, currentPage, isDataInitialized])



    // Reset automatico della ricerca quando cambia la pagina o il tab
    useEffect(() => {
        // Pulisce tutti i campi di ricerca
        const searchInputs = document.querySelectorAll('input[type="search"], input[name="search"], input[name="search-field"]');
        searchInputs.forEach(input => {
            if (input.value) {
                input.value = '';
            }
        });
        
        // Resetta i dati della tabella solo se abbiamo dati originali
        if (setTableData && originalTableData && originalTableData.length > 0) {
            setTableData([...originalTableData]);
        }
    }, [page, router.asPath, originalTableData]);

    // Reset quando cambia il tab attivo (per gestire SWR data changes)
    useEffect(() => {
        if (router.asPath.includes('list') && originalTableData && originalTableData.length > 0) {
            // Pulisce i campi di ricerca
            const searchInputs = document.querySelectorAll('input[type="search"], input[name="search"], input[name="search-field"]');
            searchInputs.forEach(input => {
                if (input.value) {
                    input.value = '';
                }
            });
            // Ripristina i dati originali
            if (setTableData) {
                setTableData([...originalTableData]);
            }
        }
    }, [router.asPath, originalTableData, setTableData]);


    function filterDataTable(value) {
        // Normalizza il valore di input rimuovendo spazi extra
        const normalizedValue = value.trim();
        
        // Se il campo è vuoto, ripristina tutto
        if (normalizedValue.length === 0) {
            // SEMPRE ripristina da originalTableData se disponibile
            if (originalTableData && originalTableData.length > 0 && isDataInitialized) {
                setTableData([...originalTableData]);
            } else if (tableData && tableData.length > 0) {
                // Fallback solo se non abbiamo dati originali
                setTableData([...tableData]);
            }
            return;
        }
        
        // Se c'è un valore di ricerca valido, filtra i dati
        // SEMPRE usa originalTableData per il filtraggio se disponibile
        const sourceData = (originalTableData && originalTableData.length > 0 && isDataInitialized) ? originalTableData : tableData;
        
        if (setTableData && sourceData && sourceData.length > 0) {
            try {
                const filteredData = filterItems(sourceData, normalizedValue);
                setTableData(filteredData);
            } catch (error) {
                // In caso di errore, ripristina i dati originali
                if (sourceData) {
                    setTableData([...sourceData]);
                }
            }
        }
    }
    function filterItems(arr, query) {

        if (page.includes('tariffe')) {
            const tempArr = [];
            arr.map(el => {

                const boolSearch = el.tariffa.filter(item => {
                    return item.nome.toLowerCase().indexOf(query.toLowerCase()) !== -1
                })
                tempArr.push({ ...el, tariffa: boolSearch })
            })
            return tempArr
        }

        return arr.filter(function (el) {
            if (page === 'admin/users') {
                if (
                    //Filtro per nome
                    el.user.profile.lastname.toLowerCase().indexOf(query.toLowerCase()) !== -1
                    //Filtro per cognome
                    || el.user.profile.firstname.toLowerCase().indexOf(query.toLowerCase()) !== -1
                    //Filro per nome + cognome
                    || (el.user.profile.firstname.toLowerCase() + ' ' + el.user.profile.lastname.toLowerCase()).indexOf(query.toLowerCase()) !== -1
                    //Filro per cognome + nome
                    || (el.user.profile.lastname.toLowerCase() + ' ' + el.user.profile.firstname.toLowerCase()).indexOf(query.toLowerCase()) !== -1
                    //filtro per email
                    || el.user.email.toLowerCase().indexOf(query.toLowerCase()) !== -1
                ) {
                    return true
                }
                else {
                    return false
                }
            }
            if (page.includes('autoscuole')) {
                if (
                    el.denominazione.toLowerCase().indexOf(query.toLowerCase()) !== -1
                    || el.comune.toLowerCase().indexOf(query.toLowerCase()) !== -1
                    || el.provincia.toLowerCase().indexOf(query.toLowerCase()) !== -1
                    || el.partIva.toLowerCase().indexOf(query.toLowerCase()) !== -1
                    || el.codFisc.toLowerCase().indexOf(query.toLowerCase()) !== -1
                    || el.email.toLowerCase().indexOf(query.toLowerCase()) !== -1
                ) {
                    return true
                }
                else {
                    return false
                }
            }
            if (page.includes('rules')) {
                return el.description.toLowerCase().indexOf(query.toLowerCase()) !== -1
            }
            if (page.includes('patenti')) {
                return el.nome.toLowerCase().indexOf(query.toLowerCase()) !== -1
            }
            if (page.includes('workplace')) {
                return el.nome.toLowerCase().indexOf(query.toLowerCase()) !== -1
            }
            if (page.includes('veicoli')) {
                if (
                    el.nome.toLowerCase().indexOf(query.toLowerCase()) !== -1
                    || el.targa.toLowerCase().indexOf(query.toLowerCase()) !== -1
                    || el.modello.toLowerCase().indexOf(query.toLowerCase()) !== -1
                    || el.workplace.nome.toLowerCase().indexOf(query.toLowerCase()) !== -1
                ) {
                    return true
                }
                else {
                    const foundInPatenti = el.Patenti.find(item => item.patente.nome.toLowerCase().indexOf(query.toLowerCase()) !== -1)
                    if (foundInPatenti) {
                        return true
                    }
                    else {
                        return false
                    }

                }
            }
            if (page.includes('allievi')) {
                if (activeTab === 'list') {
                    // Normalizza la query di ricerca
                    const normalizedQuery = query.toLowerCase().trim();
                    
                    // Crea combinazioni normalizzate dei nomi per ricerca flessibile
                    const nomeNormalizzato = el.nome ? el.nome.toLowerCase() : '';
                    const cognomeNormalizzato = el.cognome ? el.cognome.toLowerCase() : '';
                    const nomeCompleto = `${cognomeNormalizzato} ${nomeNormalizzato}`.trim();
                    const nomeCompletoInverso = `${nomeNormalizzato} ${cognomeNormalizzato}`.trim();
                    
                    if (
                        // Ricerca per nome individuale
                        nomeNormalizzato.indexOf(normalizedQuery) !== -1
                        // Ricerca per cognome individuale
                        || cognomeNormalizzato.indexOf(normalizedQuery) !== -1
                        // Ricerca per nome completo (cognome + nome)
                        || nomeCompleto.indexOf(normalizedQuery) !== -1
                        // Ricerca per nome completo inverso (nome + cognome)
                        || nomeCompletoInverso.indexOf(normalizedQuery) !== -1
                        // Ricerca per autoscuola
                        || el.autoscuola.denominazione.toLowerCase().indexOf(normalizedQuery) !== -1
                        // Ricerca per numero iscrizione
                        || el.iscrizioneNumero.toLowerCase().indexOf(normalizedQuery) !== -1
                    ) {
                        return true
                    }
                    else {
                        const foundInAllievoIstruzioni = el.AllievoIstruzioni.find(item => item.patente.nome.toLowerCase().indexOf(normalizedQuery) !== -1)
                        if (foundInAllievoIstruzioni) {
                            return true
                        }
                        else {
                            return false
                        }

                    }
                }
                if (activeTab === 'istruzione') {
                    if (
                        el.patente.nome.toLowerCase().indexOf(query.toLowerCase()) !== -1
                        || el.marcaOperativa.toLowerCase().indexOf(query.toLowerCase()) !== -1
                        || el.codiceStatino.toLowerCase().indexOf(query.toLowerCase()) !== -1
                    ) {
                        return true
                    }
                    else {
                        return false
                    }
                }
                if (activeTab === 'servizi') {
                    if (
                        el.tariffa.tipo.tipo.toLowerCase().indexOf(query.toLowerCase()) !== -1
                        || el.tariffa.patente.nome.toLowerCase().indexOf(query.toLowerCase()) !== -1
                        || el.esito.toLowerCase().indexOf(query.toLowerCase()) !== -1
                    ) {
                        return true
                    }
                    else {
                        return false
                    }
                }
            }

        })
    }
    const [navigation, setNavigation] = useState([]);
    const [profileMenu, setProfileMenu] = useState([]);
    const [smartMenu, setSmartMenu] = useState([]);

    useEffect(() => {

        const cleanUpFunction = async () => {
            setNavigation([
                { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, current: page === 'dashboard' ? true : false, enabled: true },
                { name: 'Calendario', href: '/calendario', icon: CalendarIcon, current: page.includes('calendario') ? true : false, enabled: pagePermission && pagePermission.rulesListArray.find(element => element.rule.accessCode === '/calendario') },
                { name: 'Esami', href: '/esamicorsi', icon: ClockIcon, current: page === 'esamicorsi' ? true : false, enabled: pagePermission && pagePermission.rulesListArray.find(element => element.rule.accessCode === '/esamicorsi') },
                { name: 'Autoscuole', href: '/autoscuole/list', icon: BuildingOfficeIcon, current: page.includes('autoscuole') ? true : false, enabled: pagePermission && pagePermission.rulesListArray.find(element => element.rule.accessCode === '/autoscuole/list') },
                { name: 'Allievi', href: '/allievi/list', icon: PresentationChartBarIcon, current: page.includes('allievi') ? true : false, enabled: pagePermission && pagePermission.rulesListArray.find(element => element.rule.accessCode === '/allievi/list') },
                { name: 'Tariffe', href: '/tariffe/list', icon: CurrencyEuroIcon, current: page === 'tariffe/list' ? true : page.includes('tariffe') ? true : false, enabled: pagePermission && pagePermission.rulesListArray.find(element => element.rule.accessCode === '/tariffe/list') },
                { name: 'Veicoli', href: '/veicoli/list', icon: TruckIcon, current: page.includes('veicoli') ? true : false, enabled: pagePermission && pagePermission.rulesListArray.find(element => element.rule.accessCode === '/veicoli/list') },
            ]);

            setProfileMenu([
                { id: 0, href: '/admin/cambioPassword/edit', name: 'Cambio password', active: page === 'admin/cambioPassword/edit' ? true : false, enabled: pagePermission && pagePermission.rulesListArray.find(element => element.rule.accessCode === '/admin/cambioPassword/update') },
                { id: 1, href: '/admin/profile', name: 'Profilo utente', active: page === '#' ? true : false, enabled: pagePermission && pagePermission.rulesListArray.find(element => element.rule.accessCode === '/admin/profile') },
                { id: 2, href: '/admin/users/list', name: 'Gestione utenti', active: page === 'admin/users/list' ? true : false, enabled: pagePermission && pagePermission.rulesListArray.find(element => element.rule.accessCode === '/admin/users/list') },
                { id: 3, href: '/admin/company/switch', name: 'Cambia azienda', active: page === 'admin/company/switch' ? true : false, enabled: pagePermission && pagePermission.rulesListArray.find(element => element.rule.accessCode === '/admin/company/switch') },
                { id: 4, href: '/admin/rules/list', name: 'Gestione ruoli', active: page === 'admin/rules/list' ? true : false, enabled: pagePermission && pagePermission.rulesListArray.find(element => element.rule.accessCode === '/admin/rules/list') },
                { id: 5, href: '/admin/rules/groups/list', name: 'Gestione gruppi di ruoli', active: page === 'admin/rules/groups/list' ? true : false, enabled: pagePermission && pagePermission.rulesListArray.find(element => element.rule.accessCode === '/admin/rules/groups/list') },
                { id: 6, href: '/admin/company/profile', name: 'Dati aziendali', active: page === '#' ? true : false, enabled: pagePermission && pagePermission.rulesListArray.find(element => element.rule.accessCode === '/admin/company/profile') },
                { id: 7, href: '/admin/patenti/list', name: 'Patenti', active: page === '/admin/patenti/list' ? true : false, enabled: pagePermission && pagePermission.rulesListArray.find(element => element.rule.accessCode === '/admin/workplace/list') },
                { id: 8, href: '/admin/workplace/list', name: 'Workplace', active: page === '/admin/workplace/list' ? true : false, enabled: pagePermission && pagePermission.rulesListArray.find(element => element.rule.accessCode === '/admin/patenti/list') },
                { id: 9, href: '/admin/limitePrenotazioni', name: 'Alert prenotazioni', active: page === '/admin/limitePrenotazioni' ? true : false, enabled: pagePermission && pagePermission.rulesListArray.find(element => element.rule.accessCode === '/admin/limitePrenotazioni/update') },
                { id: 10, href: '#', name: 'Esci', active: false, onClick: () => logoutHandler(), enabled: true }
            ])

            setSmartMenu([
                { name: 'Crea appuntamento', href: '#', bgColorClass: 'bg-indigo-500', enabled: pagePermission && pagePermission.rulesListArray.find(element => element.rule.accessCode === '/admin/calendar/new') },
                { name: 'Aggiungi allievo', href: '/allievi/new', bgColorClass: 'bg-pink-500', enabled: pagePermission && pagePermission.rulesListArray.find(element => element.rule.accessCode === '/allievi/new') },
                { name: 'Aggiungi spesa', href: '#', bgColorClass: 'bg-yellow-500', enabled: false },
                { name: 'Lista giornaliera', href: '/print/list', bgColorClass: 'bg-yellow-500', enabled: pagePermission && pagePermission.rulesListArray.find(element => element.rule.accessCode === '/print/list') },
                { name: 'Lista Esami', href: '/esami/list', bgColorClass: 'bg-green-500', enabled: pagePermission && pagePermission.rulesListArray.find(element => element.rule.accessCode === '/esami/list') },
                { name: 'Blocco esami', href: '/esami/new', bgColorClass: 'bg-blue-500', enabled: pagePermission && pagePermission.rulesListArray.find(element => element.rule.accessCode === '/esami/new') },
            ])

        }
        cleanUpFunction();
    }, [pagePermission])

    if (pagePermission) {

        return (
            <>

                <div className="h-screen flex  ">
                    <Success />
                    <Error />
                    <Loading />
                    <Warning />

                    <Transition.Root show={sidebarOpen} as={Fragment}>
                        <Dialog as="div" className="fixed inset-0 flex z-40 lg:hidden print:hidden" onClose={setSidebarOpen}>
                            <Transition.Child
                                as={Fragment}
                                enter="transition-opacity ease-linear duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="transition-opacity ease-linear duration-300"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
                            </Transition.Child>
                            <Transition.Child
                                as={Fragment}
                                enter="transition ease-in-out duration-300 transform"
                                enterFrom="-translate-x-full"
                                enterTo="translate-x-0"
                                leave="transition ease-in-out duration-300 transform"
                                leaveFrom="translate-x-0"
                                leaveTo="-translate-x-full"
                            >
                                <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-in-out duration-300"
                                        enterFrom="opacity-0"
                                        enterTo="opacity-100"
                                        leave="ease-in-out duration-300"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <div className="absolute top-0 right-0 -mr-12 pt-2">
                                            <button
                                                type="button"
                                                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                                onClick={() => setSidebarOpen(false)}
                                            >
                                                <span className="sr-only">Close sidebar</span>
                                                <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                            </button>
                                        </div>
                                    </Transition.Child>
                                    <div className="print:hidden flex-shrink-0 flex items-center px-4">
                                        <img
                                            className="h-8 w-auto"
                                            src="/logo.png"
                                            alt="iConsorzi"
                                        />
                                    </div>
                                    <div className="mt-5 flex-1 h-0 overflow-y-auto">
                                        <nav className="px-2">
                                            <div className="space-y-1">

                                                {navigation.map((item) => {
                                                    if (item.enabled) {
                                                        return <Link
                                                            key={item.name}
                                                            href={item.href}
                                                        >
                                                            <span
                                                                className={classNames(
                                                                    item.current
                                                                        ? 'bg-gray-100 text-gray-900'
                                                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
                                                                    'group flex items-center px-2 py-2 text-base leading-5 font-medium rounded-md'
                                                                )}
                                                                aria-current={item.current ? 'page' : undefined}
                                                            >
                                                                <item.icon
                                                                    className={classNames(
                                                                        item.current ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                                                                        'mr-3 flex-shrink-0 h-6 w-6'
                                                                    )}
                                                                    aria-hidden="true"
                                                                />
                                                                {item.name}
                                                            </span>
                                                        </Link>
                                                    }
                                                })}
                                            </div>
                                            <div className="mt-8">

                                                <h3
                                                    className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                                                    id="mobile-teams-headline"
                                                >
                                                    Accesso rapido
                                                </h3>
                                                <div className="mt-1 space-y-1" role="group" aria-labelledby="mobile-teams-headline">
                                                    {smartMenu.map((item) => {
                                                        if (item.enabled) {
                                                            return <Link
                                                                key={item.name}
                                                                href={item.href}
                                                                className="group flex items-center px-3 py-2 text-base leading-5 font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50"
                                                            >
                                                                <span
                                                                    className={classNames(item.bgColorClass, 'w-2.5 h-2.5 mr-4 rounded-full')}
                                                                    aria-hidden="true"
                                                                />
                                                                <span className="truncate">{item.name}</span>
                                                            </Link>
                                                        }
                                                    }

                                                    )}
                                                </div>
                                            </div>
                                        </nav>
                                    </div>
                                </div>
                            </Transition.Child>
                            <div className="flex-shrink-0 w-14" aria-hidden="true">
                                {/* Dummy element to force sidebar to shrink to fit close icon */}
                            </div>
                        </Dialog>
                    </Transition.Root>

                    {/* Static sidebar for desktop */}
                    <div className="hidden lg:flex lg:flex-shrink-0 print:hidden">
                        <div className="print:hidden flex flex-col w-64 border-r border-gray-200 pt-5 pb-4 bg-gray-100">
                            <div className="flex items-center flex-shrink-0 px-6">
                                <img
                                    className="h-8 w-auto print:hidden"
                                    src="/logo.png"
                                    alt="iConsorzi"
                                />
                            </div>

                            {/* Sidebar component, swap this element with another sidebar if you like */}
                            <div className="mt-6 h-0 flex-1 flex flex-col overflow-y-auto print:hidden">
                                {/* User account dropdown */}
                                <Menu as="div" className="px-3 relative inline-block text-left">
                                    <div>
                                        <Menu.Button className="group w-full bg-gray-100 rounded-md px-3.5 py-2 text-sm text-left font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-purple-500">
                                            <span className="flex w-full justify-between items-center">
                                                <span className="flex min-w-0 items-center justify-between space-x-3">
                                                    <span className="w-10 h-10 rounded-full flex-shrink-0 text-center" >
                                                        <UserCircleIcon className=" h-10 w-10 text-indigo-400" aria-hidden="true" />
                                                    </span>
                                                    <span className="flex-1 flex flex-col min-w-0">
                                                        <span className="text-gray-900 text-sm font-medium truncate">{session && session.user.name}</span>
                                                        <span className="text-gray-500 text-sm truncate">{session && session.user.email.split('@')[0]}</span>
                                                    </span>
                                                </span>

                                                <ArrowDownIcon
                                                    className="flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                                    aria-hidden="true"
                                                />

                                            </span>
                                        </Menu.Button>
                                    </div>

                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items className="z-10 mx-3 origin-top absolute right-0 left-0 mt-1 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-200 focus:outline-none">
                                            {profileMenu.map(item => {
                                                if (item.enabled) {
                                                    return <div key={item.id} className="py-1">
                                                        <Menu.Item>
                                                            <Link href={item.href}>
                                                                <span
                                                                    onClick={item.onClick}
                                                                    className={classNames(
                                                                        item.active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                                        'block px-4 py-2 text-sm'
                                                                    )}
                                                                >
                                                                    {item.name}
                                                                </span>
                                                            </Link>
                                                        </Menu.Item>
                                                    </div>
                                                }
                                            }
                                            )}
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                                {/* Sidebar Search */}

                                {(router.asPath.includes('list') || (router.asPath.includes('allievi/edit') && tableData !== null)) &&
                                    <div className="px-3 mt-5">
                                        <label htmlFor="search" className="sr-only">
                                            Cerca
                                        </label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div
                                                className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                                                aria-hidden="true"
                                            >
                                                <MagnifyingGlassIcon className="mr-3 h-4 w-4 text-gray-400" aria-hidden="true" />
                                            </div>
                                            <input
                                                onChange={(e) => filterDataTable(e.target.value)}
                                                onFocus={() => setOriginalTableData(tableData)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Escape') {
                                                        e.target.value = '';
                                                        filterDataTable('');
                                                    }
                                                }}
                                                type="text"
                                                name="search"
                                                id="search"
                                                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-9 pr-8 sm:text-sm border-gray-300 rounded-md"
                                                placeholder="Cerca (ESC per pulire)"
                                            />
                                            {/* Pulsante di reset ricerca desktop */}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const searchInput = document.getElementById('search');
                                                    if (searchInput) {
                                                        searchInput.value = '';
                                                        filterDataTable('');
                                                    }
                                                }}
                                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                                title="Pulisci ricerca"
                                            >
                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                }
                                {router.asPath.includes('dashboard') &&
                                    <div className='px-3 mt-6'>
                                        <Filter1 selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter} events={events} />
                                        <Filter2 selectedFilter={selectedFilter} filteredListForSelectedBox={filteredListForSelectedBox} events={events} />
                                    </div>
                                }
                                {/* Navigation */}
                                <nav className="px-3 mt-6">
                                    <div className="space-y-1">
                                        {navigation.map((item) => {
                                            if (item.enabled) {
                                                return <Link
                                                    key={item.name}
                                                    href={item.href}
                                                    className={classNames(
                                                        item.current
                                                            ? 'bg-gray-200 text-gray-900'
                                                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50',
                                                        'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                                                    )}
                                                    aria-current={item.current ? 'page' : undefined}
                                                >
                                                    <item.icon
                                                        className={classNames(
                                                            item.current ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                                                            'mr-3 flex-shrink-0 h-6 w-6'
                                                        )}
                                                        aria-hidden="true"
                                                    />
                                                    {item.name}
                                                </Link>
                                            }
                                        })}
                                    </div>
                                    <div className="mt-8">
                                        {/* Secondary navigation */}
                                        <h3
                                            className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                                            id="desktop-teams-headline"
                                        >
                                            Accesso rapido
                                        </h3>
                                        <div className="mt-1 space-y-1" role="group" aria-labelledby="desktop-teams-headline">
                                            {smartMenu.map((item) => {
                                                if (item.enabled) {
                                                    return <Link
                                                        key={item.name}
                                                        href={item.href}
                                                        className="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-gray-900 hover:bg-gray-50"
                                                    >
                                                        <span
                                                            className={classNames(item.bgColorClass, 'w-2.5 h-2.5 mr-4 rounded-full')}
                                                            aria-hidden="true"
                                                        />
                                                        <span className="truncate">{item.name}</span>
                                                    </Link>
                                                }
                                            })}
                                        </div>
                                    </div>
                                </nav>
                            </div>
                        </div>
                    </div>
                    {/* Main column */}
                    <div className="flex flex-col w-0 flex-1 overflow-hidden">
                        {/* Search header */}
                        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200 lg:hidden print:hidden">
                            <button
                                type="button"
                                className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 lg:hidden"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <span className="sr-only">Open sidebar</span>
                                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                            </button>
                            <div className="flex-1 flex justify-between px-4 sm:px-6 lg:px-8">
                                <div className="flex-1 flex">
                                    {router.asPath.includes('list') &&
                                        <form className="w-full flex md:ml-0" action="#" method="GET">
                                            <label htmlFor="search-field" className="sr-only">
                                                Cerca
                                            </label>
                                            <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                                                <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                                                    <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
                                                </div>
                                                <input
                                                    onChange={(e) => filterDataTable(e.target.value)}
                                                    onFocus={() => setOriginalTableData(tableData)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Escape') {
                                                            e.target.value = '';
                                                            filterDataTable('');
                                                        }
                                                    }}
                                                    id="search-field"
                                                    name="search-field"
                                                    className="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-transparent focus:placeholder-gray-400 sm:text-sm"
                                                    placeholder="Cerca (ESC per pulire)"
                                                    type="search"
                                                />
                                                {/* Pulsante di reset ricerca */}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const searchInput = document.getElementById('search-field');
                                                        if (searchInput) {
                                                            searchInput.value = '';
                                                            filterDataTable('');
                                                        }
                                                    }}
                                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                                    title="Pulisci ricerca"
                                                >
                                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </form>
                                    }
                                </div>
                                <div className="flex items-center">
                                    {/* Profile dropdown */}
                                    <Menu as="div" className="ml-3 relative">
                                        <div>
                                            <Menu.Button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                                                <span className="sr-only">Open user menu</span>
                                                <span className="w-10 h-10 rounded-full flex-shrink-0 text-center" >
                                                    <UserCircleIcon className=" h-10 w-10 text-indigo-400" aria-hidden="true" />
                                                </span>
                                            </Menu.Button>
                                        </div>
                                        <Transition
                                            as={Fragment}
                                            enter="transition ease-out duration-100"
                                            enterFrom="transform opacity-0 scale-95"
                                            enterTo="transform opacity-100 scale-100"
                                            leave="transition ease-in duration-75"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95"
                                        >
                                            <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-200 focus:outline-none">
                                                {profileMenu.map(item => {
                                                    if (item.enabled) {
                                                        return <div key={'men-' + item.id} className="py-1">
                                                            <Menu.Item>
                                                                <Link href={item.href}>
                                                                    <span
                                                                        onClick={item.onClick}
                                                                        className={classNames(
                                                                            item.active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                                            'block px-4 py-2 text-sm'
                                                                        )}
                                                                    >
                                                                        {item.name}
                                                                    </span>
                                                                </Link>
                                                            </Menu.Item>
                                                        </div>
                                                    }
                                                })}
                                            </Menu.Items>
                                        </Transition>
                                    </Menu>
                                </div>
                            </div>
                        </div>
                        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
                            {/* Page title & actions */}

                            <div className="print:hidden border-b border-gray-200 flex px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
                                <div className="flex-1 min-w-0">
                                    <h1 className="text-lg font-medium leading-6 text-gray-900 sm:truncate">{title}</h1>
                                </div>
                                <div className={`grid ${(createLink !== false && Button1) ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}   sm:mt-0 sm:ml-4 print:hidden`}>

                                    {createLink !== false &&
                                        <div className={`text-left ${createLink ? 'block' : 'hidden'} sm:block`}>
                                            {createLink === 'back' &&
                                                <button
                                                    type="button"
                                                    onClick={() => router.back()}
                                                    className="order-0 hidden sm:inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:order-1 sm:ml-3"
                                                >
                                                    Indietro
                                                </button>
                                            }
                                            {createLink === 'push' &&
                                                <button
                                                    type="button"
                                                    onClick={() => router.push(`/${page}`)}
                                                    className=" order-0 hidden sm:inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:order-1 sm:ml-3"
                                                >
                                                    Indietro
                                                </button>
                                            }
                                            {(createLink.includes('new') && pagePermission.rulesListArray.find(element => element.rule.accessCode === router.pathname.replace('list', 'new'))) &&
                                                <button
                                                    type="button"
                                                    onClick={() => router.replace(`/${page}/${createLink}`)}
                                                    className="order-0  hidden sm:inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:order-1 sm:ml-3"
                                                >
                                                    {createLink ? 'Aggiungi nuovo' : 'Indietro'}
                                                </button>
                                            }
                                            {createLink === '' &&
                                                <button
                                                    type="button"
                                                    onClick={() => router.replace(`/${page}/${createLink}`)}
                                                    className="order-0 hidden sm:inline-flex  items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:order-1 sm:ml-3"
                                                >
                                                    Indietro
                                                </button>
                                            }



                                        </div>
                                    }
                                    <div className='text-right '>
                                        {Button2 && <Button2 data={button2Data} />}
                                        {Button1 && <Button1 data={button1Data} />}
                                    </div>
                                </div>
                            </div>

                            {children}
                        </main>

                    </div>

                </div >
            </>
        )
    }
    else {
        // prima era return ''
        return <></>
    }
}
