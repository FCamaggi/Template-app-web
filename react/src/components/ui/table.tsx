// src/components/ui/table.tsx

import * as React from 'react';
import { cn } from '@/utils/cn';
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';

interface TableProps<T> extends React.HTMLAttributes<HTMLTableElement> {
  data: T[];
  columns: TableColumn<T>[];
  sortColumn?: keyof T;
  sortDirection?: 'asc' | 'desc';
  onSort?: (column: keyof T) => void;
  selectable?: boolean;
  selectedRows?: T[];
  onSelectionChange?: (selectedRows: T[]) => void;
  loading?: boolean;
  onRowClick?: (row: T) => void; // Agregado
}

interface TableColumn<T> {
  key: keyof T;
  header: string;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export function Table<T extends { id: string | number }>({
  data,
  columns,
  sortColumn,
  sortDirection,
  onSort,
  selectable,
  selectedRows = [],
  onSelectionChange,
  loading,
  className,
  onRowClick,
  ...props
}: TableProps<T>) {
  const [internalSelectedRows, setInternalSelectedRows] =
    React.useState<T[]>(selectedRows);

  const handleHeaderClick = (column: keyof T) => {
    if (onSort && columns.find((col) => col.key === column)?.sortable) {
      onSort(column);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSelected = e.target.checked ? data : [];
    setInternalSelectedRows(newSelected);
    onSelectionChange?.(newSelected);
  };

  const handleSelectRow = (row: T) => {
    const isSelected = internalSelectedRows.some((r) => r.id === row.id);
    const newSelected = isSelected
      ? internalSelectedRows.filter((r) => r.id !== row.id)
      : [...internalSelectedRows, row];
    setInternalSelectedRows(newSelected);
    onSelectionChange?.(newSelected);
  };

  const getSortIcon = (column: keyof T) => {
    if (column !== sortColumn)
      return <ChevronsUpDown className="w-4 h-4 text-gray-400" />;
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  return (
    <div className="relative overflow-x-auto">
      <table
        className={cn('w-full text-sm text-left text-gray-500', className)}
        {...props}
      >
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            {selectable && (
              <th scope="col" className="p-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={
                      data.length > 0 &&
                      internalSelectedRows.length === data.length
                    }
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                  />
                </div>
              </th>
            )}
            {columns.map((column) => (
              <th
                key={String(column.key)}
                scope="col"
                className={cn(
                  'px-6 py-3',
                  column.sortable && 'cursor-pointer hover:bg-gray-100'
                )}
                style={{ width: column.width }}
                onClick={() => handleHeaderClick(column.key)}
              >
                <div className="flex items-center gap-1">
                  {column.header}
                  {column.sortable && getSortIcon(column.key)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan={selectable ? columns.length + 1 : columns.length}
                className="px-6 py-4 text-center"
              >
                <div className="flex justify-center items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
                  <span className="ml-2">Loading...</span>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={selectable ? columns.length + 1 : columns.length}
                className="px-6 py-4 text-center"
              >
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, _index) => (
              <tr
                key={row.id}
                className={cn(
                  'bg-white border-b hover:bg-gray-50',
                  onRowClick && 'cursor-pointer',
                  internalSelectedRows.some((r) => r.id === row.id) &&
                    'bg-primary-50'
                )}
                onClick={() => onRowClick?.(row)}
              >
                {selectable && (
                  <td className="w-4 p-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={internalSelectedRows.some(
                          (r) => r.id === row.id
                        )}
                        onChange={() => handleSelectRow(row)}
                        className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                      />
                    </div>
                  </td>
                )}
                {columns.map((column) => (
                  <td key={String(column.key)} className="px-6 py-4">
                    {column.cell ? column.cell(row) : String(row[column.key])}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
