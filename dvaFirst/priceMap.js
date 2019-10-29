import React  , { Component} from 'react'
import L from 'leaflet'
import 'leaflet.chinatmsproviders'
import 'leaflet-choropleth'
import * as chinaGeojson from './china.json'
import * as cityGeojson from './city.json'
import PubSub from 'pubsub-js'
import ProvinceConfig from 'public/config'

var chroma = require('chroma-js')

class PriceMap extends Component{
  constructor(props){
    super(props)
    this.map=null;
    this.state={
      geojsonData:{},
      geojsonData1:{},
      min:0,
      max:0,
    }
  }

  componentDidMount(){
    //初始化地图并添加图层
    this.map = L.map('map', {dragging: false,doubleClickZoom:false, boxZoom:false, minZoom:4, maxZoom:4, zoomControl: false, attributionControl: false}).setView([35.746512, 114.458984], 4)
    PubSub.subscribe("priceMapData", (msg,data)=> {
      console.log(data,'pdata');
      let _this = this
      this.map.remove()
      this.map = L.map('map', {dragging: false, doubleClickZoom:false, boxZoom:false, minZoom:4, maxZoom:4, zoomControl: false, attributionControl: false}).setView([35.746512, 114.458984], 4)
      // L.tileLayer.chinaProvider(
      // 'TianDiTu.Normal.Map',
      // {
      //     key: 'f960b95a264ed7d1db99eda1fe292f23',
      //     maxZoom:4,
      //     minZoom:4,
      // }).addTo(this.map);
      // L.tileLayer.chinaProvider(
      // 'TianDiTu.Normal.Annotion',
      // {
      //     key: 'f960b95a264ed7d1db99eda1fe292f23',
      //     maxZoom:4,
      //     minZoom:4,
      // }).addTo(this.map);
      L.geoJson(chinaGeojson, {
      	style: {
      		fillColor: "#EEEEEE",
      		weight: 0.5,
      		opacity: 1,
      		color: '#BABABA',
      		dashArray: '5',
      		fillOpacity: 0.7
      	},
      }).addTo(this.map);
      //添加顺逆geojson图层
      //组装geoJson数据
      let dataJson2 = data.list
      let geojsonData2
      let featureArr2 = []
      if(data.vision == 1){//加载城市地图
        let cityObjJson = JSON.stringify(cityGeojson)
        geojsonData2 = JSON.parse(cityObjJson)
        for(let i = 0; i < geojsonData2.features.length; i++){
          for(let j = 0; j < dataJson2.length; j++){
            if(geojsonData2.features[i].properties.name == dataJson2[j].cityName){
              geojsonData2.features[i].properties.value = dataJson2[j].averageSurplus
              featureArr2.push(geojsonData2.features[i])
            }
          }
        }
      }else{
        let chinaObjJson = JSON.stringify(chinaGeojson)
        geojsonData2 = JSON.parse(chinaObjJson)
        for(let i = 0; i < geojsonData2.features.length; i++){
          for(let j = 0; j < dataJson2.length; j++){
            if(geojsonData2.features[i].properties.name == dataJson2[j].provinceName){
              geojsonData2.features[i].properties.value = dataJson2[j].averageSurplus
              featureArr2.push(geojsonData2.features[i])
            }
          }
        }
      }
      geojsonData2.features = featureArr2
      console.log(geojsonData2,'geojsonData2');
      let surplusGeoJson = L.geoJson(geojsonData2, {
      	style: style2,
      	onEachFeature: onEachFeature2,
      }).addTo(this.map);
      //添加周环比geojson图层
      //组装geoJson数据
      let dataJson3 = data.list
      let geojsonData3
      let featureArr3 = []
      if(data.vision == 1){//加载城市地图
        let cityObjJson = JSON.stringify(cityGeojson)
        geojsonData3 = JSON.parse(cityObjJson)
        for(let i = 0; i < geojsonData3.features.length; i++){
          for(let j = 0; j < dataJson3.length; j++){
            if(geojsonData3.features[i].properties.name == dataJson3[j].cityName){
              geojsonData3.features[i].properties.value = dataJson3[j].averageWOW
              featureArr3.push(geojsonData3.features[i])
            }
          }
        }
      }else{
        let chinaObjJson = JSON.stringify(chinaGeojson)
        geojsonData3 = JSON.parse(chinaObjJson)
        for(let i = 0; i < geojsonData3.features.length; i++){
          for(let j = 0; j < dataJson3.length; j++){
            if(geojsonData3.features[i].properties.name == dataJson3[j].provinceName){
              geojsonData3.features[i].properties.value = dataJson3[j].averageWOW
              featureArr3.push(geojsonData3.features[i])
            }
          }
        }
      }
      geojsonData3.features = featureArr3
      console.log(geojsonData3,'geojsonData3');
      let wowGeoJson = L.geoJson(geojsonData3, {
      	style: style3,
      	onEachFeature: onEachFeature3,
      }).addTo(this.map);
      //添加均价geojson图层
      //组装geoJson数据
      let dataJson = data.list
      let geojsonData
      let featureArr = []
      if(data.vision == 1){//加载城市地图
        let cityObjJson = JSON.stringify(cityGeojson)
        geojsonData = JSON.parse(cityObjJson)
        for(let i = 0; i < geojsonData.features.length; i++){
          for(let j = 0; j < dataJson.length; j++){
            if(geojsonData.features[i].properties.name == dataJson[j].cityName){
              geojsonData.features[i].properties.value = dataJson[j].averagePrice
              featureArr.push(geojsonData.features[i])
            }
          }
        }
      }else{
        let chinaObjJson = JSON.stringify(chinaGeojson)
        geojsonData = JSON.parse(chinaObjJson)
        for(let i = 0; i < geojsonData.features.length; i++){
          for(let j = 0; j < dataJson.length; j++){
            if(geojsonData.features[i].properties.name == dataJson[j].provinceName){
              geojsonData.features[i].properties.value = dataJson[j].averagePrice
              featureArr.push(geojsonData.features[i])
            }
          }
        }
      }
      geojsonData.features = featureArr
      console.log(geojsonData,'geojsonData');
      let averageGeoJson = L.geoJson(geojsonData, {
      	style: style,
      	onEachFeature: onEachFeature,
      }).addTo(this.map);

      let baseMaps ={};
      baseMaps = {
        "查看顺逆分布": surplusGeoJson,
        "查看均价分布": averageGeoJson,
        "查看周环比分布": wowGeoJson,
      }
      /* if(data.layerName == 'wow'){
        baseMaps = {
          "查看顺逆分布": surplusGeoJson,
          "查看均价分布": averageGeoJson,
          "查看周环比分布": wowGeoJson,
        }
      }else if(data.layerName == 'surplus'){
        baseMaps = {
          "查看周环比分布": wowGeoJson,
          "查看均价分布": averageGeoJson,
          "查看顺逆分布": surplusGeoJson,
        }
      }else{
        baseMaps = {
          "查看周环比分布": wowGeoJson,
          "查看顺逆分布": surplusGeoJson,
          "查看均价分布": averageGeoJson,
        }
      } */

      let info = L.control({position: 'bottomright'});
      info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this._div.innerHTML = `<span>均价：${data.AveragePrice.min}元</span><div class="divcolor"></div><span>${data.AveragePrice.max}元</span>`
        return this._div;
      };
      info.addTo(this.map);
      let layerOptions = {
        sortLayers:true,
        sortFunction:sortFunc,
        collapsed:false,
        hideSingleBase:true,
      }
      L.control.layers(baseMaps, null, layerOptions).setPosition('bottomright').addTo(this.map);
      //方法集
      function sortFunc(layerA, layerB, layerC, nameA, nameB, nameC){
        console.log(layerA, layerB, layerC, nameA, nameB, nameC,'nameA, nameB, nameC');
        return ['查看均价分布','查看顺逆分布','查看周环比分布'];
      }
      function style(feature) {
      	return {
      		fillColor: getColor(feature.properties.value),
      		weight: (feature.properties.name == data.provinceName ||  feature.properties.name == data.cityName) ? 2 : 0.5,
      		opacity: 1,
      		color: (feature.properties.name == data.provinceName ||  feature.properties.name == data.cityName) ? '#666' : 'white',
      		dashArray: '3',
      		fillOpacity: 0.7
      	};
      }

      function getColor(d) {
        let fillColor
        var values= data.averageAllPrice
        var limits = chroma.limits(values, 'q', values.length)
        var colors = chroma.scale(['green', 'red']).colors(limits.length)
        for (var i = 0; i < limits.length; i++) {
          if (d <= limits[i]) {
            fillColor = colors[i]
            break
          }
        }
        return fillColor
      }

      function style2(feature) {
      	return {
      		fillColor: getColor2(feature.properties.value),
      		weight: (feature.properties.name == data.provinceName ||  feature.properties.name == data.cityName) ? 2 : 0.5,
      		opacity: 1,
      		color: (feature.properties.name == data.provinceName ||  feature.properties.name == data.cityName) ? '#666' : 'white',
      		dashArray: '3',
      		fillOpacity: 0.7
      	};
      }

      function getColor2(d) {
        let fillColor
        var values= data.averageAllSurplus
        var limits = chroma.limits(values, 'q', values.length)
        var colors = chroma.scale(['green', 'red']).colors(limits.length)
        for (var i = 0; i < limits.length; i++) {
          if (d <= limits[i]) {
            fillColor = colors[i]
            break
          }
        }
        return fillColor
      }

      function style3(feature) {
      	return {
      		fillColor: getColor3(feature.properties.value),
      		weight: (feature.properties.name == data.provinceName ||  feature.properties.name == data.cityName) ? 2 : 0.5,
      		opacity: 1,
      		color: (feature.properties.name == data.provinceName ||  feature.properties.name == data.cityName) ? '#666' : 'white',
      		dashArray: '3',
      		fillOpacity: 0.7
      	};
      }

      function getColor3(d) {
        let fillColor
        var values= data.averageAllWOW
        var limits = chroma.limits(values, 'q', values.length)
        var colors = chroma.scale(['green', 'red']).colors(limits.length)
        for (var i = 0; i < limits.length; i++) {
          if (d <= limits[i]) {
            fillColor = colors[i]
            break
          }
        }
        return fillColor
      }

      function onEachFeature(feature, layer) {
      	layer.on({
      		mousemove : highlightFeature,
      		mouseout: resetHighlight,
      		click: zoomToFeature
      	});
      }

      function onEachFeature2(feature, layer) {
      	layer.on({
      		mousemove : highlightFeature2,
      		mouseout: resetHighlight2,
      		click: zoomToFeature2
      	});
      }

      function onEachFeature3(feature, layer) {
      	layer.on({
      		mousemove : highlightFeature3,
      		mouseout: resetHighlight3,
      		click: zoomToFeature3
      	});
      }

      function highlightFeature(e) {
        // console.log(111111111);
      	var layer = e.target;
        layer.bindPopup(`<div>
          <div>${layer.feature.properties.name}</div>
          均价: ${layer.feature.properties.value}元
          </div>`).openPopup()
      	layer.setStyle({
      		weight: 2,
      		color: '#666',
      		dashArray: '',
      		fillOpacity: 0.7,
          // fillColor:'yellow'
      	});
      	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      		layer.bringToFront();
      	}
      }

      function highlightFeature2(e) {
      	var layer = e.target;
        layer.bindPopup(`<div>
          <div>${layer.feature.properties.name}</div>
          顺逆差: ${layer.feature.properties.value}元
          </div>`).openPopup()
      	layer.setStyle({
      		weight: 2,
      		color: '#666',
      		dashArray: '',
      		fillOpacity: 0.7,
          // fillColor:'yellow'
      	});
      	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      		layer.bringToFront();
      	}
      }

