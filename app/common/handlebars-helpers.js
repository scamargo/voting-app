'use strict'

var handlebarsHelpers = {
    getTemplate: function getTemplate (name) {
        return $.get('/'+name).then(function(src) {
            return Handlebars.compile(src);
        });
    }
};