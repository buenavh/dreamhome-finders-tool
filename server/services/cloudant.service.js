'use strict';

var Cloudant = require('cloudant');

var cloudant = new Cloudant({
    url: process.env.CLOUDANT_URL
});

var dbCredentials = {
    dbName: 'user-profiles'
};
var db;

module.exports = {
    getDBCredentialsUrl: function(jsonData) {
        var vcapServices = JSON.parse(jsonData);
        // Pattern match to find the first instance of a Cloudant service in
        // VCAP_SERVICES. If you know your service key, you can access the
        // service credentials directly by using the vcapServices object.
        for (var vcapService in vcapServices) {
            if (vcapService.match(/cloudant/i)) {
                return vcapServices[vcapService][0].credentials.url;
            }
         }
    },  

    initDBConnection: function() {
        if (process.env.VCAP_SERVICES) {
            dbCredentials.url = getDBCredentialsUrl(process.env.VCAP_SERVICES);
        } else { //When running locally, the VCAP_SERVICES will not be set
    
            // When running this app locally you can get your Cloudant credentials
            // from Bluemix (VCAP_SERVICES in "cf env" output or the Environment
            // Variables section for an app in the Bluemix console dashboard).
            // Once you have the credentials, paste them into a file called vcap-local.json.
            // Alternately you could point to a local database here instead of a
            // Bluemix service.
            // url will be in this format: https://username:password@xxxxxxxxx-bluemix.cloudant.com
            //dbCredentials.url = getDBCredentialsUrl(fs.readFileSync("vcap-local.json", "utf-8"));
            dbCredentials.url = process.env.CLOUDANT_URL;
        }

       // check if DB exists if not create
        cloudant.db.create(dbCredentials.dbName, function(err, res) {
        if (err) {
            console.log('Could not create new db: ' + dbCredentials.dbName + ', it might already exist.');
        }
        });

        db = cloudant.use(dbCredentials.dbName);
    },

    getDB: function () {
        var db = cloudant.db.use(process.env.DB_USERS);
        return db;
    },

    getDevInfo: function () {
        var db = cloudant.db.use(process.env.DB_DEVELOPERS_INFO);
        return db;
    }
};