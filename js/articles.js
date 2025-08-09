import Utils from "/static-site/js/utils.js";

export default class ArticleBuilder
{
    init(articleJSON, templateURL, parentElement)
    {
        Utils.fetchHtml(templateURL, articleJSON, function(html, jsonData)
        {
            let articleData = jsonData;
            console.log("CREATING ARTICLE");
            console.log(articleData);
            let urlObject = new URL(articleData.url);

            let aCollection = html.body.getElementsByTagName('a')
            let title = html.getElementById('title')
            
            let description = html.getElementById('description');
            if(description !== null)
            {
                if(articleData.hasOwnProperty('description'))
                {
                    description.innerText = articleData.description;
                }
            }

            aCollection[0].getAttributeNode("href").value = articleData.url
            aCollection[1].getAttributeNode("href").value = articleData.url
            title.innerText = articleData.title

            let img = html.getElementById("img");
            if(articleData.hasOwnProperty("imgUrl"))
            {
                img.setAttribute("src", articleData.imgUrl);
            }

            if(articleData.hasOwnProperty("date"))
            {
                let date = html.getElementById("date");
                let currentDate = new Date(articleData.date);
                let nowDate = new Date(Date.now());
                
                var hours =((nowDate.getTime() - currentDate.getTime()) / 1000) / (60 * 60);
                let timeDiff = Math.abs(Math.round(hours));
                let timeDiffUnit = "h"

                if(timeDiff === 0)
                {
                    timeDiff = Math.abs(Math.round(hours * 60));
                    timeDiffUnit = "min"
                }
                else if(timeDiff >= 24)
                {
                    timeDiff /= 24;
                    timeDiff = Math.abs(Math.round(timeDiff));
                    timeDiffUnit = "d"

                    if(timeDiff >= 7)
                    {
                        timeDiff /= 7;
                        timeDiff = Math.abs(Math.round(timeDiff));
                        timeDiffUnit = "w"

                        if(timeDiff >= 4)
                        {
                            timeDiff /= 4;
                            timeDiff = Math.abs(Math.round(timeDiff));
                            timeDiffUnit = "m"

                            if(timeDiff >= 12)
                            {
                                timeDiff /= 12;
                                timeDiff = Math.abs(Math.round(timeDiff));
                                timeDiffUnit = "y"
                            }
                        }
                    }
                }

                date.innerText = timeDiff + timeDiffUnit + " ago " + "[" + currentDate.toLocaleDateString('es-UK') + " " + currentDate.toLocaleTimeString('es-UK') + "]";
            }

            if(articleData.hasOwnProperty("source"))
            {
                // let urlObject = new URL(articleData.url);

                // let source = html.getElementById("source");
                // source.innerText = (urlObject.host).replace(/(www\.)/g, '');

                let source = html.getElementById("source");
                source.innerText = articleData.source;
            }

            let childParsed = Array.prototype.slice.call(html.body.children)[0];
            let clone = childParsed.cloneNode(true);
            parentElement.appendChild(clone);

            let origin = urlObject.origin;
            let iconLinkLocalStorage = window.localStorage.getItem("icon-"+origin);
            if(iconLinkLocalStorage === null)
            {
                console.log("Fetching Icon: " + origin);
                Utils.fetchIcon(origin, (iconLink) => 
                {
                    Utils.setItemLocalStorage("icon-"+origin, iconLink);
                    console.log("Icon fetch: " + iconLink);
                    console.log(clone);
                    
                    let icon = clone.querySelector("#icon");
                    icon.setAttribute("src", iconLink);
                });
            }
            else
            {
                let icon = clone.querySelector("#icon");
                icon.setAttribute("src", iconLinkLocalStorage);
            }
        });
    }
}