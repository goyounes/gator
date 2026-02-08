import { Config, readConfig } from "src/config";
import { getUserByName } from "src/lib/db/queries/users";
import { Feed, FeedFollow, User } from "src/lib/db/schema";
import { createFeed, getAllFeeds, getFeedById, getFeedByUrl } from "src/lib/db/queries/feeds";
import { fetchRSSFeed, printRSSFeed, RSSFeed } from "src/lib/rss";
import { createFeedFollow } from "src/lib/db/queries/feedFollows";


export async function handlerFollow(cmdName:string, ...args:string[]): Promise<void>{
    if (args.length !== 1 ) {
        throw new Error ("agg function expects <url>")
    }
    const url = args[0]
    const cfg: Config = readConfig() 
    const currentUser: User = await getUserByName(cfg.currentUserName)
    const feed : Feed = await getFeedByUrl(url)
    try {        
        const _  = await createFeedFollow(feed.id, currentUser.id)
        console.log(`Successfully followed feed: ${feed.name} for user: ${currentUser.name}`)
    } catch (err) {
        throw new Error(`Failed to follow feed url: ${url}: ${(err instanceof Error) ? err.message : err}`);
    }
}
