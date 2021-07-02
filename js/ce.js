function slug(str) {
	str = str.replace(/^\s+|\s+$/g, ''); // trim
	str = str.toLowerCase();

	// remove accents, swap ñ for n, etc
	var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
	var to   = "aaaaeeeeiiiioooouuuunc------";
	for (var i=0, l=from.length ; i<l ; i++) {
		str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
	}

	str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
	.replace(/\s+/g, '-') // collapse whitespace and replace by -
	.replace(/-+/g, '-'); // collapse dashes

	return str;
}

function countParentNodes(node) {
	if (node.parentNode.tagName == "ARTICLE") {
		return 0;
	}

	if (node.parentNode.tagName == "T-B") {
		return 1 + countParentNodes(node.parentNode);
	} else {
		return 0 + countParentNodes(node.parentNode);
	}
}

// Create a class for the element
class TitledBlock extends HTMLElement {
	constructor() {
		// Always call super first in constructor
		super();

		// Create section
		const section = document.createElement('section');
		section.setAttribute('class', 'section');

		const level = countParentNodes(this) + 1;
		let title = this.getAttribute('title');
		if(title) {
			const heading = document.createElement('h' + level);
			//const text = document.createTextNode(this.getAttribute('title'));
			heading.id = slug(title);
			heading.innerHTML = title;

			this.insertBefore(heading, this.firstChild);
		}
	}
}

// Define the new element
customElements.define('t-b', TitledBlock);


class Box extends HTMLElement {
	constructor(string) {
		super();

		this.setAttribute('class', 'box');

		const div = document.createElement('div');
		div.setAttribute('class', 'title');

		const bold = document.createElement('b');
		const text1 = document.createTextNode(string + " : ");
		bold.appendChild(text1);

		const text = document.createTextNode(this.getAttribute('title'));

		div.appendChild(bold);
		div.appendChild(text);

		this.insertBefore(div, this.firstChild);
	}
}

class TheoremBox extends Box {
	constructor() {
		super("Théorème")
	}
}
class DefinitionBox extends Box {
	constructor() {
		super("Définition")
	}
}
class PropositionBox extends Box {
	constructor() {
		super("Proposition")
	}
}
class ExampleBox extends Box {
	constructor() {
		super("Exemple")
	}
}
class ExerciceBox extends Box {
	constructor() {
		super("Exercice")
	}
}
class InfoBox extends Box {
	constructor() {
		super("Information")
	}
}

// Define the new element
customElements.define('theorem-box', TheoremBox);
customElements.define('definition-box', DefinitionBox);
customElements.define('proposition-box', PropositionBox);
customElements.define('example-box', ExampleBox);
customElements.define('exercice-box', ExerciceBox);
// customElements.define('info-box', InfoBox);
