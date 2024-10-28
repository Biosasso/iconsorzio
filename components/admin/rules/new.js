import { useState, useEffect, useContext } from 'react'
import NotificationsContext from '../../../store/notifications';
import { useRouter } from "next/router";
import RadiobuttonColors from "../..//UI/forms/radiobuttonColor";

export default function NewRules({
    rules,
    companyId,
    pages,
}) {

    const router = useRouter();
    const notify = useContext(NotificationsContext)

    const [selectedColor, setSelectedColor] = useState('');
    const [selected, setSelected] = useState('Seleziona un permesso...');
    const [selectedDescription, setSelectedDescription] = useState('')


    const createRule = async event => {

        event.preventDefault();

        const ruleData = {
            description: selectedDescription,
            companyId: companyId,
            accessCode: selected,
            bgColor: selectedColor.bgColor,
        };

        const res = await fetch('/api/admin/rules/new', {
            body: JSON.stringify({ data: ruleData }),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        });

        const result = await res.json();

        if (result.statusCode === 200) {
            const found = levelAccess.find((element) => element === ruleData.accessCode)
            if (found) {
                const index = levelAccess.indexOf(found);
                levelAccess.splice(index, 1)
            }
            notify.success.setTitle(`Permesso ${ruleData.description} creato con successo!`);
            notify.success.setShow(true)
        }
        if (result.statusCode === 400) {
            setValidationFields(result.fields)
        }
    }

    const [levelAccess, setLevelAccess] = useState(pages);
    const [updateSelectRules, setUpdateSelectRules] = useState(false);

    useEffect(() => {

        if (!rules.lenght) {
            setSelected(levelAccess[0])
        }
        else {
            setSelected(levelAccess[0])
        }

        rules.map(accessLevel => {
            const found = levelAccess.find((element) => element === accessLevel.accessCode)
            if (found) {
                const index = levelAccess.indexOf(found);
                levelAccess.splice(index, 1)
            }
        });

    }, [levelAccess])

    return (
        <form onSubmit={createRule} className="space-y-8 divide-y divide-gray-200 p-8">
            <div className="space-y-8 divide-y divide-gray-200">
                <div>
                    <div>
                        <p className="mt-1 text-sm text-gray-500">
                            In questa pagina stai creando nuovi livelli di accesso
                        </p>
                    </div>
                    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-6">
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                                Seleziona permesso
                            </label>
                            <select
                                id="location"
                                name="location"
                                onChange={(e) => {
                                    setSelectedDescription(e.target.options[e.target.selectedIndex].text);
                                    setSelected(e.target.value);
                                }}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                defaultValue="Canada"
                            >
                                <option>Seleziona permesso...</option>
                                <>
                                    {levelAccess && levelAccess.map((item) => {
                                        const rule = item.split('/');
                                        let name = rule.at(-1);
                                        let folder1 = rule.at(-2);
                                        let folder2 = rule.at(-3);
                                        let folder3 = rule.at(-4) ? rule.at(-4) : '';
                                        let folder4 = rule.at(-5) ? rule.at(-5) : '';
                                        if (name.includes('list')) {
                                            name = 'Visualizza'
                                        }
                                        if (name.includes('[')) {
                                            name = 'Modifica'
                                        }
                                        if (name.includes('update')) {
                                            name = 'Modifica'
                                        }
                                        if (name.includes('new')) {
                                            name = 'Crea nuovi'
                                        }
                                        if (name.includes('switch')) {
                                            name = 'Cambia'
                                        }
                                        if (name.includes('delete')) {
                                            name = 'Elimina'
                                        }

                                        if (folder1.includes('rules')) {
                                            folder1 = 'Ruoli'
                                        }
                                        if (folder1.includes('rule')) {
                                            folder1 = 'Ruolo'
                                        }
                                        if (folder1.includes('users')) {
                                            folder1 = 'Utenti'
                                        }
                                        if (folder1.includes('user')) {
                                            folder1 = 'Utente'
                                        }
                                        if (folder1.includes('company')) {
                                            folder1 = 'Azienda'
                                        }

                                        if (folder2.includes('admin')) {
                                            folder2 = 'Gestisci'
                                        }
                                        if (folder2.includes('user')) {
                                            folder2 = 'Utente'
                                        }

                                        if (folder3.includes('admin')) {
                                            folder3 = 'Gestisci'
                                        }
                                        if (folder3.includes('user')) {
                                            folder3 = 'Utente'
                                        }

                                        if (folder4.includes('admin')) {
                                            folder4 = 'Gestisci'
                                        }

                                        return <option key={item} value={item}>
                                            {folder4 && folder4.charAt(0).toUpperCase() + folder4.slice(1) + ' - '}
                                            {folder3 && folder3.charAt(0).toUpperCase() + folder3.slice(1) + ' - '}
                                            {folder2 && folder2.charAt(0).toUpperCase() + folder2.slice(1) + ' - '}
                                            {folder1 && folder1.charAt(0).toUpperCase() + folder1.slice(1) + ' - '}
                                            {name.charAt(0).toUpperCase() + name.slice(1)}
                                        </option>
                                    })
                                    }
                                </>
                            </select>
                        </div>
                        {/* <div className="sm:col-span-6">
                            <Listbox value={selected} onChange={setSelected}>
                                {({ open }) => (
                                    <>
                                        <Listbox.Label className="block text-sm font-medium text-gray-700">Seleziona un permesso </Listbox.Label>
                                        <div className="mt-1 relative">
                                            <Listbox.Button className="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                                <span className="block truncate">{selected}</span>
                                                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                                    <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                                </span>
                                            </Listbox.Button>

                                            <Transition
                                                show={open}
                                                as={Fragment}
                                                leave="transition ease-in duration-100"
                                                leaveFrom="opacity-100"
                                                leaveTo="opacity-0"
                                            >
                                                <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                                    {pages.map((item) => {
                                                        const rule = item.split('/');
                                                        let name = rule.at(-1);
                                                        if (rule.at(-1).includes('[')) {
                                                            name = 'Modifica'
                                                        }
                                                        if (rule.at(-1).includes('index')) {
                                                            name = 'Pagina iniziale'
                                                        }
                                                        if (rule.at(-1).includes('new')) {
                                                            name = 'Crea nuovi'
                                                        }

                                                        return (
                                                            <Listbox.Option
                                                                key={item}
                                                                className={({ active }) =>
                                                                    classNames(
                                                                        active ? 'text-white bg-indigo-600' : 'text-gray-900',
                                                                        'cursor-default select-none relative py-2 pl-3 pr-9'
                                                                    )
                                                                }
                                                                value={item}
                                                            >
                                                                {({ selected, active }) => (
                                                                    <>
                                                                        <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                                                            {rule.at(-5) && rule.at(-4).charAt(0).toUpperCase() + rule.at(-5).slice(1) + ' - '}
                                                                            {rule.at(-4) && rule.at(-4).charAt(0).toUpperCase() + rule.at(-4).slice(1) + ' - '}
                                                                            {rule.at(-3) && rule.at(-3).charAt(0).toUpperCase() + rule.at(-3).slice(1) + ' - '}
                                                                            {rule.at(-2) && rule.at(-2).charAt(0).toUpperCase() + rule.at(-2).slice(1) + ' - '}
                                                                            {name}
                                                                        </span>

                                                                        {selected ? (
                                                                            <span
                                                                                className={classNames(
                                                                                    active ? 'text-white' : 'text-indigo-600',
                                                                                    'absolute inset-y-0 right-0 flex items-center pr-4'
                                                                                )}
                                                                            >
                                                                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                                            </span>
                                                                        ) : null}
                                                                    </>
                                                                )}
                                                            </Listbox.Option>
                                                        )
                                                    })}
                                                </Listbox.Options>
                                            </Transition>
                                        </div>
                                    </>
                                )}
                            </Listbox>
                        </div> */}
                        {/* <div className="sm:col-span-6">
                            <RadiobuttonLevelAccess selected={selected} setSelected={setSelected} existingRules={rules} />
                        </div> */}
                        <div className="sm:col-span-6">
                            <RadiobuttonColors selectedColor={selectedColor} setSelectedColor={setSelectedColor} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-5">
                <div className="flex justify-end">
                    <button
                        onClick={() => router.back()}
                        type="button"
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Annulla
                    </button>
                    <button
                        type="submit"
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Salva
                    </button>
                </div>
            </div>
        </form>
    )
}
