import { serverSupabaseUser } from '#supabase/server';
import { includePost, parsePost, prisma } from '../../db';

export default defineEventHandler(async(event) => {
    const user = await serverSupabaseUser(event);

    if(!user){
        return;
    }

    const response = await prisma.posts.findMany({
        ...includePost,
        include: {
            ...includePost.include,
            likes: {
                where: {
                    user_id: {
                        equals: user.id
                    }
                },
                take: 1,
                select: {
                    id: true
                }
            }
        }
    });

    // @ts-ignore
    return response.map(parsePost);
})