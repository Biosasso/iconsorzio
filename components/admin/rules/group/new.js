export default function RulesGroupNew({
    name,
    description,
    setName,
    setDescription
}) {

    return (
        <div className="space-y-6 p-6">
            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Nuovo gruppo di permessi</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Potrai aggiungere i permessi solo dopo aver creato il nuovo gruppo di ruoli
                        </p>
                    </div>
                    <div className="mt-5 md:mt-0 md:col-span-2">
                        <form className="space-y-6" action="#" method="POST">
                            <div className="grid grid-cols-3 gap-6">
                                <div className="col-span-3 sm:col-span-2">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        Nome
                                    </label>
                                    <div className="mt-1 flex rounded-md shadow-sm">
                                        <input
                                            type="text"
                                            name="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                            placeholder="Es. ruolo visualizzatore"
                                        />
                                    </div>
                                </div>
                                <div className="col-span-3 sm:col-span-2">
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                        Descrizione
                                    </label>
                                    <div className="mt-1 flex rounded-md shadow-sm">
                                        <input
                                            type="text"
                                            name="description"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                            placeholder="Il ruolo servirà per visualizzare soltanto i contenuti"
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
