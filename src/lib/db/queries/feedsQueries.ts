import { db } from "..";
import { Feed, feeds, User, users } from "../schema";
import { asc, eq, sql } from 'drizzle-orm';

export async function createFeed(name: string, url : string, userId: string) : Promise<Feed> {
    const [result] = await db.insert(feeds).values({ name: name, url: url, userId: userId }).returning();
    return result;
}

export async function getFeedById(id: string): Promise <Feed> {
    const [result] = await db.select().from(feeds).where(eq(feeds.id, id));
    if (!result) {
        throw new Error(`Feed not found id: ${id}`);
    }
    return result;
}
export async function getFeedByUrl(url: string): Promise <Feed> {
    const [result] = await db.select().from(feeds).where(eq(feeds.url, url));
    if (!result) {
        throw new Error(`Feed not found url: ${url}`);
    }
    return result;
}

export async function getAllFeeds(): Promise < Array<{feeds:Feed; users: User}> > {
    const result = await db.select().from(feeds).innerJoin(users, eq(feeds.userId, users.id))
    return result 
}

export async function markFeedFetched (feedId: string){
    const [result] = await db
        .update(feeds)
        .set({updatedAt:new Date(), lastFetchedAt:new Date()})
        .where(eq(feeds.id, feedId))
        .returning(); 

    return result  
}
export async function getNextFeedToFetch (): Promise<Feed> {
    const mostObsoleteFeed =  await db
        .select()
        .from(feeds)
        .orderBy( sql`${feeds.lastFetchedAt} ASC NULLS FIRST`)
        .limit(10);   
    // console.log(mostObsoleteFeed)
    return mostObsoleteFeed[0]
}