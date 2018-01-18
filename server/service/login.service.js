'use strict';

var bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {
    generateHash: function (password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(saltRounds), null);
    },

    validatePassword: function (password, hash) {
        return bcrypt.compareSync(password, hash);
    },

    validateEmail: function (email) {
        email = email.trim().toLowerCase();
        var pattern = /^[a-zA-Z0-9_.+-]+@(?:(?:[a-zA-Z0-9-]+\.)?[a-zA-Z]+\.)?(dhfi)\.com$/g;
        return pattern.test(email);
    }
};
