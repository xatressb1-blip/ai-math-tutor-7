# Supabase Pilot Cloud Activation — v2.6.2-beta.1

## 1. Tạo/chuẩn bị Supabase Project
Trong Supabase Dashboard, lấy Project URL và **Secret key** cho backend.
Không dùng biến `NEXT_PUBLIC_` cho Secret key.

## 2. Tạo schema
Mở SQL Editor và chạy toàn bộ `docs/cloud/supabase-pilot-schema.sql`.
Nếu đã từng chạy schema v2.6.1, script này tự thêm cột hash mới.

## 3. Tạo `.env.local`
Sao chép `.env.example` thành `.env.local`, điền:
- `SUPABASE_URL`
- `SUPABASE_SECRET_KEY`
- `PILOT_TEACHER_KEY`

`PILOT_TEACHER_KEY` nên là chuỗi dài, riêng tư, chỉ giáo viên/administrator biết.

## 4. Restart dev server
Dừng `npm run dev`, sau đó chạy lại để Next.js nạp environment variables.

## 5. Health check
Mở `/cloud-activation`. Trạng thái mong muốn:
- Server env: READY
- Supabase Data API: READY
- Pilot schema: READY

## 6. Kích hoạt học sinh
1. Mở `/teacher-cloud`.
2. Nhập Mã lớp + Teacher Key.
3. Đưa từng học sinh lên Cloud. Ghi lại Mã học sinh được tạo.
4. Trên thiết bị học sinh mở `/cloud-sync`, nhập Mã lớp + Mã học sinh.
5. Chọn “Tải hồ sơ từ Cloud” lần đầu.
6. Sau khi học, chọn “Gửi tiến độ lên Cloud”.

## 7. Vercel
Thêm 3 Environment Variables giống `.env.local` trong Project Settings → Environment Variables,
rồi Redeploy. Không commit `.env.local` lên GitHub.

## Security note
v2.6.2 lưu SHA-256 của Mã học sinh trong database thay vì mã rõ. Secret key chỉ dùng ở server route.
