-- AI Math Tutor v2.6.2-beta.1 — Supabase Pilot Cloud Activation
-- Chạy toàn bộ script trong Supabase SQL Editor.

create table if not exists public.pilot_students (
  student_id text primary key,
  class_code text not null,
  access_code_hash text,
  access_code_last4 text,
  display_name text not null,
  brain jsonb not null,
  updated_at timestamptz not null default now()
);

-- Migration an toàn nếu đã chạy schema v2.6.1.
alter table public.pilot_students add column if not exists access_code_hash text;
alter table public.pilot_students add column if not exists access_code_last4 text;

-- Bản v2.6.2 không còn sử dụng access_code dạng rõ.
drop index if exists pilot_students_class_access_unique;
create unique index if not exists pilot_students_class_access_hash_unique
  on public.pilot_students (class_code, access_code_hash)
  where access_code_hash is not null;
create index if not exists pilot_students_class_code_idx
  on public.pilot_students (class_code);

alter table public.pilot_students enable row level security;

-- Không tạo policy public. App chỉ truy cập qua Next.js server route bằng Secret key.
-- Sau khi xác nhận mọi hồ sơ v2.6.1 đã được giáo viên upload lại bằng v2.6.2,
-- có thể xóa cột access_code plaintext cũ nếu tồn tại:
-- alter table public.pilot_students drop column if exists access_code;
