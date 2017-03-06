// Created by Akash Gaurav
// on 26 Feb 2017
// akash.gaurav.coder@gmail.com

//This will create random data and insert into the database

// The park has a fixed number of towers.
// Each tower has multiple floors (chosen randomly here).
// Each floor has a fixed number of units.
// Each unit is owned by exactly one company, 
// while one company can own multiple units.


function genRandom(min, max){
	return Math.floor((Math.random()) * (max - min)) + min; 
}


var numOfTowers = 4;
var numOfUnitsPerFloor = 10;






//Populate companies
function company(name){
	this.name = name;
}

var companies = [];

var numOfCompanies = genRandom (75, 100);



for (var cmp = numOfCompanies-1; cmp > 0; cmp--) {

	// insert some companies to hold vacant units
	if(cmp%3==0)  companies.push(new company("vacant"));
	
	else          companies.push(new company("Cp" + cmp));
}
	console.log("\nNum of companies created : " + numOfCompanies);


//Units
function unit(number, owner, floor, tower) {
			this.number = number;
			this.owner = owner;
			this.floor = floor;
			this.tower = tower;
}

var units = [];  //will contain all the units in the park

var floorsInTowers = [];
	

//Populate Towers
for (var tower = 4; tower > 0; tower--) {
	//Each tower can have between 15 to 20 floors
	//Choose a value randomly
	var numOfFloors = genRandom(15, 20);
	floorsInTowers.push(numOfFloors);
	
	console.log("\nChosen " + numOfFloors + " floors for Tower number " + tower);

	for (var floor = numOfFloors; floor > 0; floor--) {
		//console.log("\n  Begin floor " + floor);

		for (var unitNum = numOfUnitsPerFloor; unitNum > 0; unitNum--) {
			var name = (unitNum<10 ? "0" + unitNum : unitNum) + "in"
					  + (floor<10 ? "0" + floor : floor)+ "in"
					  + tower ; 
			
			var owner = companies[genRandom(1, companies.length)];

			units.push(new unit (name, owner, floor, tower));

			// console.log("    Inserted " + name + " owned by " + owner.name);			
			}
	}
}




//Connect to Mongodb and insert these values
var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

var url = 'mongodb://127.0.0.1:27017/TechPark';


MongoClient.connect(url, function(err, db){
	if(err!=null){
		console.error(err);
		return;
	}


	var unitColl = db.collection('Unit');
	var logColl = db.collection('VisitorLog');


	//clear old collections
	var removeDocuments = function(db, callback) {
	  console.log("Clearing old collections...")	
	  unitColl.deleteMany({}, function(err, result) {
	    assert.equal(err, null);
	    });

	  logColl.deleteMany({}, function(err, result) {
	    assert.equal(err, null);
	    });    
	}
	removeDocuments(db);




	
	var insertUnit = function(unit, unitIndex, db, callback){
							unitColl.insertOne(unit, function(err, result){
								assert.equal(null, err);
								assert.equal(1, result.ops.length);
								callback(result.ops[0]._id, unitIndex);
							});
					}//end function insertUnit




	var insertLog = function(j, log, db, callback){
				logColl.insertOne(log, function(error, result){
					assert.equal(null, error);
					console.log("Inserted log " + result.ops[0]._id);
					callback(j, result.ops[0]._id);
				});
	}




	var insertLogs = function(){
			var purpose = ["Business", "WorkHere", "JobInterview", "Casual"];

			var numOfLogs = 5000;
			for(var j=0; j<numOfLogs; j++){
				
				//Abandoning this piece of code 
				// var log = {
				// 	'unit' : {
				// 				'$ref' : 'Unit',
				// 				'$id' : units[genRandom(0, units.length-1)].objectIDinDb
				// 			},
				// 	'purpose' : purpose[genRandom(0, purpose.length)]
				// }

				var log = {
							'purpose' : purpose[genRandom(0, purpose.length)]
				}
				insertLog(j, log, db, function(logCount, insertId){
					
					//first choose a unit randomly
					var unitNumber = units[genRandom(0, units.length)].number;
					

					//now update the unit with this log
					unitColl.update({number:unitNumber}, {$push:{"VisitorLogs": insertId}}, function(err, res){
						assert.equal(null, err);
						console.log(logCount + ". Added log " + insertId + " to " + unitNumber);

						if (logCount==numOfLogs-1) {
							db.close();
							console.log("conn closed");
						}
					})
			})
			}
}//end function InsertLogs




	

	//Insert Units and then Visitor Logs
	for (var i = units.length - 1; i >= 0; i--) {
		//console.log(units[i].objectIDinDb);
		insertUnit(units[i], i, db, function(objID, unitIndex){
										units[unitIndex].objectIDinDb = objID;
										
										//Begin after the query to insert
										//the last unit has been issued
										if(unitIndex==0) {
											insertLogs();					
										}
										
		});
	}//end looping over units

	
	
});//end Mongoclient.connect    

















// function generateLogs(){
// 	MongoClient.connect(url, function(err, db){
// 		if(err!=null){
// 			console.error(err);
// 			return;
// 		}

// 	console.log("Again");
// 	var logColl = db.collection('VisitorLog');
//Insert Visitor logs
	// var insertLog = function(log, db, callback){
	// 			logColl.insertOne(log, function(error, result){
	// 				assert.equal(null, error);
	// 				callback(result);
	// 			});
	// }

	// var purpose = ["Business", "WorkHere", "JobInterview", "Casual"];

	// for(var j=0; j<551; j++){
	// 	var log = {
	// 		'unit' : {
	// 					'$ref' : 'Unit',
	// 					'$id' : units[genRandom(0, units.length-1)].objectIDinDb
	// 				},
	// 		'purpose' : purpose[genRandom(0, purpose.length)]
	// 	}
	// 	console.log(">" +log.unit['$id']);
	// 	insertLog(log, db, function(result){console.log("inserted a log " + result);})
	// }

	
// });
// }