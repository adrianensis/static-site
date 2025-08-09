# static-site

static-site is a static site generator.

## folders and files

- **samples**: Sample of user content.
- **scripts**: User scripts. You can use `scripts/build.sh` for custom build commands. Will execute after `./static-site/scripts/build.sh` commands.
- **js and css**: Framework code.
- **templates**: Template HTML files.
- **port**: Default serving port.
- **generated**: Config files created by the framework itself.

## usage

1. Copy `static-site` in your project root folder.
2. Create an `index.html` file in your root folder.
3. Create a `content` folder in your root folder.
   1. Create a `config.json` file inside `content` with custom config.
   2. Optionally. Create a `port` file inside `content` with custom port.

4. Run `./static-site/scripts/build.sh` to build site, it will create json files in `generated` folder. (It's required for built-in features like RSS Browser and File Browser...) If you are on Linux you can use the `scripts/user/build.dekstop` launcher, to build without typing the command.
5. Now you can host your project in a http server!

### config.json

In `samples/sample_config.json` you'll find the main configurations. Example:

```
{
    "nav":
    {
        "class": "default",
        "entries":
        [
           {
                "title": "Home",
                "url": "/"
            },
            {
                "title": "Notes",
                "url": "/content/pages/notes/notes.html"
            },
            {
                "title": "RSS",
                "url": "/content/pages/rss/rss.html"
            }
        ]
    }
}
```

## local-server

Run `./static-site/scripts/run.sh` to run the site locally.

If you are on Linux you can use the `scripts/usr/run.dekstop` launcher, to run without typing the command.

## sample apps

Take a look to my RSS app based on `static-site`: [https://github.com/adrianensis/rss](https://github.com/adrianensis/rss)