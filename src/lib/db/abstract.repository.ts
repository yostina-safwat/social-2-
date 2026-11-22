import {DeleteResult, HydratedDocument, Model, QueryFilter, QueryOptions, UpdateQuery} from "mongoose";

export interface FindManyOptions {
    sort?: Record<string, 1 | -1>;
    skip?: number;
    limit?: number;
    populate?: string | {path: string; select?: string};
}

export abstract class AbstractRepository<T> {
    protected constructor(protected readonly model: Model<T>) {
    }

    async create(data: Partial<T>): Promise<HydratedDocument<T>> {
        return this.model.create(data);
    }

    async update(filter: QueryFilter<T>, newData: UpdateQuery<T>, options: QueryOptions<T> = {new: true}): Promise<HydratedDocument<T> | null> {
        return this.model.findOneAndUpdate(filter, newData, options);
    }

    async updateMany(filter: QueryFilter<T>, newData: UpdateQuery<T>): Promise<number> {
        const result = await this.model.updateMany(filter, newData);
        return result.modifiedCount;
    }

    async delete(filter: QueryFilter<T>): Promise<DeleteResult> {
        return this.model.deleteOne(filter);
    }

    async getOne(filter: QueryFilter<T>): Promise<HydratedDocument<T> | null> {
        return this.model.findOne(filter);
    }

    async getMany(filter: QueryFilter<T>, options: FindManyOptions = {}): Promise<HydratedDocument<T>[]> {
        const query = this.model.find(filter);
        if (options.sort) query.sort(options.sort);
        if (options.skip) query.skip(options.skip);
        if (options.limit) query.limit(options.limit);
        if (options.populate) query.populate(options.populate as string);
        return query.exec() as Promise<HydratedDocument<T>[]>;
    }

    async count(filter: QueryFilter<T>): Promise<number> {
        return this.model.countDocuments(filter);
    }
}
