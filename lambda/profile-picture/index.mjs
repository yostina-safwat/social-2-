import {MongoClient, ObjectId} from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URL);

export const handler = async (event) => {
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    const [folder, userId] = key.split('/');

    if (folder !== 'users' || !ObjectId.isValid(userId)) {
        return;
    }

    await client.connect();
    const users = client.db().collection('users');
    await users.updateOne({_id: new ObjectId(userId)}, {$set: {profilePicturePath: key}});
};
