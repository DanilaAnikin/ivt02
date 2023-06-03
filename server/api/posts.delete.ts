import { serverSupabaseUser } from '#supabase/server';
import { includePost, parsePost, prisma } from '../../db';
import { z } from 'zod';

const DeletePostDto = z.object({
    postId: z.number(),
})

export default defineEventHandler(async(event) => {
    const user = await serverSupabaseUser(event);
    const body = await readBody(event);

    const validatedData = DeletePostDto.safeParse(body);

    if(!validatedData.success || !user){
      return;
    }

    const {postId} = validatedData.data;

    const response = await prisma.posts.delete({
        where: {
            id: postId,
        },
        include: {
          ...includePost.include,
        }
    });

    // @ts-ignore
    return parsePost(response);
})