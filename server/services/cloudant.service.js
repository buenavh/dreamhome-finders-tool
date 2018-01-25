'use strict';

var Cloudant = require('cloudant');

var cloudant = new Cloudant({
    url: process.env.CLOUDANT_URL
});

module.exports = {
    getDB: function () {
        var db = cloudant.db.use(process.env.DB_USERS);
        return db;
    },

    getDevInfo: function () {
        var db = cloudant.db.use(process.env.DB_DEVELOPERS_INFO);
        return db;
    }
};