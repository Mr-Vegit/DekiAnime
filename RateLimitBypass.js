const axios = require("axios")
var listString = []
async function getProxySchedule() {
    try {
        const { data } = await axios.get(
            "https://api.proxyscrape.com/v2/?request=displayproxies&protocol=http&timeout=10000&country=vn&ssl=all&anonymity=all")
        return data
    } catch (err) {
        console.log(err)
    }
}

async function proxySchedule() {
    try {
        const result = await getProxySchedule()
        listString = result
        let proxyArray = await listString.trim().split("\r\n")
        return proxyArray
    } catch (err) {
        console.log(err)
    }
}

module.exports = proxySchedule
