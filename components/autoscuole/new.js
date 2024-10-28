import { provinceItalia } from "../../utils/provinceItalia";
import { useRouter } from "next/router";

export default function NewAutoscuola({
    consorziato,
    setConsorziato,
    data,
    setData,
    validationFields,
    notify
}) {

    const router = useRouter();

    const province = provinceItalia();

    const validatePrimaryKey = async (value) => {

        notify.loading.setShow(true);

        try {
            const res = await fetch('/api/autoscuole/checkAutoscuolaExist', {
                method: 'POST',
                body: JSON.stringify({ codMotorizzazione: value, id: null }),
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
                    router.replace(`/autoscuole/edit/${result.autoscuolaFound}`)
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
        <form className="space-y-8 divide-y divide-gray-200 p-8">
            <div className="space-y-8 divide-y divide-gray-200">
                <div>
                    <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Crea nuova autoscuola</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            In questa pagina stai creando una nuova autoscuola
                        </p>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">

                        <div className="sm:col-span-6">
                            <label htmlFor="denominazione" className="block text-sm font-medium text-gray-700">
                                Denominazione
                            </label>
                            <div className="mt-1">
                                <input
                                    required
                                    value={data.denominazione}
                                    onChange={(e) => setData({ ...data, denominazione: e.target.value })}
                                    type="text"
                                    name="denominazione"
                                    id="denominazione"
                                    autoComplete="given-name"
                                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm ${validationFields.includes('denominazione') ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-4">
                            <fieldset>
                                <legend className="text-sm font-medium text-gray-700">Consorziato</legend>
                                <div className="mt-4 space-y-4">
                                    <div className="relative flex items-start">
                                        <div className="flex items-center h-5">
                                            <input
                                                id="consorzioToggle"
                                                name="consorzioToggle"
                                                type="checkbox"
                                                checked={consorziato}
                                                value={consorziato}
                                                onChange={(e) => {
                                                    setConsorziato(!consorziato);
                                                    setData({ ...data, consorzioToggle: !consorziato })

                                                }}
                                                className={`focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded`}
                                            />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor="consorzioToggle" className="font-medium text-gray-700">
                                                L'autoscuola è consorziata?
                                            </label>
                                            <p className="text-gray-500">Seleziona se l'autoscuola è consorziata, lascia in bianco se non lo è.</p>
                                        </div>
                                    </div>
                                </div>
                            </fieldset>
                        </div>
                        <div className="sm:col-span-6">
                            <label htmlFor="ragSoc" className="block text-sm font-medium text-gray-700">
                                Ragione Sociale
                            </label>
                            <div className="mt-1">
                                <input
                                    value={data.ragSoc}
                                    onChange={(e) => setData({ ...data, ragSoc: e.target.value })}
                                    required
                                    type="text"
                                    name="ragSoc"
                                    id="ragSoc"
                                    autoComplete="ragione-sociale"
                                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm ${validationFields.includes('ragSoc') ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="provincia" className="block text-sm font-medium text-gray-700">
                                Provincia
                            </label>
                            <div className="mt-1">
                                <select
                                    value={data.provincia}
                                    onChange={(e) => setData({ ...data, provincia: e.target.value })}
                                    id="provincia"
                                    name="provincia"
                                    autoComplete="provincia"
                                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm ${validationFields.includes('provincia') ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                >
                                    {province.map((item) => {
                                        return <option key={item.sigla}>{item.nome}</option>
                                    })}
                                </select>
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="comune" className="block text-sm font-medium text-gray-700">
                                Comune
                            </label>
                            <div className="mt-1">
                                <input
                                    value={data.comune}
                                    onChange={(e) => setData({ ...data, comune: e.target.value })}
                                    required
                                    type="text"
                                    name="comune"
                                    id="comune"
                                    autoComplete="comune"
                                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm ${validationFields.includes('comune') ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-4">
                            <label htmlFor="indirizzo" className="block text-sm font-medium text-gray-700">
                                Indirizzo
                            </label>
                            <div className="mt-1">
                                <input
                                    value={data.indirizzo}
                                    onChange={(e) => setData({ ...data, indirizzo: e.target.value })}
                                    required
                                    type="text"
                                    name="indirizzo"
                                    id="indirizzo"
                                    autoComplete="indirizzo"
                                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm ${validationFields.includes('indirizzo') ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="nCiv" className="block text-sm font-medium text-gray-700">
                                Numero Civico
                            </label>
                            <div className="mt-1">
                                <input
                                    value={data.nCiv}
                                    onChange={(e) => setData({ ...data, nCiv: e.target.value })}
                                    required
                                    type="text"
                                    name="nCiv"
                                    id="nCiv"
                                    autoComplete="nCiv"
                                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm ${validationFields.includes('nCiv') ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-8">
                    <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Dati Contabili</h3>
                        <p className="mt-1 text-sm text-gray-500">Compila tutti i campi per la contabilità.</p>
                    </div>
                    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <label htmlFor="partIva" className="block text-sm font-medium text-gray-700">
                                P.IVA
                            </label>
                            <div className="mt-1">
                                <input
                                    value={data.partIva}
                                    onChange={(e) => setData({ ...data, partIva: e.target.value })}
                                    maxLength="11"
                                    minLength="11"
                                    type="text"
                                    name="partIva"
                                    id="partIva"
                                    autoComplete="partIva"
                                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm  rounded-md ${validationFields.includes('partIva') ? 'border-red-500' : 'border-gray-300'}`}
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="codFisc" className="block text-sm font-medium text-gray-700">
                                Codice Fiscale
                            </label>
                            <div className="mt-1">
                                <input
                                    value={data.codFisc}
                                    onChange={(e) => setData({ ...data, codFisc: e.target.value })}
                                    required
                                    type="text"
                                    name="codFisc"
                                    id="codFisc"
                                    autoComplete="codFisc"
                                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm  rounded-md ${validationFields.includes('codFisc') ? 'border-red-500' : 'border-gray-300'}`}
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="codMotorizzazione" className="block text-sm font-medium text-gray-700">
                                Codice Motorizzazione
                            </label>
                            <div className="mt-1">
                                <input
                                    value={data.codMotorizzazione}
                                    onChange={(e) => setData({ ...data, codMotorizzazione: e.target.value })}
                                    onBlur={(e) => validatePrimaryKey(e.target.value)}
                                    required
                                    id="codMotorizzazione"
                                    name="codMotorizzazione"
                                    type="text"
                                    autoComplete="codMotorizzazione"
                                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm ${validationFields.includes('codMotorizzazione') ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="sdi" className="block text-sm font-medium text-gray-700">
                                Codice SDI per fatturazione
                            </label>
                            <div className="mt-1">
                                <input
                                    value={data.sdi}
                                    onChange={(e) => setData({ ...data, sdi: e.target.value })}
                                    id="sdi"
                                    name="sdi"
                                    type="text"
                                    autoComplete="sdi"
                                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="pec" className="block text-sm font-medium text-gray-700">
                                Indirizzo PEC
                            </label>
                            <div className="mt-1">
                                <input
                                    value={data.pec}
                                    onChange={(e) => setData({ ...data, pec: e.target.value })}
                                    id="pec"
                                    name="pec"
                                    type="email"
                                    autoComplete="pec"
                                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="iban" className="block text-sm font-medium text-gray-700">
                                Iban
                            </label>
                            <div className="mt-1">
                                <input
                                    value={data.iban}
                                    onChange={(e) => setData({ ...data, iban: e.target.value })}
                                    id="iban"
                                    name="iban"
                                    type="text"
                                    autoComplete="iban"
                                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-8">
                    <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Contatti</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Inserisci i contatti dell'autoscuola
                        </p>
                    </div>
                    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-6">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <div className="mt-1">
                                <input
                                    value={data.email}
                                    onChange={(e) => setData({ ...data, email: e.target.value })}
                                    required
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm ${validationFields.includes('email') ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="tel1" className="block text-sm font-medium text-gray-700">
                                Telefono 1
                            </label>
                            <div className="mt-1">
                                <input
                                    value={data.tel1}
                                    onChange={(e) => setData({ ...data, tel1: e.target.value })}
                                    required
                                    id="tel1"
                                    name="tel1"
                                    type="text"
                                    autoComplete="tel1"
                                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm ${validationFields.includes('tel1') ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="tel2" className="block text-sm font-medium text-gray-700">
                                Telefono 2
                            </label>
                            <div className="mt-1">
                                <input
                                    value={data.tel2}
                                    onChange={(e) => setData({ ...data, tel2: e.target.value })}
                                    id="tel2"
                                    name="tel2"
                                    type="text"
                                    autoComplete="tel2"
                                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="cel" className="block text-sm font-medium text-gray-700">
                                Cellulare
                            </label>
                            <div className="mt-1">
                                <input
                                    value={data.cel}
                                    onChange={(e) => setData({ ...data, cel: e.target.value })}
                                    id="cel"
                                    name="cel"
                                    type="text"
                                    autoComplete="cel"
                                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="fax" className="block text-sm font-medium text-gray-700">
                                Fax
                            </label>
                            <div className="mt-1">
                                <input
                                    value={data.fax}
                                    onChange={(e) => setData({ ...data, fax: e.target.value })}
                                    id="fax"
                                    name="fax"
                                    type="text"
                                    autoComplete="fax"
                                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-6">
                            <label htmlFor="note" className="block text-sm font-medium text-gray-700">
                                Note
                            </label>
                            <div className="mt-1">
                                <textarea
                                    value={data.note}
                                    onChange={(e) => setData({ ...data, note: e.target.value })}
                                    id="note"
                                    name="note"
                                    rows={3}
                                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                                />
                            </div>
                            <p className="mt-2 text-sm text-gray-500">Aggiungi delle eventuali note sull'autoscuola</p>
                        </div>


                    </div>
                </div>
            </div>
        </form>
    )
}
