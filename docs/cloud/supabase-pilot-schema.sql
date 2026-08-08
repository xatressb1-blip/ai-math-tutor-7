create table if not exists public.pilot_students (
  student_id text primary key,
  class_code text not null,
  access_code text not null,
  display_name text not null,
  brain jsonb not null,
  updated_at timestamptz not null default now()
);

create unique index if not exists pilot_students_class_access_unique
  on public.pilot_students (class_code, access_code);

create index if not exists pilot_students_class_code_idx
  on public.pilot_students (class_code);

alter table public.pilot_students enable row level security;

-- Không tạo policy public. Beta 2.6.1 truy cập bảng chỉ qua Next.js API route
-- dùng Supabase Secret key / legacy Service Role key ở server.
