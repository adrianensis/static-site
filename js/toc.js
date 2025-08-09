
export default class TOCBuilder
{
    init(tocElement)
    {
        this.headers = []

        let self = this;

        function walk (nodes) {
        nodes.forEach((node) => {
            let sub = Array.from(node.childNodes)
            if (sub.length) {
            walk(sub)
            }
            if (/h[1-6]/i.test(node.tagName)) {
            self.headers.push({
                id: node.getAttribute('id'),
                level: parseInt(node.tagName.replace('H', '')),
                title: node.innerText
            })
            }
        })
        }

        walk(Array.from(document.body.childNodes))

        console.dir(this.headers)

        // generate TOC

        function createLink(header) {
            let li = document.createElement('li');
            let a = document.createElement('a');
            a.href = "#"+header.id;
            a.textContent = header.title;
            li.appendChild(a);
            return li;
        }

        let rootUl = document.createElement('ul');
        tocElement.appendChild(rootUl);
        let ul = rootUl;
        let prev = 0;

        this.headers.forEach((header, index) => {
            if (index) {
                prev = self.headers[index - 1]
            }
            if (!index || prev.level === header.level) {
                let li = createLink(header)
                ul.appendChild(li);
            }
            else if (prev.level > header.level) {
                ul = ul.parentElement;
                let li = createLink(header)
                ul.appendChild(li);
            }
            else if (prev.level < header.level) {
                let newUl = document.createElement('ul');
                ul.appendChild(newUl);
                ul = newUl;
                let li = createLink(header)
                ul.appendChild(li);
            }
        })
    }
}