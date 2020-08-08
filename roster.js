function getRoster(document) {
	div = document.getElementById('stats_standard_3232')

	let result = []
	for(let i = 2; i< div.rows.length-1; i++) {
		let name = div.rows[i].cells[0].innerText.trim()
		let pos = div.rows[i].cells[2].innerText.trim().replace(',', ' ')
		let age = div.rows[i].cells[3].innerText.trim()
		result.push([name,pos,age].join(','))
	}
	return result
}

async function fetchFromUrl(url) {
	let result = await fetch(url).then(function (response) {
		// The API call was successful!
		return response.text();
	}).then(function (html) {
		// Convert the HTML string into a document object
		var parser = new DOMParser();
		var doc = parser.parseFromString(html, 'text/html');
 
		return getRoster(doc);
	}).catch(function (err) {
		// There was an error
		console.info('Something went wrong.', err);
	});
	return result;
}

let temp = []
async function getTeamDetails(document) {
	let div = document.getElementById('results32321_overall')
	let result = []
	for(let i = 1; i< div.rows.length; i++) {
		let name = div.rows[i].cells[1].innerText.trim()
		console.info(name)
		let href = div.rows[i].cells[1].children[1].href
		console.info(href)
		let roster = await fetchFromUrl(href)
		roster.forEach(detail => result.push([name, detail].join(',')))
	}
	temp = result
	return result
}
