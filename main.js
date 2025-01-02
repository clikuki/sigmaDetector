// Hash and PRNG thanks to:
// https://stackoverflow.com/a/47593316/15169879

const nameInput = document.getElementsByTagName("input")[0];
const confirmBtn = document.getElementById("confirm");
const pointer = document.querySelector(".pointer");
const blacklistInput = document.querySelector("#blacklist textarea");
const whitelistInput = document.querySelector("#whitelist textarea");

function cyrb128(str) {
	let h1 = 1779033703,
		h2 = 3144134277,
		h3 = 1013904242,
		h4 = 2773480762;
	for (let i = 0, k; i < str.length; i++) {
		k = str.charCodeAt(i);
		h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
		h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
		h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
		h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
	}
	h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
	h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
	h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
	h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
	(h1 ^= h2 ^ h3 ^ h4), (h2 ^= h1), (h3 ^= h1), (h4 ^= h1);
	return [h1 >>> 0, h2 >>> 0, h3 >>> 0, h4 >>> 0];
}
function sfc32(a, b, c, d) {
	a |= 0;
	b |= 0;
	c |= 0;
	d |= 0;
	let t = (((a + b) | 0) + d) | 0;
	d = (d + 1) | 0;
	a = b ^ (b >>> 9);
	b = (c + (c << 3)) | 0;
	c = (c << 21) | (c >>> 11);
	c = (c + t) | 0;
	return (t >>> 0) / 4294967296;
}
const seedgen = () => (Math.random() * 2 ** 32) >>> 0;

confirmBtn.addEventListener("click", () => {
	if (!nameInput.value) return;

	confirmBtn.disabled = true;

	const inputVal = nameInput.value.toLowerCase();
	const blacklist = blacklistInput.value.split(",");
	const whitelist = whitelistInput.value.split(",");

	let isSigma;
	if (blacklist.includes(inputVal)) isSigma = false;
	else if (whitelist.includes(inputVal)) isSigma = true;
	else isSigma = sfc32(...cyrb128(inputVal)) > 0.5;

	pointer.className = "pointer spin";
	pointer.addEventListener(
		"animationend",
		() => {
			// console.log("PHASE 1");

			pointer.classList.remove("spin");
			pointer.classList.add(isSigma ? "top" : "bottom");

			pointer.addEventListener(
				"animationend",
				() => {
					// console.log("PHASE 2");
					confirmBtn.disabled = false;
				},
				{ once: true }
			);
		},
		{ once: true }
	);
});
