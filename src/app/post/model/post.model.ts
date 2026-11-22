import {HydratedDocument, model, Schema} from 'mongoose';
import {IPost} from "../interface/post.interface";

export type PostDocument = HydratedDocument<IPost>;

const schema = new Schema<IPost>({
    content: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 2000
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    commentsCount: {
        type: Number,
        default: 0
    },
    reactionsCount: {
        type: Number,
        default: 0
    },
    allowsComments: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

schema.index({userId: 1, createdAt: -1});
schema.index({isDeleted: 1, createdAt: -1});

export const Post = model<IPost>('Post', schema);
