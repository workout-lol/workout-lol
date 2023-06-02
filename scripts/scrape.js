const { Scraper, Root, DownloadContent, OpenLinks, CollectContent } = require('nodejs-web-scraper');
const fs = require('fs');

(async () => {

    const config = {
        baseSiteUrl: `https://musclewiki.com/directory`,
        startUrl: `https://musclewiki.com/directory`,
        concurrency: 10,//Maximum concurrent jobs. More than 10 is not recommended.Default is 3.
        maxRetries: 3,//The scraper will try to repeat a failed request few times(excluding 404). Default is 5.
        logPath: './logs/', //Highly recommended: Creates a friendly JSON for each operation object, with all the relevant data.
        timeout: 60000,
    }

    const scraper = new Scraper(config);

    const root = new Root();

    const linkSelector = '.wikitable .clickablecell a'

    const testArticle = new OpenLinks(linkSelector, { name: 'article' } )
    root.addOperation(testArticle)

    const title = new CollectContent('h1 span:nth-child(2)', { name: 'title' });
    const steps = new CollectContent('.steps-list li', { name: 'steps' });
    const category = new CollectContent('table[title="Exercise Matrix"] tbody tr:nth-child(1) td:last-child', { name: 'category' });
    const difficulty = new CollectContent('table[title="Exercise Matrix"] tbody tr:nth-child(2) td:last-child', { name: 'difficulty' });
    const targets = new CollectContent('table[title="Muscles  Targeted"] tbody tr td:last-child', { name: 'targets' });
    const video = new DownloadContent('.exercise-images-grid video', { name: 'video', filePath:'./videos' });

    testArticle.addOperation(title)
    testArticle.addOperation(steps)
    testArticle.addOperation(category)
    testArticle.addOperation(difficulty)
    testArticle.addOperation(targets)
    testArticle.addOperation(video)

    await scraper.scrape(root);

    // // try catch!
    const allArticles = testArticle.getData()

    for (let a of allArticles) {
      console.log(a.data)
    }

    const formattedData = []
    for (let a of allArticles) {
      try {
        const title = a.data.find(e => e.name === 'title').data[0]
        const steps = a.data.find(e => e.name === 'steps').data
        const category = a.data.find(e => e.name === 'category').data[0]
        const difficulty = a.data.find(e => e.name === 'difficulty').data[0]
        const targets = a.data.find(e => e.name === 'targets').data
        const videos = a.data.find(e => e.name === 'video').data[0]

        formattedData.push({
          title,
          steps,
          category,
          difficulty,
          targets,
          videos,
        })
        console.log('ok', title)
      } catch (e) {
        console.log('error on', a)
      }
    }

    fs.writeFileSync('./data.json', JSON.stringify(formattedData), () => { })
})();