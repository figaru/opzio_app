minifyProjectName = function(project, organization, applyVariation, variationCount){
	//console.log('generating codename with variation: ' + variationCount)
	var codeName = '';
	var duplicate = false;
	if(typeof project === 'string'){
		var projectName = project;
		var newName = project.replace( new RegExp("[-_]","gm")," "); //Remplace symbols by spaces
	}
	else{
		if(project.type === 'personal'){
			codeName = 'PER';
			return {
				codeName: codeName,
				duplicate: false
			}
		}
		//Trim name
		var projectName = project.name;
		var newName = project.name.replace( new RegExp("[-_]","gm")," "); //Remplace symbols by spaces
	}
	
	if(variationCount < 10){
		newName = newName.replace(/[^\w\s]/gim, ''); //Remove all non alpha characters
		newName = newName.replace( new RegExp("[0-9]","g"),"").replace(".",""); //Remove digits and dots


		//Split to words where camelcase
		//Adds a whitespace before each Capital letter, including single words like Word. 
		// )
		newName = newName.replace(/([A-Z](?=[a-z]))/g, ' $1');

		//Convert multiple white spaces to one only
		newName = newName.replace(/\s+/g, " ");

		//Remove leading/trailing whitespaces
		newName = newName.replace(/^\s+|\s+$/g, "");
		newName.trim()
		
		//##########
		//Actual name building
		//##########

		//check if name is smaller or equal to 3
		if(newName.length <= 3){
			//console.log('smaller than 3, no variation')
			if(!applyVariation){
				codeName = newName.toUpperCase();
			}
			else{
				variationCount+=1;
				//console.log('smaller than 3, with variation')
				//Randomize order of indexes (very stupid, but hey..)
				var indexes = [];
				while(indexes.length <= 2){
					var randIndex = Math.floor(Math.random() * (newName.length));
					indexes.push(randIndex);
				}
				//console.log('got '+ indexes.length +' possible indexes')
				var firstLetter = newName[ indexes[0] ];
				var middleLetter = newName[ indexes[1] ];
				var lastLetter = newName[ indexes[2] ];
				//console.log(firstLetter + ' - '+ middleLetter + ' - '+ lastLetter)

				codeName = (''+firstLetter + middleLetter + lastLetter).toUpperCase();
			}
		}
		//Otherwise minify into a code name
		else{
			var splitName = newName.split(' ');
			//console.log(splitName.length)

			if(splitName.length === 1){
				//Check if we want simple of variation
				if(!applyVariation){
					//console.log('1 word, no variation')
					var firstLetter = newName[0];
					var index = Math.floor(Math.round(newName.length / 2));
					//console.log(index)
					var middleLetter = newName[index];
					var lastLetter = newName[newName.length - 1];
					codeName = (''+firstLetter + middleLetter + lastLetter).toUpperCase();
				}
				else{
					//console.log('1 word, with variation')
					variationCount+=1;					
					//Get random index val
					var indexes = [];
					while(indexes.length <= 2){
						var randIndex = Math.floor(Math.random() * (newName.length));
						indexes.push(randIndex);
					}
					//console.log('got '+ indexes.length +' possible indexes')
					var firstLetter = newName[ indexes[0] ];
					var middleLetter = newName[ indexes[1] ];
					var lastLetter = newName[ indexes[2] ];
					//console.log(firstLetter + ' - '+ middleLetter + ' - '+ lastLetter)
					
					codeName = (''+firstLetter + middleLetter + lastLetter).toUpperCase();
				}
			}

			if(splitName.length === 2){
				var firstWord = splitName[0];
				var secondWord = splitName[1];

				if(firstWord.length === 1){
					//console.log('2 words A1, no variation')
					if(secondWord.length > 2){
						var firstLetter = firstWord[0];
						var middleLetter = secondWord[Math.floor(Math.round(secondWord.length / 2))];
						var lastLetter = secondWord[secondWord.length - 1];

						codeName = (''+firstLetter + middleLetter + lastLetter).toUpperCase();	

					}
					else if(secondWord.length === 2){
						//console.log('2 words A2, no variation')
						var firstLetter = firstWord[0];

						codeName = (''+firstLetter + secondWord).toUpperCase();	
					}
					else{
						//console.log('2 words A3, no variation')
						var randNumber = Math.floor(Math.random() * 9);
						codeName = (''+firstWord[0] + secondWord[0] + parseInt(randNumber)).toUpperCase();							
					}
				}

				else if(firstWord.length > 1 && firstWord.length <= 2){

					//Join first word with first letter of second word
					if(!applyVariation){
						//console.log('2 words B1, no variation')
						var lastLetter = splitName[1][0]

						codeName = (''+ firstWord + lastLetter).toUpperCase();	
					}
					else{
						//console.log('2 words B2, no variation')
						variationCount+=1;
						//console.log('2 words B, with variation')
						// var randDivider = Math.floor(Math.random() * secondWord.length);
						// var firstLetter = firstWord[0];
						// var middleLetter = secondWord[Math.floor(Math.round(secondWord.length / randDivider))];
						// var lastLetter = secondWord[secondWord.length];

						var indexes = [];
						while(indexes.length <= 2){
							var randIndex = Math.floor(Math.random() * (newName.length -1));
							indexes.push(randIndex);
						}
						//console.log('got '+ indexes.length +' possible indexes')
						var firstLetter = newName[ indexes[0] ];
						var middleLetter = newName[ indexes[1] ];
						var lastLetter = newName[ indexes[2] ];
						//console.log(firstLetter + ' - '+ middleLetter + ' - '+ lastLetter)

						codeName = (''+firstLetter + middleLetter + lastLetter).toUpperCase();	
					}
				}
				//Get middle letter from first word
				else{
					if(!applyVariation){
						//console.log('2 words C1, no variation')
						var firstLetter = firstWord[0]

						//var randIndex = Math.floor(Math.random() * (newName.length -1))

						var middleLetter = firstWord[Math.floor(Math.round(firstWord.length / firstWord.length) - 1)]
						var lastLetter = secondWord[0]

						codeName = (''+firstLetter + middleLetter + lastLetter).toUpperCase();	
					}
					else{
						//console.log('2 words C2, no variation')
						variationCount+=1;
						var indexes = [];
						while(indexes.length <= 2){
							var randIndex = Math.floor(Math.random() * (newName.length) -1);
							indexes.push(randIndex);
						}
						//console.log('got '+ indexes.length +' possible indexes')
						var firstLetter = newName[ indexes[0] ];
						var middleLetter = newName[ indexes[1] ];
						var lastLetter = newName[ indexes[2] ];
						//console.log(firstLetter + ' - '+ middleLetter + ' - '+ lastLetter)

						codeName = (''+firstLetter + middleLetter + lastLetter).toUpperCase();	
					}
					
				}

			}
			
			if(splitName.length >= 3){

				var firstWord = splitName[0];
				var secondWord = splitName[1];
				var thirdWord = splitName[2];

				if(!applyVariation){
					//console.log('3 words A, no variation')
					var firstLetter = firstWord[0]
					var middleLetter = secondWord[0]
					var lastLetter = thirdWord[0]	
					
					codeName = (''+firstLetter + middleLetter + lastLetter).toUpperCase();
				}
				else{
					variationCount+=1;
					//console.log('3 words A, with variation')
					var firstLetter = firstWord[Math.round(firstWord.length / 2)];
					var middleLetter = firstWord[Math.floor(Math.random() * secondWord.length)];
					var lastLetter = thirdWord[Math.round(thirdWord.length / 2)];	
					
					codeName = (''+firstLetter + middleLetter + lastLetter).toUpperCase();
				}
			}


		}
		
		//Verify code name is not empty
		if(codeName.length <= 0){
			//console.log('Unable to set project name')
			if(!applyVariation){
				codeName = (''+projectName[0] + projectName[1] + projectName[2]).toUpperCase();
			}
			else{
				variationCount+=1;
				codeName = '';
				for(var i = 0; i <= 2; i++){
					var index = Math.floor(Math.random() * newName.length);
					codeName = codeName + newName[index];
				}
				codeName = codeName.toUpperCase();
			}
		}

		//Check for duplicates
		var existingProject = Projects.findOne({
			type: { $exists: false },
			codeName: codeName,
			organization: organization
		});

		if(typeof existingProject !== 'undefined'){
			//console.log('duplicate project ' + newName + '('+ codeName +') with ' + existingProject.name + '('+ existingProject.codeName +')')
			duplicate = true;
		}

		//Remove leading/trailing whitespaces
		codeName = codeName.replace(' ','');
		if(codeName.length != 3){
			//console.log('error on codename for ' + projectName + '('+ codeName +')');
			duplicate = true;
		}

		//Check if by any chance there's a whitespace in the code name
		if(codeName.indexOf(' ') >= 0){
			//console.log('invalid whitespace')
			duplicate = true;
		}
	}
	//Apply random numbers to code name
	else{
		//console.log('set random codeName')
		variationCount+=1;
		codeName = (projectName[0]).toUpperCase();
		for(var i = 0; i < 2; i++){
			var index = Math.floor(Math.random() * 9);
			codeName = codeName + String(index);
		}

		//Check for duplicates
		var existingProject = Projects.findOne({
			type: { $exists: false },
			codeName: codeName,
			organization: organization
		});

		if(typeof existingProject !== 'undefined'){
			//console.log('duplicate project ' + newName + '('+ codeName +') with ' + existingProject.name + '('+ existingProject.codeName +')')
			duplicate = true;
		}

	}
	
	//console.log(projectName + ' -> ' + newName +' -> ' + codeName + '('+ codeName.length +')');

	return {
		codeName: codeName,
		duplicate: duplicate,
		variationCount: variationCount
	}
};