var timeStateCode
var totalTimeSeries=[]
var prop
var districtJson
var checkHigh=false
var objKey=[]
datastateActive=[]
currentStateArr=[]
$(document).ready(function(){
    var url="https://api.covid19india.org/data.json"
    $.getJSON(url,function(data){
        console.log(data)
        total_active=data.statewise[0].active
        total_recovered=data.statewise[0].recovered
        total_confirmed=data.statewise[0].confirmed
        total_deaths=data.statewise[0].deaths
        storedata=data
        $("#pactive").append(total_active)
        $("#precovered").append(total_recovered)
        $("#pconfirmed").append(total_confirmed)
        $("#pdeaths").append(total_deaths)
        var states=[]
        var confirm=[]
        var deathss=[]
        var recover=[]
         $.each(data.statewise,function(id,obj){
             if(obj.state=='Dadra and Nagar Haveli and Daman and Diu'){
                 obj.state='Daman & Diu'
             }
             if(obj.state=='Andaman and Nicobar Islands'){
                obj.state='Andaman & Nicobar'
             }if(obj.state=='Jammu and Kashmir'){
                obj.state='Jammu & Kashmir'
             }
             states.push(obj.state)
             confirm.push(obj.confirmed)
             deathss.push(obj.deaths)
            recover.push(obj.recovered)
         })
         states.shift()
         confirm.shift()
         deathss.shift()
         recover.shift()
         for(var i=1;i<data.statewise.length;i++){
             datastateActive[i-1]=data.statewise[i].active
         }
          var distWiseChart=document.getElementById("distChart").getContext('2d')
        
        dChart1=new Chart(distWiseChart,{
            type:'bar',
            data:{
                labels:states,
                datasets:[
                   
                    {
                        label:'Confirmed',
                        backgroundColor: "rgb(226 48 40)", //rgb(255,69,0)
                        data:confirm
                    },
                    {
                        label:'Deceased',
                        backgroundColor: "white",
                        data:deathss
                    },
                    {
                        label:'Active',
                        backgroundColor: "rgb(50,30,255)", 
                        data:datastateActive
                    },
                    
                    {
                        label:'Recovered' ,
                        backgroundColor: "rgb(127,255,0)",
                        data:recover
                    }
                ]   
            },
            options:{
                title: {
                    display: true,
                    fontColor:"white",
                    fontSize:20,
                    text: 'State wise Current Cases in India'//+ activeSateName,
                },
                tooltips: {
                    mode: 'index',
                    intersect: false
                },
                responsive: true,
                scales: {
                    xAxes: [{
                        stacked: true,
                        ticks:{
                            fontColor:"white"
                        }
                    }],
                    yAxes: [{
                        stacked: true,
                        ticks:{
                            fontColor:"white",
                            callback: function(label, index, labels) {
                                return label/1000+'k';
                            }
                        }
                    }]
                },
                legend: {
                    display: true,
                    labels: {
                        fontColor: 'rgb(255,255,255)'
                    }
                }
            },
            
        }); 
    })
    var url3="https://api.covid19india.org/state_district_wise.json "
    $.getJSON(url3,function(distData){
        districtJson=distData
    })
   
})
 mydata = [];
