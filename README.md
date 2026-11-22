# Social-App

Backend API for a social app, built with Express, TypeScript and MongoDB (Mongoose), with Redis for caching.

## Features

**Auth**
- Registration and email verification (OTP)
- Login with access token + refresh token (httpOnly cookies), with a login attempts limit
- Token refreshing
- Password reset with OTP
- Google sign-in

**User**
- Upload / delete the profile picture (multer, local `uploads/` folder or AWS S3)
- Presigned url to upload the picture straight to S3 (a lambda saves the key in the database)

**Posts**
- Create, list (my posts), get one, update and delete (owner only, soft delete)

**Comments**
- Create a comment (or a reply) on a post, list the comments of a post, get one, update (owner only)
- Delete: the comment owner or the post owner

**Notifications**
- Firebase Cloud Messaging provider (`firebase-admin`)

## Tech

express, typescript, mongoose, redis (ioredis), tsyringe (dependency injection), zod, argon2, jsonwebtoken, nodemailer / mailjet, google-auth-library, multer, AWS S3 (`@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`), firebase-admin

## Getting started

```bash
npm install
cp .env.example .env   # fill in your values
npm run dev
```

Requirements: Node.js 20+, a running MongoDB and a Redis server (or `CACHE_PROVIDER=memory` in development, no Redis needed), a Gmail account with an App Password (`MAIL_USER` / `MAIL_PASSWORD`) to send the emails (or `MAIL_PROVIDER=console` in development, which prints the emails and OTP codes in the terminal instead), and a Google OAuth client id for Google sign-in (optional).

The server runs on `http://localhost:3001` (change `PORT` in `.env` if you need another port).

Other scripts: `npm run build`, `npm start`.

## Project structure

```
src
├── app
│   ├── auth        route > controller > service
│   ├── user        route > controller > service > repository > model
│   ├── post        route > controller > service > repository > model
│   └── comment     route > controller > service > repository > model
├── lib
│   ├── di          tokens + tsyringe container
│   ├── cache       cache provider + withCache middleware
│   ├── cloud       cloud provider (local or s3)
│   ├── email       mail provider
│   ├── notification  notification provider (firebase)
│   └── ...         config, db, error handling, validation
└── pkg             provider implementations (redis, s3, nodemailer, firebase, ...)
lambda              s3 lambda that saves the uploaded profile picture
```

Controllers, services and repositories are classes registered as singletons in `src/lib/di/container.ts` and injected with tsyringe, so each one only depends on a token.

## API endpoints

Every endpoint except the auth ones needs a logged in user (the `access_token` cookie).

| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/register` | Create a user and send a verification code |
| POST | `/api/auth/verify-account` | Verify the account with the code |
| POST | `/api/auth/login` | Login (sets `access_token` and `refresh_token` cookies) |
| POST | `/api/auth/send-otp` | Send a new OTP |
| POST | `/api/auth/reset-password` | Reset the password with an OTP |
| POST | `/api/auth/login-google` | Login with a Google ID token |
| POST | `/api/auth/refresh-token` | Get a new token pair |
| POST | `/api/user/upload-profile-pic` | Upload a profile picture (form-data field `pp`) |
| POST | `/api/user/get-presigned-url` | Get a temporary url to upload the picture to S3 (`fileName`, `contentType`) |
| DELETE | `/api/user/delete-profile-pic` | Delete the profile picture |
| POST | `/api/post` | Create a post (`content`, optional `allowsComments`) |
| GET | `/api/post?page=1&limit=10` | Get the posts of the logged in user |
| GET | `/api/post/:id` | Get one post |
| PATCH | `/api/post/:id` | Update a post (owner only) |
| DELETE | `/api/post/:id` | Delete a post (owner only) |
| POST | `/api/comment` | Create a comment on a post (`postId`, `content`, optional `parentId` to reply) |
| GET | `/api/comment/post/:postId?page=1&limit=10` | Get the comments of a post |
| GET | `/api/comment/:id` | Get one comment |
| PATCH | `/api/comment/:id` | Update a comment (owner only) |
| DELETE | `/api/comment/:id` | Delete a comment (comment owner or post owner) |

Responses look like `{ "message": "...", "success": true, "data": ... }`, errors like `{ "message": "...", "success": false }`.

## Profile picture storage

Set `CLOUD_PROVIDER` in `.env`:

- `local` (default): pictures are saved in the `uploads/` folder, no AWS account needed.
- `s3`: pictures are saved in an S3 bucket, see the setup below.

In both cases the key is `users/<userId>/<timestamp>-<filename>`. Presigned urls work with `s3` only.

### AWS S3 setup

If you received an AWS account for the course (a sign-in url, an account id or alias, and an IAM user name and password):

1. Open the sign-in url, choose **IAM user** and sign in with the account id, user name and password.
2. Open **S3** and create a bucket (the name must be unique, use the region you work in, for example Europe (Stockholm) `eu-north-1`). Keep the public access blocked.
3. Open **IAM**, create a user for the app (no console access) and give it permission to use the bucket (for example `AmazonS3FullAccess`, or the course group). Then create an **access key** for it (use case: application running outside AWS) and copy both values, the secret is shown only once.
4. In `.env` set `CLOUD_PROVIDER=s3` and fill `S3_ACCESS_KEY`, `S3_SECRET_KEY`, `S3_REGION` and `S3_BUCKET_NAME`.

For the presigned url flow, the client sends a `PUT` request with the file to the returned url and the `Content-Type` that was used to create it. The lambda in `lambda/` then saves the key in the user document, see [`lambda/README.md`](lambda/README.md).

Never commit `.env` or the keys.

## Firebase notifications

The Firebase provider sends push notifications with `firebase-admin`. Download a service account key from the Firebase console (project settings, service accounts, generate a new private key), keep the file outside git and set its path:

```
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
```

Without it, notifications are only printed in the terminal.

## Postman

Import these files in Postman (**Import** button):

- [`docs/postman/social-app.postman_collection.json`](docs/postman/social-app.postman_collection.json): the **Social-App API** collection (folders `auth`, `user`, `post` and `comment`)
- [`docs/postman/social-app-local.postman_environment.json`](docs/postman/social-app-local.postman_environment.json): the **Social-App Local** environment (`baseUrl = http://localhost:3001`)

Or read the published documentation: [Social-App API docs](https://documenter.getpostman.com/view/49920929/2sBYHbqarU)

The API runs locally (`http://localhost:3001`), so start the server first (see *Getting started*) before sending requests from Postman.

Run **Login** first, the tokens are stored as cookies and reused by the other requests. In **Upload Profile Picture** choose an image in the `pp` field, and replace `<post id>` / `<comment id>` in the post and comment requests with real ids.

## Docs

- [requirements](docs/requirements.md)
- [db design](docs/db-design.md)
