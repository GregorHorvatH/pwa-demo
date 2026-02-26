export interface Todo {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  is_completed: boolean;
  is_shared: boolean;
  user_id: string;
  last_updated_by: string | null;
}