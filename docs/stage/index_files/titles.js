function createTitles(element) {

	for (let level = 1; level <= 6; level++) {
		let sections = document.querySelectorAll(element + ' > section')
		sections.forEach(section => {
			const heading = document.createElement('h' + level)
			heading.innerHTML = section.title
			section.insertBefore(heading, section.firstChild)
		})

		element = element + ' > section'
	}

}

createTitles('article')