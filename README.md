# Game Ngu - Kiểm tra trí nhớ

Game kiểm tra trí nhớ và khả năng quan sát với nhiều stage khác nhau.

## Tính năng

- **Stage 1**: Hiển thị hình dạng với màu sắc, sau đó hỏi màu nào vừa xuất hiện
- **Stage 2**: Stroop test - hiển thị text với màu khác nhau, hỏi màu nào không xuất hiện
- Animation mượt mà với Framer Motion
- UI đẹp với Tailwind CSS

## Công nghệ

- Next.js 14
- TypeScript
- Tailwind CSS
- Framer Motion

## Cài đặt

```bash
npm install
```

## Chạy development server

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem game.

## Build production

```bash
npm run build
npm start
```

## Deploy lên Vercel

### Cách 1: Deploy qua Vercel CLI (Khuyến nghị)

1. **Cài đặt Vercel CLI** (nếu chưa có):
```bash
npm i -g vercel
```

2. **Đăng nhập vào Vercel**:
```bash
vercel login
```

3. **Deploy project**:
```bash
vercel
```
- Lần đầu tiên, Vercel sẽ hỏi một số câu hỏi:
  - Set up and deploy? → **Y**
  - Which scope? → Chọn tài khoản của bạn
  - Link to existing project? → **N** (lần đầu)
  - Project name? → Nhấn Enter để dùng tên mặc định hoặc nhập tên mới
  - Directory? → Nhấn Enter (sử dụng thư mục hiện tại)
  - Override settings? → **N**

4. **Deploy production**:
```bash
vercel --prod
```

### Cách 2: Deploy qua GitHub (Tự động)

1. **Đẩy code lên GitHub**:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <URL-repository-của-bạn>
git push -u origin main
```

2. **Kết nối với Vercel**:
   - Truy cập [vercel.com](https://vercel.com)
   - Đăng nhập bằng GitHub
   - Click **"Add New Project"**
   - Import repository của bạn
   - Vercel sẽ tự động phát hiện Next.js và cấu hình
   - Click **"Deploy"**

3. **Tự động deploy**: Mỗi khi bạn push code lên GitHub, Vercel sẽ tự động deploy lại.

### Cấu hình bổ sung (Tùy chọn)

Nếu cần cấu hình đặc biệt, tạo file `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

### Kiểm tra deployment

- Sau khi deploy thành công, bạn sẽ nhận được URL dạng: `https://your-project.vercel.app`
- Vercel tự động tạo preview URL cho mỗi pull request
- Xem logs và analytics trong dashboard của Vercel

### Lưu ý

- ✅ Project đã được cấu hình sẵn cho Next.js 14
- ✅ `.gitignore` đã bao gồm `.vercel`
- ✅ Không cần cấu hình thêm nếu không có biến môi trường
- 🔧 Nếu có biến môi trường, thêm vào Settings → Environment Variables trong Vercel dashboard

