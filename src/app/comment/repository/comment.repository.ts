import {injectable} from "tsyringe";
import {AbstractRepository} from "../../../lib/db/abstract.repository";
import {IComment} from "../interface/comment.interface";
import {Comment, CommentDocument} from "../model/comment.model";

const authorPopulate = {path: 'userId', select: 'userName profilePicturePath'};

@injectable()
export class CommentRepository extends AbstractRepository<IComment> {
    constructor() {
        super(Comment);
    }

    async findActiveById(id: string, withAuthor = false): Promise<CommentDocument | null> {
        const query = Comment.findOne({_id: id, isDeleted: false});
        if (withAuthor) query.populate(authorPopulate);
        return query.exec();
    }

    async findActiveByPost(postId: string, page: number, limit: number): Promise<{ comments: CommentDocument[]; total: number }> {
        const filter = {postId, isDeleted: false};
        const [comments, total] = await Promise.all([
            this.getMany(filter, {
                sort: {createdAt: -1},
                skip: (page - 1) * limit,
                limit,
                populate: authorPopulate,
            }),
            this.count(filter),
        ]);
        return {comments, total};
    }

    async softDeleteWithReplies(commentId: string): Promise<number> {
        return this.updateMany(
            {isDeleted: false, $or: [{_id: commentId}, {parentId: commentId}]},
            {$set: {isDeleted: true}}
        );
    }
}
