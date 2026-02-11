import {XMLParser} from 'fast-xml-parser';
import util from "util";

export async function fetchRSSFeed(feedURL: string): Promise<RSSFeed> {
    const response = await fetch(feedURL,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/xml',
            'User-Agent': 'gator',
            accept: 'application/rss+xml'
        }
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch RSS feed: ${response.status} ${response.statusText}`);
    }
    const xmlText = await response.text();
    const xmlParser = new XMLParser();

    const parsedXML = xmlParser.parse(xmlText);
    if (!parsedXML) {
        throw new Error("Failed to parse RSS feed XML");
    }
    if (typeof parsedXML !== 'object' || !parsedXML.rss) {
        throw new Error("Failed to parse RSS feed");
    }

    const feed = validateRSSFeed(parsedXML.rss);
    const {title, link, description, item} = feed.channel;
    const validItems = filterValidItems(item);

    // console.log(`Fetched RSS feed: ${title} (${link}) - ${description}`);
    console.log(`Found ${validItems.length} items in the feed.`);

    return {
        channel: {
            title,
            link,
            description,
            item: validItems
        }
    } as RSSFeed;
}

export function printRSSFeed(feed: RSSFeed,maxStringLength: number = 0): void {
    console.log(util.inspect(feed, { 
        depth: null, 
        colors: true, 
        maxStringLength: maxStringLength || null
    }));
}
export function printRSSFeedTitles(feed: RSSFeed): void {
    console.log("======================\nTopics: ")
    feed.channel.item.forEach((item) => {
        console.log(item.title)
    })
    console.log("======================");
}

function validateRSSFeed(feed: unknown): RSSFeed {

    if (feed === null || typeof feed !== 'object' ) {
        throw new Error('Invalid RSS feed format: Feed is not an object');
    }

    const f = feed as Record<string, unknown>;
    
    if (!f.channel || typeof f.channel !== 'object') {
        throw new Error('Invalid RSS feed format: Invalid channel element');
    }

    const c = f.channel as Record<string, unknown>;
    let errorMessage = '';

    if (!c.description || typeof c.description !== 'string') {
        errorMessage += '- Missing or invalid description element\n';
    }
    if (!c.title || typeof c.title !== 'string') {
        errorMessage += '- Missing or invalid title element\n';
    }
    if (!c.link || typeof c.link !== 'string') {
        errorMessage += '- Missing or invalid link element\n';
    }
    if (!c.item || !Array.isArray(c.item)) {
        errorMessage += '- Missing or invalid item element\n';
    }

    if (errorMessage !== '') {
        throw new Error('Invalid RSS feed format:\n' + errorMessage.trim());
    }

    return feed as RSSFeed;
}

function filterValidItems(items: unknown[]): RSSItem[] {
    const validItems: RSSItem[] = [];
    
    items.forEach((item, index) => {
        if (item === null || typeof item !== 'object') {
            throw new Error(`Invalid RSS feed format: Item at index ${index} is not an object`);
        }
        const i = item as Record<string, unknown>;
        let errorMessage = '';

        if (!i.title || typeof i.title !== 'string') {
            errorMessage += '- Missing or invalid title element\n';
        }
        if (!i.link || typeof i.link !== 'string') {
            errorMessage += '- Missing or invalid link element\n';
        }
        if (!i.description || typeof i.description !== 'string') {
            errorMessage += '- Missing or invalid description element\n';
        }
        if (!i.pubDate || typeof i.pubDate !== 'string') {
            errorMessage += '- Missing or invalid pubDate element\n';
        }

        if (errorMessage !== '') {
            throw new Error(`Invalid RSS feed format for item at index ${index}:\n${errorMessage.trim()}`);
        }

        validItems.push({
            title: i.title as string,
            link: i.link as string,
            description: i.description as string,
            pubDate: i.pubDate as string
        });
    });
    return validItems;
}

export type RSSFeed = {
    channel: {
        title: string
        link: string
        description: string
        item: RSSItem[]
    }
}

export type RSSItem = {
  title: string
  link: string
  description: string
  pubDate: string
}