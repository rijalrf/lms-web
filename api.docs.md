# API Documentation

## 1. Authentication

### User Login

- URL: `api/v1/auth/login`
- Method: `POST`

**Request Body:**

```json
{
  "email": "john.doe@example.com",
  "password": "securepassword123"
}
```

**Response Header** : Set-Cookie: token=753f4fe6-573a-4e22-9d9e-186415bc...; Path=/; Expires=Sat, 20 Apr 2024 12:00:00 GMT; HttpOnly

**Response Body(200 OK):**

```json
{
  "code": 200,
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "divisi": "IT",
    "position": "Software Engineer",
    "role": "ADMIN"
  }
}
```

**Error Responses:**

```json
{
  "success": false,
  "code": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "error": "Invalid email address"
    },
    {
      "field": "password",
      "error": "Too small: expected string to have >=8 characters"
    }
  ]
}
```

### User Logout

- URL: `api/v1/auth/logout`
- Method: `DELETE`

**Response Body(200 OK):**

```json
{
  "code": 200,
  "success": true,
  "message": "Succes Logout"
}
```

### User Registration

**URL:** `api/v1/auth/register`

**Method:** `POST`

**Request Body:**

```json
{
  "name": "Gita Amelia",
  "email": "gita.amelia@example.com",
  "password": "GitaAmel!a",
  "divisi": "R&D",
  "position": "Lead",
  "role": "ADMIN"
}
```

**Response Body(201 Created):**

```json
{
  "success": true,
  "code": 201,
  "message": "Success register",
  "data": {
    "id": 14,
    "name": "Gita Amelia",
    "email": "gita.amelia@example.com",
    "divisi": "R&D",
    "position": "Lead",
    "role": "ADMIN"
  }
}
```

**Error Responses:**

```json
{
  "success": false,
  "code": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "error": "Invalid email address"
    },
    {
      "field": "password",
      "error": "Too small: expected string to have >=8 characters"
    }
  ]
}
```

## 2. Users

### Update User

**URL:** `api/v1/users/:id`

**Method:** `PUT`

**Request Body:**

```json
{
  "name": "Gita Amelia Updated",
  "email": "gita.amelia@example.com",
  "password": "GitaAmel!a",
  "divisi": "R&D",
  "position": "Lead",
  "role": "ADMIN"
}
```

**Response Body(200 OK):**

```json
{
  "success": true,
  "code": 200,
  "data": {
    "id": 14,
    "name": "Gita Amelia Updated",
    "email": "gita.amelia@example.com",
    "divisi": "R&D",
    "position": "Lead",
    "role": "ADMIN"
  }
}
```

### Get All Users

- URL: `api/v1/users`
- Method: `GET`
- Query Params:
  - `page`: number (optional, default: 1)
  - `limit`: number (optional, default: 10)

**Response Body(200 OK):**

```json
{
  "code": 200,
  "success": true,
  "message": "Success get all users",
  "data": [
    {
      "id": "1",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "divisi": "IT",
      "position": "Software Engineer",
      "role": "ADMIN"
    },
    {
      "id": "2",
      "name": "Jane Doe",
      "email": "jane.doe@example.com",
      "divisi": "HR",
      "position": "Recruiter",
      "role": "USER"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "perPage": 10,
    "totalItems": 20,
    "totalPages": 2
  }
}
```

### Get User By ID

- URL: `api/v1/users/:id`
- Method: `GET`

**Response Body(200 OK):**

```json
{
  "code": 200,
  "success": true,
  "message": "Success get user by id",
  "data": {
    "id": "1",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "divisi": "IT",
    "position": "Software Engineer",
    "role": "ADMIN"
  }
}
```

**Error Response Body(404 Not Found):**

```json
{
  "success": false,
  "code": 404,
  "message": "User with id 1 not found",
  "errors": "Not Found"
}
```

### Delete User By ID

- URL: `api/v1/users/:id`
- Method: `DELETE`

