import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem } from '@/components/ui/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { ProductFilterFormValues } from '../product-filter/validation';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount?: number;
  isLoading: boolean;
}

export function DataTable<TData, TValue>({ columns, data, pageCount, isLoading }: DataTableProps<TData, TValue>) {
  const [page, setPage] = useState(0);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  const { control } = useFormContext<ProductFilterFormValues>();

  let content = table.getRowModel().rows?.length ? (
    table.getRowModel().rows.map((row) => (
      <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
        ))}
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={columns.length} className="h-24 text-center">
        No results.
      </TableCell>
    </TableRow>
  );
  if (isLoading) {
    content = (
      <TableRow>
        <TableCell colSpan={5} className="h-24 text-center">
          <Loader2 className={cn('mr-2 hidden h-4 w-4 animate-spin flex mx-auto')} />
        </TableCell>
      </TableRow>
    );
  }
  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>{content}</TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div>
          Page {page + 1} of {pageCount || 0}
        </div>
        <FormField
          control={control}
          name="offset"
          render={({ field }) => {
            return (
              <FormItem>
                <FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setPage((prev) => prev - 1);
                      field.onChange((page - 1) * 10);
                    }}
                    disabled={page === 0}
                  >
                    Previous
                  </Button>
                </FormControl>
              </FormItem>
            );
          }}
        />
        <FormField
          control={control}
          name="offset"
          render={({ field }) => {
            return (
              <FormItem>
                <FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setPage((prev) => prev + 1);
                      field.onChange((page + 1) * 10);
                    }}
                    disabled={page + 1 === pageCount || !pageCount}
                  >
                    Next
                  </Button>
                </FormControl>
              </FormItem>
            );
          }}
        />
      </div>
    </div>
  );
}
