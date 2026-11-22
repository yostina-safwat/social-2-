import {Types} from "mongoose";

export interface IComment {
    _id: Types.ObjectId;
    content: string;
    userId: Types.ObjectId;
    postId: Types.ObjectId;
    parentId?: Types.ObjectId | null;
    reactionsCount: number;
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