$.ajax({
  url:"https://api.covid19india.org/data.json",
  async: false,
  dataType: 'json',
  success: function (json) {
    mydata = json;
  }
});
$(document).ready(function(){
    currentStateArr=['LA']
    map = L.map('rightDiv1',{zoomControl:false}).setView([22.554443580751062,82.9673465625], 4);
    layer=L.esri.basemapLayer("Imagery").addTo(map);
    status='confirmed'
     indiaLayer=L.geoJson(indiastates,
        {
            style:countriesStyle,
            onEachFeature:indiaEachFeature,
        }
        ).addTo(map)
    map.fitBounds(indiaLayer.getBounds())
    var zoomHome = L.Control.zoomHome({position:'topleft'});
    zoomHome.addTo(map);    
document.getElementById('confirmed').focus()
})
var indiaLayer
var status
function tst1(id){
    status=id
    currentStateArr[0]='LA'
    indiaLayer.remove()
    legend.remove()
    indiaLayer=L.geoJson(indiastates,
        {
            style:countriesStyle,
            onEachFeature:indiaEachFeature,
            
        }
        ).addTo(map)
}
function countriesStyle(indiaLayer){ 
        currentState=indiaLayer.properties.State_code
        for(var i=0;i<mydata.statewise.length;i++){
            //console.log('json type is ',mydata.statewise[i].statecode)
            if(indiaLayer.properties.State_code==mydata.statewise[i].statecode){
                //console.log("feature matched this geojson ", indiaLayer.properties.State_code," with this JSON API ",mydata.statewise[i].statecode)
                symbology=mydata.statewise[i][status]
                //console.log("active case of ",indiaLayer.properties.State_code," is ",symbology)
                
            }
        }
        return{       
            fillColor:stateSymbology(symbology),
            weight:1,
            opacity:1,
            color:'black',
            dashArray:1,
            fillOpacity:1
            }  
}
function stateSymbology(d){
        if(status=='confirmed'){
            var breaks=[-Infinity,60957,231834,474054,811825,1648665,Infinity]
            var colours=['#fef0d9','#fdcc8a','#fc8d59','#e34a33','#b30000','#67000d']
        }
        else if(status=='active'){
            var colours=['#f7fbff','#d1e3f3','#9ac8e1','#529dcc','#1c6cb1','#08306b']
            var breaks=[-Infinity,7680,20271,36807,97418,140194,Infinity]
        }
        else if(status=='recovered'){
            var breaks=[-Infinity,59228,226646,463241,809771,1562343,Infinity]
            var colours=['#f7fcf5','#d5efcf','#9ed898','#54b567','#1d8641','#00441b']
        }
        else if(status=='deaths'){
            var breaks=[-Infinity,1130,4296,7178,11348,44965,Infinity]
            var colours=['#fafafa','#c9c9c9','#989898','#676767','#363636','#050505']
        }
        if(currentStateArr[0]=='LA'){
            currentStateArr[0]='null'
            legend = L.control({position: 'bottomright'});
            legend.onAdd = function (map) {
                var div = L.DomUtil.create('div', 'info legend');
                for (var i=colours.length; i <=colours.length&&i>=0; i--) {
                    div.innerHTML+='<i style="background:'+colours[i-1] +'"></i><br>'
                }
            return div;
            };
        legend.addTo(map);
        }
        for(var i=0;i<breaks.length;i++){
            
            if(d>breaks[i]&&d<=breaks[i+1]){
                return colours[i]
            }
        }
}
//symbology for Active Case
$(document).ready(function(){
    var timeURL="https://api.covid19india.org/v4/timeseries.json"
    $.getJSON(timeURL,function(timeData){
        console.log(timeData)
        timeStateCode=timeData   
    caseDuration=function(times=30){
        objKey=[]
        totalTimeSeries=[]
        totalTimeConfirmed=[]
        totalTimeRecovered=[]
        totalTimeDeaths=[]
        totalTimeActive=[]
           for(i in timeData){
                if(checkHigh==false){
                     prop='TT'
                     objKey= Object.keys(timeData[prop].dates)
                }
                else{
                 prop=layer.feature.properties.State_code.toString()
                 console.log("else state")
                    if (i==prop){
                        objKey= Object.keys(timeData.TT.dates)
                    }
             }
        }
        for(var i=objKey.length-times;i<objKey.length;i++){
            totalTimeSeries.push(objKey[i])
            
        }
         for(var i=0;i<totalTimeSeries.length;i++){
            if(totalTimeSeries[i] in timeData[prop].dates){
                if("confirmed" in timeData[prop].dates[totalTimeSeries[i]].total){
                    timeConfirmed=timeData[prop].dates[totalTimeSeries[i]].total.confirmed
                }else{
                    timeConfirmed=0
                }
                if ("recovered" in timeData[prop].dates[totalTimeSeries[i]].total){
                    timeRecovered=timeData[prop].dates[totalTimeSeries[i]].total.recovered           
                }else{
                    timeRecovered=0
                }
                if("other" in timeData[prop].dates[totalTimeSeries[i]].total){
                    timeOthers=timeData[prop].dates[totalTimeSeries[i]].total.other
                }else{
                    timeOthers=0
                }
                if("deceased" in timeData[prop].dates[totalTimeSeries[i]].total){
                    timeDeaths=timeData[prop].dates[totalTimeSeries[i]].total.deceased
                }else{
                    timeDeaths=0
                }
            }else{
                timeConfirmed=0
                timeRecovered=0
                timeOthers=0
                timeDeaths=0
            }
           timeActive=(timeConfirmed-(timeRecovered+timeOthers+timeDeaths))
           totalTimeConfirmed.push(timeConfirmed)
           totalTimeRecovered.push(timeRecovered)
           totalTimeDeaths.push(timeDeaths)
           totalTimeActive.push(timeActive)
        }

       $('#myChartConf').remove(); // this is my <canvas> element
       $('#timeSeriesConfirmed').append('<canvas id="myChartConf"><canvas>');
       $('#myChartActive').remove(); // this is my <canvas> element
       $('#timeSeriesActive').append('<canvas id="myChartActive"><canvas>');
       $('#myChartReco').remove(); // this is my <canvas> element
       $('#timeSeriesRecovered').append('<canvas id="myChartReco"><canvas>');
       $('#myChartDeath').remove(); // this is my <canvas> element
       $('#timeSeriesDeaths').append('<canvas id="myChartDeath"><canvas>');

    timeChart1=document.getElementById("myChartConf").getContext("2d")
        chart1=new Chart(timeChart1,{
             type:'line',
             data:
                 {   
                    
                     labels:totalTimeSeries,
                     datasets:[
                         {
                            pointRadius: 1.5,
                            label:'Confirmed Cases',
                            data:totalTimeConfirmed,
                            //minBarLength:100,
                            fill:false,
                            borderColor:'rgb(255,69,0)',
                            pointHoverBackgroundColor:'red'
                             
                         }
                         
                     ]
                  },
                  options: {
                    tooltips: {
                        mode: 'index',
                        intersect: false
                    },
                    scales: {
                        xAxes: [{
                            //display:false,
                            type:'time',
                            gridLines: {
                                //color: "rgba(0, 0, 0, 0)",
                                display:false,
                                
                            },
                            ticks:{
                                maxTicksLimit:5,
                                fontColor: 'rgb(255,255,255)',
                                minRotation:0,
                                maxRotation:0
                                //display:false
                                
                            },
                            time:{
                                displayFormats:{
                                    quarter:'MMM D'
                                }
                            },
                            
                            
                        }],
                        yAxes: [{
                            //display:false,
                            gridLines: {
                                color: "rgba(0, 0, 0, 0)",
                            },
                            ticks:{
                                maxTicksLimit:10,
                                fontColor: 'rgb(255,255,255)',
                                display:false
                                
                            }
                            /*scaleLabel:{
                                display:true,
                                labelString:"1k 1000",
                                fontColor:'white'
                            }*/
                        }]
                    },
                    legend: {
                        display: true,
                        labels: {
                            fontColor: 'rgb(255,255,255)'
                        }
                    }
                      
                  }
             
         })
         //Recovered Chart
        var timeChart2=document.getElementById("myChartReco").getContext("2d")
         chart2=new Chart(timeChart2,{
              type:'line',
              data:
                  {   
                     
                      labels:totalTimeSeries,
                      datasets:[
                          {
                             pointRadius: 1.5,
                             label:'Recovered Cases',
                             data:totalTimeRecovered,
                             //minBarLength:100,
                             fill:false,
                             borderColor:'rgb(127,255,0)',
                             pointHoverBackgroundColor:'blue'
                              
                          }
                          
                      ]
                   },
                   options: {
                    tooltips: {
                        mode: 'index',
                        intersect: false
                    },
                     scales: {
                         xAxes: [{
                             //display:false,
                             type:'time',
                             gridLines: {
                                 //color: "rgba(0, 0, 0, 0)",
                                 display:false,
                                 
                             },
                             ticks:{
                                 maxTicksLimit:5,
                                 fontColor: 'rgb(255,255,255)',
                                 minRotation:0,
                                 maxRotation:0
                                 //display:false
                                 
                             },
                             time:{
                                displayFormats:{
                                    quarter:'MMM D'
                                }
                            }
                             
                         }],
                         yAxes: [{
                             //display:false,
                             gridLines: {
                                 color: "rgba(0, 0, 0, 0)",
                             },
                             ticks:{
                                 maxTicksLimit:10,
                                 fontColor: 'rgb(255,255,255)',
                                 display:false
                                 
                             }
                             /*scaleLabel:{
                                 display:true,
                                 labelString:"1k 1000",
                                 fontColor:'white'
                             }*/
                         }]
                     },
                     legend: {
                        display: true,
                        labels: {
                            fontColor: 'rgb(255,255,255)'
                        }
                    }
                       
                   }
              
          })
          //Death Chart
        var timeChart3=document.getElementById("myChartDeath").getContext("2d")
            chart3=new Chart(timeChart3,{
               type:'line',
               data:
                   {   
                      
                       labels:totalTimeSeries,
                       datasets:[
                           {
                              pointRadius: 1.5,
                              label:'Deceased Cases',
                              data:totalTimeDeaths,
                              //minBarLength:100,
                              fill:false,
                              borderColor:'rgb(255,255,255)', //rgb(138,43,226)
                              pointHoverBackgroundColor:'yellow'
                               
                           }
                           
                       ]
                    },
                    options: {
                        tooltips: {
                            mode: 'index',
                            intersect: false
                        },
                      scales: {
                          xAxes: [{
                              //display:false,
                              type:'time',
                              gridLines: {
                                  //color: "rgba(0, 0, 0, 0)",
                                  display:false,
                                  
                              },
                              ticks:{
                                  maxTicksLimit:5,
                                  fontColor: 'rgb(255,255,255)',
                                  minRotation:0,
                                  maxRotation:0
                                  //display:false
                                  
                              },
                              time:{
                                displayFormats:{
                                    quarter:'MMM D'
                                }
                            }
                              
                          }],
                          yAxes: [{
                              //display:false,
                              gridLines: {
                                  color: "rgba(0, 0, 0, 0)",
                              },
                              ticks:{
                                  maxTicksLimit:10,
                                  fontColor: 'rgb(255,255,255)',
                                  display:false
                                  
                              }
                              /*scaleLabel:{
                                  display:true,
                                  labelString:"1k 1000",
                                  fontColor:'white'
                              }*/
                          }]
                      },
                      legend: {
                        display: true,
                        labels: {
                            fontColor: 'rgb(255,255,255)'
                        }
                    }
                        
                    }
               
           })
           //Active Chart

        var timeChart4=document.getElementById("myChartActive").getContext("2d")
        chart4=new Chart(timeChart4,{
             type:'line',
             data:
                 {   
                    
                     labels:totalTimeSeries,
                     datasets:[
                         {
                            pointRadius: 1.5,
                            label:'Active Cases',
                            data:totalTimeActive,
                            //minBarLength:100,
                            fill:false,
                            borderColor:'rgb(138,43,226)', //rgb(255,255,255)
                            pointHoverBackgroundColor:'red'
                             
                         }
                         
                     ]
                  },
                  options: {
                    tooltips: {
                        mode: 'index',
                        intersect: false
                    },
                    scales: {
                        xAxes: [{
                            //display:false,
                            type:'time',
                            gridLines: {
                                //color: "rgba(0, 0, 0, 0)",
                                display:false,
                                
                            },
                            ticks:{
                                maxTicksLimit:5,
                                fontColor: 'rgb(255,255,255)',
                                minRotation:0,
                                maxRotation:0
                                //display:false
                                
                            },
                            time:{
                                displayFormats:{
                                    quarter:'MMM D'
                                }
                            }
                        }],
                        yAxes: [{
                            //display:false,
                            gridLines: {
                                color: "rgba(0, 0, 0, 0)",
                            },
                            ticks:{
                                maxTicksLimit:10,
                                fontColor: 'rgb(255,255,255)',
                                display:false,
                                
                                
                            }
                            /*scaleLabel:{
                                display:true,
                                labelString:"1k 1000",
                                fontColor:'white'
                            }*/
                        }]
                    },
                    legend: {
                        display: true,
                        labels: {
                            fontColor: 'rgb(255,255,255)'
                        }
                    }
                      
                  }
             
         })
    }
    caseDuration()
    })
})
var stateConfirmed=[]
function highlightFeature(e){
    checkHigh=true
     layer=e.target
    layer.setStyle({
        weight:5,
        color:'black',
        fillColor:'white',
        fillOpacity:0.2
    })
    if(!L.Browser.ie && !L.Browser.opera){
        layer.bringToFront()
    } 
    // Get State wise Cases from JSON 
    prop=e.target.feature.properties.State_code.toString()
    var scode=storedata.statewise
    var activeStateName=''
    for (i=0;i<scode.length;i++){
        if(scode[i].statecode===prop){
            $("#pactive").empty()
            $("#pconfirmed").empty()
            $("#precovered").empty()
            $("#pdeaths").empty()
            $("#pactive").append(scode[i].active)
            $("#pconfirmed").append(scode[i].confirmed)
            $("#precovered").append(scode[i].recovered)
            $("#pdeaths").append(scode[i].deaths)
            
        }
        if(scode[i].statecode===prop){
            activeStateName=scode[i].state
        }
    }
    $("#stateName").empty()
    $("#stateName").append(activeStateName)
    var stateActive=[]
    var stateRecovered=[]
    var stateDeaths=[]
    var stateOthers=[]
    var stateConfirmed=[]
    var timeStateObj=Object.keys(timeStateCode)
    for(var j=0;j<timeStateObj.length;j++){
       
        if(timeStateObj[j]==prop){
            
            for(var i=0;i<totalTimeSeries.length;i++){
               
                if(totalTimeSeries[i] in timeStateCode[timeStateObj[j]].dates){
                    
                    stateConfirmed[i]=timeStateCode[timeStateObj[j]].dates[totalTimeSeries[i]].total.confirmed
                    stateRecovered[i]=timeStateCode[timeStateObj[j]].dates[totalTimeSeries[i]].total.recovered
                    stateDeaths[i]=timeStateCode[timeStateObj[j]].dates[totalTimeSeries[i]].total.deceased
                    stateOthers[i]=timeStateCode[timeStateObj[j]].dates[totalTimeSeries[i]].total.other
                    if(stateConfirmed[i]==undefined){
                        stateConfirmed[i]=0
                    }
                    if(stateRecovered[i]==undefined){
                        stateRecovered[i]=0
                    }
                    if(stateDeaths[i]==undefined){
                        stateDeaths[i]=0
                    }
                    if(stateOthers[i]==undefined){
                        stateOthers[i]=0
                    }
                    stateActive[i]=eval("stateConfirmed[i]-(stateRecovered[i]+stateDeaths[i]+stateOthers[i])")
                    
                }
            }
        }
    }

    stateWiseChartUpdate=()=>{
            chart1.data.datasets[0].data=stateConfirmed
            chart2.data.datasets[0].data=stateRecovered
            chart3.data.datasets[0].data=stateDeaths
            chart4.data.datasets[0].data=stateActive
            chart1.update()
            chart2.update()
            chart3.update()
            chart4.update()
    }
    stateWiseChartUpdate() 
}

