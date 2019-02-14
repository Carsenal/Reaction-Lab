

class Screen{
  set sideWidth(w){
    document.getElementById("leftCover").setAttribute("style", "width: " + w + "%");
    document.getElementById("rightCover").setAttribute("style", "width: " + w + "%");
  }
}
class Reaction{
  constructor(c, t){
    this.correct = c;
    this.time = t;
  }
  get tCorrect(){
    return this.correct;
  }
  get tTime(){
    return this.time;
  }
}
class Subject{
  constructor(){
    this.name = prompt("Please enter your name", "subject name");
    this.reactions = [];
  }
  react(c, t){
    this.reactions.push(new Reaction(c,t));
    console.log(this.reactions);
  }
  get csv(){
    var response = [this.name];
    for(var r in this.reactions){
      response.push(r.tCorrect);
      response.push(r.tTime);
    }
    console.log(response);
    return response;
  }
  save(){
    var qParams = {
      spreadsheetId: '1uEJWCHcjNaiXkBF8qgcAJugXAu3LVYF8noNDTGtWoIk',
      range: 'RAW!A1:L1',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS'
    };
    var qBody = {
      "values": [this.csv]
    };

    var request = gapi.client.sheets.spreadsheets.values.append(qParams, qBody);
    request.then(function(response) {
      console.log(response.result);
      alert("thank you, data synched");
    }, function(reason) {
      console.error('error: ' + reason.result.error.message);
    });
  }
}
var user;
function init(){
  var s = new Screen();
  s.sideWidth = 2;
  //gapi.auth2.getAuthInstance().signIn();

  user = new Subject();
  user.react(true, 100);
  user.react(false, 2);
  user.react(true, 600);
  user.save(0);
}

function initClient() {
  var API_KEY = 'AIzaSyBLa2eD2JVht2y85qLFF2yyiF0WlQNYUlM';  // TODO: Update placeholder with desired API key.
  var CLIENT_ID = '810383360174-97u7h1nnfcek0gtd0orujn3ero0netp7.apps.googleusercontent.com';  // TODO: Update placeholder with desired client ID.
  var SCOPE = 'https://www.googleapis.com/auth/spreadsheets';
  gapi.client.init({
    'apiKey': API_KEY,
    'clientId': CLIENT_ID,
    'scope': SCOPE,
    'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
  }).then(function() {
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);
        updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      });
    }

    function handleClientLoad() {
      gapi.load('client:auth2', initClient);
    }

    function updateSignInStatus(isSignedIn) {
      if (isSignedIn) {
        user.save();
      }
    }

    function handleSignInClick(event) {
      gapi.auth2.getAuthInstance().signIn();
    }

    function handleSignOutClick(event) {
      gapi.auth2.getAuthInstance().signOut();
    }
