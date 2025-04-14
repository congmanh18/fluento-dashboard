# Hướng dẫn deploy project VueJS Quasar mới với CI/CD trên AWS

## Tổng quan

Bài hướng dẫn này sẽ giúp bạn:

- Tạo một project **VueJS Quasar** mới.
- Deploy ứng dụng dưới dạng static site lên **Amazon S3** và phân phối qua **CloudFront**.
- Tích hợp **CI/CD** bằng **GitHub Actions** để tự động build và deploy khi push code.
- Tối ưu chi phí bằng cách tận dụng **AWS Free Tier**.

### Yêu cầu

- Tài khoản AWS (Free Tier nếu mới bắt đầu).
- Tài khoản GitHub.
- Node.js (v18 hoặc cao hơn) và npm/yarn cài trên máy local.
- Cơ bản về terminal và Git.

---

## Bước 1: Tạo project Quasar mới

1. **Cài Quasar CLI**:

   ```bash
   npm install -g @quasar/cli
   ```

2. **Tạo project Quasar**:

   ```bash
   quasar create my-quasar-app
   ```

   - Chọn các tùy chọn:
     - **Project name**: `my-quasar-app`.
     - **Framework**: Vue 3.
     - **Features**: ESLint, Vuex (tùy chọn), Vue-i18n (nếu cần).
     - **Package manager**: npm (hoặc yarn nếu bạn thích).
   - Sau khi tạo, vào thư mục project:
     ```bash
     cd my-quasar-app
     ```

3. **Chạy thử local**:

   ```bash
   quasar dev
   ```

   - Mở trình duyệt tại `http://localhost:9000` để kiểm tra giao diện mặc định của Quasar.

4. **Tạo Git repository**:
   ```bash
   git init
   git add .
   git commit -m "Initial Quasar project"
   ```
   - Tạo repository trên GitHub (ví dụ: `my-quasar-app`).
   - Push code lên:
     ```bash
     git remote add origin https://github.com/<your-username>/my-quasar-app.git
     git branch -M main
     git push -u origin main
     ```

---

## Bước 2: Cấu hình AWS cho deployment

### 2.1. Tạo S3 bucket

1. Đăng nhập vào **AWS Management Console**.
2. Vào **S3** > **Create bucket**:
   - **Bucket name**: `my-quasar-app-static` (phải unique toàn cầu).
   - **Region**: Chọn region gần bạn (ví dụ: `us-east-1`).
   - **Block all public access**: Bỏ chọn để cho phép truy cập public (cần cho static website).
   - **Enable ACLs**: Bật để quản lý quyền truy cập.
3. Sau khi tạo bucket:
   - Vào **Properties** > **Static website hosting**:
     - Enable: Bật.
     - Index document: `index.html`.
     - Error document: `index.html` (để hỗ trợ Vue Router history mode).
   - Vào **Permissions** > **Bucket policy**:
     - Dán policy sau để cho phép public read:
       ```json
       {
         "Version": "2012-10-17",
         "Statement": [
           {
             "Sid": "PublicReadGetObject",
             "Effect": "Allow",
             "Principal": "*",
             "Action": "s3:GetObject",
             "Resource": "arn:aws:s3:::my-quasar-app-static/*"
           }
         ]
       }
       ```

### 2.2. Tạo CloudFront distribution

1. Vào **CloudFront** > **Create distribution**:
   - **Origin**:
     - Origin domain: Chọn S3 bucket vừa tạo (`my-quasar-app-static.s3.amazonaws.com`).
     - Origin access: Chọn **Legacy access identities** (nếu cần, tạo OAI và cập nhật bucket policy theo hướng dẫn của AWS).
   - **Viewer protocol policy**: Redirect HTTP to HTTPS.
   - **Default root object**: `index.html`.
   - **Price class**: Use all edge locations (hoặc chỉ US/Europe để tiết kiệm chi phí).
   - **Cache behavior**:
     - Cache key and origin requests: Use **Legacy cache settings**.
     - Object caching: Customize, set **Minimum TTL** và **Default TTL** thành `0` (để dễ invalidate cache khi deploy mới).
