/*
# Create planning tasks for the shared planning workspace

1. New Tables
- `planning_tasks`
- `id` (uuid, primary key): unique task identifier.
- `title` (text): short task label shown in the planner.
- `details` (text): optional supporting description.
- `category` (text): planning area such as Trabajo, Personal, Estudio, or Salud.
- `due_date` (date): optional date assigned to the task.
- `priority` (text): low, medium, or high importance.
- `completed` (boolean): whether the task is finished.
- `created_at` (timestamptz): creation timestamp.

2. Security
- Row level security is enabled.
- The app is intentionally single-tenant and has no sign-in screen, so anon and authenticated roles can use the shared planning board.
- Separate policies allow select, insert, update, and delete operations.

3. Important Notes
- No user-owned columns or authentication dependency are used in this first shared planning workspace.
- The table is additive and safe to re-run.
*/

CREATE TABLE IF NOT EXISTS public.planning_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  details text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Personal',
  due_date date,
  priority text NOT NULL DEFAULT 'medium',
  completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.planning_tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "shared_planning_tasks_select" ON public.planning_tasks;
CREATE POLICY "shared_planning_tasks_select" ON public.planning_tasks FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "shared_planning_tasks_insert" ON public.planning_tasks;
CREATE POLICY "shared_planning_tasks_insert" ON public.planning_tasks FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "shared_planning_tasks_update" ON public.planning_tasks;
CREATE POLICY "shared_planning_tasks_update" ON public.planning_tasks FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "shared_planning_tasks_delete" ON public.planning_tasks;
CREATE POLICY "shared_planning_tasks_delete" ON public.planning_tasks FOR DELETE TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS planning_tasks_due_date_idx ON public.planning_tasks (due_date);
CREATE INDEX IF NOT EXISTS planning_tasks_completed_idx ON public.planning_tasks (completed);
