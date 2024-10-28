export default async function handler(req, res) {

    if (req.method !== 'GET') {
        res.status(500).json('Non permesso!')
    }

    const fs = require("fs")
    const path = require("path")

    const getAllFiles = function (dirPath, arrayOfFiles) {

        const files = fs.readdirSync(dirPath)

        arrayOfFiles = arrayOfFiles || []

        files.forEach(function (file) {
            if (fs.statSync(dirPath + "/" + file).isDirectory()) {
                arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
            } else {
                arrayOfFiles.push(path.join(dirPath + "/" + file))

            }
        })

        return arrayOfFiles
    }

    const pages = getAllFiles(process.env.DEV_STATUS ? String(process.env.URL_RULES_DEV) : String(process.env.URL_RULES))

    const allowedPage = [];

    pages.map((item) => {
        if (
            (
                item.includes('list.js')
                || item.includes('new.js')
                || item.includes('update.js')
                || item.includes('delete.js')
                || item.includes('switch.js')
            )
            && !item.includes('json')
        ) {
            const tmp = item.replace('api/', '')
                .replace('.output/', '')
                .replace('.next/', '')
                .replace('server/', '')
                .replace('pages', '')
                .replace('.js', '')
                .replace('.html', '');
            allowedPage.push(tmp)
        }
    })

    res.json(allowedPage)
}


