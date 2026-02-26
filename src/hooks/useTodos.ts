import { useEffect, useState } from 'react';
import { supabase } from '../api/supabase';
import type { Todo } from '../types/todo';
import { toast } from 'sonner';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTodos = async () => {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) toast.error(error.message);
    else setTodos(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchTodos();

    // SUBSCRIBE TO REALTIME
    const channel = supabase
      .channel('schema-db-changes') // Channel name (arbitrary)
      .on(
        'postgres_changes',
        {
          event: '*', // Listening for INSERT, UPDATE and DELETE
          schema: 'public',
          table: 'todos',
        },
        (payload) => {
          console.log('Database change:', payload);

          // Instead of a full reload (fetch), we can update state locally
          // But to start, fetchTodos() is the most reliable way to sync
          fetchTodos();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { todos, loading, refresh: fetchTodos };
}