import { Prisma, PrismaClient, posts } from "@prisma/client";

export const prisma = new PrismaClient();


export const includePost = Prisma.validator<Prisma.postsFindManyArgs>()({
    include: {
        users: {
            select: {
                raw_user_meta_data: true
            }
        },
        _count: {
            select: {
                likes: true
            }
        }
    },
    orderBy: {
        createdAt: 'desc'
    }
})

export type Post = ReturnType<typeof parsePost>

export const parsePost = (post: (posts & {
    likes: {
        id: number;
    }[];
    users: {
        raw_user_meta_data: Prisma.JsonValue;
    };
    _count: {
        likes: number;
    };
})) => {
    const {
        id,
        title,
        content,
        createdAt,
        users,
        _count,
        likes
    } = post;

    return {
        id,
        title,
        content,
        createdAt,
        user: {
            // @ts-ignore
            name: users.raw_user_meta_data.name,
            // @ts-ignore
            avatar: users.raw_user_meta_data!.picture,
        },
        likes: _count.likes,
        liked: !!likes?.length || 0
    }
}