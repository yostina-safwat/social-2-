export interface CreateCommentDto {
    postId: string;
    content: string;
    parentId?: string;
}

export interface UpdateCommentDto {
    content: string;
}
