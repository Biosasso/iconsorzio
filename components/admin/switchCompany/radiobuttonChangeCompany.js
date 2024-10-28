import { RadioGroup } from '@headlessui/react'
import { useEffect } from 'react'

const levelAccess = [
    { accessLevel: '1', recommended: 'Gestore del sito', description: 'Accesso a tutte le funzionalità' },
    { accessLevel: '2', recommended: 'Addetti amministrativi', description: 'Accesso alla complilazione per tutti gli utenti' },
    { accessLevel: '3', recommended: 'Istruttori', description: 'Accesso alla compilazione dei propri servizi' },
    { accessLevel: '4', recommended: 'Visitatori o allievi', description: 'Accesso alla sola visualizzazione dei propri servizi' },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function RadiobuttonChangeCompany({ selected, setSelected, companies }) {

    return (
        <RadioGroup value={selected} onChange={setSelected}>
            <RadioGroup.Label className="">Seleziona la tua ditta</RadioGroup.Label>
            <div className="relative bg-white rounded-md -space-y-px pt-2">
                {companies.map((item, planIdx) => (
                    <RadioGroup.Option
                        key={item.id}
                        value={item.companyId}
                        className={({ checked }) =>
                            classNames(
                                planIdx === 0 ? 'rounded-tl-md rounded-tr-md' : '',
                                planIdx === levelAccess.length - 1 ? 'rounded-bl-md rounded-br-md' : '',
                                checked ? 'bg-indigo-50 border-indigo-200 z-10' : 'border-gray-200',
                                'relative border p-4 flex flex-col cursor-pointer md:pl-4 md:pr-6 md:grid md:grid-cols-3 focus:outline-none'
                            )
                        }
                    >
                        {({ active, checked }) => (
                            <>
                                <div className="flex items-center text-sm">
                                    <span
                                        className={classNames(
                                            checked ? 'bg-indigo-600 border-transparent' : 'bg-white border-gray-300',
                                            active ? 'ring-2 ring-offset-2 ring-indigo-500' : '',
                                            'h-4 w-4 rounded-full border flex items-center justify-center'
                                        )}
                                        aria-hidden="true"
                                    >
                                        <span className="rounded-full bg-white w-1.5 h-1.5" />
                                    </span>
                                    <RadioGroup.Label
                                        as="span"
                                        className={classNames(checked ? 'text-indigo-900' : 'text-gray-900', 'ml-3 font-medium')}
                                    >
                                        {item.company.vat}
                                    </RadioGroup.Label>
                                </div>
                                <RadioGroup.Description className="ml-6 pl-1 text-sm md:ml-0 md:pl-0 md:text-center">
                                    <span className={classNames(checked ? 'text-indigo-900' : 'text-gray-900', 'font-medium')}>
                                        {item.company.profile.name}
                                    </span>

                                </RadioGroup.Description>
                                <RadioGroup.Description
                                    className={classNames(
                                        checked ? 'text-indigo-700' : 'text-gray-500',
                                        'ml-6 pl-1 text-sm md:ml-0 md:pl-0 md:text-right'
                                    )}
                                >
                                    Seleziona
                                </RadioGroup.Description>
                            </>
                        )}
                    </RadioGroup.Option>
                ))}
            </div>
        </RadioGroup>
    )
}
