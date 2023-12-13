import type { Comment } from "@prisma/client";
import { db } from "@/db";
import { cache } from "react";
export type CommentWithAuthor = Comment & {
    user: { name: string | null; image: string | null };
};

// export type PostWithData=Awaited<
// ReturnType<typeof fetchPostsByTopicSlugs>
// >[number];

export const fetchCommentsByPostId = cache((
    postId: string
): Promise<CommentWithAuthor[]> => {
    // console.log("Making a query");
    return db.comment.findMany({
        where: { postId: postId },
        include: {
            user: {
                select: {
                    name: true,
                    image: true,
                },
            },
        },
    });
})
