import { useState } from 'react';
import ColumnSelector from '../components/allievi/columnSelector';

export default function TestColumnSelector() {
    const [visibleColumns, setVisibleColumns] = useState([
        'iscrizione', 'nome', 'autoscuola', 'patente', 'scadenzaFr', 'dataEsame'
    ]);

    const columns = [
        { key: 'iscrizione', label: 'N. ISCRIZIONE' },
        { key: 'nome', label: 'COGNOME E NOME' },
        { key: 'autoscuola', label: 'AUTOSCUOLA' },
        { key: 'patente', label: 'PATENTE' },
        { key: 'scadenzaFr', label: 'SCADENZA FR' },
        { key: 'dataEsame', label: 'DATA ESAME' },
        { key: 'guide', label: 'GUIDE' },
        { key: 'ultimoServizio', label: 'ULTIMO SERVIZIO' },
        { key: 'prossimoServizio', label: 'PROSSIMO SERVIZIO' }
    ];

    const handleColumnToggle = (columnKey) => {
        setVisibleColumns(prev => 
            prev.includes(columnKey) 
                ? prev.filter(col => col !== columnKey)
                : [...prev, columnKey]
        );
    };

    const handleResetColumns = () => {
        setVisibleColumns([
            'iscrizione', 'nome', 'autoscuola', 'patente', 'scadenzaFr', 'dataEsame'
        ]);
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Test Column Selector</h1>
            
            {/* Componente da testare */}
            <div className="mb-6">
                <ColumnSelector 
                    columns={columns}
                    visibleColumns={visibleColumns}
                    onColumnToggle={handleColumnToggle}
                    onResetColumns={handleResetColumns}
                />
            </div>

            {/* Debug info */}
            <div className="bg-gray-100 p-4 rounded">
                <h3 className="font-semibold mb-2">Colonne Visibili:</h3>
                <p className="text-sm">{visibleColumns.join(', ')}</p>
            </div>

            {/* Simulazione tabella */}
            <div className="mt-6">
                <h3 className="font-semibold mb-2">Anteprima Tabella:</h3>
                <div className="border rounded">
                    <div className="bg-gray-50 p-2 font-medium">
                        {visibleColumns.map(colKey => {
                            const column = columns.find(c => c.key === colKey);
                            return (
                                <span key={colKey} className="inline-block w-32 p-2 border-r">
                                    {column.label}
                                </span>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
