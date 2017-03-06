
// Raw queries for Mongo shell


// 1. List of units that are vacant
// units.find({owner:{name:'vacant'}}, {number:1, _id:0})



// 2. Top 10 companies with max number of units
// units.aggregate([ 
// 	{$group:{_id : "$owner.name", count:{$sum:1}}}, 
// 	{$match:{_id:{$nin:["vacant"]}}},
// 	{$sort:{count:-1}},
// 	{$limit:10},
// 	{$project:{_id:0, name : "$_id", "Number of units":"$count"}}
// ])





// 3. Average num of units per Company in each tower
// units.aggregate([
// 	{$group:{
// 		_id:{tower:"$tower", owner:"$owner.name"}, 
// 		unitsOfOwnerInTower:{$sum:1}
// 		}
// 	},
// 	{$match:{'_id.owner':{$nin:["vacant"]}}},
// 	{$group:{_id:'$_id.tower', ownersInTower:{$sum:1}, unitsInTower:{$sum:'$unitsOfOwnerInTower'}, "Average num of units per Company" : {$avg:"$unitsOfOwnerInTower"}}}	
// ])






// 4. Biggest Companies in each tower and the number of units they own in that tower
// units.aggregate([
// 		{$group:{_id:{tower:"$tower", owner:"$owner.name"}, count:{$sum:1}}},
// 		{$match:{'_id.owner':{$nin:["vacant"]}}},
// 		{$sort:{count:-1}},
// 		{$group:{_id:"$_id.tower", unitsInTower:{$sum:1}, biggestOwner:{$first:"$_id.owner"}, unitsOwned:{$first:'$count'}}},
// 		{$sort:{_id:1}},
// 		{$project:{_id:0, tower: "$_id", "Total units in tower":'$unitsInTower', "Biggest Owner":'$biggestOwner', "Units owned by them": '$unitsOwned'}},
// 		{$sort:{tower:1}}
// 	])

// //check
// units.find({tower:1, owner:{'name':'Cp20'}}).count()   //5	




// 5. Number of visits for each purpose
// logs.aggregate([
// 	{$group:{_id:'$purpose', count:{$sum:1}}},
// 	{$sort:{count:-1}}
// ])




// 6.Top 10 owners with max number of visits
// units.aggregate([
// 	{$group:{_id:"$owner.name", visitCount:{$sum:{$size:'$VisitorLogs'}}}},
// 	{$sort:{visitCount:-1}},
// 	{$limit:10}
// ])




// 7.Tower wise visit count
// units.aggregate([
// 	{$match:{'VisitorLogs':{$gt:[]}}},
// 	{$group:{_id:"$tower", visitCount:{$sum:{$size:'$VisitorLogs'}}}},
// 	{$sort:{visitCount:-1}},
// 	{$limit:10},
// 	{$project:{"Tower num" : "$_id", "Visit Count":"$visitCount", _id:0}}
// ])




// 8. Top 10 Units with max num of visits

// units.aggregate([
// 	{$match:{'VisitorLogs':{$gt:[]}}},
// 	{$group:{_id:"$number", visitCount:{$sum:{$size:'$VisitorLogs'}}}},
// 	{$sort:{visitCount:-1}},
// 	{$limit:10}
// ])




// 9. Visits to empty units, purpose wise

// units.aggregate([
// 	{$match:{"owner.name":"vacant"}},
// 	{$unwind : "$VisitorLogs"},
// 	{$lookup:{from:"VisitorLog", localField:"VisitorLogs", foreignField:"_id", as:"log"}},
// 	{$group:{_id:"$log.purpose", count:{$sum:1}}},
// 	{$sort:{count:-1}}	
// ])




// 10.The units with max num of visits for each purpose
// 	units.aggregate([
// 		{$match:{'VisitorLogs':{$gt:[]}}},
// 		{$unwind:'$VisitorLogs'},
// 		{$lookup:{from:"VisitorLog", localField:"VisitorLogs", foreignField:"_id", as:"log"}},
// 		{$group:{_id:{number:"$number", purpose:"$log.purpose"}, count:{$sum:1}}},
// 		{$sort:{count:-1}},
// 		{$group:{_id:"$_id.purpose", unit:{$first:"$_id.number"}, visits:"$count"}},
// 		{$limit:10}
// 	])  


		
