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

function getScorersFromDiv(a) {
	return a.innerText.split('\n').map(a => a.trim()).filter(a => a).map(a => a.split('·')).map(a => [a[0].trim(), parseInt(a[1].replace('’', ''))])
}
 
function getScorers(document) {
	let [home, away] = document.querySelectorAll('#content .scorebox > .event');
	return {home: getScorersFromDiv(home), away:getScorersFromDiv(away)}
}
  
async function fetchFromUrl(url) {
	let result = await fetch(url).then(function (response) {
		// The API call was successful!
		return response.text();
	}).then(function (html) {
		// Convert the HTML string into a document object
		var parser = new DOMParser();
		var doc = parser.parseFromString(html, 'text/html');
 
		return getScorers(doc);
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
		result.push([arr[0], arr[1], arr[2], game[0], game[1], arr[1]])
	}
	for(let game of game_data.away) {
		result.push([arr[0], arr[1], arr[2], game[0], game[1], arr[2]])
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
