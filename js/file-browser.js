import Utils from "/static-site/js/utils.js";

export default class FileBrowserBuilder
{
    async buildFileBrowser(pathsJSON, template)
    {
        let fileBrowserElement = document.getElementById('fileBrowser');
        if(fileBrowserElement != null)
        {
            let pathStack = []
            this.buildFileBrowserRecursive(fileBrowserElement, pathsJSON["paths"], pathStack, template);

            let fileBrowserScroll = window.localStorage.getItem("fileBrowser-scrollTop");
            fileBrowserElement.scrollTop = parseInt(fileBrowserScroll, 10);

            fileBrowserElement.addEventListener("scroll", (event) => {
                Utils.setItemLocalStorage("fileBrowser-scrollTop", fileBrowserElement.scrollTop);
            });
        }
    }

    buildFileBrowserRecursive(parent, pathsJSON, pathStack, template)
    {
        const sortedPathsJSON = Object.keys(pathsJSON).sort().reduce(
            (obj, key) => { 
                obj[key] = pathsJSON[key]; 
                return obj;
            }, 
            {}
        );

        for (let root in sortedPathsJSON)
        {
            if(root == 'files')
            {
                this.buildFileBrowserEntries(parent, sortedPathsJSON[root], pathStack, template);
            }
            else
            {
                let details = document.createElement("details");
                let summary = document.createElement("summary");
                
                summary.innerText = root;
                details.appendChild(summary);
                parent.appendChild(details);
            
                pathStack.push(root);

                let path = pathStack.join("::");
                
                details.addEventListener("toggle", (event) => {
                    Utils.setItemLocalStorage("fileBrowser-"+path, event.newState === "open");
                });

                let currentDetailState = localStorage.getItem("fileBrowser-"+path);
                if(currentDetailState === "true")
                {
                    details.toggleAttribute("open");
                }

                this.buildFileBrowserRecursive(details, sortedPathsJSON[root], pathStack, template);
                pathStack.pop();
            }
        }
    }

    buildFileBrowserEntries(parent, pathsJSON, pathStack, template)
    {
        let ul = document.createElement("ul");
        let path = pathStack.length > 0 ? pathStack.join("/") : "";
        for (let i = 0; i < pathsJSON.length; i++)
        {
            let li = document.createElement("li");
            let a = document.createElement("a");
            a.href = template + "?file=" + path + "/" + pathsJSON[i]
            a.innerText = pathsJSON[i];
            li.appendChild(a);
            ul.appendChild(li);
        }

        parent.appendChild(ul);
    }
}