import { Feed, User } from "src/lib/db/schema";
import { getFeedByUrl } from "src/lib/db/queries/feedsQueries";
import { createFeedFollow, deleteFeedFollowsForUser, getFeedFollowsForUser } from "src/lib/db/queries/feedFollowsQueries";

export async function handlerFollow(cmdName:string, user:User, ...args:string[]): Promise<void>{
    if (args.length !== 1 ) {
        throw new Error ("agg function expects <url>")
    }
    const url = args[0]

    const feed : Feed = await getFeedByUrl(url)
    try {        
        const newFeedFollow  = await createFeedFollow(feed.id, user.id)
        console.log(`Successfully followed feed: ${newFeedFollow.feedName} for user: ${newFeedFollow.userName}`)
    } catch (err) {
        throw new Error(`Failed to follow feed url: ${url}\n ${(err instanceof Error) ? err.message : err}`);
    }
}

export async function handlerFollowing(cmdName:string, user:User, ...args:string[]): Promise<void>{

    try {        
        const userFeedFollows  = await getFeedFollowsForUser(user.id)
        console.log(`found feeds: ${userFeedFollows.length}`)
        userFeedFollows.forEach( feedFollow  => {
            console.log(` - ${feedFollow.feedName}`)
        })
    } catch (err) {
        throw new Error(`Failed to fetch feed for user : ${user.name}\n ${(err instanceof Error) ? err.message : err}`);
    }
}

export async function handlerUnfollow(cmdName:string, user:User, ...args:string[]): Promise<void>{
    if (args.length !== 1 ) {
        throw new Error ("agg function expects <url>")
    }
    const feedUrl = args[0]

    try {        
         await deleteFeedFollowsForUser(user.id, feedUrl)
        console.log(`Successfully unfollowed feed url: ${feedUrl} for user: ${user.id}`)
    } catch (err) {
        throw new Error(`Failed to unfollowed feed url: ${feedUrl} for user: ${user.id} \n ${(err instanceof Error) ? err.message : err}`);
    }
}