**Response Body(200 OK):**

```json
{
  "success": true,
  "code": 200,
  "message": "Success delete user by id"
}
```

**Error Response Body(404 Not Found):**

```json
{
  "success": false,
  "code": 404,
  "message": "User with id 1 not found",
  "errors": "Not Found"
}
```

### Trainer Populars

- URL: `api/v1/assignments/trainer/populars`
- Method: `GET`

**Response Body(200 OK):**

```json
{
  "success": true,
  "code": 200,
  "message": "Success get top trainers by assignment count",
  "data": [
    {
      "trainer": {
        "id": 7,
        "name": "Rijal Rifai",
        "email": "rijal@ppu.co.id"
      },
      "countAssignment": 10
    },
    {
      "trainer": {
        "id": 4,
        "name": "Dewi Lestari",
        "email": "dewi.lestari@example.com"
      },
      "countAssignment": 2
    },
    {
      "trainer": {
        "id": 16,
        "name": "Hannah Garrett",
        "email": "bubiqik@mailinator.com"
      },
      "countAssignment": 1
    }
  ]
}
```

**Error Response Body(404 Not Found):**

```json
{
  "success": false,
  "code": 404,
  "message": "Trainer not found",
  "errors": "Not Found"
}
```

## 3. Topics

### Create Topic

- URL: `api/v1/topics`
- Method: `POST`

**Request Body:**

```json
{
  "title": "Introduction to NestJS",
  "description": "A comprehensive introduction to the NestJS framework."
}
```

**Response Body(201 Created):**

```json
{
  "success": true,
  "code": 201,
  "message": "Topic created successfully",
  "data": {
    "id": 1,
    "title": "Introduction to NestJS",
    "description": "A comprehensive introduction to the NestJS framework."
  }
}
```

**Error Responses:**

```json
{
  "success": false,
  "code": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "error": "title is required"
    }
  ]
}
```

### Update Topic

- URL: `api/v1/topics/:id`
- Method: `PUT`

**Request Body:**

```json
{
  "title": "Introduction to NestJS updated",
  "description": "A comprehensive introduction to the NestJS framework."
}
```

**Response Body(200):**

```json
{
  "success": true,
  "code": 201,
  "message": "Topic updated successfully",
  "data": {
    "id": 1,
    "title": "Introduction to NestJS updated",
    "description": "A comprehensive introduction to the NestJS framework."
  }
}
```

**Error Responses:**

```json
{
  "success": false,
  "code": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "error": "title is required"
    }
  ]
}
```

### Get All Topics

- URL: `api/v1/topics`
- Method: `GET`
- Query Params:
  - `page`: number (optional, default: 1)
  - `limit`: number (optional, default: 10)

**Response Body(200 OK):**

```json
{
  "code": 200,
  "success": true,
  "message": "Success get topics",
  "data": [
    {
      "id": 1,
      "title": "Introduction to NestJS",
      "description": "A comprehensive introduction to the NestJS framework."
    },
    {
      "id": 2,
      "title": "Introduction to NestJS 2",
      "description": "A comprehensive introduction to the NestJS framework 2."
    }
  ],
  "pagination": {
    "currentPage": 1,
    "perPage": 10,
    "totalItems": 20,
    "totalPages": 2
  }
}
```

### Get Topic By ID

- URL: `api/v1/topics/:id`
- Method: `GET`

**Response Body(200 OK):**

```json
{
  "success": true,
  "code": 200,
  "message": "Success get topic by id",
  "data": {
    "id": 2,
    "title": "Introduction to NestJS 2",
    "description": "A comprehensive introduction to the NestJS framework 2."
  }
}
```

**Error Response Body(404 Not Found):**

```json
{
  "success": false,
  "code": 404,
  "message": "topic with id 1 not found",
  "errors": "Not Found"
}
```

### Delete Topic By ID

- URL: `api/v1/topics/:id`
- Method: `DELETE`

**Response Body(200 OK):**

