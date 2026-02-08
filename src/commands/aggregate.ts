import { fetchRSSFeed, RSSFeed } from "src/lib/rss";
        import util from "util";

export async function handlerAgg(cmdName:string, ...args:string[]): Promise<void>{
    // if (args.length !== 1 ) {
    //     throw new Error ("agg function expects <url>")
    // }
    const url = args[0] || "https://www.wagslane.dev/index.xml"
    try {        
        const feed : RSSFeed = await fetchRSSFeed(url)
        console.log(`Successfully fetched RSS feed from ${url}`)
        console.log(util.inspect(feed, { depth: null, colors: true, maxStringLength: null }));
    } catch (err) {
        throw new Error(`Failed to fetch RSS feed from ${url}: ${(err instanceof Error) ? err.message : err}`);
    }
}