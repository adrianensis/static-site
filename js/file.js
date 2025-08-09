import Utils from "/static-site/js/utils.js";
import FileBrowserBuilder from "/static-site/js/file-browser.js";
import CardsBuilder from "/static-site/js/cards.js";
import TOCBuilder from "/static-site/js/toc.js";

Utils.onWebFrameworkReady(function(config)
{
    let fileBuilder = new FileBuilder();
    fileBuilder.init(config);
});

export default class FileBuilder
{
    init(config)
    {
        let urlObject = URL.parse(window.location);
    
        if(urlObject.searchParams.has("file"))
        {
            let filePath = urlObject.searchParams.get("file");
            console.log(urlObject);
            
            let self = this;
            console.warn(window.origin+"/"+config.content+"/"+filePath);
            
            Utils.fetchURL(window.origin+"/"+config.content+"/"+filePath, {}, function(text, jsonData)
            {
                let mainBlock = document.getElementsByTagName('main')[0];
                let div = document.createElement('div');
                mainBlock.appendChild(div);

                if(filePath.endsWith(".md"))
                {
                    self.handleMarkdown(text, div);
                }
                else
                {
                    console.warn("Unhandled filetype: " + filePath);
                }
            });
        }

        let fileBrowserElement = document.getElementById('fileBrowser');
        if(fileBrowserElement != null)
        {
            Utils.onWebFrameworkConfigReady("/content/paths.json", (json) =>
            {
                let fileBrowserBuilder = new FileBrowserBuilder();
                fileBrowserBuilder.buildFileBrowser(json, "/static-site/templates/file.html");
            });
        }
    }

    handleMarkdown(text, fileElement)
    {
        if(typeof showdown !== 'undefined')
        {
            let converter = new showdown.Converter({
                simplifiedAutoLink: true,
                tables: true,
                tasklists: true,
                emoji: true,
                metadata: true,
            });

            fileElement.innerHTML = converter.makeHtml(text);
    
            let cardsBuilder = new CardsBuilder(fileElement);
            cardsBuilder.init();

            let tocBuilder = new TOCBuilder();
            tocBuilder.init(document.getElementById('toc'));
            tocBuilder.init(document.getElementById('toc-mobile'));
        }
        else
        {
            console.error("No markdown lib found!");
        }
    }
}