```json
{
  "success": true,
  "code": 200,
  "message": "Success delete topic by id"
}
```

**Error Response Body(404 Not Found):**

```json
{
  "success": false,
  "code": 404,
  "message": "topic with id 1 not found",
  "errors": "Not Found"
}
```

### Topic Populars

- URL: `api/v1/topics/topic/populars`
- Method: `GET`

**Response Body(200 OK):**

```json
{
  "success": true,
  "code": 200,
  "message": "Topics popular retrieved successfully",
  "data": [
    {
      "title": "Voluptatem Consequa update",
      "description": "Nemo duis aliqua Fu updated",
      "countAssignment": 1
    },
    {
      "title": "aaa",
      "description": "aaa",
      "countAssignment": 1
    },
    {
      "title": "Clean Code",
      "description": "Clean Code Topic ",
      "countAssignment": 1
    }
  ]
}
```

**Error Response Body(404 Not Found):**

```json
{
  "success": false,
  "code": 404,
  "message": "Topic not found",
  "errors": "Not Found"
}
```

## 4. Materials

### Create Material

- URL: `api/v1/materials`
- Method: `POST`

**Request Body:**

```json
{
  "title": "NestJS Fundamentals",
  "description": "An in-depth look at the core concepts of NestJS.",
  "topicId": 1,
  "fileUrl": "https://example.com/nestjs-fundamentals.pdf"
}
```

**Response Body(201 Created):**

```json
{
  "success": true,
  "code": 201,
  "message": "Material created successfully",
  "data": {
    "id": 1,
    "title": "NestJS Fundamentals",
    "description": "An in-depth look at the core concepts of NestJS.",
    "topicId": 1,
    "fileUrl": "https://example.com/nestjs-fundamentals.pdf"
  }
}
```

**Error Responses:**

```json
{
  "success": false,
  "code": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "error": "Title is required"
    },
    {
      "field": "topicId",
      "error": "Topic ID must be a number"
    }
  ]
}
```

### Update Material

- URL: `api/v1/materials/:id`
- Method: `PUT`

**Request Body:**

```json
{
  "title": "NestJS Fundamentals Updated",
  "description": "An in-depth look at the core concepts of NestJS, updated.",
  "topicId": 1,
  "fileUrl": "https://example.com/nestjs-fundamentals-v2.pdf"
}
```

**Response Body(200 OK):**

```json
{
  "success": true,
  "code": 200,
  "message": "Material updated successfully",
  "data": {
    "id": 1,
    "title": "NestJS Fundamentals Updated",
    "description": "An in-depth look at the core concepts of NestJS, updated.",
    "topicId": 1,
    "fileUrl": "https://example.com/nestjs-fundamentals-v2.pdf"
  }
}
```

**Error Responses:**

```json
{
  "success": false,
  "code": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "error": "Title is required"
    }
  ]
}
```

### Get All Materials

- URL: `api/v1/materials`
- Method: `GET`
- Query Params:
  - `page`: number (optional, default: 1)
  - `limit`: number (optional, default: 10)
  - `topicId`: number (optional, filter by topic)

**Response Body(200 OK):**

```json
{
  "code": 200,
  "success": true,
  "message": "Success get materials",
  "data": [
    {
      "id": 1,
      "title": "NestJS Fundamentals",
      "description": "An in-depth look at the core concepts of NestJS.",
      "topicId": 1,
      "fileUrl": "https://example.com/nestjs-fundamentals.pdf"
    },
    {
      "id": 2,
      "title": "Advanced NestJS Concepts",
      "description": "Exploring advanced features and patterns in NestJS.",
      "topicId": 1,
      "fileUrl": "https://example.com/advanced-nestjs.pdf"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "perPage": 10,
    "totalItems": 2,
    "totalPages": 1
  }
}
```

### Get Material By ID

- URL: `api/v1/materials/:id`
- Method: `GET`

**Response Body(200 OK):**

