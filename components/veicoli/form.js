import DeleteAlert from '@/components/UI/modal/deleteAlert'
import ReactivateAlert from '@/components/UI/modal/reactivateAlert'
import ButtonWithIconLeft from '@/components/UI/button/buttonWithIconLeft'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import Checkbox from './checkbox';

import { DateTime } from 'datetime-next';
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import it from 'date-fns/locale/it';
import "react-datepicker/dist/react-datepicker.css"
import { CalendarIcon } from '@heroicons/react/24/outline';

export default function VeicoliForm({
    router,
    nome,
    setNome,
    modello,
    setModello,
    targa,
    setTarga,
    immatricolazione,
    setImmatricolazione,
    scadenzaRevisione,
    setScadenzaRevisione,
    scadenzaAssicurazione,
    setScadenzaAssicurazione,
    scadenzaBollo,
    setScadenzaBollo,
    workplaceId,
    setWorkplaceId,
    workplaces,
    checkboxList,
    veicoloAttivo,
    onChange,
    deactivateRecord,
    alertDeactivateRecord,
    reactivateRecord,
    alertReactivateRecord
}) {

    registerLocale('it', it)

    const title = router.asPath.includes('new') ? ' Crea' : 'Modifica';

    const pageName = 'Veicolo'

    return (
        <div className="space-y-6 p-6">
            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">{title} {' '} {pageName}</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {title} {' '} {pageName}, potrai modificare questo campo in qualsiasi momento
                        </p>
                    </div>
                    <div className="mt-5 md:mt-0 md:col-span-2">
                        <form className="space-y-6 " action="#" method="POST">
                            <div className="grid grid-cols-3 gap-6">
                                <div className="col-span-3 sm:col-span-2">
                                    <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                                        Nome
                                    </label>
                                    <div className="mt-1 flex rounded-md shadow-sm ">
                                        <input
                                            type="text"
                                            name="nome"
                                            value={nome}
                                            onChange={(e) => setNome(e.target.value)}
                                            className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300 capitalize"
                                            placeholder="Es. Automobile dell'autoscuola X"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-6">
                                <div className="col-span-3 sm:col-span-2">
                                    <label htmlFor="targa" className="block text-sm font-medium text-gray-700">
                                        Targa
                                    </label>
                                    <div className="mt-1 flex rounded-md shadow-sm ">
                                        <input
                                            type="text"
                                            name="targa"
                                            value={targa}
                                            onChange={(e) => setTarga(e.target.value)}
                                            className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300 uppercase"
                                            placeholder="Es. XX 999 XX"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-6">
                                <div className="col-span-3 sm:col-span-2">
                                    <label htmlFor="modello" className="block text-sm font-medium text-gray-700">
                                        Modello
                                    </label>
                                    <div className="mt-1 flex rounded-md shadow-sm ">
                                        <input
                                            type="text"
                                            name="modello"
                                            value={modello}
                                            onChange={(e) => setModello(e.target.value)}
                                            className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300 capitalize"
                                            placeholder="Es. Fiat Panda"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-6">
                                <div className="col-span-3 sm:col-span-2">
                                    <label htmlFor="immatricolazione" className="block text-sm font-medium text-gray-700">
                                        Immatricolazione
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm ">
                                        <DatePicker
                                            locale={'it'}
                                            selected={immatricolazione ? new Date(new DateTime(immatricolazione).getString('YYYY-MM-DD')) : ''}
                                            onChange={(e) => setImmatricolazione(e)}
                                            dateFormat="P"
                                            className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <CalendarIcon className="h-5 w-5 text-gray-700 z-40" aria-hidden="true" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-6">
                                <div className="col-span-3 sm:col-span-2">
                                    <label htmlFor="scadenzaRevisione" className="block text-sm font-medium text-gray-700">
                                        Scadenza Revisione
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm ">
                                        <DatePicker
                                            locale={'it'}
                                            selected={scadenzaRevisione ? new Date(new DateTime(scadenzaRevisione).getString('YYYY-MM-DD')) : ''}
                                            onChange={(e) => setScadenzaRevisione(e)}
                                            dateFormat="P"
                                            className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <CalendarIcon className="h-5 w-5 text-gray-700 z-40" aria-hidden="true" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-6">
                                <div className="col-span-3 sm:col-span-2">
                                    <label htmlFor="scadenzaAssicurazione" className="block text-sm font-medium text-gray-700">
                                        Scadenza Assicurazione
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm ">
                                        <DatePicker
                                            locale={'it'}
                                            selected={scadenzaAssicurazione ? new Date(new DateTime(scadenzaAssicurazione).getString('YYYY-MM-DD')) : ''}
                                            onChange={(e) => setScadenzaAssicurazione(e)}
                                            dateFormat="P"
                                            className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <CalendarIcon className="h-5 w-5 text-gray-700 z-40" aria-hidden="true" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-6">
                                <div className="col-span-3 sm:col-span-2">
                                    <label htmlFor="scadenzaBollo" className="block text-sm font-medium text-gray-700">
                                        Scadenza Bollo
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm ">
                                        <DatePicker
                                            locale={'it'}
                                            selected={scadenzaBollo ? new Date(new DateTime(scadenzaBollo).getString('YYYY-MM-DD')) : ''}
                                            onChange={(e) => setScadenzaBollo(e)}
                                            dateFormat="P"
                                            className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <CalendarIcon className="h-5 w-5 text-gray-700 z-40" aria-hidden="true" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-6">
                                <div className="col-span-3 sm:col-span-2">
                                    <label htmlFor="workplace" className="block text-sm font-medium text-gray-700">
                                        Seleziona Workplace
                                    </label>
                                    <select
                                        id="workplace"
                                        name="workplace"
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                        value={workplaceId}
                                        onChange={(e) => {
                                            setWorkplaceId(e.target.options[e.target.selectedIndex].value)
                                        }}
                                    >
                                        <option value={'Seleziona'}>Seleziona...</option>
                                        {workplaces.map(item => (
                                            <option key={item.id} value={item.id}>{item.nome.charAt(0).toUpperCase() + item.nome.slice(1)}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Modifica patenti associate</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Assegna le patenti al veicolo
                        </p>
                    </div>
                    <div className="mt-5 md:mt-0 md:col-span-2 ">
                        {router.asPath.includes('edit') ?
                            <form className="space-y-6 " action="#" method="POST">

                                <div className="grid grid-cols-3 gap-6">
                                    <div className="col-span-3 sm:col-span-2">
                                        <legend className="">Patenti assegnabili</legend>

                                        {checkboxList && checkboxList.map((item) => (
                                            <Checkbox key={item.id} item={item} onChange={onChange} />
                                        ))}
                                    </div>
                                </div>

                            </form>
                            :
                            <div>
                                <h3>Potrai associare le patenti solo dopo aver salvato</h3>
                            </div>
                        }
                    </div>
                </div>

            </div>

            {router.asPath.includes('edit') &&
                <>
                    <DeleteAlert clicked={deactivateRecord} buttonName={'Disattiva'} />
                    <ReactivateAlert clicked={reactivateRecord} buttonName={'Riattiva'} />
                    {veicoloAttivo ?
                        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 mt-10">
                            <div className="md:grid md:grid-cols-3 md:gap-6">
                                <div className="md:col-span-1">
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">Disattivazione veicolo</h3>
                                    <p className="mt-1 text-sm text-gray-500">Sezione per disattivare il veicolo</p>
                                </div>
                                <div className="mt-5 md:mt-0 md:col-span-2">
                                    <form className="space-y-6" action="#" method="POST">
                                        <ButtonWithIconLeft clicked={() => alertDeactivateRecord()} icon={ExclamationTriangleIcon} text={`Disattiva il ${pageName}`} color={'red'} />
                                    </form>
                                </div>
                            </div>
                        </div>
                        :
                        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                            <div className="md:grid md:grid-cols-3 md:gap-6">
                                <div className="md:col-span-1">
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">Riattivazione veicolo</h3>
                                    <p className="mt-1 text-sm text-gray-500">Sezione per riattivare il veicolo</p>
                                </div>
                                <div className="mt-5 md:mt-0 md:col-span-2">
                                    <form className="space-y-6" action="#" method="POST">
                                        <ButtonWithIconLeft clicked={() => alertReactivateRecord()} icon={ExclamationTriangleIcon} text={'Riattiva veicolo'} color={'green'} />
                                    </form>
                                </div>
                            </div>
                        </div>
                    }
                </>
            }
        </div>
    )
}
