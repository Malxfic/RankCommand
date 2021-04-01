const axios = require('axios').default

var cooldown = false

const tmi = require('tmi.js');

const client = new tmi.Client({
  options: { debug: true },
  connection: {
    secure: true,
    reconnect: true
  },
  identity: {
    username: 'twitch_username',
    password: 'twitch_bot_token'
  },
  channels: ['channel_name']
});

client.connect();

client.on('message', (channel, tags, message, self) => {
  // Ignore echoed messages.
  if(self) return;

  var messageArray = message.split(" ");

  var command = messageArray[0].toLowerCase();

  var user = messageArray.splice(1,messageArray.length-1).join("%20");
  if(command === '!rank') {
    if (!cooldown)
    {
      if (user.length > 0) {
          var username = user.split("#")[0];
          var tag = user.split("#")[1];
          var url = `https://dgxfkpkb4zk5c.cloudfront.net/search/affinity/EU/queue/competitive/act/ab57ef51-4e59-da91-cc8d-51a5a2b9b8ff/gameName/${encodeURI(username)}/tagLine/${encodeURI(tag)}`
          axios.get(url)
          .then(function (response) {
            console.log(response.data)
            // handle success
            var playerFound = false;
            for (var i = 0; i < response.data.players.length; i++) {
              var player = response.data.players[i];
              if (player.gameName == username.split("%20").join(" ") && player.tagLine == tag) {
                //console.log(player.competitiveTier)
                //commandText = `I am currently #${player.leaderboardRank} with ${player.rankedRating}RR`
                let rank = "NONE";
                switch (player.competitiveTier) {
                  case 21:
                    rank = "Immortal"
                    break;
                  case 24:
                    rank = "Radiant"
                    break;
                }
                client.say(channel, `${username.split("%20").join(" ")}#${tag} is ${rank} at #${player.leaderboardRank} with ${player.rankedRating}RR`);
                playerFound = true;
              }
            }  
            if (!playerFound) {
              client.say(channel, `${username.split("%20").join(" ")}#${tag}'s rank is currently updating!`);
            }
          })
          .catch(function (error) {
              client.say(channel, `User Not found or not in Immortal/Radiant`);
          });
          
          cooldown = true
          setTimeout(
            () => {
              cooldown = false
            }, 5000
          )
        
      } else {
        var url = `https://dgxfkpkb4zk5c.cloudfront.net/search/affinity/EU/queue/competitive/act/ab57ef51-4e59-da91-cc8d-51a5a2b9b8ff/gameName/RixGG%20Pegsazeus/tagLine/TTV`
        axios.get(url)
        .then(function (response) {
          console.log(response.data)
          // handle success
          var playerFound = false;
          for (var i = 0; i < response.data.players.length; i++) {
            var player = response.data.players[i];
            if (player.gameName == "RixGG Pegsazeus" && player.tagLine == "TTV") {
              //console.log(player.competitiveTier)
              //commandText = `I am currently #${player.leaderboardRank} with ${player.rankedRating}RR`
              let rank = "NONE";
              switch (player.competitiveTier) {
                case 21:
                  rank = "Immortal"
                  break;
                case 24:
                  rank = "Radiant"
                  break;
              }
              client.say(channel, `Rank: ${rank}. I am #${player.leaderboardRank} with ${player.rankedRating}RR`);
              playerFound = true;
            }
          } 
          if (!playerFound) {
            client.say(channel, `My rank is currently updating!`);
          } 
        })
        .catch(function (error) {
            client.say(channel, `User Not found or not in Immortal/Radiant`);
        });
        
        cooldown = true
        setTimeout(
          () => {
            cooldown = false
          }, 5000
        )
      }
      
    }
      
  }
});

