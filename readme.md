# URL word counter in Node

## What it Does

The script will accept two parameters. One URL and another a list of words. It will crawl the page in the URL and print how many times the given words are present on the page.

For example, if the script is written in node.js, then it will run like <br />`npm run dev -- --url=https://anatta.io --words=Sustainable,Growth,Anatta`


And the output for the same is going to be:<br />
```sh
Sustainable: 12
Growth: 6
Anatta: 17
```
## How to run

Install the dependencies and devDependencies and start the server.

```sh
npm install
npm run dev -- --url=https://anatta.io --words=Sustainable,Growth,Anatta
```
