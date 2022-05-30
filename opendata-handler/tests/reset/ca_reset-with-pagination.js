const configInfo = require('../../../config/connectConfig')
const remove = require('../../../airbyte-api-module/distribution/remove/odl')

const fh = require('../../fileHandler/file-handler')
const path = require('path')
const defaultPath = path.join('C:/Users/kimds/nodeProject', 'data/')

async function main() {

    /**
     * odl-source/validation logic
     */
    // read urls in file
    const dataDir = defaultPath
    const format = 'csv'
    const publisher = 'CA'
    const page = 1
    const urlInfo = {
        name: 'ca_catalog',
        type: 'url',
        format: format,
        publisher: publisher,
        page: page
    }
    // distribution name extraction
    const lastPage = 319
    let p = page
    let global_cnt = 0
    while (p <= lastPage) {
        urlInfo.page = p
        const rSources = fh.readSourceIds(dataDir, urlInfo)
        if (rSources == false) {
            console.log(`${p} catalogs does not contain ${format} files`)
        } else {
            const sourceObj = JSON.parse(rSources)
            const count = sourceObj.info.count
            console.log(`Number of ${format} file in ${publisher} portal catalog page ${urlInfo.page}: ${count}`)

            let i = 0
            let cnt = 0
            console.time('Time check for CA portal validation')
            while (i < count) {
                const source = sourceObj.sourceList[i]
                if (source != undefined) {
                    // console.log(source)
                    const removeResult = await remove.removeSource(configInfo.defaultUrl, source)
                    if (removeResult == true) {
                        cnt++
                        console.log("odlSource/reset succeeded")
                    } else {
                        console.log("odlSource/reset failed")
                    }
                }
                i++
            }
            console.timeEnd('Time check for CA portal validation')
            fh.removeSourceList(dataDir, urlInfo)
            global_cnt += cnt
            console.log(`reset ${publisher} workspace, #of deleted sources: ${cnt}`)
        }
        p++
    }
    console.log(`reset ${publisher} workspace, #of total deleted sources: ${global_cnt}`)
}
if (require.main == module) {
    main()
}