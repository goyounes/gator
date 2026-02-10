import { db } from "..";
import { Feed, feedFollows, feeds, users } from "../schema";
import { eq, and } from 'drizzle-orm';
import { getFeedByUrl } from "./feedsQueries";

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

export async function deleteFeedFollowsForUser (userId : string, feedUrl: string) {
    await db.delete(feedFollows).
        where(
            and(
                eq(feedFollows.userId, userId),
                eq(feedFollows.feedId, db     //get feed id based on url on the same db trip
                    .select({ id: feeds.id })
                    .from(feeds)
                    .where(eq(feeds.url, feedUrl))
                    .limit(1)
                )
            )
        )
}