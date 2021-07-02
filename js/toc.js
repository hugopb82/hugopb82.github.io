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

function makeListItem(href, text, nocount = false) {
    let link = document.createElement('a');
    link.setAttribute('href', href);
    link.innerHTML = text;

    let temp = document.createElement('li');
    temp.appendChild(link);
	if (nocount) {
		temp.setAttribute('nocount', '');
	}
    return temp;
}

function buildToc(tb) {

	var toc = document.createElement('ol');

	let children = tb.childNodes;
	children.forEach(child => {
		if (child.tagName == "T-B") {
			let text = child.getAttribute('title');
			nocount = child.getAttribute('nocount') == '';
			var item = makeListItem("#" + slug(text), text, nocount);
			item.appendChild(buildToc(child));
			toc.appendChild(item);
		}
	});

	return toc;

}

// Create a class for the element
class TableOfContents extends HTMLElement {
	constructor() {
		super();

		var summary = document.createElement('h2');
		//summary.classList.add("header");
		summary.innerHTML = "Table des matières";
		this.appendChild(summary);
		this.appendChild(buildToc(document.querySelector('t-b')));
	}
}

// Define the new element
customElements.define('t-o-c', TableOfContents);
