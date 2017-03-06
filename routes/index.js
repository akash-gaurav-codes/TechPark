var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index')
});


router.get('/initial', function(req, res, next) {
 //connect to MongoDB
  var MongoClient = require('mongodb').MongoClient,
        assert = require('assert');

  var url = 'mongodb://127.0.0.1:27017/TechPark';

  MongoClient.connect(url, function(err, db){
                                if(err!=null){
                                       console.error(err);
                                       return;
                                }
                                
                                console.log("Connected to db for initial query.");
                                     
                                
                                var runQuery = function(db, callback) {
										  
										  var collection = db.collection('Unit');
										  
										  collection.find().toArray(function(err, docs) {
										    assert.equal(err, null);
										    callback(docs);
										  });      
										}

								runQuery(db, function(docs){
															db.close();
															console.log('Connection closed.');
															res.send(docs);
														});															
                       });//end mongo connect


});//end route



router.get('/query', function(req, res, next) {
  var index = req.param('index');
  console.log('Got query : ' + index);
  
  var out = {};

  //connect to MongoDB
  var MongoClient = require('mongodb').MongoClient,
        assert = require('assert');

  var url = 'mongodb://127.0.0.1:27017/TechPark';

  MongoClient.connect(url, function(err, db){
                                if(err!=null){
                                       console.error(err);
                                       return;
                                }
                                
                                console.log("Connected to db.");
                                  

                                if(index==1){
                                	var findUnits = function(db, callback){
                                					db.collection('Unit').find({owner:{name:'vacant'}},{number:1, _id:0}).toArray(function(err, docs) {
																							    assert.equal(err, null);
																							    //console.log(docs);
																							    callback(docs);
																							  });   
	                                }//end function findUnits	


									findUnits(db, function(docs){
														    out['units'] = docs;
														    out['result'] = docs;  //to display on Response section
															db.close();
															console.log('Connection closed.');
															res.send(out);
														});											  
										  }// end case index=1

								
								else if(index==2){
									var findUnits = function(db, out){
														var owners = out['result'].map(function(el){return el.name;});
														console.log(owners);
														db.collection('Unit').find({"owner.name":{$in:owners}}).toArray(function(err, docs) {
																									    assert.equal(err, null);
																									    db.close();
																									    console.log(docs);
																										console.log('Connection closed.');
																										out['units'] = docs;
																										res.send(out);								
																				  });   
                              										}//end findUnits

                                     
									var findDocuments = function(db, callback) {
										  							db.collection('Unit').aggregate([ 
																							{$group:{_id : "$owner.name", count:{$sum:1}}}, 
																							{$match:{_id:{$nin:["vacant"]}}},
																							{$sort:{count:-1}},
																							{$limit:10},
																							{$project:{_id:0, name : "$_id", "Number of units":"$count"}}
																				]).toArray(function(err, docs) {
																								    assert.equal(err, null);
																								    callback(docs);
																								  });   
																				}//end findDocuments


									findDocuments(db, function(docs){
																	out['result'] = docs;
																	console.log(out);
																	findUnits(db, out);
																	});
								  }//end case index=2  

								
								else if(index==3){
									                                     
									var findDocuments = function(db, callback) {
										  
																		db.collection('Unit').aggregate([
																						{$group:{
																							_id:{tower:"$tower", owner:"$owner.name"}, 
																							unitsOfOwnerInTower:{$sum:1}
																							}
																						},
																						{$match:{'_id.owner':{$nin:["vacant"]}}},
																						{$group:{_id:{"Tower number":'$_id.tower'}, ownersInTower:{$sum:1}, unitsInTower:{$sum:'$unitsOfOwnerInTower'}, "Average num of units per Company" : {$avg:"$unitsOfOwnerInTower"}}}	
																					]).toArray(function(err, docs) {
																						    assert.equal(err, null);
																						    db.close();
																							console.log('Connection closed.');
																							out['units'] = [];
																							out['result'] = docs;
																							res.send(out);
																						  });   
																		}//end findDocuments

																				
									findDocuments(db, function(docs){
																	out['result'] = docs;
																	findUnits(db, out);
																	});
								  }//end case index=3  

								
								else if(index==4){
									var findUnits = function(db, out){
														var filter = out['result'].map(function (elem){return {'tower':elem.tower, 'Biggest Owner':elem['Biggest Owner']}})
														db.collection('Unit').find({
															$or:[
																{"owner.name":filter[0]['Biggest Owner'], tower:filter[0]['tower']}, 
																{"owner.name":filter[1]['Biggest Owner'], tower:filter[1]['tower']},
																{"owner.name":filter[2]['Biggest Owner'], tower:filter[2]['tower']},
																{"owner.name":filter[3]['Biggest Owner'], tower:filter[3]['tower']}
																]
														}).toArray(function(err, docs) {
																		    assert.equal(err, null);
																		    db.close();
																			console.log('Connection closed.');
																			out['units'] = docs;
																			res.send(out);								
																				  });   
                              										}//end findUnits

                                     
									var findDocuments = function(db, callback) {
										  										db.collection('Unit').aggregate([
																							{$group:{_id:{tower:"$tower", owner:"$owner.name"}, count:{$sum:1}}},
																							{$match:{'_id.owner':{$nin:["vacant"]}}},
																							{$sort:{count:-1}},
																							{$group:{_id:"$_id.tower", unitsInTower:{$sum:1}, biggestOwner:{$first:"$_id.owner"}, unitsOwned:{$first:'$count'}}},
																							{$sort:{_id:1}},
																							{$project:{_id:0, tower: "$_id", "Total units in tower":'$unitsInTower', "Biggest Owner":'$biggestOwner', "Units owned by them": '$unitsOwned'}},
																							{$sort:{tower:1}}
																						]).toArray(function(err, docs) {
																								    assert.equal(err, null);
																								    console.log(docs);
																								    callback(docs);
																								  });   
																				}//end findDocuments

																				
									findDocuments(db, function(docs){
																	out['result'] = docs;
																	findUnits(db, out);
																	});
								  }//end case index=4


								else if(index==5){
									var findDocuments = function(db, callback) {
										  										db.collection('VisitorLog').aggregate([
																								{$group:{_id:'$purpose', count:{$sum:1}}},
																								{$sort:{count:-1}}
																								]).toArray(function(err, docs) {
																								    assert.equal(err, null);
																								    console.log(docs);
																								    callback(docs);
																								  });   
																				}//end findDocuments

																				
									findDocuments(db, function(docs){
																	out['result'] = docs;
																	db.close();
																	console.log('Connection closed.');
																	out['units'] = [];
																	res.send(out);
																	});
								  }//end case index=5


								else if(index==6){
									var findUnits = function(db, out){
														var owners = out['result'].map(function(el){return el['_id']});
														console.log('owners:' + owners);
														db.collection('Unit').find({"owner.name":{$in:owners}}).toArray(function(err, docs) {
																									    assert.equal(err, null);
																									    db.close();
																										console.log(docs);
																										console.log('Connection closed.');
																										out['units'] = docs;
																										res.send(out);								
																				  });   
                              										}//end findUnits

                                     
									var findDocuments = function(db, callback) {
						  										db.collection('Unit').aggregate([
																		{$match:{'VisitorLogs':{$exists:true}}},
																		{$group:{_id:"$owner.name", visitCount:{$sum:{$size:'$VisitorLogs'}}}},
																		{$sort:{visitCount:-1}},
																		{$limit:10}
																	]).toArray(function(err, docs) {
																				    assert.equal(err, null);
																				    callback(docs);
																				  });   
																}//end findDocuments

																				
									findDocuments(db, function(docs){
																	out['result'] = docs;
																	console.log(out);
																	findUnits(db, out);
																	});
								  }//end case index=6


								else if(index==7){
									                                     
									var findDocuments = function(db, callback) {
										  										db.collection('Unit').aggregate([
																						{$match:{'VisitorLogs':{$gt:[]}}},
																						{$group:{_id:"$tower", visitCount:{$sum:{$size:'$VisitorLogs'}}}},
																						{$sort:{visitCount:-1}},
																						{$limit:10},
																						{$project:{"Tower num" : "$_id", "Visit Count":"$visitCount", _id:0}}
																					]).toArray(function(err, docs) {
																								    assert.equal(err, null);
																								    //console.log(docs);
																								    callback(docs);
																								  });   
																				}//end findDocuments

																				
									findDocuments(db, function(docs){
																	out['result'] = docs;
																	db.close();
																	console.log('Connection closed.');
																	out['units'] = [];
																	res.send(out);
																	});
								  }//end case index=7


								else if(index==8){
									                                    
									var findDocuments = function(db, callback) {
						  										db.collection('Unit').aggregate([
																	{$match:{'VisitorLogs':{$gt:[]}}},
																	{$group:{_id:"$number", visitCount:{$sum:{$size:'$VisitorLogs'}}}},
																	{$project:{'number':"$_id", 'visitCount':"$visitCount"}},
																	{$sort:{visitCount:-1}},
																	{$limit:10}
																]).toArray(function(err, docs) {
																				    assert.equal(err, null);
																				    //console.log(docs);
																				    callback(docs);
																				  });   
																}//end findDocuments

																				
									findDocuments(db, function(docs){
																	out['result'] = docs;
																	db.close();
																	console.log('Connection closed.');
																	out['units'] = docs;
																	res.send(out);
																	});
								  }//end case index=8


								else if(index==9){
									var findDocuments = function(db, callback) {
										  										db.collection('Unit').aggregate([
																					{$match:{"owner.name":"vacant"}},
																					{$unwind : "$VisitorLogs"},
																					{$lookup:{from:"VisitorLog", localField:"VisitorLogs", foreignField:"_id", as:"log"}},
																					{$group:{_id:"$log.purpose", count:{$sum:1}}},
																					{$sort:{count:-1}}	
																				]).toArray(function(err, docs) {
																								    assert.equal(err, null);
																								    //console.log(docs);
																								    callback(docs);
																								  });   
																				}//end findDocuments

																				
									findDocuments(db, function(docs){
																	out['result'] = docs;
																	db.close();
																	console.log('Connection closed.');
																	out['units'] = [];
																	res.send(out);
																	});
								  }//end case index=9


								else if(index==10){
                                     
									var findDocuments = function(db, callback) {
										  										db.collection('Unit').aggregate([
																							{$match:{'VisitorLogs':{$gt:[]}}},
																							{$unwind:'$VisitorLogs'},
																							{$lookup:{from:"VisitorLog", localField:"VisitorLogs", foreignField:"_id", as:"log"}},
																							{$group:{_id:{number:"$number", purpose:"$log.purpose"}, count:{$sum:1}}},
																							{$sort:{count:-1}},
																							{$group:{_id:"$_id.purpose", number:{$first:"$_id.number"}, visits:{$first:"$count"}}},
																							{$limit:10}
																						]).toArray(function(err, docs) {
																								    assert.equal(err, null);
																								    //console.log(docs);
																								    callback(docs);
																								  });   
																				}//end findDocuments

																				
									findDocuments(db, function(docs){
																	out['result'] = docs;
																	db.close();
																	console.log('Connection closed.');
																	out['units'] = docs;
																	res.send(out);
																	});
								  }//end case index=10


                                															
                       });//end mongo connect




  
});//end route

module.exports = router;
