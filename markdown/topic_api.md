// 1. GET /api/topics

```js

// 1. GET /api/topics/:topicId/lessons
Response: {
  lessons: [{
    id: number,          // ID của lesson
    name: string,        // Tên lesson
    imageURL: string,    // URL hình ảnh
    order: number,       // Thứ tự sắp xếp
    topicId: number      // ID của topic chứa lesson
  }]
}

// 2. POST /api/topics/:topicId/lessons
Request: {
  name: string,          // Tên lesson (required)
  imageURL: string,      // URL hình ảnh (optional)
  order: number          // Thứ tự sắp xếp (required)
}

Response: {
  id: number,            // ID của lesson vừa tạo
  name: string,
  imageURL: string,
  order: number,
  topicId: number
}

// 3. PUT /api/topics/:topicId/lessons/:lessonId
Request: {
  name: string,          // Tên lesson mới
  imageURL: string,      // URL hình ảnh mới
  order: number          // Thứ tự mới
}

Response: {
  id: number,
  name: string,
  imageURL: string,
  order: number,
  topicId: number
}

// 4. DELETE /api/topics/:topicId/lessons/:lessonId
Response: {
  success: boolean,      // true nếu xóa thành công
  message: string        // Thông báo kết quả
}

// 5. PUT /api/topics/:topicId/lessons/reorder
Request: {
  lessons: [{
    id: number,          // ID của lesson
    order: number        // Thứ tự mới
  }]
}

Response: {
  success: boolean,
  message: string
}


// POST /api/upload
Request: FormData {
  file: File            // File hình ảnh
}

Response: {
  url: string,          // URL của file đã upload
  filename: string,     // Tên file
  size: number,         // Kích thước file (bytes)
  type: string          // Loại file (image/jpeg, image/png, ...)
}


{
  error: {
    code: string,       // Mã lỗi
    message: string,    // Thông báo lỗi
    details?: {         // Chi tiết lỗi (optional)
      field?: string,   // Trường bị lỗi
      value?: any       // Giá trị không hợp lệ
    }
  }
}


// // GET /api/topics
// Query Parameters:
// - page: number (default: 1)
// - limit: number (default: 10)
// - sort: string (asc/desc)
// - search?: string

// Response: {
//   topics: [{
//     id: string,
//     name: string,
//     status: string,
//     order: number,
//     lessonCount: number
//   }],
//   pagination: {
//     total: number,      // Tổng số topics
//     page: number,       // Trang hiện tại
//     limit: number,      // Số items mỗi trang
//     totalPages: number  // Tổng số trang
//   }
// }

// GET /api/topics/:topicId/lessons
Query Parameters:
- page: number (default: 1)
- limit: number (default: 10)
- sort: string (asc/desc)

Response: {
  lessons: [{
    id: string,
    name: string,
    imageURL: string,
    order: number,
    topicId: string
  }],
  pagination: {
    total: number,
    page: number,
    limit: number,
    totalPages: number
  }
}
```