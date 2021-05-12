//mindefjson
let newjson= 
{
  "tabs": [
    {
      "name": "Datos",
      "id": "tab-datos",
      "searcheable": false,
      "iconsrc":"src/styles/icons/capas.png"
    },
    {
      "name": "Opciones",
      "id": "tab-opciones",
      "searcheable": false,
      "iconsrc":"src/styles/icons/opciones.png"
    }
  ],
"folders":[//primer nivel de carpetas - menciona en que tab estan
          {
            "tabid": "tab-datos",
            "name": "Secretaría de Investigación, Política Industrial y Producción para la Defensa",
            "id":"secretaria"
          },
          {
            "tabid": "tab-datos",
            "name": "Fuerzas Armadas",
            "id":"fa"
          }
],
"folders2":[//segundo nivel de carpetas no menciona tab
  {
    "folderid": "secretaria",
    "name": "Instituto Geográfico Nacional",
    "id":"ign"
  }
],
"wmslayers":[ // el source-id pueden ser:, idtabs  o idfolder
{
  "sourceid": "tab-datos",
  "nombre":"Mapa cultural de la Defensa",
  "peso": 1,
  "type": "wmslayer",
  "servicio": "wms",
  "version": "1.3.0",
  "host": "https://idemindef.ign.gob.ar/geoserver/cultura"
},
{
  "sourceid": "secretaria",
  "nombre":"Fabricaciones Militares",
  "peso": 1,
  "type": "wmslayer",
  "servicio": "wms",
  "version": "1.3.0",
  "host": "https://idemindef.ign.gob.ar/geoserver/genero"
}
,
{
  "sourceid": "secretaria",
  "nombre":"Fabrica Argentina de Aviones",
  "peso": 1,
  "type": "wmslayer",
  "servicio": "wms",
  "version": "1.3.0",
  "host": "https://idemindef.ign.gob.ar/geoserver/fabricas_empresas"
},
{
  "sourceid": "secretaria",
  "nombre":"Complejo Industrial y Naval Argentino",
  "peso": 1,
  "type": "wmslayer",
  "servicio": "wms",
  "version": "1.3.0",
  "host": "https://idemindef.ign.gob.ar/geoserver/fabricas_empresas"
},
{
  "sourceid": "ign",
  "nombre":"Límites y unidades territoriales",
  "peso": 1,
  "type": "wmslayer",
  "servicio": "wms",
  "version": "1.3.0",
  "host": "https://wms.ign.gob.ar/geoserver/limites"
},
{
  "sourceid": "ign",
  "nombre":"Industria y servicios",
  "peso": 1,
  "type": "wmslayer",
  "servicio": "wms",
  "version": "1.3.0",
  "host": "https://wms.ign.gob.ar/geoserver/industria-servicios"
},
{
  "sourceid": "ign",
  "nombre":"Hábitat e infraestructura social",
  "peso": 1,
  "type": "wmslayer",
  "servicio": "wms",
  "version": "1.3.0",
  "host": "https://wms.ign.gob.ar/geoserver/infraestructura-social"
},
{
  "sourceid": "ign",
  "nombre":"Redes geodésicas",
  "peso": 1,
  "type": "wmslayer",
  "servicio": "wms",
  "version": "1.3.0",
  "host": "https://wms.ign.gob.ar/geoserver/geodesia-demarcacion"
},
{
  "sourceid": "secretaria",
  "nombre":"Servicio Meteorológico Nacional",
  "peso": 1,
  "type": "wmslayer",
  "servicio": "wms",
  "version": "1.3.0",
  "host": "https://idemindef.ign.gob.ar/geoserver/meteorologico"
},
{
  "sourceid": "secretaria",
  "nombre":"Servicio de Hidrografía Naval",
  "peso": 1,
  "type": "wmslayer",
  "servicio": "wms",
  "version": "1.3.0",
  "host": "https://idemindef.ign.gob.ar/geoserver/hidrografia"
},
{
  "sourceid": "secretaria",
  "nombre":"Generales",
  "peso": 1,
  "type": "wmslayer",
  "servicio": "wms",
  "version": "1.3.0",
  "host": "https://idemindef.ign.gob.ar/geoserver/fabricas_empresas"
},
{
  "sourceid": "fa",
  "nombre":"Fuerza Armada",
  "peso": 1,
  "type": "wmslayer",
  "servicio": "wms",
  "version": "1.3.0",
  "host": "https://idemindef.ign.gob.ar/geoserver/fuerzas_armadas"
},
{
  "sourceid": "fa",
  "nombre":"Política de Género",
  "peso": 1,
  "type": "wmslayer",
  "servicio": "wms",
  "version": "1.3.0",
  "host": "https://idemindef.ign.gob.ar/geoserver/genero"
}
]
}

