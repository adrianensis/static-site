export class LinkMetadata
{
    constructor(url,title,description,host,favicon,image,indent)
    {
        this.url = url;
        this.title = title;
        this.description = description;
        this.host = host;
        this.favicon = favicon;
        this.image = image;
        this.indent = indent;
    }
}

export class YamlParseError extends Error {}
export class NoRequiredParamsError extends Error {}

export class LinkMetadataRegex
{
    static urlRegex =
    /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})$/i;
    static lineRegex =
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
    static linkRegex =
    /^\[([^[\]]*)\]\((https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})\)$/i;
    static linkLineRegex =
    /\[([^[\]]*)\]\((https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})\)/gi;
    static imageRegex = /\.(gif|jpe?g|tiff?|png|webp|bmp|tga|psd|ai)$/i;
}

export class CheckIf
{
  static isUrl(text)
  {
    const regex = new RegExp(LinkMetadataRegex.urlRegex);
    return regex.test(text);
  }

  static isImage(text)
  {
    const regex = new RegExp(LinkMetadataRegex.imageRegex);
    return regex.test(text);
  }

  static isLinkedUrl(text)
  {
    const regex = new RegExp(LinkMetadataRegex.linkRegex);
    return regex.test(text);
  }
}

export class LinkMetadataParser
{
    constructor(url, htmlText)
    {
        this.url = url;

        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(htmlText, "text/html");
        this.htmlDoc = htmlDoc;
    }

    async parse()
    {
        let title = this.getTitle()
        ?.replace(/\r\n|\n|\r/g, "")
        .replace(/\\/g, "\\\\")
        // .replace(/"/g, '\\"')
        .trim();
        if (!title) 
        {
            title = this.url;
        };

        const description = this.getDescription()
        ?.replace(/\r\n|\n|\r/g, "")
        .replace(/\\/g, "\\\\")
        // .replace(/"/g, '\\"')
        .trim();
        const { hostname } = new URL(this.url);
        const favicon = await this.getFavicon();
        const image = await this.getImage();

        let linkMetadata = new LinkMetadata(
            this.url,
            title,
            description,
            hostname,
            favicon,
            image,
            0,
        );

        return linkMetadata;
    }

    getTitle()
    {
        try {
            const ogTitle = this.htmlDoc
            .querySelector("meta[property='og:title']")
            ?.getAttribute("content");
            if (ogTitle) return ogTitle;

            const title = this.htmlDoc.querySelector("title")?.textContent;
            if (title) return title;   
        } catch (error) {
            console.error(error);
        }

        return null;
    }

    getDescription()
    {
        try {
            const ogDescription = this.htmlDoc
            .querySelector("meta[property='og:description']")
            ?.getAttribute("content");
            if (ogDescription) return ogDescription;

            const metaDescription = this.htmlDoc
            .querySelector("meta[name='description']")
            ?.getAttribute("content");
            if (metaDescription) return metaDescription;
        } catch (error) {
            console.error(error);
        }

        return null;
    }

    async getFavicon()
    {
        const favicon = this.htmlDoc
        .querySelector("link[rel='icon']")
        ?.getAttribute("href");
        if (favicon) return await this.fixImageUrl(favicon);
    }

    async getImage()
    {
        const ogImage = this.htmlDoc
        .querySelector("meta[property='og:image']")
        ?.getAttribute("content");
        if (ogImage) return await this.fixImageUrl(ogImage);
    }

    async fixImageUrl(url)
    {
        if (url === undefined) return "";
        const { hostname } = new URL(this.url);
        let image = url;
        // check if image url use double protocol
        if (url && url.startsWith("//")) {
        //   check if url can access via https or http
        const testUrlHttps = `https:${url}`;
        const testUrlHttp = `http:${url}`;
        if (await checkUrlAccessibility(testUrlHttps)) {
            image = testUrlHttps;
        } else if (await checkUrlAccessibility(testUrlHttp)) {
            image = testUrlHttp;
        }
        } else if (url && url.startsWith("/") && hostname) {
        //   check if image url is relative path
        const testUrlHttps = `https://${hostname}${url}`;
        const testUrlHttp = `http://${hostname}${url}`;
        const resUrlHttps = await checkUrlAccessibility(testUrlHttps);
        const resUrlHttp = await checkUrlAccessibility(testUrlHttp);
        //   check if url can access via https or http
        if (resUrlHttps) {
            image = testUrlHttps;
        } else if (resUrlHttp) {
            image = testUrlHttp;
        }
        }

        // check if url is accessible via image element
        async function checkUrlAccessibility(url)
        {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
        }

        return image;
    }
}

export default{
  LinkMetadata,
  LinkMetadataParser,
  LinkMetadataRegex,
  YamlParseError,
  NoRequiredParamsError,
}