import type { Post } from "@prisma/client";

import { db } from "@/db";

export type PostWithData = Post & {
    topic: { slug: string };
    user: { name: string | null };
    _count: { comments: number };
};

// export type PostWithData=Awaited<
// ReturnType<typeof fetchPostsByTopicSlugs>
// >[number];

export function fetchPostsByTopicSlugs(slug: string): Promise<PostWithData[]> {
    return db.post.findMany({
        where: { topic: { slug: slug } },
        include: {
            topic: { select: { slug: true } },
            user: { select: { name: true } },
            _count: { select: { comments: true } },
        },
    });
}

export function fetchTopPosts(): Promise<PostWithData[]> {
    return db.post.findMany({
        orderBy: [
            {
                comments: {
                    _count: "desc",
                },
            },
        ],
        include: {
            topic: { select: { slug: true } },
            user: { select: { name: true ,image:true} },
            _count: { select: { comments: true } },
        },
        take:6,
    });
}
