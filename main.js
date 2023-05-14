let round = {}
const numoftries = 7
let isgameplaying = false
let notusedprompts = []
function checkanswer() {
	let correctletters = 0
	for (let i = 0; i < round.currentstring.length; i++) {
		let currentelement = round.characters[`${round.currenttry - 1}-${i}`] //This characters html div.
		if (currentelement) {
			currentelement.style.backgroundColor = "grey"
			if (round.currentprompt[0].toUpperCase().includes(round.currentstring.charAt(i))) {
				currentelement.style.backgroundColor = "yellow"
			}
			if (round.currentstring.charAt(i) == round.currentprompt[0].charAt(i).toUpperCase()) {
				currentelement.style.backgroundColor = "green"
				correctletters++
			}
		}
	}
	if (correctletters == round.currentprompt[0].length) {
		let wintext
		switch(round.currenttry) {
			case 1: wintext = "First try!"; break
			case 2: wintext = "Second try!"; break
			case 3: wintext = "Third time's the charm!"; break
			case 4: wintext = "Only 4 tries!"; break
			case 5: wintext = "I mean you won, which is good..."; break
			case 6: wintext = "2 more tries and you would've failed..."; break
			case 7: wintext = "That was close!"; break
			default: wintext = "You won!"; break
		}
		document.getElementById("win-screen-text").innerText = wintext
		document.getElementById("win-screen-prompt").innerText = round.currentprompt[0]
		document.getElementById("win-screen").style.display = "block"
		document.getElementById("results").appendChild(document.getElementById("guesses").cloneNode(true))
		isgameplaying = false
	} else {
		if (round.currenttry == numoftries) {
			document.getElementById("win-screen-text").innerText = "You lost. Try again?"
			document.getElementById("win-screen-prompt").innerText = round.currentprompt[0]
			document.getElementById("win-screen").style.display = "block"
			document.getElementById("results").appendChild(document.getElementById("guesses").cloneNode(true))
			isgameplaying = false
		} else {
			round.currentcharacter = 1
			round.currenttry++
			round.currentstring = ""
		}
	}
}
function restart() {
	document.getElementById("guesses").innerText = ""
	document.getElementById("results").innerText = ""
	document.getElementById("win-screen").style.display = "none"
	round = {}
	startround()
}
function keyboardhandler(event) {
	const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
	let key = event.key.toUpperCase()
	if (alphabet.includes(key) && isgameplaying) {
		if (round.currentcharacter != round.currentprompt[0].length + 1) { //Check if we haven't reached the end yet
			let currentelement = round.characters[`${round.currenttry - 1}-${round.currentcharacter - 1}`] //This characters html div.
			if (currentelement) { //Probably needs more error handling...
			round.currentstring += key
				if (round.currentprompt[0].charAt(round.currentcharacter) == " ") {
					round.currentcharacter++ //For when we hit a space
					round.currentstring += " "
				}
				currentelement.innerText = key
				
			}
			round.currentcharacter++
		}
	} else if (key == "BACKSPACE" && round.currentcharacter != 1 && isgameplaying) {
		round.currentcharacter -= 1
		if (round.currentprompt[0].charAt(round.currentcharacter - 1) == " ") {
			round.currentcharacter-- //For when we hit a space.
			round.currentstring = round.currentstring.slice(0, -1)
		}
		let currentelement = round.characters[`${round.currenttry - 1}-${round.currentcharacter - 1}`]
		if (currentelement) {
			currentelement.innerText = ""
			round.currentstring = round.currentstring.slice(0, -1)
		}
	} else if (key == "ENTER" && round.currentcharacter == round.currentprompt[0].length + 1 && isgameplaying) {
		checkanswer()
	}
}
function startround() {
	isgameplaying = true
	round.characters = {}
	round.currenttry = 1 //1-based indexing
	round.currentcharacter = 1 //same
	if (Object.entries(notusedprompts).length == 0) {
		notusedprompts = JSON.parse(JSON.stringify(prompts))
	}
	round.prompts = Object.entries(notusedprompts)
	round.currentprompt = round.prompts[Math.floor(Math.random() * round.prompts.length)]
	delete notusedprompts[round.currentprompt[0]]
	round.currentstring = ""
	document.getElementById("image-view").src = round.currentprompt[1]
	for (let y = 0; y < numoftries; y++) {
		let row = document.createElement("div")
		row.classList.add("guess-row")
		document.getElementById("guesses").appendChild(row);
		for (let x = 0; x < round.currentprompt[0].length; x++) {
			let characterelement = document.createElement("div")
			characterelement.classList.add("character")
			round.characters[`${y}-${x}`] = characterelement //Add element to round directory for easy access
			if (round.currentprompt[0].charAt(x) == " ") {
				characterelement.innerText = "�"
			}
			row.appendChild(characterelement)
		}
	}
}
function startgame() {
	console.log("%cGet outa here!", "background: black; color: white; font-size: 500%")
	console.log("%cYou're not a real hacker!", "background: black; color: green; font-size: 350%")
	console.log("%cOh, iM sO cOoL bY bEiNg In ChRoMe DeVtOoLs!!!11", "background: black; color: red; font-size: 200%")
	console.log("%cNo, no you're not. So get out of here!", "background: black; color: blue; font-size: 200%")
	console.log("hello fellow chrome devtools / source code inspector! I'm just a happy little script with ABSOLUTELY nothing special in it.")
	console.log("Also if you're trying to look at my source code, save yourself some time and look at the github page for it.")
	notusedprompts = JSON.parse(JSON.stringify(prompts))
	startround()
	document.addEventListener("keydown", keyboardhandler)
}