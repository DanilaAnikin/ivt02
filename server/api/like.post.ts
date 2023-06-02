import { serverSupabaseUser } from '#supabase/server';
import { includePost, parsePost, prisma } from '../../db';
import { z } from 'zod';

const LikeDto = z.object({
    postId: z.number(),
    liked: z.boolean()
})

export default defineEventHandler(async(event) => {
    const user = await serverSupabaseUser(event);
    const body =  await readBody(event);

    const validatedData = LikeDto.safeParse(body);

    if(!user || !validatedData.success){
        return;
    }

    const {liked, postId} = validatedData.data;

    let newCount = 0;
    

    if(!liked){
        const res = await prisma.likes.delete({
            where: {
                user_id_post_id: {
                    user_id: user.id,
                    post_id: postId
                }
            },
            select: {
                posts: {
                    select: {
                        _count: {
                            select: {
                                likes: true
                            }
                        }
                    }
                }
            }
        });


        newCount = await prisma.likes.count({
            where: {
                post_id: postId
            }
        })
    } else {
        const res = await prisma.likes.create({
            data: {
                users: {
                    connect: {
                        id: user.id
                    }
                },
                posts: {
                    connect: {
                        id: postId
                    }
                }
            },
            select: {
                posts: {
                    select: {
                        _count: {
                            select: {
                                likes: true
                            }
                        }
                    }
                }
            }
        })
        newCount = res.posts._count.likes
    }

    return newCount
})