export default class Utils
{
    static config = null;
    static hostConfig = null;

    static fetchURL(url, jsonData, callback, fetchOptions)
    {
        fetch(url, fetchOptions).then(response => response.text()).
        then(text => callback(text, jsonData)).
        catch(error => {console.error('Failed to load file: ' + url); console.error(error);});
    }

    static fetchIcon(url, callback, fetchOptions)
    {
        let safeURL = url;
        if(Utils.isLocalHost())
        {
            safeURL = Utils.getCORSSafeURL(url);
        }
        Utils.fetchHtml(safeURL, {}, function(html, jsonData)
        {
            let links = html.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]');
            if(links.length > 0)
            {
                let iconLink = links[0].href;
                let urlObject = new URL(iconLink);
                
                if(iconLink.startsWith("http://localhost"))
                {
                    iconLink = url + urlObject.pathname;
                }

                callback(iconLink)
            }
        });
    }

    static fetchHtml(url, jsonData, callback, fetchOptions)
    {
        Utils.fetchURL(url, jsonData, function(text, jsonData)
        {
            let parser = new DOMParser();
            let html = parser.parseFromString(text, "text/html");
            callback(html, jsonData)
        });
    }

    static fetchXml(url, jsonData, callback, fetchOptions)
    {
        Utils.fetchURL(url, jsonData, function(text, jsonData)
        {
            let parser = new DOMParser();
            let xml = parser.parseFromString(text, 'text/xml');
            callback(xml, jsonData)
        });
    }

    static fetchJSON(url, callback, fetchOptions)
    {
        Utils.fetchURL(url, {}, function(text, jsonData)
        {
            let json = JSON.parse(text)
            callback(json)
        });
    }

    static onWebFrameworkConfigReady(configJSONPath, callback)
    {
        Utils.fetchJSON(configJSONPath, function(json)
        {
            Utils.config = json;
            Utils.fetchJSON("/static-site/generated/host.json", function(hostJSON)
            {
                Utils.hostConfig = hostJSON;
                callback(json);
            });
        });
    }

    static onWebFrameworkReady(callback)
    {
        // Listen for the event.
        document.addEventListener("src-ready", function(event)
        {
            callback(event.detail);
        });
    }

    static getCORSSafeURL(url)
    {
        let corsProxy = ''
        if(Utils.isLocalHost())
        {
            if(document.location.hostname == 'localhost')
            {
                corsProxy = "http://localhost:"+Utils.hostConfig.port+"/corsproxy?";
            }
            else
            {
                corsProxy = "http://"+Utils.hostConfig.ip+":"+Utils.hostConfig.port+"/corsproxy?";
            }
        }

        return corsProxy+url;
    }

    static isLocalHost()
    {
        return document.location.hostname == 'localhost' || location.hostname === "127.0.0.1" || location.hostname.startsWith("192.168.1.");
    }

    static setItemLocalStorage(key, item)
    {
        try {
            window.localStorage.setItem(key, item);
        } catch (error) {
            console.log('Local Storage is complete! Clearing 1/4.');
            for (let i = 0; i < window.localStorage.length / 4; i++)
            {
                window.localStorage.removeItemItem(window.localStorage.key(i));
            }

            window.localStorage.setItem(key, item);
        }
    }
}