class UIApp {
  createArgenmap(){
    
    const style = document.createElement('style');
    style.innerHTML = `
    .header {
      background-color: ${app.theme.headerBackground};
    }
    .nav-tabs {
      background-color: ${app.theme.headerBackground};
    }
    .panel-default > .panel-heading {
      background-color: ${app.theme.menuBackground} !important;
    }
    .featureInfo h4{
      border-bottom:3px solid ${app.theme.menuBackground};
      margin:2em;
    }
    .featuresGroup {
      border-bottom: 2px solid ${app.theme.menuBackground};
    }
    .individualFeature {
      border-bottom: 1px dashed ${app.theme.menuBackground};
    }
    .nav-tabs > li.active > a {
      background-color: ${app.theme.activeLayer} !important;
    }
    .active {
      background-color: ${app.theme.activeLayer} !important;
    }
    .featureInfo h4 {
    border-bottom: 3px solid ${app.theme.menuBackground};
    }
   .featuresGroup {
    border-bottom: 2px solid ${app.theme.menuBackground};
    }
    .individualFeature {
    border-bottom: 1px dashed ${app.theme.menuBackground};
    }
    .active-layers-counter {
      background: ${app.theme.activeLayer} !important;
    }
    .panel-default > .panel-heading {
      color:${app.theme.textMenu};
    }
    .item-group-short-desc a {
      color:${app.theme.textLegendMenu};
    }
    .navbar-toggle .icon-bar {
      border: 1px solid ${app.theme.iconBar};
    }
    #sidebar-container{
      zindex: 1500;
      background-color:${app.theme.menuBackground};
    }
    @media (max-width: 768px) {
      #top-left-logo {
        background-repeat: no-repeat;
        background-image: url("${app.logo.srcLogoMini}");
        background-size: ${app.logo.miniHeight} ${app.logo.miniWidth};
        background-position: left 1px center;
        width: 70%;
      }
    }
    @media (min-width: 769px) {
      #top-left-logo {
        background-repeat: no-repeat;
        background-image: url("${app.logo.src}");
        background-size: ${app.logo.height} ${app.logo.width};
        background-position: left 1px center;
      }

    }
    `;

    document.head.appendChild(style);

    document.title  = app.title

    let icon = document.createElement("link")
    icon.rel = "icon"
    icon.href= app.favicon
    document.head.append(icon)

    let sicon = document.createElement("link")
    sicon.rel = "shortcut icon"
    sicon.href= app.favicon
    document.head.append(sicon)

    const uiHeader = new UIHeader
    uiHeader.render()
   

    
    const uimapa = document.createElement("div")
    uimapa.id = "mapa"

    let argenmap = document.getElementById("Argenmap")
    argenmap.append(uimapa)
    
    const uimenuLayers = new UIMenuLayers
    //container.append(uimenuLayers.printHTML())

    //////// New MENU ////////////////
    //estructura principal sin boostrap
    uimenuLayers.createMenu()

    //agrega tabs
    uimenuLayers.createTabs(newjson.tabs)

    //crea carpetas
    uimenuLayers.createFolder(newjson.folders)

    //crea subcarpetas
    uimenuLayers.createSubfolder(newjson.folders2)

    //agrega carpetas que llaman a un getcapabilities
    uimenuLayers.createFolderForGetCapabilities(newjson.wmslayers)
    
  }

}



