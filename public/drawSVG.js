var colorTower      = "#000000";
var colorUnitVacant = "#212121";
var colorUnitOwned  = "#00E676";
var colorUnitQueryResult  = "#FFFF00";


	



function drawInitial(unitsInDB, numOfTowers, floorsInTowers, numOfUnitsPerFloor){
	var screenHeight = 500;
	var screenWidth  = 800;

	var towerPadding = 20;
	var unitPadding  = 5;

	

	var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

	var svgNS = svg.namespaceURI;

	

	
	//create the towers
	var towerWidth = (screenWidth - (towerPadding*(numOfTowers+1)))/4;
		//console.log(" +++floorsInTower " + floorsInTowers);
	
	for (var i = numOfTowers; i > 0; i--) {
			//console.log((i) + " floorsInTower " + floorsInTowers[4-i]);
		var towerHeight = screenHeight * (floorsInTowers[4-i]/25);
		
		var towerX = (i*towerPadding) + (i-1)*towerWidth;
		var towerY = (screenHeight - towerHeight);
		
		 	//console.log("\ntower height : " + towerHeight);
			//console.log("tower y : " + towerY);
		
		var rect = document.createElementNS(svgNS,'rect');
	    rect.setAttribute('x',towerX);
	    rect.setAttribute('y',towerY);
	    rect.setAttribute('width',towerWidth);
	    rect.setAttribute('height',towerHeight);
	    rect.setAttribute('fill',colorTower);
	    svg.appendChild(rect);		
	}





	//draw the units
		
	var unitHeight = (screenHeight - 26*unitPadding)/25;

	for (var i = unitsInDB.length - 1; i >=0; i--) {
		
		var unitNum  = Number(unitsInDB[i]['number'].split('in')[0]);
		var floorNum = Number(unitsInDB[i]['number'].split('in')[1]);
		var towerNum = Number(unitsInDB[i]['number'].split('in')[2]);
		
			
		var unitWidth = (towerWidth - (numOfUnitsPerFloor+1)*unitPadding)/numOfUnitsPerFloor;
		
			
		var unitX = towerNum*towerPadding + (towerNum-1)*towerWidth
				   +unitNum*unitPadding + (unitNum-1)*unitWidth;

		var unitY = floorNum*unitHeight + floorNum*unitPadding;
		unitY = screenHeight - unitY;
	
				
		var fill = (unitsInDB[i].owner.name=='vacant') ? colorUnitVacant : colorUnitOwned;
	    
	    var rect = document.createElementNS(svgNS,'rect');
	    rect.setAttribute('x',unitX);
	    rect.setAttribute('y',unitY);
	    rect.setAttribute('width',unitWidth);
	    rect.setAttribute('height',unitHeight);
	    rect.setAttribute('fill',fill);
	    rect.setAttribute('id',unitsInDB[i]['number']);
	    svg.appendChild(rect);
	}
	    document.getElementById('asvg').appendChild(svg);

}	


	
var highlightedUnits = [];

function highlightUnits(unitsArray){
	
	//loop through the highlighted units and remove their highlight
	var max = highlightedUnits.length;
	for (var p=0; p<max; p++){
		var unit = highlightedUnits.pop();
		var id = unit.id;
		var color = unit.oldColor;
		$('#' + id).css({fill:color});	
		}

	//loop through the new to-be-highlighted-units array containing unit numbers
	//for each element, locate that unit in the svg using its id
	//highlight it
	//add it to highlightedUnits
	var max = unitsArray.length;
	for (var p=0; p<max; p++){
		var id = unitsArray.pop();
		var oldColor = $('#' + id).attr('fill');
		$('#' + id).css({fill:colorUnitQueryResult});	
		highlightedUnits.push({id, oldColor});
		}
}
