let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["stick"];

const weapons = [
	{
		name: "Stick",
		power: 5
	},
	{
		name: "Dagger",
		power: 30
	},
	{
		name: "Claw hammer",
		power: 50
	},
	{
		name: "Sword",
		power: 100
	},
];

const monsters = [
	{
		name: "slime",
		level: 2,
		health: 15
	},
	{
		name: "fanged beast",
		level: 8,
		health: 60
	},
	{
		name: "dragon",
		level: 20,
		health: 300
	},
];

const locations = [
	{
		name: "town square",
		"button text": ["Go to store", "Go to cave", "Fight dragon"],
		"button functions": [goStore, goCave, fightDragon],
		text: "You are in the town square. You see a sign that says \"Store\"."
	},
	{
		name: "Store",
		"button text": ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go to town square"],
		"button functions": [buyHealth, buyWeapon, goTown],
		text: "You enter the store."
	},
	{
		name: "Cave",
		"button text": ["Fight sime", "Fight fang beast", "Go to town square"],
		"button functions": [fightSlime, fightBeast, goTown],
		text: "You enter the cave. You see some monsters."
	},
	{
		name: "Fight",
		"button text": ["Attack", "Dodge", "Run"],
		"button functions": [attack, dodge, goTown],
		text: "You are fighting a monster."
	},
	{
		name: "Kill monsters",
		"button text": ["Go to town square", "Go to town square", "Go to town square"],
		"button functions": [goTown, goTown, easterEgg],
		text: 'Monster scream "Arg!" as it dies.\nYou gain experience points find gold.'
	},
	{
		name: "Lose",
		"button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
		"button functions": [restart, restart, restart],
		text: "You die. 💀"
	},
	{
		name: "Win",
		"button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
		"button functions": [restart, restart, restart],
		text: "You defeat the dragon!\nYOU WIN THE GAME! 🎉"
	},
	{
		name: "Easter Egg",
		"button text": ["2", "8", "Go to town square?"],
		"button functions": [pickTwo, pickEight, goTown],
		text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!"
	},
];

const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterNameText = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");

// initialize buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(location) {
	monsterStats.style.display = "none";
	button1.innerText = location["button text"][0];
	button2.innerText = location["button text"][1];
	button3.innerText = location["button text"][2];

	button1.onclick = location["button functions"][0];
	button2.onclick = location["button functions"][1];
	button3.onclick = location["button functions"][2];

	text.innerText = location.text;
}

function goTown() {
	update(locations[0]);
}

function goStore() {
	update(locations[1]);
}

function goCave() {
	update(locations[2]);
}

function buyHealth() {
	if (gold >= 10) {
		gold -= 10;
		health += 10;
		goldText.innerText = gold;
		healthText.innerText = health;
	} else {
		text.innerText = "You do not have enough gold to buy health.";
	}
}

function buyWeapon() {
	if (currentWeapon < weapons.length - 1) {
		if (gold >= 30) {
			gold -= 30;
			currentWeapon++;
			goldText.innerText = gold;
			let newWeapon = weapons[currentWeapon].name;
			text.innerText = "You now have a " + newWeapon + ".";
			inventory.push(newWeapon);
			text.innerText += "\nIn your inventory you have: " + inventory;
		} else {
			text.innerText = "You do not have enough gold to buy a weapon.";
		}
	} else {
		text.innerText = "You already have the most powerful weapon!";
		button2.innerText = "Sell weapon for 15 gold";
		button2.onclick = sellWeapon;
	}
}

function sellWeapon() {
	if (inventory.length > 1) {
		gold += 50;
		goldText.innerText = gold;
		let currentWeapon = inventory.shift();
		text.innerText = "You sold a " + currentWeapon + ".";
		text.innerText += "\nIn your inventory you have: " + inventory;
	} else {
		text.innerText = "Don't sell your only weapon!";
	}
}

function defeatMonster() {
	gold += Math.floor(monsters[fighting].level * 6.7);
	xp += monsters[fighting].level;
	goldText.innerText = gold;
	xpText.innerText = xp;
	update(locations[4]);
}

function goFight() {
	update(locations[3]);
	monsterHealth = monsters[fighting].health;
	monsterStats.style.display = "block";
	monsterNameText.innerText = monsters[fighting].name;
	monsterHealthText.innerText = monsterHealth;
}

function fightSlime() {
	fighting = 0;
	goFight();
}

function fightBeast() {
	fighting = 1;
	goFight();
}

function fightDragon() {
	fighting = 2;
	goFight();
}

function attack() {
	text.innerText = "You attack " + monsters[fighting].name +" with your " + weapons[currentWeapon].name + ".";

	if (hitMonster()) {
		let monsterHit = getPlayerAttackValue();
		monsterHealth -= monsterHit;
		text.innerText += ("\nYou deals " + monsterHit + " damage to " + monsters[fighting].name + ".");
	} else {
		text.innerText += "\nYou miss.";
	}

	text.innerText += "\n\nThe " + monsters[fighting].name + " attacks.\n";
	let monsterHit = getMonsterAttackValue();
	health -= monsterHit;
	text.innerText += monsters[fighting].name + " deals " + monsterHit + " damage to you.";
	healthText.innerText = health;
	monsterHealthText.innerText = monsterHealth;
	if (health <= 0) {
		lose();
	} else if (monsterHealth <= 0) {
		monsters[fighting].name === "dragon" ? winGame() : defeatMonster();
	}

	if (Math.random() <= 0.1 && inventory.length != 1) {
		text.innerText += "\nYour " + inventory.pop() + " breaks.";
		currentWeapon--;
	}
}

function getPlayerAttackValue() {
	return weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
}

function getMonsterAttackValue() {
	let monsterHit = (monsters[fighting].level * 5) - (Math.floor(Math.random() * xp));
	return monsterHit >= 0 ? monsterHit : 0;
}

function hitMonster() {
	let missRate = 0.2;
	return Math.random() > missRate || health < 20;
}

function dodge() {
	text.innerText = "You dodged the attack from " + monsters[fighting].name + "."; 
}

function lose() {
	update(locations[5]);
}

function winGame() {
	update(locations[6]);
}

function restart() {
	xp = 0;
	health = 100;
	gold = 50;
	currentWeapon = 0;
	inventory = ["stick"];
	goldText.innerText = gold;
	healthText.innerText = health;
	xpText.innerText = xp;
	goTown();
}

function easterEgg() {
	update(locations[7]);
}

function pickTwo() {
	pick(2);
}

function pickEight() {
	pick(8);
}

function pick(guess) {
	let numbers = [];
	while (numbers.length < 10) {
		numbers.push(Math.floor(Math.random() * 11));
	}

	text.innerText = "You picked " + guess + ". Here are the random numbers:\n";

	for (let i = 0; i < 10; i++) {
		text.innerText += numbers[i] + "\n";
	}

	if (numbers.indexOf(guess) !== -1) {
		text.innerText += "Right! You win 20 gold!";
		gold += 20;
		goldText.innerText = gold;
	} else {
		text.innerText = "Wrong! You lose 10 health!";
		health -= 10;
		healthText.innerText = health;
		if (health <= 0) {
			lose();
		}
	}
}