```json
{
  "success": true,
  "code": 200,
  "message": "Success get material by id",
  "data": {
    "id": 1,
    "title": "NestJS Fundamentals",
    "description": "An in-depth look at the core concepts of NestJS.",
    "topicId": 1,
    "fileUrl": "https://example.com/nestjs-fundamentals.pdf"
  }
}
```

**Error Response Body(404 Not Found):**

```json
{
  "success": false,
  "code": 404,
  "message": "Material with id 1 not found",
  "errors": "Not Found"
}
```

### Get Materials By Topic ID

- URL: `api/v1/materials/topic/:topicId`
- Method: `GET`
- Query Params:
  - `page`: number (optional, default: 1)
  - `limit`: number (optional, default: 10)

**Response Body(200 OK):**

```json
{
  "success": true,
  "code": 200,
  "message": "Success get material by topic id",
  "data": [
    {
      "id": 1,
      "title": "NestJS Fundamentals",
      "description": "An in-depth look at the core concepts of NestJS.",
      "topicId": 1,
      "fileUrl": "https://example.com/nestjs-fundamentals.pdf"
    },
    {
      "id": 2,
      "title": "Advanced NestJS Concepts",
      "description": "Exploring advanced features and patterns in NestJS.",
      "topicId": 1,
      "fileUrl": "https://example.com/advanced-nestjs.pdf"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "perPage": 10,
    "totalItems": 2,
    "totalPages": 1
  }
}
```

**Error Response Body(404 Not Found):**

```json
{
  "success": false,
  "code": 404,
  "message": "topic with id 2 not found",
  "errors": "Not Found"
}
```

### Material Populars

- URL: `api/v1/materials/material/populars`
- Method: `GET`

**Response Body(200 OK):**

```json
{
  "success": true,
  "code": 200,
  "message": "Materials popular retrieved successfully",
  "data": [
    {
      "title": "Dolor beatae cumque ",
      "description": "Eos reprehenderit re",
      "countAssignment": 1
    },
    {
      "title": "Non debitis quisquam",
      "description": "Commodi est maxime ",
      "countAssignment": 1
    },
    {
      "title": "Fuga Eum molestiae ",
      "description": "Sint fuga Ea dolore",
      "countAssignment": 1
    }
  ]
}
```

**Error Response Body(404 Not Found):**

```json
{
  "success": false,
  "code": 404,
  "message": "Material not found",
  "errors": "Not Found"
}
```

## 5. Assignments

### Create Assignment

- URL: `api/v1/assignments`
- Method: `POST`

**Request Body:**

```json
{
  "topicId": 1,
  "materialId": 1,
  "userId": 1,
  "trainingDate": "2025-12-31",
  "startTime": "09:00",
  "endTime": "17:00",
  "maxParticipant": 50,
  "classRoomLink": "https://meet.google.com/xxx-xxx-xxx",
  "status": "DRAFT"
}
```

**Response Body(201 Created):**

```json
{
  "success": true,
  "code": 201,
  "message": "Assignment created successfully",
  "data": {
    "id": 32,
    "trainingDate": "2025-10-10",
    "startTime": "10:00",
    "endTime": "11.00",
    "maxParticipant": 50,
    "classRoomLink": "https://meet.google.com/xxx-xxx-xxx",
    "status": "DRAFT",
    "trainer": {
      "id": 7,
      "name": "Rijal Rifai",
      "email": "rijal@ppu.co.id"
    },
    "topic": {
      "id": 17,
      "title": "Voluptatem Consequa update",
      "description": "Nemo duis aliqua Fu updated"
    },
    "material": {
      "id": 10,
      "title": "Dolor beatae cumque ",
      "description": "Eos reprehenderit re",
      "topicId": 17,
      "fileUrl": "https://coinmarketcap.com/currencies/bitcoin/"
    }
  }
}
```

**Error Responses:**

```json
{
  "success": false,
  "code": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "topicId",
      "error": "topicId is required"
    }
  ]
}
```

