$(function (event) {
  
  //fetch units data for display
  $.get( '/initial',{}, function(unitsInDB) {
        
                        // console.log(">>>>>>" + data.map(function(obj){return obj['number']}));
                        
                        //find out numOfTowers, floorsInTowers,  numOfUnitsPerFloor
                        var towers = unitsInDB.map(function(unit){ return unit.tower});

                        towers = towers.filter( function (value, index, self) { 
                                                   return self.indexOf(value) === index;
                                               });
                        
                        towers = towers.sort(function(a,b){return a-b});
                        
                        numOfTowers = towers.length;

                        

                        var floorsInTowers = [0,0,0,0];
                        for (var i = unitsInDB.length - 1; i >= 0; i--) {
                           var floorInCurrentUnit =  unitsInDB[i]['floor'];
                           var maxFloorInCurrentTower = floorsInTowers[unitsInDB[i]['tower'] - 1];
                           
                           if (floorInCurrentUnit > maxFloorInCurrentTower){
                              floorsInTowers[unitsInDB[i]['tower'] - 1] = floorInCurrentUnit;
                           }
                        }
                        
                        floorsInTowers = floorsInTowers.reverse();
                        console.log ( "Floor [4,3,2,1]: " + floorsInTowers);

                        // All the floors in each tower have equal num of units
                        // so count the num of units in any floor in any tower
                        // say, floor 1 in tower 2
                        numOfUnitsPerFloor = 0; 
                        for (var i = unitsInDB.length - 1; i >= 0; i--) {
                          if (unitsInDB[i]['tower']=='1' && unitsInDB[i]['floor']=='1') numOfUnitsPerFloor++;
                        }
                        console.log('numOfUnitsPerFloor ' + numOfUnitsPerFloor);



                        drawInitial(unitsInDB, numOfTowers, floorsInTowers, numOfUnitsPerFloor);
     });

  $('#queries td').click(function(){
      var index =  $('#queries td').index(this) ;

      $.get( '/query',{'index':(index+1)}, function(data) {
        
                      highlightUnits(data['units'].map(function(obj){return obj['number']}));
                      $('#response').html(JSON.stringify(data['result']));
     });

        

      });//end click handler

});


