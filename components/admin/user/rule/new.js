import { useState, useContext } from "react"
import { useRouter } from "next/router";
import useSWR from "swr";
import fetcher from "../../../../lib/fetch";
import NotificationsContext from "../../../../store/notifications";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function NewUserRuleForm({
    rules,
    userId
}) {

    const router = useRouter();

    const notify = useContext(NotificationsContext);

    const [accessLevel, setAccessLevel] = useState(false);

    const { data, error } = useSWR(`/api/admin/users/getUserData?id=${userId}`, fetcher);

    if (!data) return 'loading...';

    const createRule = async (e) => {

        if (!accessLevel) {
            notify.error.setTitle('Devi selezionare un permesso');
            notify.error.setMessage('Se non vedi permessi selezionabili significa che tutti i permessi disponibili sono già stati assegnati')
            notify.error.setShow(true);
            return
        }

        notify.loading.setShow(true);

        try {
            const res = await fetch('/api/admin/users/rule/new', {
                method: 'POST',
                body: JSON.stringify({ userId: data.id, ruleId: accessLevel }),
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            const result = await res.json();

            if (result.statusCode === 200) {
                notify.success.setTitle('Aggiornamento completato');
                notify.success.setMessage('');
                notify.loading.setShow(false);
                notify.success.setShow(true);
                router.back();
            }

        } catch (err) {
            console.log(err)
        }

    }

    if (data) return (
        <div className="space-y-6 p-6">
            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">{data && (data.user.profile.firstname + ' ' + data.user.profile.lastname)}</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Stai creando un nuovo permesso
                        </p>
                    </div>
                    <div className="mt-5 md:mt-0 md:col-span-2">
                        <form className="space-y-6">
                            <div className="grid grid-cols-3 gap-6">

                                <div className="col-span-3 sm:col-span-2">
                                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                        Livello di accesso
                                    </label>
                                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                                        <select
                                            id="accessLevel"
                                            name="accessLevel"
                                            autoComplete="accessLevel"
                                            defaultValue={accessLevel}
                                            onChange={(e) => { setAccessLevel(e.target.value) }}
                                            className="max-w-lg block focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                        >
                                            <option value={false}>Seleziona un livello di accesso...</option>
                                            {rules && rules.map(item => {
                                                const found = data.userRules?.find(element => {
                                                    if (element.ruleId === item.id) {

                                                        return true
                                                    }
                                                    else {
                                                        return false
                                                    }
                                                })
                                                if (!found) {
                                                    return <option value={item.id} key={item.accessCode}>{item.description}</option>
                                                }
                                            })}
                                        </select>
                                    </div>
                                </div>

                                {/* More fields here*/}
                            </div>

                        </form>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Indietro
                </button>
                <button
                    onClick={() => { createRule() }}
                    type="button"
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Crea permesso
                </button>
            </div>
        </div>
    )
}
