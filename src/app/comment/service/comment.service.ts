import {inject, injectable} from "tsyringe";
import {Types} from "mongoose";
import {TOKENS} from "../../../lib/di/tokens";
import {ICacheProvider} from "../../../pkg/cache/cache.interface";
import {CommentRepository} from "../repository/comment.repository";
import {PostRepository} from "../../post/repository/post.repository";
import {CommentDocument} from "../model/comment.model";
import {CreateCommentDto, UpdateCommentDto} from "../dto/comment.dto";
import {PaginationDto} from "../../../lib/validation/common";
import {postNotFound} from "../../post/errors";
import {postCacheKey} from "../../post/service/post.service";
import {
    commentNotFound,
    commentsDisabled,
    invalidParentComment,
    notAllowedToDeleteComment,
    notCommentOwner
} from "../errors";

@injectable()
export class CommentService {
    constructor(
        @inject(TOKENS.CommentRepository) private readonly commentRepository: CommentRepository,
        @inject(TOKENS.PostRepository) private readonly postRepository: PostRepository,
        @inject(TOKENS.CacheProvider) private readonly cacheProvider: ICacheProvider
    ) {
    }

    createComment = async (userId: string, dto: CreateCommentDto): Promise<CommentDocument> => {
        const post = await this.postRepository.findActiveById(dto.postId);
        if (!post) throw postNotFound;
        if (!post.allowsComments) throw commentsDisabled;

        if (dto.parentId) {
            const parent = await this.commentRepository.findActiveById(dto.parentId);
            if (!parent || parent.postId.toString() !== dto.postId || parent.parentId) {
                throw invalidParentComment;
            }
        }

        const comment = await this.commentRepository.create({
            content: dto.content,
            userId: new Types.ObjectId(userId),
            postId: new Types.ObjectId(dto.postId),
            parentId: dto.parentId ? new Types.ObjectId(dto.parentId) : null,
        });
        await this.postRepository.incrementCounter(dto.postId, 'commentsCount', 1);
        await this.cacheProvider.del(postCacheKey(dto.postId));
        return comment;
    }

    getPostComments = async (postId: string, {page, limit}: PaginationDto) => {
        const post = await this.postRepository.findActiveById(postId);
        if (!post) throw postNotFound;
        const {comments, total} = await this.commentRepository.findActiveByPost(postId, page, limit);
        return {comments, page, limit, total, totalPages: Math.ceil(total / limit)};
    }

    getCommentById = async (commentId: string): Promise<CommentDocument> => {
        const comment = await this.commentRepository.findActiveById(commentId, true);
        if (!comment) throw commentNotFound;
        return comment;
    }

    updateComment = async (commentId: string, userId: string, dto: UpdateCommentDto): Promise<CommentDocument> => {
        const comment = await this.commentRepository.findActiveById(commentId);
        if (!comment) throw commentNotFound;
        if (comment.userId.toString() !== userId) throw notCommentOwner;
        const updated = await this.commentRepository.update(
            {_id: commentId, isDeleted: false},
            {$set: {content: dto.content}},
            {new: true, runValidators: true}
        );
        if (!updated) throw commentNotFound;
        return updated;
    }

    deleteComment = async (commentId: string, userId: string): Promise<void> => {
        const comment = await this.commentRepository.findActiveById(commentId);
        if (!comment) throw commentNotFound;

        const postId = comment.postId.toString();
        const post = await this.postRepository.findActiveById(postId);
        if (!post) throw postNotFound;

        const isCommentOwner = comment.userId.toString() === userId;
        const isPostOwner = post.userId.toString() === userId;
        if (!isCommentOwner && !isPostOwner) throw notAllowedToDeleteComment;

        const deletedCount = await this.commentRepository.softDeleteWithReplies(commentId);
        if (deletedCount > 0) {
            await this.postRepository.incrementCounter(postId, 'commentsCount', -deletedCount);
        }
        await this.cacheProvider.del(postCacheKey(postId));
    }
}
