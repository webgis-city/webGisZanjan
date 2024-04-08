
var mapView = new ol.View({
  projection: 'EPSG:4326',
  center: [48.48 ,36.66],
  zoom:8,
});

var OSM = new ol.layer.Tile({
  source: new ol.source.OSM(),
  type: 'base',
  title: 'Open Street Map',
  visible: true,
});


var map = new ol.Map({
  controls: ol.control.defaults({ attribution: false}),
  target: 'map',
  view: mapView,
  controls: []
});

var view_ov = new ol.View({
  projection: 'EPSG:4326',
  center: [48.48 ,36.66],
    zoom:8,
});


var noneTile = new ol.layer.Tile({
title: 'None',
type: 'base',
visible: false
});


var base_maps = new ol.layer.Group({
  'title': 'Base maps',
   fold:true,
   layers: [OSM , noneTile]
});

map.addLayer(base_maps);



var Ostan_Zanjan = new ol.layer.Image({
    title: "Ostan_Zanjan",
    visible: false,
    source: new ol.source.ImageWMS({
    url:'http://localhost:8080/geoserver/school_webgis/wms',
    params:{'LAYERS':'school_webgis:Ostan_Zanjan','TILED':true},
    serverType: 'geoserver',
    visible: false
    })
  });

 var Bakhsh_Zanjan = new ol.layer.Image({
    title: 'Bakhsh_Zanjan',
    source: new ol.source.ImageWMS({
        url:'http://localhost:8080/geoserver/school_webgis/wms',
        params: {'LAYERS':'	school_webgis:Bakhsh_Zanjan','TILED':true},
        serverType: 'geoserver',
        visible: true
})
});

 var City_Zanjan = new ol.layer.Image({
    title: 'City_Zanjan',
    source: new ol.source.ImageWMS({
        url:'http://localhost:8080/geoserver/school_webgis/wms',
        params: {'LAYERS':'school_webgis:City_Zanjan','TILED':true},
        serverType: 'geoserver',
        visible: true
    })
  });


var Roads_Zanjan =  new ol.layer.Image({
    title: "Roads_Zanjan",
    source: new ol.source.ImageWMS({
    url:'http://localhost:8080/geoserver/school_webgis/wms',
    params:{'LAYERS':'school_webgis:Roads_Zanjan','TILED':true},
    serverType: 'geoserver',
    visible: true
    })
  });

 var Dehestan_Zanjan = new ol.layer.Image({
    title: "Dehestan_Zanjan",
    source: new ol.source.ImageWMS({
    url:'http://localhost:8080/geoserver/school_webgis/wms',
    params:{'LAYERS':'school_webgis:Dehestan_Zanjan','TILED':true},
    serverType: 'geoserver',
    visible: true
    })
  });


var overlaysGroup = new ol.layer.Group({
  'title': 'Overlays',
  fold:true,
  layers: [City_Zanjan, Roads_Zanjan, Ostan_Zanjan, Bakhsh_Zanjan,Dehestan_Zanjan ]
});

map.addLayer(overlaysGroup);

var overview = new ol.control.OverviewMap({
  className:'ol-overviewmap',
  view: view_ov,
  collapseLabel: 'O',
  lable: 'O',
  layers: [OSM]
  });
  
  map.addControl(overview);
  
var layerSwitcher = new ol.control.LayerSwitcher({
  activationMod: 'click',
  startActive: true,
  tipLabel:'Layers',
  groupSelectStyle: 'children',
  collapseTipLabel: 'Collapse layers',
  
});
  
  map.addControl(layerSwitcher);
  

var mousePositionControl = new ol.control.MousePosition({
    className: 'custom-mouse-position',
    projection: 'EPSG:4326',
    coordinateFormat: function(coordinate){return ol.coordinate.format(coordinate, '{x},{y}', 6);}
});
map.addControl(mousePositionControl);


var scaleControl = new ol.control.ScaleLine({
className: 'scaleControl',
bar: true,
steps: 4,
text: true,
minWidth:100,
});
map.addControl(scaleControl);

var full_sc = new ol.control.FullScreen({label:'F'});
map.addControl(full_sc);

var zoom = new ol.control.Zoom({
className: 'zoom',
zoomInLabel: '+' , 
zoomOutLabel:'-'
});
map.addControl(zoom);


var slider = new ol.control.ZoomSlider({
className: 'ol-zoomslider'
});
map.addControl(slider);

var zoom_ex = new ol.control.ZoomToExtent({
className: 'zoom_ex',
extent: [
  40.20 , 36.90, 
              58.22 , 37.35
]
});
map.addControl(zoom_ex);




///////////////////////  start :  identify   


var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');

var popup = new ol.Overlay({
  element: container,
  autoPan: true,
  autoPanAnimation:{
      duration:250
  },
});

map.addOverlay(popup);

closer.onclick = function(){
  popup.setPosition(undefined);
  closer.blur();
  return false;
};

