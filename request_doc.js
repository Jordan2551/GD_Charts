
function makeApiCall() {
  var params = {
    // The ID of the spreadsheet to retrieve data from.
    spreadsheetId: '1Rpyk7_PsVpkzpoIoHPAhv7zJusFBDdyPTf7cNt1brpw',  // TODO: Update placeholder value.

    // The A1 notation of the values to retrieve.
    range: 'A1:B100',  // TODO: Update placeholder value.
  };

  var request = gapi.client.sheets.spreadsheets.values.get(params);
  request.then(function(response) {

    var table = JSON.parse(response.body).values;

    for (var i = 1; i < table.length; i++) {
      $("#dataTable tbody").append('<tr></tr>');
      for (var j = 0; j < table[i].length; j++) {
        $("#dataTable tr:last").append('<td>'+table[i][j]+'</td>');
      }
    }


    //DATA AND LABELS
    labels = [];
    data = [];

    for (var i = 1; i < table.length; i++) {
      labels.push(table[i][0]);
    }
    for (var i = 1; i < table.length; i++) {
      data.push(table[i][1]);
    }
    /////////////////

    //CREATE THE CHART
    //Params: chartType, labels, chartData
    createChart('radar', labels, data);
    //////////////////

    console.log(response.result);
  }, function(reason) {
    console.error('error: ' + reason.result.error.message);
  });
}

function initClient() {

  var API_KEY = 'AIzaSyD_SY71U0uPyi4a2OSgxdgqy9IT4jDpDWk';
  var CLIENT_ID = '194613176088-uja1rfkdu5mo1g6s8rrhljteoga8077c.apps.googleusercontent.com';  // TODO: Update placeholder with desired client ID.

  // TODO: Authorize using one of the following scopes:
  //   'https://www.googleapis.com/auth/drive'
  //   'https://www.googleapis.com/auth/drive.file'
  //   'https://www.googleapis.com/auth/drive.readonly'
  //   'https://www.googleapis.com/auth/spreadsheets'
  //   'https://www.googleapis.com/auth/spreadsheets.readonly'
  var SCOPE = 'https://www.googleapis.com/auth/drive.readonly';

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
    makeApiCall();
  }
}

function handleSignInClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

function handleSignOutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}