2. Sau khi tạo, ghi lại **Distribution domain name** (ví dụ: `d123456789.cloudfront.net`).

3. **Cập nhật S3 bucket policy** (nếu dùng OAI):

   - Vào S3 bucket > **Permissions** > **Bucket policy**:
     ```json
     {
       "Version": "2012-10-17",
       "Statement": [
         {
           "Sid": "AllowCloudFrontAccess",
           "Effect": "Allow",
           "Principal": {
             "AWS": "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity <OAI-ID>"
           },
           "Action": "s3:GetObject",
           "Resource": "arn:aws:s3:::my-quasar-app-static/*"
         }
       ]
     }
     ```
   - Thay `<OAI-ID>` bằng ID của OAI bạn tạo trong CloudFront.

4. **Kiểm tra**:
   - Truy cập CloudFront URL (ví dụ: `https://d123456789.cloudfront.net`) sau vài phút để đảm bảo cấu hình hoạt động.

---

## Bước 3: Tích hợp CI/CD với GitHub Actions

### 3.1. Tạo IAM User cho CI/CD

1. Vào **IAM** > **Users** > **Add users**:
   - **User name**: `quasar-cicd-user`.
   - **Access type**: Programmatic access.
2. Gắn policy:
   - Chọn **Attach existing policies directly**.
   - Gắn: `AmazonS3FullAccess` và `CloudFrontFullAccess` (hoặc tạo custom policy giới hạn chỉ bucket và distribution cụ thể).
3. Lưu **Access Key ID** và **Secret Access Key** (tải file CSV hoặc ghi lại).

4. **Lưu credentials vào GitHub Secrets**:
   - Vào GitHub repository > **Settings** > **Secrets and variables** > **Actions** > **New repository secret**:
     - Thêm:
       - `AWS_ACCESS_KEY_ID`: Dán Access Key ID.
       - `AWS_SECRET_ACCESS_KEY`: Dán Secret Access Key.
       - `AWS_REGION`: Region của bucket (ví dụ: `us-east-1`).
       - `AWS_S3_BUCKET`: Tên bucket (`my-quasar-app-static`).
       - `AWS_CLOUDFRONT_DISTRIBUTION_ID`: ID của CloudFront distribution (tìm trong CloudFront console, ví dụ: `E1A2B3C4D5E6F`).

### 3.2. Tạo GitHub Actions workflow

1. Trong project Quasar, tạo file:

   ```bash
   mkdir -p .github/workflows
   touch .github/workflows/deploy.yml
   ```

2. Dán nội dung sau vào `.github/workflows/deploy.yml`:

   ```yaml
   name: Deploy Quasar to AWS S3 and CloudFront

   on:
     push:
       branches:
         - main

   jobs:
     deploy:
       runs-on: ubuntu-latest

       steps:
         - name: Checkout code
           uses: actions/checkout@v3

         - name: Set up Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '18'

         - name: Install dependencies
           run: npm install

         - name: Install Quasar CLI
           run: npm install -g @quasar/cli

         - name: Build Quasar app
           run: quasar build

         - name: Configure AWS credentials
           uses: aws-actions/configure-aws-credentials@v2
           with:
             aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
             aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
             aws-region: ${{ secrets.AWS_REGION }}

         - name: Sync files to S3
           run: aws s3 sync dist/spa s3://${{ secrets.AWS_S3_BUCKET }} --delete

         - name: Invalidate CloudFront cache
           run: aws cloudfront create-invalidation --distribution-id ${{ secrets.AWS_CLOUDFRONT_DISTRIBUTION_ID }} --paths "/*"
   ```

