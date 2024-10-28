import DeleteAlert from '../UI/modal/deleteAlert'
import ButtonWithIconLeft from '../UI/button/buttonWithIconLeft'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import useSWR from 'swr'
import { fetcherWithData } from '@/lib/fetch'
import Loader from '../UI/loader'
import { useEffect, useState } from 'react'

export default function TariffaNewForm({
    router,
    companyId,
    originalData,
    patente,
    setPatente,
    patenti,
    prezzo,
    setPrezzo,
    tipo,
    setTipo,
    tipoList,
    deleteTariffa,
    alertDeleteTariffa
}) {

    const [patentiDisponibili, setPatentiDisponibili] = useState([]);

    const { data: patentiUsate } = useSWR(companyId ? {
        url: '/api/tariffe/getAvailablePatenti',
        data: { companyId: companyId, tariffaTipo: tipo }
    } : null, fetcherWithData)

    const title = router.asPath.includes('new') ? 'Nuova' : 'Modifica'

    useEffect(() => {
        if (patentiUsate) {
            const arr = [];
            patenti.map((item, index) => {
                const found = patentiUsate.find(el => el.patente.id === item.id)
                if (!found || (item.id === patente && originalData.tariffaTipoId === tipo)) {
                    arr.push(item)
                }
                if (item.id === patente && originalData?.tariffaTipoId !== tipo) {
                    setPatente('Seleziona')
                }
            })
            setPatentiDisponibili(arr);
        }

    }, [patentiUsate])


    if (!patentiDisponibili.length) {
        return <Loader />
    }
    else {
        return (
            <div className="space-y-6 p-6">
                <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                    <div className="md:grid md:grid-cols-3 md:gap-6">
                        <div className="md:col-span-1">
                            <h3 className="text-lg font-medium leading-6 text-gray-900">{title} tariffa</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {title} tariffa, non dimenticarti di selezionare la giusta categoria
                            </p>
                        </div>
                        <div className="mt-5 md:mt-0 md:col-span-2">
                            <form className="space-y-6" action="#" method="POST">
                                <div className="grid grid-cols-3 gap-6">
                                    <div className="col-span-3 sm:col-span-2">
                                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                                            Tipologia di servizio (Categoria)
                                        </label>
                                        <select
                                            id="tipo"
                                            name="tipo"
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                            value={tipo}
                                            onChange={(e) => {
                                                setTipo(e.target.options[e.target.selectedIndex].value)
                                            }}
                                        >
                                            <option value={'Seleziona'}>Seleziona...</option>
                                            {tipoList.map(item => (
                                                <option key={item.id} value={item.id}>{item.tipo}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-span-3 sm:col-span-2">
                                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                                            Seleziona patente
                                        </label>
                                        <select
                                            id="tipo"
                                            name="tipo"
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                            value={patente}
                                            onChange={(e) => {
                                                setPatente(e.target.options[e.target.selectedIndex].value)
                                            }}
                                        >
                                            <option value={'Seleziona'}>Seleziona...</option>
                                            {patentiDisponibili.map(item => (
                                                <option key={item.id} value={item.id}>{item.nome.charAt(0).toUpperCase() + item.nome.slice(1)}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-span-3 sm:col-span-2">
                                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                                            Prezzo
                                        </label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="text-gray-500 sm:text-sm">€</span>
                                            </div>
                                            <input
                                                type="number"
                                                name="prezzo"
                                                id="prezzo"
                                                value={prezzo}
                                                onChange={(e) => setPrezzo(Number(e.target.value))}
                                                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                                                placeholder="0,00"
                                                aria-describedby="price-currency"
                                            />
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                <span className="text-gray-500 sm:text-sm" id="price-currency">
                                                    EUR
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                {router.asPath.includes('edit') &&
                    <>
                        <DeleteAlert clicked={deleteTariffa} buttonName={'Elimina'} />
                        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 mt-10">
                            <div className="md:grid md:grid-cols-3 md:gap-6">
                                <div className="md:col-span-1">
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">Eliminazione Tariffa</h3>
                                    <p className="mt-1 text-sm text-gray-500">Sezione per eliminare la Tariffa</p>
                                </div>
                                <div className="mt-5 md:mt-0 md:col-span-2">
                                    <form className="space-y-6" action="#" method="POST">
                                        <ButtonWithIconLeft clicked={() => alertDeleteTariffa()} icon={ExclamationTriangleIcon} text={'Elimina la Tariffa'} color={'red'} />
                                    </form>
                                </div>
                            </div>
                        </div>
                    </>
                }
            </div>
        )
    }
}
