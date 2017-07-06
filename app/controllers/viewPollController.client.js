
'use strict';

(function () {

var voteUrl = appUrl + '/api/:id/votes';
var pollUrl = appUrl + '/api/:id/poll'
var pollId = document.getElementById('pollObject').getAttribute('value');
var voteCountView = document.querySelector('#voteCount');

function updateVotes() {
        
        var urlWithQuery = pollUrl + '?pollId=' + pollId;
        ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', urlWithQuery, function(data){

            // loop through options in data and update UI
            var pollObject = JSON.parse(data);
            
            AmCharts.makeChart( "chartdiv", {
              "type": "serial",
              "dataProvider": pollObject.optionsInPoll,
              "categoryField": "text",
              "graphs": [ {
                "valueField": "voteCount",
                "type": "column"
              } ]
            } );
        }));     
}

updateVotes();

function getTemplate(name) {
    
  return $.get('/'+name).then(function(src) { // TODO: update get path
     return Handlebars.compile(src);
  });
}

$('#submitVote').click(function(){
    
    var urlWithQuery = voteUrl + $('#options').val();
    ajaxFunctions.ready(ajaxFunctions.ajaxRequest('POST', urlWithQuery, function(){
        updateVotes();
        // Hide vote elements
        $('#voting-options').hide();
    }));
})

})();