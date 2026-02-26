import { useState, useMemo, useCallback } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper
} from '@tanstack/react-table';
import { supabase } from '../api/supabase';
import type { Todo } from '../types/todo';
import { toast } from 'sonner';
import { CheckCircle2, Circle, Users, Lock, Plus } from 'lucide-react';
import { useTodos } from '../hooks/useTodos';

const columnHelper = createColumnHelper<Todo>();

export default function Dashboard() {
  const { todos, loading } = useTodos();
  const [newTodo, setNewTodo] = useState('');
  const [isShared, setIsShared] = useState(false);

  const toggleTodo = useCallback(async (todo: Todo) => {
    const { error } = await supabase
      .from('todos')
      .update({ is_completed: !todo.is_completed })
      .eq('id', todo.id);

    if (error) toast.error(error.message);
  }, []);

  const columns = useMemo(() => [
    columnHelper.accessor('is_completed', {
      header: '',
      cell: (info) => (
        <button
          onClick={() => toggleTodo(info.row.original)}
          className="transition-transform active:scale-90"
        >
          {info.getValue() ?
            <CheckCircle2 className="text-green-500" size={22} /> :
            <Circle className="text-gray-300 dark:text-neutral-600" size={22} />
          }
        </button>
      ),
    }),
    columnHelper.accessor('title', {
      header: 'Task',
      cell: (info) => (
        <span className={`block transition-all ${
          info.row.original.is_completed
            ? 'line-through text-gray-400 dark:text-neutral-600'
            : 'text-gray-800 dark:text-neutral-200'
        }`}>
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('is_shared', {
      header: 'Type',
      cell: (info) => (
        <div className="text-gray-400 dark:text-neutral-500">
          {info.getValue() ?
            <span title="Shared"><Users size={16} /></span> :
            <span title="Personal"><Lock size={16} /></span>
          }
        </div>
      ),
    }),
    columnHelper.accessor('updated_at', {
      header: 'Time',
      cell: (info) => {
        const date = new Date(info.getValue()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return <span className="text-[10px] font-medium text-gray-400 dark:text-neutral-500 uppercase">{date}</span>;
      },
    }),
  ], [toggleTodo]);

  const table = useReactTable({
    data: todos,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    const { error } = await supabase
      .from('todos')
      .insert([{ title: newTodo, is_shared: isShared }]);

    if (error) {
      toast.error(error.message);
    } else {
      setNewTodo('');
      toast.success('Task added');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Add form */}
      <form
        onSubmit={addTodo}
        className="bg-white dark:bg-neutral-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-800 transition-colors"
      >
        <input
          className="w-full p-2 mb-3 bg-transparent border-b border-gray-100 dark:border-neutral-800 outline-none focus:border-brand dark:focus:border-brand transition-colors text-gray-800 dark:text-neutral-200"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <div className="flex justify-between items-center">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-neutral-400 cursor-pointer select-none">
            <input
              type="checkbox"
              className="accent-brand w-4 h-4"
              checked={isShared}
              onChange={(e) => setIsShared(e.target.checked)}
            />
            Shared
          </label>
          <button
            type="submit"
            className="bg-brand hover:opacity-90 text-white p-2.5 rounded-xl transition-all active:scale-95 shadow-lg shadow-brand/20"
          >
            <Plus size={20} />
          </button>
        </div>
      </form>

      {/* Table */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-800 overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 dark:bg-neutral-800/50">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="p-4 text-[11px] font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-widest">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-neutral-800">
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="group hover:bg-gray-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="p-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
              {todos.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-gray-400 dark:text-neutral-600">
                    List is empty. Time to plan something!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}