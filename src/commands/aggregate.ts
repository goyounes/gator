import { Config, readConfig } from "src/config";
import { getUserByName } from "src/lib/db/queries/users";
import { Feed, User } from "src/lib/db/schema";
import { createFeed, getFeedById } from "src/lib/db/queries/feeds";
import { fetchRSSFeed, printRSSFeed, RSSFeed } from "src/lib/rss";


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
    const cfg: Config = readConfig() 
    const currentUser: User = await getUserByName(cfg.currentUserName)
    console.log(currentUser)
    if (args.length !== 2 ) {
        throw new Error ("addfeed function expects <name> <url>")
    }
    const [name, url] = args
    try {        
        const {insertedId} = await createFeed(name, url, currentUser.id)
        console.log(`Successfully added RSS feed ${name} from ${url}`)

        const feed : Feed = await getFeedById(insertedId)
        printFeed(feed, currentUser)
    } catch (err) {
        throw new Error(`Failed to add RSS feed ${name} from ${url}: ${(err instanceof Error) ? err.message : err}`);
    }
}

function printFeed(feed: Feed, user: User): void {
    console.log(`Feed: ${feed.name} (${feed.url}) - User: ${user.name}`)
}