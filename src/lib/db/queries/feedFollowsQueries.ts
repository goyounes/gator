import { db } from "..";
import { feedFollows, feeds, users } from "../schema";
import { eq, and } from 'drizzle-orm';

export async function createFeedFollow(feedId: string, userId : string) {
    const [ newFeedFollow ] = await db.insert(feedFollows).values( {feedId: feedId, userId: userId }).returning();
    const [feedFollowWithNames] = await db.select({
        id: feedFollows.id,
        createdAt: feedFollows.createdAt,
        updatedAt: feedFollows.updatedAt,
        userId: feedFollows.userId,
        feedId: feedFollows.feedId,
        userName: users.name,
        feedName: feeds.name
    }).from(feedFollows).
    innerJoin(users,eq(feedFollows.userId, users.id)).
    innerJoin(feeds,eq(feedFollows.feedId, feeds.id)).
    where(
      and(
        eq(feedFollows.id, newFeedFollow.id),
        eq(users.id, newFeedFollow.userId),
      )
    )
    return feedFollowWithNames
}

export async function getFeedFollowsForUser (userId : string) {
    const result = await db.select({
        id: feedFollows.id,
        createdAt: feedFollows.createdAt,
        updatedAt: feedFollows.updatedAt,
        userId: feedFollows.userId,
        feedId: feedFollows.feedId,
        userName: users.name,
        feedName: feeds.name
    }).from(feedFollows).
    innerJoin(users,eq(feedFollows.userId, users.id)).
    innerJoin(feeds,eq(feedFollows.feedId, feeds.id)).
    where(eq(feedFollows.userId, userId))
  
    return result
}