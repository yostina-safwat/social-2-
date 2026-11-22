import {injectable} from "tsyringe";
import {QueryFilter} from "mongoose";
import {AbstractRepository} from "../../../lib/db/abstract.repository";
import {IPost} from "../interface/post.interface";
import {Post, PostDocument} from "../model/post.model";

export type PostCounter = 'commentsCount' | 'reactionsCount';

const authorPopulate = {path: 'userId', select: 'userName profilePicturePath'};

@injectable()
export class PostRepository extends AbstractRepository<IPost> {
    constructor() {
        super(Post);
    }

    async findActiveById(id: string, withAuthor = false): Promise<PostDocument | null> {
        const query = Post.findOne({_id: id, isDeleted: false});
        if (withAuthor) query.populate(authorPopulate);
        return query.exec();
    }

    async findActivePaginated(filter: QueryFilter<IPost>, page: number, limit: number): Promise<{ posts: PostDocument[]; total: number }> {
        const activeFilter = {...filter, isDeleted: false};
        const [posts, total] = await Promise.all([
            this.getMany(activeFilter, {
                sort: {createdAt: -1},
                skip: (page - 1) * limit,
                limit,
                populate: authorPopulate,
            }),
            this.count(activeFilter),
        ]);
        return {posts, total};
    }

    async incrementCounter(postId: string, field: PostCounter, by: number): Promise<void> {
        await this.update({_id: postId, isDeleted: false}, {$inc: {[field]: by}});
    }
}