### Update Assignment

- URL: `api/v1/assignments/:id`
- Method: `PUT`

**Request Body:**

```json
{
  "topicId": 1,
  "materialId": 1,
  "userId": 1,
  "trainingDate": "2025-12-31",
  "startTime": "09:00",
  "endTime": "17:00",
  "maxParticipant": 50,
  "classRoomLink": "https://meet.google.com/xxx-xxx-xxx",
  "status": "PUBLISH"
}
```

**Response Body(200 OK):**

```json
{
  "success": true,
  "code": 200,
  "message": "Assignment updated successfully",
  "data": {
    "id": 2,
    "trainingDate": "2025-10-10",
    "startTime": "10:00",
    "endTime": "12:00",
    "maxParticipant": 50,
    "classRoomLink": "https://meet.google.com/xxx-xxx-xxx updated",
    "status": "DRAFT",
    "trainer": {
      "id": 7,
      "name": "Rijal Rifai",
      "email": "rijal@ppu.co.id"
    },
    "topic": {
      "id": 17,
      "title": "Voluptatem Consequa update",
      "description": "Nemo duis aliqua Fu updated"
    },
    "material": {
      "id": 10,
      "title": "Dolor beatae cumque ",
      "description": "Eos reprehenderit re",
      "topicId": 17,
      "fileUrl": "https://coinmarketcap.com/currencies/bitcoin/"
    }
  }
}
```

**Error Responses:**

```json
{
  "success": false,
  "code": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "topicId",
      "error": "topicId is required"
    }
  ]
}
```

### Update Status Assignment

- URL: `api/v1/assignments/:id/status`
- Method: `PATCH`

**Request Body:**

```json
{
  "status": "PUBLISH"
}
```

**Response Body(200 OK):**

```json
{
  "success": true,
  "code": 200,
  "message": "Assignment updated successfully",
  "data": {
    "id": 2,
    "trainingDate": "2025-10-10",
    "startTime": "10:00",
    "endTime": "12:00",
    "maxParticipant": 50,
    "classRoomLink": "https://meet.google.com/xxx-xxx-xxx updated",
    "status": "PUBLISH",
    "trainer": {
      "id": 7,
      "name": "Rijal Rifai",
      "email": "rijal@ppu.co.id"
    },
    "topic": {
      "id": 17,
      "title": "Voluptatem Consequa update",
      "description": "Nemo duis aliqua Fu updated"
    },
    "material": {
      "id": 10,
      "title": "Dolor beatae cumque ",
      "description": "Eos reprehenderit re",
      "topicId": 17,
      "fileUrl": "https://coinmarketcap.com/currencies/bitcoin/"
    }
  }
}
```

**Error Responses:**

```json
{
  "success": false,
  "code": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "topicId",
      "error": "topicId is required"
    }
  ]
}
```

### Get All Assignments

- URL: `api/v1/assignments`
- Method: `GET`
- Query Params:
  - `page`: number (optional, default: 1)
  - `limit`: number (optional, default: 10)
  - `status`: string (optional, filter by status)

**Response Body(200 OK):**