3. **Giải thích workflow**:

   - **Trigger**: Chạy khi push code lên nhánh `main`.
   - **Steps**:
     - Checkout code từ repository.
     - Cài Node.js v18.
     - Cài dependencies và Quasar CLI.
     - Build project Quasar (tạo thư mục `dist/spa`).
     - Cấu hình AWS credentials từ GitHub Secrets.
     - Đồng bộ thư mục `dist/spa` lên S3 bucket (xóa file cũ với `--delete`).
     - Invalidate cache CloudFront để cập nhật nội dung mới.

4. **Commit và push workflow**:

   ```bash
   git add .github/workflows/deploy.yml
   git commit -m "Add GitHub Actions for AWS deployment"
   git push origin main
   ```

5. **Kiểm tra pipeline**:
   - Vào GitHub repository > **Actions** tab.
   - Xem workflow `Deploy Quasar to AWS S3 and CloudFront` chạy.
   - Nếu thành công, truy cập CloudFront URL để thấy ứng dụng live.

---

## Bước 4: Cấu hình tùy chọn (Optional)

### 4.1. Thêm custom domain

1. Mua domain qua **Route 53** hoặc nhà cung cấp khác (GoDaddy, Namecheap).
2. Trong **CloudFront**:
   - Edit distribution > **Alternate domain name (CNAME)**: Thêm domain (ví dụ: `www.myquasarapp.com`).
   - **Custom SSL certificate**: Tạo certificate miễn phí qua **AWS Certificate Manager (ACM)** ở region `us-east-1`.
3. Trong **Route 53**:
   - Tạo **Hosted Zone** cho domain.
   - Tạo record:
     - Type: A.
     - Alias: Chọn CloudFront distribution.
4. Cập nhật DNS tại nhà cung cấp domain (nếu không dùng Route 53) để trỏ về CloudFront.

### 4.2. Tối ưu chi phí

- **Free Tier**:
  - S3: 5GB storage, 20K GET requests/tháng.
  - CloudFront: 1TB data transfer out, 10M requests/tháng trong 12 tháng.
- **Giảm chi phí**:
  - Dùng **S3 Standard-Infrequent Access** nếu lưu file ít truy cập.
  - Tắt CloudFront distribution khi không dùng (không có Free Tier cho idle distributions).
  - Theo dõi chi phí qua **AWS Budgets** (đặt cảnh báo $5/tháng).
- **Dự tính chi phí** (với Free Tier):
  - S3: ~$0 (1GB storage, 10K requests).
  - CloudFront: ~$0 (dưới 1TB transfer).
  - Route 53: $0.50/zone/tháng (nếu dùng custom domain).
  - Tổng: ~$0.50/tháng nếu tối ưu.

---

## Bước 5: Kiểm tra và bảo trì

1. **Kiểm tra ứng dụng**:

   - Truy cập CloudFront URL hoặc custom domain.
   - Đảm bảo Vue Router hoạt động (history mode cần `index.html` cho error document).

2. **Cập nhật code**:

   - Chỉnh sửa code trong `src` (ví dụ: thêm component mới).
   - Push lên `main`:
     ```bash
     git add .
     git commit -m "Update UI"
     git push origin main
     ```
   - GitHub Actions sẽ tự động build và deploy.

3. **Monitoring**:
   - Dùng **CloudWatch** để theo dõi S3 và CloudFront metrics.
   - Kiểm tra **GitHub Actions logs** nếu deploy lỗi.

---

## Lưu ý và khắc phục sự cố

- **Lỗi S3 permission**:
  - Kiểm tra bucket policy và IAM user permissions.
  - Đảm bảo `AWS_ACCESS_KEY_ID` và `AWS_SECRET_ACCESS_KEY` đúng trong GitHub Secrets.
- **CloudFront không cập nhật**:
  - Đợi 5-10 phút sau khi invalidate cache.
  - Kiểm tra lệnh `aws cloudfront create-invalidation` trong workflow.
- **Vue Router không hoạt động**:
  - Đảm bảo S
