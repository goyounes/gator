import { getPostsForUser } from "src/lib/db/queries/postsQueries";
import { Post, User } from "src/lib/db/schema";

export async function handlerBrowse(cmdName:string, user:User, ...args:string[]): Promise<void>{
    if (args.length > 1 ) {
        throw new Error ("follow function expects optional <number_of_posts> ")
    }
    const DEFAULT_LIMIT_VALUE = 2
    const limit = Number(args[0]) || DEFAULT_LIMIT_VALUE
    const posts: Post[] = await getPostsForUser(user, limit)
    for (const post of posts){
        console.log(`${post.title}`)
    }
}