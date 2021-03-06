module.exports = function(username, callback) {
  const wtj = require('website-to-json');
  const request = require('request');

  request(`https://masterbattlerite.com/profile/${username}/lookup`, function(error, response, body) {
   console.log('Looking for user.');
   var dataobj = JSON.parse(body);

   if (dataobj.status != "error") {

    request(`https://masterbattlerite.com/profile/${dataobj.player.user_id}/update`, function(error, response, body) {
     var updateobj = JSON.parse(body);

     console.log('Checking if user is up to date.');

     if (updateobj.status == "success") {
      console.log('User is not up to date, waiting for masterbattlerite to finish updating.');

      setTimeout(() => {
       request(`https://masterbattlerite.com/profile/update/${updateobj.job}`, function(error, response, body) {
        console.log('Getting data.');
        var jobupdateobj = JSON.parse(body);

        if (jobupdateobj.result == 4) {

         wtj.extractUrl(`https://masterbattlerite.com/profile/${dataobj.player.user_id}`, {
           fields: ['data'],
           parse: function($) {
            return {
             title: $("h1 small").text(),
             name: $("h1").clone().children().remove().end().text().replace('\n', '').replace(/\s/gi, ''),
             avatar: $(".header-box .header-avatar img").attr('src').replace(/(\/\/)/, 'http://'),
             mrv: $(".player-header .header-stats .stat-rating").text().replace(/[^0-9]/gi, ''),
             gr: $(".player-header .header-stats .header-stat:nth-child(2)").text().replace(/[^0-9]/gi, ''),
             win: $(".player-header .header-stats .header-stat:nth-child(3) strong").html().split("<small>-</small>")[0].replace(/[^0-9]/gi, ''),
             loss: $(".player-header .header-stats .header-stat:nth-child(3) strong").html().split("<small>-</small>")[1].replace(/[^0-9]/gi, ''),
             winrate: $(".player-header .header-stats .header-stat:nth-child(4) strong").text().replace('\n', '').replace(/\s/gi, ''),
             solo: {
              rank: $(".data-team-solo .team-badge .badge-title strong").text().replace('\n', ''),
              division: $('.data-team-solo .team-badge .badge-title small:nth-child(2)').clone().children().remove().end().text().replace('\n', '').replace(/(·)/, '').replace(/(Division)/, '').replace(/\s/gi, ''),
              winloserate: $(".data-team-solo .team-badge .badge-title .title-record").clone().children().remove().end().text().replace('\n', '').replace(/(·)/, ''),
              statkills: $(".data-team-solo .team-badge .badge-title .title-record span").clone().children().remove().end().text().replace('\n', '')
             },
             dual: {
              teamname: $(".data-team-2x2 .widget-title small").text().replace('\n', ''),
              rank: $(".data-team-2x2 .team-badge .badge-title strong").text().replace('\n', ''),
              division: $('.data-team-2x2 .team-badge .badge-title small:nth-child(2)').clone().children().remove().end().text().replace('\n', '').replace(/(·)/, '').replace(/(Division)/, '').replace(/\s/gi, ''),
              winloserate: $(".data-team-2x2 .team-badge .badge-title .title-record").clone().children().remove().end().text().replace('\n', '').replace(/(·)/, ''),
              statkills: $(".data-team-2x2 .team-badge .badge-title .title-record span").clone().children().remove().end().text().replace('\n', '')
             },
             standard: {
              teamname: $(".data-team-3x3 .widget-title small").text().replace('\n', ''),
              rank: $(".data-team-3x3 .team-badge .badge-title strong").text().replace('\n', ''),
              division: $('.data-team-3x3 .team-badge .badge-title small:nth-child(2)').clone().children().remove().end().text().replace('\n', '').replace(/(·)/, '').replace(/(Division)/, '').replace(/\s/gi, ''),
              winloserate: $(".data-team-3x3 .team-badge .badge-title .title-record").clone().children().remove().end().text().replace('\n', '').replace(/(·)/, ''),
              statkills: $(".data-team-3x3 .team-badge .badge-title .title-record span").clone().children().remove().end().text().replace('\n', '')
             },
             mostusedchamp: {
              name: $(".data-champion-card:nth-child(1) .card-champion-name strong").text().replace('\n', ''),
              winloserate: $(".data-champion-card:nth-child(1) .card-champion-name .card-games").text().replace('\n', '').replace(/( Wins)/, 'W').replace(/( Losses)/, 'L').replace(/,/, ''),
              xp: $(".data-champion-card:nth-child(1) .card-primary-stats .card-primary-stat:nth-child(1) strong").clone().children().remove().end().text().replace(/[^0-9]/gi, ''),
              level: $(".data-champion-card:nth-child(1) .card-primary-stats .card-primary-stat:nth-child(2) strong").text().replace('\n', ''),
              winrate: $(".data-champion-card:nth-child(1) .card-primary-stats .card-primary-stat:nth-child(3) strong").text().replace('\n', '')
             }

            }
           }
          })
          .then(function(res) {
           console.log("Success.");
           callback(res);
          });

        } else {

         callback('Please, try again in a few seconds.');

        }

       })
      }, 5000)

     } else if (updateobj.status == "error" && updateobj.message == "This player is already up to date.") {
      console.log('User its already up to date');

      wtj.extractUrl(`https://masterbattlerite.com/profile/${dataobj.player.user_id}`, {
        fields: ['data'],
        parse: function($) {
         return {
          title: $("h1 small").text(),
          name: $("h1").clone().children().remove().end().text().replace('\n', '').replace(/\s/gi, ''),
          avatar: $(".header-box .header-avatar img").attr('src').replace(/(\/\/)/, 'http://'),
          mrv: $(".player-header .header-stats .stat-rating").text().replace(/[^0-9]/gi, ''),
          gr: $(".player-header .header-stats .header-stat:nth-child(2)").text().replace(/[^0-9]/gi, ''),
          win: $(".player-header .header-stats .header-stat:nth-child(3) strong").html().split("<small>-</small>")[0].replace(/[^0-9]/gi, ''),
          loss: $(".player-header .header-stats .header-stat:nth-child(3) strong").html().split("<small>-</small>")[1].replace(/[^0-9]/gi, ''),
          winrate: $(".player-header .header-stats .header-stat:nth-child(4) strong").text().replace('\n', '').replace(/\s/gi, ''),
          solo: {
           rank: $(".data-team-solo .team-badge .badge-title strong").text().replace('\n', ''),
           division: $('.data-team-solo .team-badge .badge-title small:nth-child(2)').clone().children().remove().end().text().replace('\n', '').replace(/(·)/, '').replace(/(Division)/, '').replace(/\s/gi, ''),
           winloserate: $(".data-team-solo .team-badge .badge-title .title-record").clone().children().remove().end().text().replace('\n', '').replace(/(·)/, ''),
           statkills: $(".data-team-solo .team-badge .badge-title .title-record span").clone().children().remove().end().text().replace('\n', '')
          },
          dual: {
           teamname: $(".data-team-2x2 .widget-title small").text().replace('\n', ''),
           rank: $(".data-team-2x2 .team-badge .badge-title strong").text().replace('\n', ''),
           division: $('.data-team-2x2 .team-badge .badge-title small:nth-child(2)').clone().children().remove().end().text().replace('\n', '').replace(/(·)/, '').replace(/(Division)/, '').replace(/\s/gi, ''),
           winloserate: $(".data-team-2x2 .team-badge .badge-title .title-record").clone().children().remove().end().text().replace('\n', '').replace(/(·)/, ''),
           statkills: $(".data-team-2x2 .team-badge .badge-title .title-record span").clone().children().remove().end().text().replace('\n', '')
          },
          standard: {
           teamname: $(".data-team-3x3 .widget-title small").text().replace('\n', ''),
           rank: $(".data-team-3x3 .team-badge .badge-title strong").text().replace('\n', ''),
           division: $('.data-team-3x3 .team-badge .badge-title small:nth-child(2)').clone().children().remove().end().text().replace('\n', '').replace(/(·)/, '').replace(/(Division)/, '').replace(/\s/gi, ''),
           winloserate: $(".data-team-3x3 .team-badge .badge-title .title-record").clone().children().remove().end().text().replace('\n', '').replace(/(·)/, ''),
           statkills: $(".data-team-3x3 .team-badge .badge-title .title-record span").clone().children().remove().end().text().replace('\n', '')
          },
          mostusedchamp: {
           name: $(".data-champion-card:nth-child(1) .card-champion-name strong").text().replace('\n', ''),
           winloserate: $(".data-champion-card:nth-child(1) .card-champion-name .card-games").text().replace('\n', '').replace(/( Wins)/, 'W').replace(/( Losses)/, 'L').replace(/,/, ''),
           xp: $(".data-champion-card:nth-child(1) .card-primary-stats .card-primary-stat:nth-child(1) strong").clone().children().remove().end().text().replace(/[^0-9]/gi, ''),
           level: $(".data-champion-card:nth-child(1) .card-primary-stats .card-primary-stat:nth-child(2) strong").text().replace('\n', ''),
           winrate: $(".data-champion-card:nth-child(1) .card-primary-stats .card-primary-stat:nth-child(3) strong").text().replace('\n', '')
          }

         }
        }
       })
       .then(function(res) {
        //console.log(res);
        callback(res);
       });
     } else {
      console.log(body);
      callback('Whoops... Something went wrong.')
     }

    });

   } else {
    callback('Error: player not found');
   }

  });

 } //module.exports
