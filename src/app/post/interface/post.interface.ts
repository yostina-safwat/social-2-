import {Types} from "mongoose";

export interface IPost {
    _id: Types.ObjectId;
    content: string;
    userId: Types.ObjectId;
    commentsCount: number;
    reactionsCount: number;
    allowsComments: boolean;
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
