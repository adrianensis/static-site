import IncludeParser from "/static-site/js/include.js";
import Utils from "/static-site/js/utils.js";

document.addEventListener("DOMContentLoaded", function()
{
    Utils.onWebFrameworkConfigReady("/content/config.json", onReady)
});

function onReady(config)
{
    let includeParser = new IncludeParser();
    includeParser.init();

    buildNav(config);

    const event = new CustomEvent("src-ready", {'detail': config});
    document.dispatchEvent(event);
}

function buildNav(config)
{
    let header = document.createElement("header");
    document.body.prepend(header);

    if(config.nav.class != "default")
    {
        header.classList.add(config.nav.class)
    }

    let nav = document.createElement("nav");
    header.appendChild(nav);
    
    for (let i=0; i < config.nav.entries.length; i++)
    {
        let navData = config.nav.entries[i];
        let a = document.createElement("a");
        a.href = navData.url;
        a.innerText = navData.title;
        nav.appendChild(a);
    }
}