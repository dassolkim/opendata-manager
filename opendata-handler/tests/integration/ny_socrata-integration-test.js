const configInfo = require('../../../config/connectConfig')
const create = require('../../../airbyte-api-module/distribution/create/odl')
const fh = require('../../fileHandler/file-handler')
const path = require('path')
const defaultPath = path.join('C:/Users/kimds/nodeProject', 'data/')

async function main() {

    let csvConnectSource = {
        "url": "https://data.cityofnewyork.us/api/views/wutj-3rsj/rows.csv?accessType=DOWNLOAD",
        "format": "csv",
        "provider": {
            "storage": "HTTPS"
        },
        "dataset_name": "ny_portal_csv_test"
    }

    let csvSourceInfo = {
        defaultUrl: configInfo.defaultUrl,
        connectionConfiguration: csvConnectSource,
        workspaceId: configInfo.workspaceId,
        sourceDefinitionId: configInfo.csvSourceDefinitnionId,
        // name: "us_p1_csv_"
    }
    const destinationInfo = {
        defaultUrl: configInfo.defaultUrl,
        connectionConfiguration: configInfo.connectDestination,
        workspaceId: configInfo.workspaceId,
        destinationDefinitionId: configInfo.destinationDefinitionId,
        exist: true,
        destinationId: "28926fd8-09b0-4311-8bdc-6099d670dfdf" // HPC01 NY_Socrata_destination_1

    }
    const connectionInfo = {
        defaultUrl: configInfo.defaultUrl,
        status: configInfo.status,
        operationId: configInfo.operationId,
        sync: true
    }

    /**
     * dstribution/create test
     */

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
    const name = `ny_p${page}_csv_`

    // distribution name extraction
    const rUrls = fh.readUrls(dataDir, urlInfo)
    const urlObj = JSON.parse(rUrls)
   
    const count = urlObj.info.count
    console.log(`Number of ${format} file in ${publisher} portal catalog page ${urlInfo.page}: ${count}`)
    let i = 0
    while (i < count) {

        const url = urlObj.url[i]

        csvConnectSource.url = url
        csvConnectSource.dataset_name = name + (i + 1)
        csvSourceInfo.name = name + (i + 1)
        
        
        const connection = await create.create(csvSourceInfo, destinationInfo, connectionInfo)
        if (connection == true) {
            console.log("distribution/create succeeded")
        } else {
            console.log("distribution/create failed")
        }
        i++
    }
    // const writeSource = fh.writeSourceIds(sourceList, urlInfo)
    // console.log(writeSource)
}
if (require.main == module) {
    main()
}