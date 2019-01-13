const axios = require('axios')

class BitBucket {
    constructor(key, secret) {
        const options = {
            hostBaseUrl: 'https://instance.atlassian.net',
            sharedSecret: 'LpvN8xdp8dukFTtusGtCUsXKF82a9nQS',
            userKey: 'z2FMqQpWJzHGwJECXQ'
        }

        this.url = `https://bitbucket.org/site/oauth2/authorize?client_id=${options.userKey}&client_secret=${options.sharedSecret}&response_type=code`
    }

    ucitaj(nazivRepSpi, nazivRepVje, cb) {
        cb(true);
    }
}

module.exports = BitBucket