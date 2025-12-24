import { useMemo, useState } from "react";
import {
  useFinancialRecords,
  type FinancialRecord,
} from "../../contexts/financial-record-context";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  type ColumnDef,
} from '@tanstack/react-table';

interface EditableCellProps {
  getValue: () => any;
  row: { index: number; original: FinancialRecord };
  column: { id: string };
  table: any;
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

  return (
    <div
      onClick={() => editable && setIsEditing(true)}
      style={{ cursor: editable ? "pointer" : "default" }}
    >
      {isEditing ? (
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
          onBlur={onBlur}
          style={{ width: "100%" }}
        />
      ) : typeof value === "string" ? (
        value
      ) : (
        value.toString()
      )}
    </div>
  );
};

const columnHelper = createColumnHelper<FinancialRecord>();

export const FinancialRecordList = () => {
  const { records, updateRecord, deleteRecord } = useFinancialRecords();

  const updateCellRecord = (rowIndex: number, columnId: string, value: any) => {
    const id = records[rowIndex]?._id;
    updateRecord(id ?? "", { ...records[rowIndex], [columnId]: value });
  };

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
          />
        ),
      }),
      columnHelper.accessor('paymentMethod', {
        header: 'Payment Method',
        cell: (props) => (
          <EditableCell
            {...props}
            updateRecord={updateCellRecord}
            editable={true}
          />
        ),
      }),
      columnHelper.accessor('date', {
        header: 'Date',
        cell: (props) => (
          <EditableCell
            {...props}
            updateRecord={updateCellRecord}
            editable={false}
          />
        ),
      }),
      columnHelper.display({
        id: 'delete',
        header: 'Delete',
        cell: ({ row }) => (
          <button
            onClick={() => deleteRecord(row.original._id ?? "")}
            className="button"
          >
            Delete
          </button>
        ),
      }),
    ],
    [records]
  );

  const table = useReactTable({
    data: records,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
