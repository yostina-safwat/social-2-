# Profile picture lambda

The client uploads the picture straight to S3 with the url returned by `POST /api/user/get-presigned-url`.
This function runs after the upload and saves the object key in the user document (`profilePicturePath`).

The key looks like `users/<userId>/<timestamp>-<file name>`, so the user id is the second part of the key.

## Deploy

1. Install the dependencies and zip the folder:

   ```bash
   cd lambda/profile-picture
   npm install --omit=dev
   zip -r function.zip .
   ```

2. In the AWS console open **Lambda**, create a function (Node.js runtime) in the same region as the bucket and upload `function.zip`.
3. Add the environment variable `MONGODB_URL` with a database url that the lambda can reach (for example MongoDB Atlas, a `localhost` url will not work from AWS). The database name must be part of the url.
4. In the function add an **S3 trigger**: choose the bucket, the event type **PUT** and the prefix `users/`.
