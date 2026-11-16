# Social-App

Backend API for a social app, built with Express, TypeScript and MongoDB (Mongoose), with Redis for caching.

## Features (so far)

**Auth module**
- User registration and email verification (OTP)
- Login with access token + refresh token (httpOnly cookies), with login attempts limit
- Token refreshing
- Password reset with OTP
- Google sign-in

**User module**
- Upload / delete profile picture (multer + AWS S3)

## Tech

express, typescript, mongoose, redis (ioredis), zod, argon2, jsonwebtoken, nodemailer / mailjet, google-auth-library, multer, AWS S3 (`@aws-sdk/client-s3`)

## Getting started

```bash
npm install
cp .env.example .env   # fill in your values
npm run dev
```

Other scripts: `npm run build`, `npm start`.

## API endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/register` | Create a user and send a verification code |
| POST | `/api/auth/verify-account` | Verify the account with the code |
| POST | `/api/auth/login` | Login (sets `access_token` and `refresh_token` cookies) |
| POST | `/api/auth/send-otp` | Send a new OTP |
| POST | `/api/auth/reset-password` | Reset the password with an OTP |
| POST | `/api/auth/login-google` | Login with a Google ID token |
| POST | `/api/auth/refresh-token` | Get a new token pair |
| POST | `/api/user/upload-profile-pic` | Upload a profile picture (form-data field `pp`, requires login) |
| DELETE | `/api/user/delete-profile-pic` | Delete the profile picture (requires login) |

## AWS S3 setup

Profile pictures are stored in an S3 bucket (`users/<userId>/<timestamp>-<filename>`).

1. Create a bucket and an IAM user with permission to put / get / delete objects on it (e.g. `AmazonS3FullAccess`).
2. Create an access key for that user.
3. Fill `S3_ACCESS_KEY`, `S3_SECRET_KEY`, `S3_REGION` and `S3_BUCKET_NAME` in `.env`.

## Postman

[Social-App API collection](https://go.postman.co/workspace/4ae48e01-46cd-4a98-8023-3fc41d6f346e)

The workspace contains the **Social-App API** collection and the **Social-App Local** environment (`baseUrl = http://localhost:3000`).

## Docs

- [requirements](docs/requirements.md)
- [db design](docs/db-design.md)
