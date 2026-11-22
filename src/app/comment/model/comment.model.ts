import {HydratedDocument, model, Schema} from 'mongoose';
import {IComment} from "../interface/comment.interface";

export type CommentDocument = HydratedDocument<IComment>;

const schema = new Schema<IComment>({
    content: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 1000
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    parentId: {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        default: null
    },
    reactionsCount: {
        type: Number,
        default: 0
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

schema.index({postId: 1, isDeleted: 1, createdAt: -1});
schema.index({parentId: 1});

export const Comment = model<IComment>('Comment', schema);