      function highlightFeature3(e) {
      	var layer = e.target;
        layer.bindPopup(`<div>
          <div>${layer.feature.properties.name}</div>
          周环比: ${layer.feature.properties.value}元
          </div>`).openPopup()
      	layer.setStyle({
      		weight: 2,
      		color: '#666',
      		dashArray: '',
      		fillOpacity: 0.7,
          // fillColor:'yellow'
      	});
      	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      		layer.bringToFront();
      	}
      }

      function resetHighlight(e) {
      	averageGeoJson.resetStyle(e.target);
        var layer = e.target;
        layer.bindPopup(`<div>${layer.feature.properties.value}</div>`).closePopup()
      }

      function resetHighlight2(e) {
      	surplusGeoJson.resetStyle(e.target);
        var layer = e.target;
        layer.bindPopup(`<div>${layer.feature.properties.value}</div>`).closePopup()
      }

      function resetHighlight3(e) {
      	wowGeoJson.resetStyle(e.target);
        var layer = e.target;
        layer.bindPopup(`<div>${layer.feature.properties.value}</div>`).closePopup()
      }

      function zoomToFeature(e) {
        console.log(e.target.feature.properties,'info');
      	var layer = e.target;
        layer.setStyle({
      		weight: 2,
      		color: '#666',
      		dashArray: '',
      		fillOpacity: 0.7,
          // fillColor:'yellow'
      	});
      	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      		layer.bringToFront();
      	}
        layer.bindPopup(`<div>
          <div>${layer.feature.properties.name}</div>
          <div>均价: ${layer.feature.properties.value}元</div>
          </div>`)
        console.log("你点击了坐标为" + e.latlng.toString()+"的点。");
        console.log("你点击了城市为" + JSON.stringify(layer.feature.properties) );
        if(layer.feature.properties.level == 'province'){
          PubSub.publish("clickAddress",{provinceName:layer.feature.properties.name, cityName:'所有地市', layerName: "average"})
        }else{
          let adcode = layer.feature.properties.parent.adcode
          let name = ''
          for(let i = 0; i < ProvinceConfig.data.length; i++){
            if(ProvinceConfig.data[i]['adcode'] == adcode){
              name = ProvinceConfig.data[i]['name']
            }
          }
          PubSub.publish("clickAddress",{provinceName: name, cityName:layer.feature.properties.name, layerName: "average"})
        }
      }

      function zoomToFeature2(e) {
        console.log(e.target.feature.properties,'info');
      	var layer = e.target;
        layer.setStyle({
      		weight: 2,
      		color: '#666',
      		dashArray: '',
      		fillOpacity: 0.7,
          // fillColor:'yellow'
      	});
      	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      		layer.bringToFront();
      	}
        layer.bindPopup(`<div>
          <div>${layer.feature.properties.name}</div>
          <div>顺逆差: ${layer.feature.properties.value}元</div>
          </div>`)
        console.log("你点击了坐标为" + e.latlng.toString()+"的点。");
        console.log("你点击了城市为" + JSON.stringify(layer.feature.properties) );
        if(layer.feature.properties.level == 'province'){
          PubSub.publish("clickAddress",{provinceName:layer.feature.properties.name, cityName:'所有地市', layerName: "surplus"})
        }else{
          let adcode = layer.feature.properties.parent.adcode
          let name = ''
          for(let i = 0; i < ProvinceConfig.data.length; i++){
            if(ProvinceConfig.data[i]['adcode'] == adcode){
              name = ProvinceConfig.data[i]['name']
            }
          }
          PubSub.publish("clickAddress",{provinceName: name, cityName:layer.feature.properties.name, layerName: "surplus"})
        }
      }

      function zoomToFeature3(e) {
        console.log(e.target.feature.properties,'info');
      	var layer = e.target;
        layer.setStyle({
      		weight: 2,
      		color: '#666',
      		dashArray: '',
      		fillOpacity: 0.7,
          // fillColor:'yellow'
      	});
      	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      		layer.bringToFront();
      	}
        layer.bindPopup(`<div>
          <div>${layer.feature.properties.name}</div>
          <div>周环比: ${layer.feature.properties.value}元</div>
          </div>`)
        console.log("你点击了坐标为" + e.latlng.toString()+"的点。");
        console.log("你点击了城市为" + JSON.stringify(layer.feature.properties) );
        if(layer.feature.properties.level == 'province'){
          PubSub.publish("clickAddress",{provinceName:layer.feature.properties.name, cityName:'所有地市', layerName: "wow"})
        }else{
          let adcode = layer.feature.properties.parent.adcode
          let name = ''
          for(let i = 0; i < ProvinceConfig.data.length; i++){
            if(ProvinceConfig.data[i]['adcode'] == adcode){
              name = ProvinceConfig.data[i]['name']
            }
          }
          PubSub.publish("clickAddress",{provinceName: name, cityName:layer.feature.properties.name, layerName: "wow"})
        }
      }

    })
  }



  render() {
    return(
      <div>
        <div id='map'></div>
      </div>
    )
  }
}
export default PriceMap
