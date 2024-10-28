import React, { useState } from "react";

export default function Checkbox({
    item,
    onChange
}) {
    const [checked, setChecked] = useState(item.isChecked);

    return (
        <div key={item.id} className="relative flex items-start my-3">

            <div className="flex items-center h-5">
                <input
                    id="patente"
                    aria-describedby="rule-description"
                    name="patente"
                    value={item.id}
                    checked={checked}
                    onChange={(e) => {
                        onChange(e, item);
                        setChecked(!checked)
                    }}
                    type="checkbox"
                    className={`focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded `}
                />
            </div>
            <div className="ml-3 text-sm">
                <label htmlFor="patente" className="font-medium text-gray-700 uppercase">
                    {item.nome}
                </label>
                <span id="comments-description" className="text-gray-500 uppercase">
                    <span className="sr-only"> {item.nome} </span>
                </span>
            </div>
        </div>
    )
}