```json
{
  "success": true,
  "code": 200,
  "message": "Success get all assignments",
  "data": [
    {
      "id": 2,
      "trainingDate": "2025-10-10",
      "startTime": "10:00",
      "endTime": "12:00",
      "maxParticipant": 50,
      "classRoomLink": "https://meet.google.com/xxx-xxx-xxx updated",
      "status": "DRAFT",
      "trainer": {
        "id": 7,
        "name": "Rijal Rifai",
        "email": "rijal@ppu.co.id"
      },
      "topic": {
        "id": 17,
        "title": "Voluptatem Consequa update",
        "description": "Nemo duis aliqua Fu updated"
      },
      "material": {
        "id": 10,
        "title": "Dolor beatae cumque ",
        "description": "Eos reprehenderit re",
        "topicId": 17,
        "fileUrl": "https://coinmarketcap.com/currencies/bitcoin/"
      }
    },
    {
      "id": 3,
      "trainingDate": "2025-12-20",
      "startTime": "16.00",
      "endTime": "17.00",
      "maxParticipant": 50,
      "classRoomLink": "https://meet.google.com/xxx-xxx-xxx",
      "status": "DRAFT",
      "trainer": {
        "id": 7,
        "name": "Rijal Rifai",
        "email": "rijal@ppu.co.id"
      },
      "topic": {
        "id": 17,
        "title": "Voluptatem Consequa update",
        "description": "Nemo duis aliqua Fu updated"
      },
      "material": {
        "id": 8,
        "title": "Repellendus Vitae c",
        "description": "Commodi deleniti acc",
        "topicId": 17,
        "fileUrl": "https://coinmarketcap.com/currencies/bitcoin/"
      }
    },
    {
      "id": 4,
      "trainingDate": "2025-12-20",
      "startTime": "16.00",
      "endTime": "17.00",
      "maxParticipant": 50,
      "classRoomLink": "https://meet.google.com/xxx-xxx-xxx",
      "status": "DRAFT",
      "trainer": {
        "id": 7,
        "name": "Rijal Rifai",
        "email": "rijal@ppu.co.id"
      },
      "topic": {
        "id": 17,
        "title": "Voluptatem Consequa update",
        "description": "Nemo duis aliqua Fu updated"
      },
      "material": {
        "id": 7,
        "title": "Ex architecto conseq",
        "description": "Eum numquam quibusda",
        "topicId": 17,
        "fileUrl": "https://coinmarketcap.com/currencies/bitcoin/"
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "perPage": 3,
    "totalItems": 31,
    "totalPages": 11
  }
}
```

### Get Assignment By ID

- URL: `api/v1/assignments/:id`
- Method: `GET`

**Response Body(200 OK):**

```json
{
  "success": true,
  "code": 200,
  "message": "Success get assignment by id",
  "data": {
    "id": 2,
    "trainingDate": "2025-10-10",
    "startTime": "10:00",
    "endTime": "12:00",
    "maxParticipant": 50,
    "classRoomLink": "https://meet.google.com/xxx-xxx-xxx updated",
    "status": "DRAFT",
    "trainer": {
      "id": 7,
      "name": "Rijal Rifai",
      "email": "rijal@ppu.co.id"
    },
    "topic": {
      "id": 17,
      "title": "Voluptatem Consequa update",
      "description": "Nemo duis aliqua Fu updated"
    },
    "material": {
      "id": 10,
      "title": "Dolor beatae cumque ",
      "description": "Eos reprehenderit re",
      "topicId": 17,
      "fileUrl": "https://coinmarketcap.com/currencies/bitcoin/"
    }
  }
}
```

**Error Response Body(404 Not Found):**

```json
{
  "success": false,
  "code": 404,
  "message": "Assignment with id 1 not found",
  "errors": "Not Found"
}
```

### Delete Assignment By ID

- URL: `api/v1/assignments/:id`
- Method: `DELETE`

**Response Body(200 OK):**

```json
{
  "success": true,
  "code": 200,
  "message": "Success delete assignment"
}
```

**Error Response Body(404 Not Found):**

```json
{
  "success": false,
  "code": 404,
  "message": "Assignment with id 1 not found",
  "errors": "Not Found"
}
```

### Assignments By Status

- URL: `api/v1/assignments/count/status`
- Method: `GET`
- Query Params:
  - `status`: string (optional, filter by status)

**Response Body(200 OK):**

````json

{
  "success": true,
  "code": 200,
  "message": "Success get assignment count by status",
  "data": {
    "status": "PUBLISH",
    "count": 3
  }
}
``
**Error Response Body(404 Not Found):**

```json
{
  "success": false,
  "code": 404,
  "message": "Assignment Status not found",
  "errors": "Not Found"
}

````
