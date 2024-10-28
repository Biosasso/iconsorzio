import React, { useState } from "react";

export default function CheckBox({
    item,
    onChange
}) {
    const [checked, setChecked] = useState(item.isChecked);
    return (
        <div key={item.id} className="relative flex items-start">
            <div className="flex items-center h-5">
                <input
                    id="rule"
                    aria-describedby="rule-description"
                    name="rule"
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
                <label htmlFor="comments" className="font-medium text-gray-700">
                    {item.description}
                </label>
                <span id="comments-description" className="text-gray-500">
                    <span className="sr-only"> {item.description} </span>  {item.accessCode}
                </span>
            </div>
        </div>
    )
}