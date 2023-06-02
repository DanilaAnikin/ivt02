import { serverSupabaseUser } from '#supabase/server';
import { includePost, parsePost, prisma } from '../../db';
import { z } from 'zod';


const CreatePostDto = z.object({
  title: z.string(),
  content: z.string()
})

export default defineEventHandler(async(event) => {
    const user = await serverSupabaseUser(event);
    const body = await readBody(event);

    const validatedData = CreatePostDto.safeParse(body);

    if(!validatedData.success || !user){
      return;
    }

    const {title, content} = validatedData.data;

    const response = await prisma.posts.create({
        data: {
          title: title,
          content: content,
          users: {
            connect: {
              id: user.id
            }
          }
        },
        include: {
          ...includePost.include,
          likes: {
            where: {
              user_id: {
                equals: user.id
              }
            },
            take: 1,
            select: {id: true}
          }
        }
    });

    // @ts-ignore
    return parsePost(response);
})