import React, { forwardRef, useState, useMemo } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const tableVariants = cva(
  "w-full border-collapse",
  {
    variants: {
      variant: {
        default: "",
        striped: "",
        bordered: "border border-gray-200",
        hover: ""
      },
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
);

const tableHeaderVariants = cva(
  "bg-gray-50 text-left font-semibold text-gray-900",
  {
    variants: {
      size: {
        sm: "px-3 py-2",
        md: "px-4 py-3",
        lg: "px-6 py-4"
      }
    },
    defaultVariants: {
      size: "md"
    }
  }
);

const tableCellVariants = cva(
  "border-b border-gray-100",
  {
    variants: {
      size: {
        sm: "px-3 py-2",
        md: "px-4 py-3",
        lg: "px-6 py-4"
      }
    },
    defaultVariants: {
      size: "md"
    }
  }
);

const Table = forwardRef(({
  variant = "default",
  size = "md",
  className,
  children,
  ...props
}, ref) => {
  return (
    <div className="w-full overflow-x-auto">
      <table
        ref={ref}
        className={cn(tableVariants({ variant, size }), className)}
        {...props}
      >
        {children}
      </table>
    </div>
  );
});

Table.displayName = "Table";

const TableHeader = forwardRef(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <thead
      ref={ref}
      className={cn("", className)}
      {...props}
    >
      {children}
    </thead>
  );
});

TableHeader.displayName = "TableHeader";

const TableRow = forwardRef(({
  className,
  children,
  isSelected = false,
  onClick,
  ...props
}, ref) => {
  const baseClasses = cn(
    tableCellVariants({ size: "md" }),
    "transition-colors",
    {
      "bg-blue-50 border-blue-200": isSelected,
      "hover:bg-gray-50 cursor-pointer": onClick,
      "even:bg-gray-50": false // Gestito dal TableBody
    }
  );

  return (
    <tr
      ref={ref}
      className={cn(baseClasses, className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </tr>
  );
});

TableRow.displayName = "TableRow";

const TableHeaderCell = forwardRef(({
  className,
  children,
  sortable = false,
  sortDirection = null,
  onSort,
  ...props
}, ref) => {
  const handleSort = () => {
    if (sortable && onSort) {
      onSort();
    }
  };

  return (
    <th
      ref={ref}
      className={cn(
        tableHeaderVariants({ size: "md" }),
        {
          "cursor-pointer select-none hover:bg-gray-100": sortable
        },
        className
      )}
      onClick={handleSort}
      {...props}
    >
      <div className="flex items-center space-x-2">
        <span>{children}</span>
        {sortable && (
          <div className="flex flex-col">
            <ChevronUpIcon 
              className={cn(
                "w-3 h-3",
                sortDirection === "asc" ? "text-blue-600" : "text-gray-400"
              )}
            />
            <ChevronDownIcon 
              className={cn(
                "w-3 h-3 -mt-1",
                sortDirection === "desc" ? "text-blue-600" : "text-gray-400"
              )}
            />
          </div>
        )}
      </div>
    </th>
  );
});

TableHeaderCell.displayName = "TableHeaderCell";

const TableBody = forwardRef(({
  className,
  children,
  variant = "default",
  ...props
}, ref) => {
  return (
    <tbody
      ref={ref}
      className={cn(
        {
          "[&>tr:nth-child(even)]:bg-gray-50": variant === "striped",
          "[&>tr:hover]:bg-gray-50": variant === "hover"
        },
        className
      )}
      {...props}
    >
      {children}
    </tbody>
  );
});

TableBody.displayName = "TableBody";

const TableCell = forwardRef(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <td
      ref={ref}
      className={cn(tableCellVariants({ size: "md" }), className)}
      {...props}
    >
      {children}
    </td>
  );
});

TableCell.displayName = "TableCell";

const TableFooter = forwardRef(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <tfoot
      ref={ref}
      className={cn("bg-gray-50 font-semibold", className)}
      {...props}
    >
      {children}
    </tfoot>
  );
});

TableFooter.displayName = "TableFooter";

// Componente Table avanzato con funzionalità
const DataTable = forwardRef(({
  data = [],
  columns = [],
  variant = "default",
  size = "md",
  sortable = true,
  searchable = true,
  pagination = true,
  pageSize = 10,
  selectable = false,
  onRowSelect,
  className,
  ...props
}, ref) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState(new Set());

  // Funzione di ordinamento
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  // Funzione di ricerca
  const filteredData = useMemo(() => {
    if (!searchTerm) return sortedData;

    return sortedData.filter(item =>
      Object.values(item).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [sortedData, searchTerm]);

  // Paginazione
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Gestione ordinamento
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Gestione selezione righe
  const handleRowSelect = (rowId) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(rowId)) {
      newSelected.delete(rowId);
    } else {
      newSelected.add(rowId);
    }
    setSelectedRows(newSelected);
    onRowSelect?.(Array.from(newSelected));
  };

  // Gestione selezione tutte le righe
  const handleSelectAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
      onRowSelect?.([]);
    } else {
      const allIds = paginatedData.map(row => row.id || row[columns[0]?.key]);
      setSelectedRows(new Set(allIds));
      onRowSelect?.(allIds);
    }
  };

  return (
    <div className="space-y-4" ref={ref}>
      {/* Barra di ricerca */}
      {searchable && (
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cerca..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {/* Tabella */}
      <Table variant={variant} size={size} className={className} {...props}>
        <TableHeader>
          <TableRow>
            {selectable && (
              <TableHeaderCell>
                <input
                  type="checkbox"
                  checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </TableHeaderCell>
            )}
            {columns.map((column) => (
              <TableHeaderCell
                key={column.key}
                sortable={sortable && column.sortable !== false}
                sortDirection={sortConfig.key === column.key ? sortConfig.direction : null}
                onSort={() => handleSort(column.key)}
              >
                {column.label}
              </TableHeaderCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody variant={variant}>
                      {paginatedData.map((row, index) => (
            <TableRow
              key={row.id || index}
              isSelected={selectedRows.has(row.id || row[columns[0]?.key])}
            >
              {selectable && (
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedRows.has(row.id || row[columns[0]?.key])}
                    onChange={() => handleRowSelect(row.id || row[columns[0]?.key])}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell key={column.key}>
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Paginazione */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Mostrando {startIndex + 1} a {Math.min(endIndex, filteredData.length)} di {filteredData.length} risultati
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={cn(
                  "px-3 py-1 border rounded",
                  currentPage === page
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-300 hover:bg-gray-50"
                )}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

DataTable.displayName = "DataTable";

export { 
  Table, 
  TableHeader, 
  TableHeaderCell, 
  TableBody, 
  TableRow, 
  TableCell, 
  TableFooter,
  DataTable
};
export default Table;
