const configInfo = require('../../../config/connectConfig')
const remove = require('../../../airbyte-api-module/distribution/remove/odl')

const fh = require('../../fileHandler/file-handler')
const path = require('path')
const defaultPath = path.join('C:/Users/kimds/nodeProject', 'data/')

async function main() {


    /**
     * dstribution/create test
     */

    // read urls in file
    const dataDir = defaultPath
    const format = 'csv'
    const publisher = 'Socrata'
    const page = 1
    const urlInfo = {
        name: 'ny_catalog',
        type: 'url',
        format: format,
        publisher: publisher,
        page: page
    }
    const sourceInfo = {
        defulatUrl: configInfo.defaultUrl
    }
    const name = `ny_p${page}_csv_`
    // distribution name extraction
    const rSources = fh.readSourceIds(dataDir, urlInfo)
    const sourceObj = JSON.parse(rSources)
    const count = sourceObj.info.count
    console.log(`Number of ${format} file in ${publisher} portal catalog page ${urlInfo.page}: ${count}`)
    let i = 1
    
    while (i <= count) {
        const source = sourceObj.sourceList[i]
        console.log(source)
        const removeResult = await remove.removeSource(sourceInfo, source)
        if (removeResult == true) {
            console.log("odlSource/reset succeeded")
        } else {
            console.log("odlSource/reset failed")
        }
        i++
    }
}
if (require.main == module) {
    main()
}