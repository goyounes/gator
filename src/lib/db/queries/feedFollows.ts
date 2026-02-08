import { db } from "..";
import { feedFollows, feeds, users } from "../schema";
import { eq } from 'drizzle-orm';

export async function createFeedFollow(feedId: string, userId : string) {
    const [ _ ] = await db.insert(feedFollows).values( {feedId: feedId, userId: userId }).returning();
    const feedFollowsWithNames = await db.select({
        id: feedFollows.id,
        createdAt: feedFollows.createdAt,
        updatedAt: feedFollows.updatedAt,
        userId: feedFollows.userId,
        feedId: feedFollows.feedId,
        userName: users.name,
        feedName: feeds.name
    }).from(feedFollows).
    innerJoin(users,eq(feedFollows.userId, users.id)).
    innerJoin(feeds,eq(feedFollows.feedId, feeds.id))
    
    return feedFollowsWithNames
}