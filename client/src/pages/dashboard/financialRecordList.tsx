import { useMemo, useState } from 'react';
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

interface EditableCellProps {
  getValue: () => any;
  row: { index: number; original: FinancialRecord };
  column: { id: string };
  updateRecord: (rowIndex: number, columnId: string, value: any) => void;
  editable: boolean;
}

const EditableCell: React.FC<EditableCellProps> = ({
  getValue,
  row,
  column,
  updateRecord,
  editable,
}) => {
  const initialValue = getValue();
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  const onBlur = () => {
    setIsEditing(false);
    updateRecord(row.index, column.id, value);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onBlur();
    }
  };

  if (!editable) {
    return (
      <span className='text-slate-300'>
        {value instanceof Date ? value.toLocaleDateString() : value}
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
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          className='w-full bg-transparent p-0 text-sm text-white focus:outline-none'
        />
      ) : (
        <span className='text-slate-300'>{value}</span>
      )}
    </div>
  );
};

export const FinancialRecordList = () => {
  const { records, updateRecord, deleteRecord } = useFinancialRecords();
  const { showConfirmation } = useConfirmationDialog();

  const handleDeleteRecord = (record: FinancialRecord) => {
    showConfirmation({
      title: 'Delete Transaction',
      message: `Are you sure you want to delete "${record.description}"?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger',
      onConfirm: () => deleteRecord(record._id ?? ''),
    });
  };

  const updateCellRecord = (rowIndex: number, columnId: string, value: any) => {
    const id = records[rowIndex]?._id;
    updateRecord(id ?? '', { ...records[rowIndex], [columnId]: value });
  };

  const columnHelper = createColumnHelper<FinancialRecord>();

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
        cell: (props) => {
          const val = props.getValue();
          const type = props.row.original.type;
          return (
            <div
              className={clsx(
                'font-medium',
                type === 'income' ? 'text-emerald-500' : 'text-rose-500',
              )}
            >
              {type === 'income' ? '+' : '-'}${Math.abs(val).toFixed(2)}
            </div>
          );
        },
      }),
      columnHelper.accessor('category', {
        header: 'Category',
        cell: (props) => (
          <span className='inline-flex items-center rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-300'>
            {props.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor('paymentMethod', {
        header: 'Method',
        cell: (props) => (
          <span className='text-xs text-slate-500'>{props.getValue()}</span>
        ),
      }),
      columnHelper.accessor('date', {
        header: 'Date',
        cell: (props) => {
          const date = new Date(props.getValue());
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
    [records],
  );

  const table = useReactTable({
    data: records,
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
