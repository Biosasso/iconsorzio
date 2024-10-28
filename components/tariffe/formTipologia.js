import { useState, useContext } from "react"
import useSWR from "swr";
import fetcher from '@/lib/fetch'
import NotificationsContext from "../../store/notifications";
import TableTipo from "./tableTipo";

export default function TipologiaForm({
    router,
    tariffaTipo
}) {

    const notify = useContext(NotificationsContext);

    const { data: companyId, error } = useSWR('/api/admin/company/isActive', fetcher);

    const [tipoNome, setTipoNome] = useState('');

    const createNewTipo = async () => {

        if (!tipoNome) {
            notify.error.set({
                title: 'Devi inserire il nome',
            })
            return
        }

        notify.loading.setShow(true);

        const data = {
            companyId: companyId.isActive,
            tipo: tipoNome,
            tipo_cod: tipoNome.replace(' ', '_').toLowerCase()
        }


        if (tariffaTipo.find(el => el.tipo_cod === data.tipo_cod)) {
            notify.warning.set({
                title: `Tipologia già presente in archivio`
            })
            return
        }

        try {
            const res = await fetch('/api/tariffe/tipologie/new', {
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST'
            });
            const result = await res.json();

            if (result.statusCode === 200) {
                notify.success.set({
                    title: `Tariffa creata correttamente`,
                });

                setTimeout(() => {
                    router.push(router.pathname + '#' + tipoNome.replace(' ', '_').toLowerCase());
                    router.reload();
                }, 1000)

            }
            if (result.statusCode === 400) {
                notify.error.set({
                    title: `Errore, controlla i dati inseriti`,
                });

            }
        }
        catch (err) {
            notify.error.set({
                title: `Errore interno, ti preghiamo di riprovare più tardi`,
            });
        }

    }
    if (companyId) {
        return (
            <>
                <TableTipo tableData={tariffaTipo} />
                <div className="space-y-6 p-6">
                    <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                        <div className="md:grid md:grid-cols-3 md:gap-6">
                            <div className="md:col-span-1">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">Aggiungi Tipologia di Servizio</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Una nuova tipologia di servizio si può considerare come una categoria di prezzi
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
                                                    value={tipoNome}
                                                    onChange={(e) => setTipoNome(e.target.value)}
                                                    className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                                    placeholder="Es. Patenti oppure Corsi speciali"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-span-3 sm:col-span-2">
                                            <button
                                                type="button"
                                                onClick={() => createNewTipo()}
                                                className="inline-flex w-full items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            >
                                                Inserisci nuova tipologia
                                            </button>
                                        </div>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
    else {
        return <p>Caricamento dati</p>
    }
}

