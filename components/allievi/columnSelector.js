import { useState, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

export default function ColumnSelector({ columns, visibleColumns, onColumnToggle, onResetColumns, onSave }) {
    const [isOpen, setIsOpen] = useState(false);

    const handleColumnToggle = (columnKey) => {
        onColumnToggle(columnKey);
    };

    const handleReset = () => {
        onResetColumns();
    };

    const handleSave = () => {
        if (onSave) {
            onSave();
        }
        setIsOpen(false); // Chiude il menu dopo il salvataggio
    };

    return (
        <div className="relative inline-block text-left">
            {/* Button per aprire menu */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                <span>Colonne</span>
                <ChevronDownIcon className="ml-2 h-4 w-4" />
            </button>

            {/* Menu dropdown */}
            {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                        {/* Header menu */}
                        <div className="px-4 py-2 text-sm font-medium text-gray-900 border-b border-gray-200">
                            Mostra/Nascondi Colonne
                        </div>
                        
                        {/* Lista colonne */}
                        {columns.map((column) => (
                            <label key={column.key} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={visibleColumns.includes(column.key)}
                                    onChange={() => handleColumnToggle(column.key)}
                                    className="mr-3 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                {column.label}
                            </label>
                        ))}
                        
                                                       {/* Separatore */}
                               <div className="border-t border-gray-200 my-2"></div>

                               {/* Pulsanti azioni */}
                               <div className="flex space-x-2 px-4 py-2">
                                   {/* Reset button */}
                                   <button
                                       onClick={handleReset}
                                       className="flex-1 px-3 py-1 text-sm text-red-600 hover:bg-gray-100 rounded border border-red-200"
                                   >
                                       Reset
                                   </button>
                                   
                                   {/* Salva button */}
                                   <button
                                       onClick={handleSave}
                                       className="flex-1 px-3 py-1 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded border border-blue-600"
                                   >
                                       Salva
                                   </button>
                               </div>
                    </div>
                </div>
            )}
        </div>
    );
}
