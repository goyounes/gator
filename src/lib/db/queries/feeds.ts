import { db } from "..";
import { feeds, users } from "../schema";
import { eq } from 'drizzle-orm';

export async function createFeed(name: string, url : string, userId: string) {
    const [result] = await db.insert(feeds).values({ name: name, url: url, userId: userId }).returning({ insertedId: feeds.id });
    return result;
}

export async function getFeedById(id: string) {
  const [result] = await db.select().from(feeds).where(eq(feeds.id, id));
  return result;
}

export async function getAllFeeds() {
    const result = await db.select().from(feeds).leftJoin(users, eq(feeds.userId, users.id))
    return result 
}