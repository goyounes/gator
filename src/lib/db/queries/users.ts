import { db } from "..";
import { User, users } from "../schema";
import { eq } from 'drizzle-orm';

export async function createUser(name: string): Promise<User> {
  const [result] = await db.insert(users).values({ name: name }).returning();
  return result;
}

export async function getUserByName(name: string): Promise<User>{
  const [result] = await db.select().from(users).where(eq(users.name, name));
  if (!result) {
    throw new Error(`User not found: ${name}`);
  }
  return result;
}

export async function getAllUsers(): Promise<User[]> {
  const result = await db.select().from(users);
  return result;
}

export async function deleteUsers() : Promise<void> {
  const [result] = await db.delete(users);
  return result;
}