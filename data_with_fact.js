function getEvents(document, event) {
  result = []
  for (let div of document.getElementsByClassName(event)) {
      if(div.getElementsByClassName('event_icon own_goal').length > 0) {
          let time = div.children[0].innerText.trim().split('\n')[0]
          let goal_scorer = div.children[1].children[1].children[0].innerText.trim()
          let fact = div.children[1].children[1].children[1].innerText.split('\n').map(a => a.trim()).reduce((a, b) => a + b)
          result.push([time, goal_scorer, fact])
      }

      if(div.getElementsByClassName('event_icon goal').length > 0) {
          let time = div.children[0].innerText.trim().split('\n')[0]
          let goal_scorer = div.children[1].children[1].children[0].innerText.trim()
          let fact = ''
          if (div.children[1].children[1].children.length > 1)
          fact = div.children[1].children[1].children[1].innerText.split('\n').map(a => a.trim()).reduce((a, b) => a + b)
          result.push([time, goal_scorer, fact])
      }
      if(div.getElementsByClassName('event_icon penalty_goal').length > 0) {
          let time = div.children[0].innerText.trim().split('\n')[0]
          let goal_scorer = div.children[1].children[1].children[0].innerText.trim()
          let fact = ''
          if (div.children[1].children[1].children.length > 1)
          fact = div.children[1].children[1].children[1].innerText.split('\n').map(a => a.trim()).reduce((a, b) => a + b)
          result.push([time, goal_scorer, fact])
      }
  }
  return result
}

function getMatchFacts(document) {
  let home = getEvents(document, 'event a')
  let away = getEvents(document, 'event b')
  return {home: home, away: away}
}

function GetAllGames() {
  div = document.getElementById('sched_ks_3232_1')
  let hrefss = []
  for(let i = 0; i< div.rows.length; i++) {
      if(div.rows[i].cells[12].firstElementChild) {
        let result = [
          div.rows[i].cells[2].innerText,
          div.rows[i].cells[4].innerText,
          div.rows[i].cells[8].innerText,
          div.rows[i].cells[12].firstElementChild.href
        ]
          hrefss.push(result)
      }
  }
  return hrefss
}

async function fetchFromUrl(url) {
  let result = await fetch(url).then(function (response) {
    // The API call was successful!
    return response.text();
  }).then(function (html) {
    // Convert the HTML string into a document object
    var parser = new DOMParser();
    var doc = parser.parseFromString(html, 'text/html');
 
    return getMatchFacts(doc);
  }).catch(function (err) {
    // There was an error
    console.info('Something went wrong.', err);
  });
  return result;
}

async function fetchGame(arr) {
  let game_data = await fetchFromUrl(arr[3])
  let result = []
  for(let game of game_data.home) {
    result.push([arr[0], arr[1], arr[2], game[0], game[1], game[2], arr[1]])
  }
  for(let game of game_data.away) {
    result.push([arr[0], arr[1], arr[2], game[0], game[1], game[2], arr[2]])
  }
  return result
}

promises = []
for (let game of GetAllGames()) {
  promises.push(fetchGame(game))
}

let gg = []
Promise.all(promises).then((values) => {
  console.info(values);
  gg = values;
});
