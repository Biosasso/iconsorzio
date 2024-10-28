import DeleteAlert from "../UI/modal/deleteAlert";
import ButtonWithIconLeft from "../UI/button/buttonWithIconLeft";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";

export default function TipologiaFormUpdate({
    nome,
    setNome,
    alertDeleteTariffa,
    deleteTariffaTipo
}) {

    return (
        <div className="space-y-6 p-6">
            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Modifica Tipologia di  Servizio</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            La tipologia di servizio si può considerare come una categoria di prezzi
                        </p>
                    </div>
                    <div className="mt-5 md:mt-0 md:col-span-2">
                        <form className="space-y-6" action="#" method="POST">
                            <div className="grid grid-cols-3 gap-6">
                                <div className="col-span-3 sm:col-span-2">
                                    <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                                        Nome
                                    </label>
                                    <div className="mt-1 flex rounded-md shadow-sm">
                                        <input
                                            type="text"
                                            name="nome"
                                            value={nome}
                                            onChange={(e) => setNome(e.target.value)}
                                            className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                            placeholder="Es. Patenti oppure Corsi speciali"
                                        />
                                    </div>
                                </div>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
            <DeleteAlert clicked={deleteTariffaTipo} buttonName={'Elimina'} />
            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 mt-10">
                <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Eliminazione Tipologia Tariffa</h3>
                        <p className="mt-1 text-sm text-gray-500">Sezione per eliminare la Tipologia di tariffa</p>
                    </div>
                    <div className="mt-5 md:mt-0 md:col-span-2">
                        <form className="space-y-6" action="#" method="POST">
                            <ButtonWithIconLeft clicked={() => alertDeleteTariffa()} icon={ExclamationTriangleIcon} text={'Elimina tipologia di Tariffa'} color={'red'} />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

