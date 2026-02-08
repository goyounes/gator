import {XMLParser} from 'fast-xml-parser';

export async function fetchRSSFeed(feedURL: string): Promise<RSSFeed> {
    const response = await fetch(feedURL,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/xml',
            'User-Agent': 'gator'
        }
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch RSS feed: ${response.status} ${response.statusText}`);
    }
    const xmlText = await response.text();
    const xmlParser = new XMLParser();
    const parsedXML = xmlParser.parse(xmlText) as RSSFeed;
    const feed = validateRSSFeed(parsedXML);

    const {title, link, description} = feed.channel;
    console.log(`Fetched RSS feed: ${title} (${link}) - ${description}`);
    const items = feed.channel.item;
    console.log(`Found ${items.length} items in the feed.`);
    return feed;
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

    if (!c.description || typeof c.description !== 'string') {
        throw new Error('Invalid RSS feed format: Missing or invalid description element');
    }
    if (!c.title || typeof c.title !== 'string') {
        throw new Error('Invalid RSS feed format: Missing or invalid title element');
    }
    if (!c.link || typeof c.link !== 'string') {
        throw new Error('Invalid RSS feed format: Missing or invalid link element');
    }
    if (!c.item || !Array.isArray(c.item)) {
        throw new Error('Invalid RSS feed format: Missing or invalid item element');
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

        if (!i.title || typeof i.title !== 'string') {
            throw new Error(`Invalid RSS feed format: Missing or invalid title element in item at index ${index}`);
        }
        if (!i.link || typeof i.link !== 'string') {
            throw new Error(`Invalid RSS feed format: Missing or invalid link element in item at index ${index}`);
        }
        if (!i.description || typeof i.description !== 'string') {
            throw new Error(`Invalid RSS feed format: Missing or invalid description element in item at index ${index}`);
        }
        if (!i.pubDate || typeof i.pubDate !== 'string') {
            throw new Error(`Invalid RSS feed format: Missing or invalid pubDate element in item at index ${index}`);
        }
        validItems.push({
            title: i.title,
            link: i.link,
            description: i.description,
            pubDate: i.pubDate
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