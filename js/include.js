import Utils from "/static-site/js/utils.js";

export default class IncludeParser
{
    init()
    {
        let children = Array.prototype.slice.call(document.body.children);
        for (let index = 0; index < children.length; index++)
        {
            this.processElement(children[index]);
        }
    }

    processElement(element)
    {
        const tag = element.tagName.toLowerCase();
        if(tag == 'include')
        {
            var self = this;
            Utils.fetchHtml(element.attributes.getNamedItem('src').value, {}, function(html, jsonData)
            {
                self.processElement(html.body);

                const children = Array.prototype.slice.call(html.body.children);
                let last = element;
                for (let c=0; c < children.length; c++)
                {
                    const child = children[c];
                    last.after(child);
                    last = child;
                }
            });
        }
        else
        {
            let children = Array.prototype.slice.call(element.children);
            for (let c = 0; c < children.length; c++)
            {
                const child = children[c];
                this.processElement(child);
            }
        }
    }
}