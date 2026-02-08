import { Config, readConfig } from "src/config";
import { getUserByName } from "src/lib/db/queries/users";
import { Feed, User } from "src/lib/db/schema";
import { getFeedByUrl } from "src/lib/db/queries/feeds";
import { createFeedFollow, getFeedFollowsForUser } from "src/lib/db/queries/feedFollows";

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

export async function handlerFollowing(cmdName:string, ...args:string[]): Promise<void>{
    const cfg: Config = readConfig() 
    const currentUser: User = await getUserByName(cfg.currentUserName)

    try {        
        const userFeedFollows  = await getFeedFollowsForUser(currentUser.id)
        console.log(`found feeds: ${userFeedFollows.length}`)
        userFeedFollows.forEach( feedFollow  => {
            console.log(` - ${feedFollow.feedName}`)
        })
    } catch (err) {
        throw new Error(`Failed to fetch feed for user : ${currentUser.name}: ${(err instanceof Error) ? err.message : err}`);
    }
}