import * as LinkMetadataLib from "/static-site/js/link-metadata.js"
import Utils from "/static-site/js/utils.js";
import ArticleBuilder from "/static-site/js/articles.js";

export class CodeBlockProcessor
{
  constructor(documentBody)
  {
    this.documentBody = documentBody;
  }

  async processCardlink(element) {
      try {
        let url = element.getAttribute('href');

        
        let metadataString = window.localStorage.getItem(url);
        let metadata = JSON.parse(metadataString);
        if(metadata === null)
        {
          let corsURL = Utils.getCORSSafeURL(url);
          fetch(corsURL).then(response => response.text()).
          then(text => 
          {
              const parser = new LinkMetadataLib.LinkMetadataParser(url, text);
              parser.parse().then(metadataObj =>
              {
                let source = jsyaml.dump(metadataObj);
                console.log(source);
                const metadata = this.parseLinkMetadataFromYaml(source);
                console.log(metadata);

                Utils.setItemLocalStorage(url, JSON.stringify(metadata));
                  
                this.generateLinkCardFromMetadata(element, url, metadata);
              });
          }).
          catch(error => {
            console.error('Failed to retrieve cors resource: ' + url); console.error(error);
          });
        }
        else
        {
          this.generateLinkCardFromMetadata(element, url, metadata);
        }
        
      } catch (error) {
        if (error instanceof LinkMetadataLib.NoRequiredParamsError) {
          console.log(error);
        } else if (error instanceof LinkMetadataLib.YamlParseError) {
          console.log(error);
        } else if (error instanceof TypeError) {
          console.log(error);
        } else {
          console.log("Code Block: cardlink unknown error", error);
        }
      }
    }

  generateLinkCardFromMetadata(element, url, metadata)
  {
      console.log(metadata);
      let articleJSON =
      {
          "title": metadata.title,
          // "date": entry.pubDate,
          "description": metadata.description,
          "url": metadata.url,
          "source": metadata.host,
          "imgUrl":metadata.image,
          // "audio":""
      }

      let articleBuilder = new ArticleBuilder();
      articleBuilder.init(articleJSON, "/static-site/templates/article-preview-horiz.html", element.parentElement);
      element.remove();
  } 

  parseLinkMetadataFromYaml(source) {
    let yaml = {};

    let indent = -1;
    source = source
      .split(/\r?\n|\r|\n/g)
      .map((line) =>
        line.replace(/^\t+/g, (tabs) => {
          const n = tabs.length;
          if (indent < 0) {
            indent = n;
          }
          return " ".repeat(n);
        })
      )
      .join("\n");

    try {
      yaml = jsyaml.load(source);
    } catch (error) {
      console.log(error);
      throw new YamlParseError(
        "failed to parse yaml. Check debug console for more detail."
      );
    }

    if (!yaml || !yaml.url || !yaml.title) {
      throw new LinkMetadataLib.NoRequiredParamsError(
        "required params[url, title] are not found."
      );
    }

    let linkMetadata = new LinkMetadataLib.LinkMetadata(
        yaml.url,
        yaml.title,
        yaml.description,
        yaml.host,
        yaml.favicon,
        yaml.image,
        indent
    );

    return linkMetadata;
  }

  getLocalImagePath(link) {
    link = link.slice(2, -2); // remove [[]]
    const imageRelativePath = this.app.metadataCache.getFirstLinkpathDest(
      getLinkpath(link),
      ""
    )?.path;

    if (!imageRelativePath) return link;

    return this.app.vault.adapter.getResourcePath(imageRelativePath);
  }
}

export default class CardsBuilder
{
    constructor(documentBody)
    {
      this.documentBody = documentBody;
    }

    init()
    {
        let cardElements = this.documentBody.getElementsByTagName('a');
        if(!cardElements)
        {
            console.error("'cardlink' element not found!");
            return;
        }
        // NOTE: Protection agains adding more HTMLElements to HTMLCollection while iterating
        const cardElementsArray = Array.prototype.slice.call( cardElements );
        for (let c = 0; c < cardElementsArray.length; c++)
        {
            const element = cardElementsArray[c];
            if(!element.innerText.trimStart().startsWith('http'))
            {
                try
                {
                    let codeBlockProcessor = new CodeBlockProcessor(this.documentBody);
                    codeBlockProcessor.processCardlink(element);
                } 
                catch (error)
                {
                    if (error instanceof LinkMetadataLib.NoRequiredParamsError)
                    {
                      console.log(error);
                    }
                    else if (error instanceof LinkMetadataLib.YamlParseError)
                    {
                      console.log(error);
                    }
                    else if (error instanceof TypeError)
                    {
                        console.log(error);
                    }
                    else
                    {
                        console.log("Code Block: card unknown error", error);
                    }
                }
            }
        }
    }
}