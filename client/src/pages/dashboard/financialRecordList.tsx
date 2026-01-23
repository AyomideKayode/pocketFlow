import { useMemo, useState, useEffect, useCallback } from 'react';
import {
  useFinancialRecords,
  type FinancialRecord,
} from '../../contexts/financial-record-context';
import { useConfirmationDialog } from '../../contexts/confirmation-dialog-context';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  type ColumnDef,
} from '@tanstack/react-table';
import { Trash2 } from 'lucide-react';
import { clsx } from 'clsx';

type CellValue = string | number | Date;

interface EditableCellProps {
  getValue: () => CellValue;
  row: { index: number; original: FinancialRecord };
  column: { id: string };
  updateRecord: (rowIndex: number, columnId: string, value: CellValue) => void;
  editable: boolean;
  renderItem?: (value: CellValue) => React.ReactNode;
  type?: 'text' | 'number';
}

const EditableCell: React.FC<EditableCellProps> = ({
  getValue,
  row,
  column,
  updateRecord,
  editable,
  renderItem,
  type = 'text',
}) => {
  const initialValue = getValue();
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState<CellValue>(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const onBlur = () => {
    setIsEditing(false);
    let finalValue = value;
    if (type === 'number') {
      finalValue = parseFloat(String(value));
      if (isNaN(finalValue)) {
        finalValue = initialValue as number;
      } else {
        finalValue = Math.abs(finalValue);
      }
    }

    if (finalValue !== initialValue) {
      updateRecord(row.index, column.id, finalValue);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onBlur();
    }
  };

  if (!editable) {
    return (
      <span className='text-slate-300'>
        {value instanceof Date ? value.toLocaleDateString() : String(value)}
      </span>
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className={clsx(
        'cursor-pointer rounded px-2 py-1 transition-colors hover:bg-slate-800',
        isEditing && 'bg-slate-800 ring-1 ring-emerald-500',
      )}
    >
      {isEditing ? (
        <input
          value={
            value instanceof Date
              ? value.toISOString().split('T')[0]
              : String(value)
          }
          onChange={(e) => setValue(e.target.value)}
          autoFocus
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          type={type}
          className='w-full bg-transparent p-0 text-sm text-white focus:outline-none'
        />
      ) : renderItem ? (
        renderItem(value)
      ) : (
        <span className='text-slate-300'>{String(value)}</span>
      )}
    </div>
  );
};

const columnHelper = createColumnHelper<FinancialRecord>();

interface FinancialRecordListProps {
  limit?: number;
}

export const FinancialRecordList = ({ limit }: FinancialRecordListProps) => {
  const { records, updateRecord, deleteRecord } = useFinancialRecords();
  const { showConfirmation } = useConfirmationDialog();

  const displayRecords = useMemo(() => {
    // Sort by date descending
    const sorted = [...records].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });

    // Limit if needed
    if (limit && limit > 0) {
      return sorted.slice(0, limit);
    }
    return sorted;
  }, [records, limit]);

  const handleDeleteRecord = useCallback(
    (record: FinancialRecord) => {
      showConfirmation({
        title: 'Delete Transaction',
        message: `Are you sure you want to delete "${record.description}"?`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        variant: 'danger',
        onConfirm: () => deleteRecord(record._id ?? ''),
      });
    },
    [showConfirmation, deleteRecord],
  );

  const updateCellRecord = useCallback(
    (rowIndex: number, columnId: string, value: CellValue) => {
      // Use displayRecords to get the correct record based on current view
      const record = displayRecords[rowIndex];
      if (!record) return;

      const id = record._id;
      updateRecord(id ?? '', { ...record, [columnId]: value });
    },
    [displayRecords, updateRecord],
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns = useMemo<ColumnDef<FinancialRecord, any>[]>(
    () => [
      columnHelper.accessor('description', {
        header: 'Description',
        cell: (props) => (
          <EditableCell
            {...props}
            updateRecord={updateCellRecord}
            editable={true}
          />
        ),
      }),
      columnHelper.accessor('amount', {
        header: 'Amount',
        cell: (props) => (
          <EditableCell
            {...props}
            updateRecord={updateCellRecord}
            editable={true}
            type='number'
            renderItem={(val) => {
              const numVal = Number(val);
              const type = props.row.original.type;
              return (
                <div
                  className={clsx(
                    'font-medium',
                    type === 'income' ? 'text-emerald-500' : 'text-rose-500',
                  )}
                >
                  {type === 'income' ? '+' : '-'}${Math.abs(numVal).toFixed(2)}
                </div>
              );
            }}
          />
        ),
      }),
      columnHelper.accessor('category', {
        header: 'Category',
        cell: (props) => (
          <EditableCell
            {...props}
            updateRecord={updateCellRecord}
            editable={true}
            renderItem={(val) => (
              <span className='inline-flex items-center rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-300'>
                {String(val)}
              </span>
            )}
          />
        ),
      }),
      columnHelper.accessor('paymentMethod', {
        header: 'Method',
        cell: (props) => (
          <EditableCell
            {...props}
            updateRecord={updateCellRecord}
            editable={true}
            renderItem={(val) => (
              <span className='text-xs text-slate-500'>{String(val)}</span>
            )}
          />
        ),
      }),
      columnHelper.accessor('date', {
        header: 'Date',
        cell: (props) => {
          const val = props.getValue();
          const date =
            val instanceof Date ? val : new Date(val as string | number);
          return (
            <span className='text-xs text-slate-400'>
              {date.toLocaleDateString()}
            </span>
          );
        },
      }),
      columnHelper.display({
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <button
            onClick={() => handleDeleteRecord(row.original)}
            className='rounded-md p-2 text-slate-500 hover:bg-rose-500/10 hover:text-rose-500 transition-colors'
            title='Delete'
          >
            <Trash2 className='h-4 w-4' />
          </button>
        ),
      }),
    ],
    [updateCellRecord, handleDeleteRecord],
  );

  const table = useReactTable({
    data: displayRecords,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (records.length === 0) {
    return null;
  }

  return (
    <div className='overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 shadow-sm backdrop-blur-sm'>
      <div className='overflow-x-auto'>
        <table className='w-full text-left text-sm'>
          <thead className='bg-slate-900/80 text-xs uppercase text-slate-400'>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className='px-6 py-3 font-semibold tracking-wider'
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className='divide-y divide-slate-800'>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className='hover:bg-slate-800/30 transition-colors group'
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className='px-6 py-4 whitespace-nowrap'>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
