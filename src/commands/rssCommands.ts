import { Feed, User } from "src/lib/db/schema";
import { createFeed, getAllFeeds, getNextFeedToFetch, markFeedFetched } from "src/lib/db/queries/feedsQueries";
import { fetchRSSFeed, printRSSFeed, printRSSFeedTitles, RSSFeed } from "src/lib/rssService";
import { createFeedFollow } from "src/lib/db/queries/feedFollowsQueries";
import { createPost } from "src/lib/db/queries/postsQueries";


export async function handlerAgg(_:string, ...args:string[]): Promise<void>{
    if (args.length !== 1 ) {
        throw new Error ("agg function expects <time_between_reqs>")
    }

    const timeBetweenReqs = parseDuration(args[0]) 

    console.log(`Collecting feeds every ${timeBetweenReqs}`)

    await scrapeFeeds()

    const interval = setInterval(async () => {
        await scrapeFeeds()
    }, timeBetweenReqs)

    await new Promise<void>((resolve) => {
        process.on("SIGINT", () => {
            console.log("Shutting down feed aggregator...");
            clearInterval(interval);
            resolve();
        });
    });
}


async function scrapeFeeds(){

    const nextFeed = await getNextFeedToFetch()
    
    markFeedFetched(nextFeed.id) 

    try {        
        const rssFeed : RSSFeed = await fetchRSSFeed(nextFeed.url)
        console.log(`Successfully fetched RSS feed from ${nextFeed.url}`)
        printRSSFeed(rssFeed, 50) //50 charecters max during the printing of long strings
        // printRSSFeedTitles(rssFeed);

        await Promise.all(
            rssFeed.channel.item.map((post) =>
                createPost(post, nextFeed.id)
            )
        );
        console.log(`${rssFeed.channel.item.length} posts saved to the DB`)
    } catch (err) {
        throw new Error(`Failed to scrap RSS feed from ${nextFeed.url}\n ${(err instanceof Error) ? err.message : err}`);
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
        throw new Error(`Failed to add RSS feed ${name} from ${url}\n ${(err instanceof Error) ? err.message : err}`);
    }
}

export async function handlerFeeds(cmdName:string, ...args:string[]): Promise<void>{
    let items
    try {
        items  = await getAllFeeds()
    } catch (err) {
        throw new Error(`Failed to list RSS feeds\n ${(err instanceof Error) ? err.message : err}`);
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

function parseDuration(durationStr: string): number {
    const regex = /^(\d+)(ms|s|m|h)$/;
    const match = durationStr.match(regex);
    
    if (!match) throw new Error(`invalid duration: ${durationStr}`);

    const amount = Number(match[1]);
    const unit = match[2];
    let unitMultiplier = 1000 * 60 //default to 1m 
    if (unit === "s") unitMultiplier = 1000
    if (unit === "m") unitMultiplier = 1000 * 60
    if (unit === "h") unitMultiplier = 1000 * 60 * 60
    if (unit === "d") unitMultiplier = 1000 * 60 * 60 * 24

    return amount * unitMultiplier
}