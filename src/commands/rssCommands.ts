import { Config, readConfig } from "src/config";
import { getUserByName } from "src/lib/db/queries/usersQueries";
import { Feed, User } from "src/lib/db/schema";
import { createFeed, getAllFeeds } from "src/lib/db/queries/feedsQueries";
import { fetchRSSFeed, printRSSFeed, RSSFeed } from "src/lib/rssService";
import { createFeedFollow } from "src/lib/db/queries/feedFollowsQueries";


export async function handlerAgg(cmdName:string, ...args:string[]): Promise<void>{
    // if (args.length !== 1 ) {
    //     throw new Error ("agg function expects <url>")
    // }
    const url = args[0] || "https://www.wagslane.dev/index.xml"
    try {        
        const feed : RSSFeed = await fetchRSSFeed(url)
        console.log(`Successfully fetched RSS feed from ${url}`)
        printRSSFeed(feed, 100)
    } catch (err) {
        throw new Error(`Failed to fetch RSS feed from ${url}: ${(err instanceof Error) ? err.message : err}`);
    }
}

export async function handlerAddFeed(cmdName:string, user: User, ...args:string[]): Promise<void>{
    if (args.length !== 2 ) {
        throw new Error ("addfeed function expects <name> <url>")
    }
    const [name, url] = args

    try {        
        const feed: Feed = await createFeed(name, url, user.id)
        console.log(`Successfully added RSS feed ${name} with URL ${url}`)
        printFeed(feed, user);
        await createFeedFollow(feed.id,user.id)
        console.log(`Successfully followed feed: ${feed.name} for user: ${user.name}`)
    } catch (err) {
        throw new Error(`Failed to add RSS feed ${name} from ${url}: ${(err instanceof Error) ? err.message : err}`);
    }
}

export async function handlerFeeds(cmdName:string, ...args:string[]): Promise<void>{
    let items
    try {
        items  = await getAllFeeds()
    } catch (err) {
        throw new Error(`Failed to list RSS feeds: ${(err instanceof Error) ? err.message : err}`);
    }

    if (items.length === 0) {
        console.log(`No feeds found.`);
        return;
    }

    console.log(`found feeds: ${items.length}`)
    items.forEach((item , index) => {        
        index !== 0 && console.log(`=====================================`);
        printFeed(item.feeds, item.users!)
    })

}

export function printFeed(feed: Feed, user: User): void {
    console.log(`* ID:            ${feed.id}`);
    console.log(`* Created:       ${feed.createdAt}`);
    console.log(`* Updated:       ${feed.updatedAt}`);
    console.log(`* name:          ${feed.name}`);
    console.log(`* URL:           ${feed.url}`);
    console.log(`* User:          ${user.name}`);
}

