const Branches = {
	"es": "scp-es",
	"en": "scp-wiki",
	"ru": "scpfoundation.ru",
	"ko": "ko.scp-wiki.net",
	"ja": "ja.scp-wiki.net",
	"fr": "fondationscp",
	"th": "scp-th",
	"pl": "scp-wiki.net.pl",
	"de": "scp-wiki-de",
	"cn": "scp-wiki-cn",
	"it": "fondazionescp",
	"int": "scp-int",
}

module.exports.checkBranch = branch => {
	var isNotSpanish = false;
	for(let key in Branches) {
		if(key == branch) {
			isNotSpanish = true;
		}
	}
	return isNotSpanish;
};

module.exports.urlBranch = branch => {
	return (Branches[branch]) ? Branches[branch] : false; 
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

				return `**Creado por:** ${msg_o} :left_right_arrow: ${msg_re}`;
			};
		};
	};
};

module.exports.checkSiteColor = (site) => {
	const branchAndColors = {"en": "848484", "ru": "df0101", "ko": "ff0080", 
							"ja": "effbfb", "fr": "0040ff", "th": "0b0b61", 
							"pl": "be03fc", "de": "ff8000", "cn": "3b0b17", 
							"it": "01df01", "int": "2efef7", "es": "ffff00"};
	var color;
  
	for(var x in branchAndColors) {
		if(x == site) {
			color = `0x${branchAndColors[x]}`;
		}
	}

	return color;
}
