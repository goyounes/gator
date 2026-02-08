import { db } from "..";
import { feeds } from "../schema";
import { eq } from 'drizzle-orm';

export async function createFeed(name: string, url : string, userId: string) {
    const [result] = await db.insert(feeds).values({ name: name, url: url, user_id: userId }).returning({ insertedId: feeds.id });
    return result;
}

export async function getFeedById(id: string) {
  const [result] = await db.select().from(feeds).where(eq(feeds.id, id));
  return result;
}