var featureInfoButton = document.createElement('button');
featureInfoButton.innerHTML = '<img src="Icone/identify-icon.png" alt="" style="width26px;height:26px;filter:brightness(0) invert(1);vertical-align:center"></img>';
featureInfoButton.className = 'myButton';
featureInfoButton.id = 'featureInfoButton';

var featureInfoElement = document.createElement('div');
featureInfoElement.className = 'featureInfoDiv';
featureInfoElement.appendChild(featureInfoButton);

var featureInfoControl = new ol.control.Control({
element: featureInfoElement
})

var featureInfoFlag = false;
featureInfoButton.addEventListener("click", () => {
featureInfoButton.classList.toggle('clicked');
featureInfoFlag  = !featureInfoFlag;
})
map.addControl(featureInfoControl);


map.on('singleclick', function (evt){
if (featureInfoFlag){

content.innerHTML = '';
var resolution = mapView.getResolution();
var url = Dehestan_Zanjan.getSource().getFeatureInfoUrl(evt.coordinate,resolution, 'EPSG:4326', {
  'INFO_FORMAT': 'application/json',
  'propertyName': 'CityName,DistricNam'

});

if (url){
      $.getJSON(url,function(data){
        var feature = data.features[0];
        var props = feature.properties;
        content.innerHTML = "<h3> CityName : </h3> <p>" + props.CityName.toUpperCase() + "</p> <br> <h3> DistricNam : <h3> <p>" +
        props.DistricNam.toUpperCase() + "</p>";
        popup.setPosition(evt.coordinate);
      }) 
} else {
  popup.setPosition(undefined);
}}});


////////////////////////////  end : identify   



///////////////////////////  strat:   legend

function legend (){
var no_layers = overlaysGroup.getLayers().get('length');
var head = document.createElement("h4");
var txt = document.createTextNode("Legend");

head.appendChild(txt);
var element = document.getElementById("legend");
element.appendChild(head);
var ar = [];
var i ;
for (i = 0 ; i < no_layers; i++) {
  ar.push("http://localhost:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=" + overlaysGroup.getLayers().item(i).get('title'));
//    alert(overlaysGroup.getLayers().item(i).get('title'));
}
for (i = 0; i < no_layers; i++){
var head = document.createElement("p");

var txt = document.createTextNode(overlaysGroup.getLayers().item(i).get('title'));
//    alert(txt[i]);
head.appendChild(txt);
var element = document.getElementById("legend");
element.appendChild(head);
  var img = new Image();
img.src = ar[i];

var src = document.getElementById("legend");
src.appendChild(img);
}

}
legend();

///////////////////////////////////////////////////   end:    legend


   
/////////////////////////////////// start : Length and Area Measurement Control

var lengthButton =  document.createElement('button');
lengthButton.innerHTML = '<img src="Icone/line_measure.png" alt="" style="width:25px;height:25px;filter:brightness(0) invert(1);vertical-align:middle"></img>';
lengthButton.className = 'myButton';
lengthButton.id = 'lengthButton';

var lengthElement = document.createElement('div');
lengthElement.className = 'lengthButtonDiv';
lengthElement.appendChild(lengthButton);

var lengthControl = new ol.control.Control({
    element: lengthElement
})
var lengthFlag = false;
lengthButton.addEventListener("click", () => {
    lengthButton.classList.toggle('clicked');
    lengthFlag  = !lengthFlag;
    document.getElementById("map").style.cursor = "default";
    if(lengthFlag){
        map.removeInteraction(draw);
        addInteraction('LineString');
    } else {
        map.removeInteraction(draw);
        source.clear();
        const elements = document.getElementsByClassName("ol-tooltip ol-tooltip-static");
        while (elements.length > 0)elements[0].remove();

       }
});
map.addControl(lengthControl);

var areaButton = document.createElement('button');
areaButton.innerHTML = '<img src="Icone/area_measure.png" alt="" style="width25px;height:25px;filter:brightness(0) invert(1);vertical-align:middle"></img>';
areaButton.className = 'myButton';
areaButton.id = 'areaButton';

var areaElement = document.createElement('div');
areaElement.className = 'areaButtonDiv';
areaElement.appendChild(areaButton);

var areaControl = new ol.control.Control({
    element: areaElement
})

var areaFlag = false;
areaButton.addEventListener("click", () => {
    areaButton.classList.toggle('clicked');
    areaFlag  = !areaFlag;
    document.getElementById("map").style.cursor = "default";
    if(areaFlag){
        map.removeInteraction(draw);
        addInteraction('Polygon');
    } else {
        map.removeInteraction(draw);
        source.clear();
        const elements = document.getElementsByClassName("ol-tooltip ol-tooltip-static");
        while (elements.length > 0)elements[0].remove();

      }
});
map.addControl(areaControl);