function distWiseData(){
        var distFullName=[]
        var distWiseActive=[]
        var distWiseConfirmes=[]
        var distWiseDeaths=[]
        var activeStateName=''
        for(i in districtJson){
            //
            var stateName=districtJson[i].statecode
            if(stateName==prop){
                activeStateName=i
                for (j in districtJson[i].districtData){
                    if(j==('Other State')||(j=='Unknown')){
                        continue
                    }
                    var distActive=districtJson[i].districtData[j].active
                    var distDeaths=districtJson[i].districtData[j].deceased
                    var distConfirm=districtJson[i].districtData[j].confirmed
                    distFullName.push(j)
                    distWiseActive.push(distActive)
                    distWiseConfirmes.push(distConfirm)
                    distWiseDeaths.push(distDeaths) 
                }
            }
        }
        updatechart=()=>{
            dChart1.data.labels=distFullName
            dChart1.data.datasets[0].data= distWiseConfirmes
            dChart1.data.datasets[1].data= distWiseDeaths
            dChart1.data.datasets[2].data= distWiseActive
            dChart1.options.title.text="Distrcit wise current status in "+activeStateName
            dChart1.data.datasets.splice(3)
            dChart1.update()
        }
      updatechart()
}

function resetHighlight(e){
    indiaLayer.resetStyle(e.target)
}
var timeStateArray=[]
var stateConfirmedArray=[]

function whenClicked(e){
    map.fitBounds(e.target.getBounds())
    distWiseData()
} 
function indiaEachFeature(feature, layer){
    layer.bindTooltip(feature.properties.State.toString(),{permanent:false}),
    layer.on({
        mouseover:highlightFeature,
        mouseout:resetHighlight,
        click:whenClicked
    })
}