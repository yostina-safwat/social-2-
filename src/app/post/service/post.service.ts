import {inject, injectable} from "tsyringe";
import {Types} from "mongoose";
import {TOKENS} from "../../../lib/di/tokens";
import {ICacheProvider} from "../../../pkg/cache/cache.interface";
import {PostRepository} from "../repository/post.repository";
import {PostDocument} from "../model/post.model";
import {CreatePostDto, UpdatePostDto} from "../dto/post.dto";
import {PaginationDto} from "../../../lib/validation/common";
import {notPostOwner, postNotFound} from "../errors";

export const postCacheKey = (postId: string) => `GET:/api/post/${postId}`;

@injectable()
export class PostService {
    constructor(
        @inject(TOKENS.PostRepository) private readonly postRepository: PostRepository,
        @inject(TOKENS.CacheProvider) private readonly cacheProvider: ICacheProvider
    ) {
    }

    createPost = async (userId: string, dto: CreatePostDto): Promise<PostDocument> => {
        return this.postRepository.create({
            content: dto.content,
            allowsComments: dto.allowsComments ?? true,
            userId: new Types.ObjectId(userId),
        });
    }

    getPostById = async (postId: string): Promise<PostDocument> => {
        const post = await this.postRepository.findActiveById(postId, true);
        if (!post) throw postNotFound;
        return post;
    }

    getUserPosts = async (userId: string, pagination: PaginationDto) => {
        return this.paginate({userId: new Types.ObjectId(userId)}, pagination);
    }

    updatePost = async (postId: string, userId: string, dto: UpdatePostDto): Promise<PostDocument> => {
        await this.getOwnedPost(postId, userId);
        const updated = await this.postRepository.update(
            {_id: postId, isDeleted: false},
            {$set: dto},
            {new: true, runValidators: true}
        );
        if (!updated) throw postNotFound;
        await this.cacheProvider.del(postCacheKey(postId));
        return updated;
    }

    deletePost = async (postId: string, userId: string): Promise<void> => {
        await this.getOwnedPost(postId, userId);
        await this.postRepository.update({_id: postId}, {$set: {isDeleted: true}});
        await this.cacheProvider.del(postCacheKey(postId));
    }

    private getOwnedPost = async (postId: string, userId: string): Promise<PostDocument> => {
        const post = await this.postRepository.findActiveById(postId);
        if (!post) throw postNotFound;
        if (post.userId.toString() !== userId) throw notPostOwner;
        return post;
    }

    private paginate = async (filter: Record<string, unknown>, {page, limit}: PaginationDto) => {
        const {posts, total} = await this.postRepository.findActivePaginated(filter, page, limit);
        return {posts, page, limit, total, totalPages: Math.ceil(total / limit)};
    }
}
