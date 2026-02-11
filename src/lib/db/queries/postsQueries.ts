import { RSSItem } from "src/lib/rssService";
import { posts } from "../schema";
import { db } from "..";



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
