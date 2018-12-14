module.exports.checkBranch = branch => {
	if (branch == 'en') { return true } else if (branch == 'ru') { return true } else if (branch == 'ko') { return true } else if (branch == 'ja') { return true } else if (branch == 'fr') { return true } else if (branch == 'th') { return true } else if (branch == 'pl') { return true } else if (branch == 'de') { return true } else if (branch == 'cn') { return true } else if (branch == 'it') { return true } else if (branch == 'int') { return true } else { return false }
};

module.exports.checkTitle = (title, altTitle) => {
	if (altTitle === null) {
		return title;
	} else {
		return altTitle;
	}
};

module.exports.checkVotes = votes => {
	if (votes < 0) {
		return votes;
	} else if (votes === null) {
		return '0';
	} else {
		return '+' + votes;
	}
};

module.exports.checkAuthors = (status, authors) => {
	console.log(status)
	console.log(authors)
	if (status === "Translation") {
		return '**Traducido por:** ' + page['authors'][0]['user'];
	} else if (page['status'] === "Original") {
		if (authors.lenght == 1) {
			return '**Creado por:** ' + page['authors'][0]['user'];
		} else {
			let st_o = [];
			let st_re = [];

			for (var i = 0; i < authors.length; i++) {
				if (authors[i]['role'] == 'Author') {
					st_o.push(authors[i]['user']);
				} else if (authors[i]['role'] == 'Rewrite author') {
					st_re.push(authors[i]['user']);
				}
			};

			if (st_re.length == 0) {
				let msg = '';

				for (var i = 0; i < st_o.length; i++) { 
					if (i < (st_o.length - 1)) { msg += st_o[i] + ', ';} 
					else { msg += st_o[i]; }
				};

				return '**Creado por:** ' + msg
			} else {
				let msg_o = '';
				let msg_re = '';

				for (var i = 0; i < st_o.length; i++) { 
					if (i < (st_o.length - 1)) { 
						msg_o += st_o[i] + ', ';
					} 
					else { 
						msg_o += st_o[i] + ' (Autor/@s)'; 
					}
				};
				for (var i = 0; i < st_re.length; i++) { 
					if (i < (st_re.length - 1)) { 
						msg_re += st_re[i] + ', ';
					} 
					else { 
						msg_re += st_re[i] + ' (Reescritor/@s)'; 
					}
				};

				return '**Creado por:** ' + msg_o + ' :left_right_arrow:  ' + msg_re
			};
		};
	};
};