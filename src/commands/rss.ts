import { Config, readConfig } from "src/config";
import { getUserByName } from "src/lib/db/queries/users";
import { Feed, User } from "src/lib/db/schema";
import { createFeed, getAllFeeds } from "src/lib/db/queries/feeds";
import { fetchRSSFeed, printRSSFeed, RSSFeed } from "src/lib/rss";
import { createFeedFollow } from "src/lib/db/queries/feedFollows";


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

export async function handlerAddFeed(cmdName:string, ...args:string[]): Promise<void>{
    if (args.length !== 2 ) {
        throw new Error ("addfeed function expects <name> <url>")
    }
    const [name, url] = args

    const cfg: Config = readConfig() 
    const currentUser: User = await getUserByName(cfg.currentUserName)

    try {        
        const feed: Feed = await createFeed(name, url, currentUser.id)
        console.log(`Successfully added RSS feed ${name} with URL ${url}`)
        printFeed(feed, currentUser);
        await createFeedFollow(feed.id,currentUser.id)
        console.log(`Successfully followed feed: ${feed.name} for user: ${currentUser.name}`)
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