var continuePolygonMsg = 'Click to continue polygon, Double click to complete';
var continueLineMsg = 'Click to continue line, Double click to complete';

 var draw;  

 var source = new ol.source.Vector();
 var vector = new ol.layer.Vector({
     source: source,
     style: new ol.style.Style({
          fill: new ol.style.Fill({
             color: 'rgba(255, 255, 255, 0.4)',
     }),
     stroke: new ol.style.Stroke({
         color: '#ffcc33',
         width: 2,
     }),
     image: new ol.style.Circle({
         radius: 7,
         fill: new ol.style.Fill({
            color: '#ffcc33',
        }),
    }),
 }),
});
map.addLayer(vector);

function addInteraction(intType) {

        draw = new ol.interaction.Draw({
            source: source,
            type: intType,
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(200, 200, 200, 0.6)',
                }),
                stroke: new ol.style.Stroke({
                    color: 'rgba(0, 0, 0, 0.5)',
                    lineDash: [10, 10],
                    width: 2,
                }),
                image: new ol.style.Circle({
                    radius: 5,
                    stroke: new ol.style.Stroke({
                        color: 'rgba(0, 0, 0, 0.7)',
                    }),
                    fill: new ol.style.Fill({
                         color: 'rgba(255, 255, 255, 0.2)',
                    }),
                }),
        }),
   });
   map.addInteraction(draw);

   createMeasureTooltip();
   createHelpTooltip();


   var sketch;
   var pointerMoveHandler = function (evt){
       if (evt.dragging){
           return;
       }
       var helpMsg = 'Click to start drawing';
       if (sketch){
           var geom = sketch.getGeometry();   
       }};

   map.on('pointermove', pointerMoveHandler);
   draw.on('drawstart', function (evt){
    
       sketch = evt.feature;
       var tooltipCoord = evt.coordinate;
      
        sketch.getGeometry().on('change', function (evt){
            var geom = evt.target;
            var output;
            if (geom instanceof ol.geom.Polygon){
                output = formatArea(geom);
                tooltipCoord = geom.getInteriorPoint().getCoordinates();
            } else if (geom instanceof ol.geom.LineString){
                output = formatLength(geom);
                tooltipCoord = geom.getLastCoordinate();  
            }

            measureTooltipElement.innerHTML = output;
            measureTooltip.setPosition(tooltipCoord);
        });
       });

       draw.on('drawend', function(){
            measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
            measureTooltip.setOffset([0, -7]);
       
            sketch = null;
         
            measureTooltipElement = null;
            createMeasureTooltip();
        });
};

  
   var helpTooltipElement;
   var helpTooltip;

   function createHelpTooltip(){
       if (helpTooltipElement){
           helpTooltipElement.parentNode.removeChild(helpTooltipElement);
       }
       helpTooltipElement = document.createElement('div');
       helpTooltipElement.className = 'ol-tooltip hidden';
       helpTooltip = new ol.Overlay({
           element:  helpTooltipElement,
           offset: [15, 0],
           positioning: 'center-left',
       });
       map.addOverlay(helpTooltip);
};

map.getViewport().addEventListener('mouseout', function(){
   helpTooltipElement.classList.add('hidden');
});



 ////////////////////          Creates a new measure tooltip


 var measureTooltipElement;
 var measureTooltip; 

function createMeasureTooltip(){
    if (measureTooltipElement){
        measureTooltipElement.parentNode.removeChild(measureTooltipElement);
    }
    measureTooltipElement = document.createElement('div');
    measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
    measureTooltip = new ol.Overlay({
        element: measureTooltipElement,
        offset: [0, -15],
        positioning: 'bottom-center',
    });
    map.addOverlay(measureTooltip);

};
// /**
// //  * Format length output.
// //  * @param {LineString} line The line.
// //  * @return {string} The formatted length.
// //  */

var formatLength = function (line){
    var length = ol.sphere.getLength(line,{projection:'EPSG:4326'});
    var output;
    if (length > 100) {
        output = Math.round((length / 1000 * 100) / 100) + ' ' + 'km';
    } else {
        output = (Math.round(length * 100) / 100) + ' ' + 'm';

    }
    return output;
};

// /**
//  * Format area output.
//  * @param {Polygon} polygon The polygon.
//  * @return {string} The formatted area.
//  */
 var formatArea = function (polygon){
    var area = ol.sphere.getArea(polygon,{projection:'EPSG:4326'});
    var output;
    if (area > 10000) {
        output = (Math.round(area / 1000000 * 100) / 100) + ' ' + 'km<sup>2</sup>';
    } else {
        output = (Math.round(area * 100) / 100) + ' ' + 'm<sup>2</sup>';

    }
    return output;
}; 

var element = document.createElement('div');
element.className = 'measure-control ol-unselectable ol-control';
element.appendChild(button);

ol.control.Control.call(this, {
  element: element,
  target: options.target
});


/////////////////////////  end : Length and Area Measurement Control

