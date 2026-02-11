import { RSSItem } from "src/lib/rssService";
import { feeds, Post, posts, User } from "../schema";
import { db } from "..";
import { getFeedFollowsForUser } from "./feedFollowsQueries";
import { eq, getTableColumns, inArray } from "drizzle-orm";



export async function createPost(post: RSSItem, feedId: string) {
    try {
        const [result] = await db
            .insert(posts)
            .values({
                title: post.title,
                url: post.link,
                description: post.description,
                publishedAt: new Date(post.pubDate),
                feedId: feedId
            })
            .returning();

        return result;

    } catch (error: any) {
        console.log(`Post with URL "${post.link}" already exists.`);
    }
}

export async function getPostsForUser(user: User, limit: number = 2): Promise<Post[]>{
    const feedFollows = await getFeedFollowsForUser(user.id)
    const feedIds = feedFollows.map(f => f.feedId)
    const userPosts = await db
        .select({ ...getTableColumns(posts) })
        .from(posts)
        .innerJoin(feeds, eq(feeds.id, posts.feedId))
        .where(inArray(feeds.id,feedIds))
        .limit(limit);

    return userPosts
}