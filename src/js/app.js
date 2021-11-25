var baseLayers = {};
var baseLayersInfo = {};
var selectedBasemap = null;
let menu_ui = new Menu_UI;
var geoProcessingManager =null;
const impresorItemCapaBase = new ImpresorItemCapaBaseHTML(),
  impresorBaseMap = new ImpresorCapasBaseHTML(),
  impresorGroup = new ImpresorGrupoHTML(),
  impresorGroupWMSSelector = new ImpresorGroupWMSSelector(),
  urlInteraction = new URLInteraction(),
  geometry = new Geometry(),
  app = {
    profile: "default",
    profiles: {},
    layers: {},
    layerNameByDomId: {},
    templates: [
      "ign-geoportal-basic"
    ],

    init: async function (data) {
      Object.assign(app, data);

      if (Object.keys(app.profiles).length === 0) {
        app['profiles'] = {
          "default": { "data": [], "modules": [] }
        };
        app['profile'] = "default";
      };

      setBaseLayersInfo(app.items[0].capas);
      setBaseLayersZoomLevels(app.items[0].capas);
      gestorMenu.setBaseMapDependencies(app.items[0].capas);

      //Load table if is active
      if (app.hasOwnProperty('table')) {
        setTableAsPopUp(app.table.isActive);
        setTableFeatureCount(app.table.rowsLimit);
      }
      
      if (app.hasOwnProperty('charts')) {
        setCharts(app.charts.isActive);
      }

      if (app.hasOwnProperty('searchbar')) {
        setSearchbar(app.searchbar.isActive);
      }

      if (app.hasOwnProperty('layer_options')) {
        setLayerOptions(app.layer_options.isActive);
      }

      if (app.hasOwnProperty('geoprocessing')) {
        setGeoprocessing(app.geoprocessing.isActive);
      }

      await this._startModules();
    },

    _startModules: async function () {
      try {
        for (const module of app.profiles[app.profile].modules) {
          switch (module) {
            case "login":
                await login.load();
              break;
            // Intialize here more modules defined in profile (config JSON)
            default:
              break;
          }
        }
      } catch (error) {
        if (app.profiles == undefined) {
          console.warn("Profiles attribute isn't defined in configuration file.");
        } else {
          console.error(error);
        }
      }
    },

    _save: function (d) {
      let fileName = 'config.json',
        e = document.createEvent('MouseEvents'),
        a = document.createElement('a'),
        fileToSave = new Blob([JSON.stringify(d)], {
          type: 'application/json',
          name: fileName
        });

      a.download = fileName;
      a.href = window.URL.createObjectURL(fileToSave);
      a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
      e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      a.dispatchEvent(e);
    },

    saveConfig: function () {
      this._save(app)
    },

    addBasemaps: function () {

      app.items.forEach(element => {

        if (element.type == "basemap") {
          let item = element, tab = new Tab(item.tab),
            groupAux = new ItemGroupBaseMap(tab, item.nombre, item.seccion, item.peso, "", "", item.short_abstract, null);
          groupAux.setImpresor(impresorBaseMap);
          groupAux.setObjDom(".basemap-selector");

          for (let key2 in item.capas) {
            gestorMenu.setAvailableBaseLayer(item.capas[key2].nombre);
            let capa = new Capa(
              item.capas[key2].nombre,
              item.capas[key2].titulo,
              null,
              item.capas[key2].host,
              item.capas[key2].servicio,
              item.capas[key2].version,
              null,
              item.capas[key2].key,
              null,
              null,
              null,
              null,
              item.capas[key2].attribution
            );
            let basemap = new Item(
              capa.nombre,
              item.seccion + key2,
              "",
              capa.attribution,
              capa.titulo,
              capa,
              null
            );
            basemap.setLegendImg(item.capas[key2].legendImg);
            if (item.capas[key2].peso) {
              basemap.setPeso(item.capas[key2].peso);
            }
            if (item.capas[key2].selected && item.capas[key2].selected == true) {
              gestorMenu.setBasemapSelected(item.seccion + key2);
            }
            basemap.setImpresor(impresorItemCapaBase);
            groupAux.setItem(basemap);
          }
          gestorMenu.addTab(tab);
          gestorMenu.addItemGroup(groupAux);
        }
      });
      selectedBasemap = setBasemapToLoad(urlInteraction.layers, gestorMenu.availableBaseLayers);
    },

    removeLayers: function () {
      let sidebar = document.getElementById('sidebar');
      sidebar.querySelectorAll('*').forEach(n => n.remove());
      Object.keys(gestorMenu.items).forEach(key => {
        if (key != "mapasbase") {
          gestorMenu.items[key].hideAllLayers();
          gestorMenu.items[key].muestraCantidadCapasVisibles();
          delete gestorMenu.items[key];
        }
      });
    },

    addLayers: function () {

      app.items.forEach(element => {

        if (element.type != "basemap") {
          let item = element, tab = new Tab(item.tab),
            customizedLayers = (item.customize_layers == undefined) ? "" : item.customize_layers,
            featureInfoFormat = (item.feature_info_format == undefined) ? "application/json" : item.feature_info_format,
            impresorGroupTemp = impresorGroup;
          let profile = app.profiles[app.profile], matchItemProfile;
          if (profile.data.length === 0) {
            matchItemProfile = "";
          } else {
            // Process item if it's in profile
            matchItemProfile = app.profiles[app.profile].data.find(e => e == item.id);
          }

          if (matchItemProfile != undefined) {
            if (item.tab == undefined) {
              item.tab = "";
            }

            switch (item.type) {
              case "wmslayer":
                getGeoserverCounter++;
                if (tab.listType == "combobox") {
                  impresorGroupTemp = impresorGroupWMSSelector;
                }
                let wmsLayerInfo = new LayersInfoWMS(item.host, item.servicio, item.version, tab, item.seccion, item.peso, item.nombre, item.short_abstract, featureInfoFormat, item.type, customizedLayers, impresorGroupTemp);
                if (item.allowed_layers) {
                  wmsLayerInfo.setAllowebLayers(item.allowed_layers);
                }
                if (item.customize_layers) {
                  wmsLayerInfo.setCustomizedLayers(item.customize_layers);
                }
                gestorMenu.addTab(tab);
                gestorMenu.addLayersInfo(wmsLayerInfo);
                if (item.folders) {
                  gestorMenu.addFolders(item.seccion, item.folders);
                }
                break;
              case "wmts":
                getGeoserverCounter++;
                if (tab.listType == "combobox") {
                  impresorGroupTemp = impresorGroupWMSSelector;
                }
                let wmtsLayerInfo = new LayersInfoWMTS(item.host, item.servicio, item.version, tab, item.seccion, item.peso, item.nombre, item.short_abstract, featureInfoFormat, item.type, customizedLayers, impresorGroupTemp);
                if (item.allowed_layers) {
                  wmtsLayerInfo.setAllowebLayers(item.allowed_layers);
                }
                if (item.customize_layers) {
                  wmtsLayerInfo.setCustomizedLayers(item.customize_layers);
                }
                gestorMenu.addTab(tab);
                gestorMenu.addLayersInfo(wmtsLayerInfo);
                if (item.folders) {
                  gestorMenu.addFolders(item.seccion, item.folders);
                }
                break;
              default:
                let sourceTypeUndefined = "The 'type' parameter is not set for the source:" + item.host;
            }
          }
        }
      });

    },

    changeProfile: function (profile) {
      if (profile != app.profile) {
        if (profile != undefined && app.profiles[profile] != undefined) {
          try {
            app.profile = profile;
            app.removeLayers();
            app.addLayers();
            gestorMenu.printMenu();
            console.info(`Profile changed to ${profile}.`);
          } catch (error) {
            return error;
          }
        } else {
          let message = `Profile '${profile}' missing or not present in profiles property. Available profiles: ${Object.keys(app.profiles)}`;
          console.warn(message);
        }
      } else {
        console.info(`Profile ${profile} is already in use.`);
      }
    },

    setLayer: function (layer){
      this.layers[layer.capa.nombre] = layer
    },

    getLayers: function (){
      return this.layers;
    },

    getSections: function(){
    return gestorMenu.items;
    },

    getActiveLayers: function(){
      return overlayMaps;
    },

    getBaseMapPane: function(){
      return mapa.getPane("tilePane").firstChild;
    },

    addMenuSection: function(name_section){
      menu_ui.addSection(name_section)
    },

    addLayerBtn: function (name_section,name_layer){
      menu_ui.addLayer(name_section,name_layer)
    },

    showLayer: function (layer_name){
      gestorMenu.muestraCapa(app.layers[layer_name].childid)
    },

    argenmapDarkMode: function(){
      this.showLayer('argenmap')
      mapa.getPane("tilePane").firstChild.style="filter:  invert(1) brightness(1.5) hue-rotate(180deg);"
      let stylesui = new StylesUI;
      stylesui.createdarktheme()
      let oldstyle = document.getElementById("main-style-ui")
      //oldstyle.innerHTML=""
      
    }
     
      
  }

let getGeoserverCounter = 0,
  keywordFilter = 'dato-basico-y-fundamental',
  template = "",
  templateFeatureInfoFieldException = [],
  gestorMenu = new GestorMenu();

$.getJSON("./src/config/data.json", async function (data) {
  $.getJSON("./src/config/preferences.json", async function (preferences) {
      gestorMenu.setLegendImgPath('src/config/styles/images/legends/');
      await loadTemplate({ ...data, ...preferences }, false);
  })
  .fail(async function( jqxhr, textStatus, error ) {
    console.warn( "Template not found. Default configuration will be loaded.");
    await loadDefaultJson();
  });
})
.fail(async function( jqxhr, textStatus, error ) {
  console.warn( "Template not found. Default configuration will be loaded.");
  await loadDefaultJson();
});

async function loadDefaultJson() {
  $.getJSON("./src/config/default/data.json", async function (data) {
    $.getJSON("./src/config/default/preferences.json", async function (preferences) {
        gestorMenu.setLegendImgPath('src/config/default/styles/images/legends/');
        await loadTemplate({ ...data, ...preferences }, true);
    });
  });
};

async function loadTemplate(data, isDefaultTemplate) {
  $(document).ready( async function() {
    await app.init(data);

    //Template
    template = app.template; // define wich template to use

    let stylesui = new StylesUI;
    stylesui.createstyles()
    //Load template config
    loadTemplateStyleConfig(template, isDefaultTemplate);

    delete app['template']; // delete template item from data

    //templateFeatureInfoFieldException
    if (app.template_feature_info_exception) {
      templateFeatureInfoFieldException = app.template_feature_info_exception; // define not showing fields in feature info popup
      delete app['template_feature_info_exception']; // delete template item from data
    }

    //Layers Joins (join several layers into one item)
    if (app.layers_joins) {
      gestorMenu.setLayersJoin(app.layers_joins);
      delete app['layers_joins']; // delete template item from data
    }

    //Folders (generate folders items into main menu to generate logical groups of layers)
    if (app.folders) {
      gestorMenu.setFolders(app.folders);
      delete app['folders']; // delete folders item from data
    }

    //Add Analytics
    if (app.analytics_ids) {
      addAnalytics(app.analytics_ids);
    }

    

    //Load dynamic mapa.js
    app.template_id = template;
    
    $.getScript(`src/js/map/map.js`);
    
    
    app.addBasemaps();
    app.addLayers();

    template = 'templates/' + template + '/main.html';

    //Wait until global 'mapa' object is available.
    const intervalID = setInterval(() => {
      if (mapa && mapa.hasOwnProperty('_leaflet_id')) {
        window.clearInterval(intervalID);

        CSS_PLUGINS.forEach((value, i) => {
          $('head').append(value);
        });



        if (urlInteraction.areParamsInUrl) {
          mapa.setView(L.latLng(urlInteraction.center.latitude, urlInteraction.center.longitude), urlInteraction.zoom);
        }

        $.getScript("src/js/components/zoomLevel/ZoomLevel.js").done(function(){
          const zoomLevel = new ZoomLevel(mapa.getZoom());
          urlInteraction.zoom = mapa.getZoom();
          mapa.on('zoom', () => {
            if (Number.isInteger(mapa.getZoom())) {
              urlInteraction.zoom = mapa.getZoom();
              zoomLevel.zoom = mapa.getZoom();
              geoProcessingManager.svgZoomStyle(mapa.getZoom())
            }
        });
        })

        

        urlInteraction.center = mapa.getCenter();
        mapa.on('moveend', () => {
          urlInteraction.center = mapa.getCenter();
        });

        gestorMenu.loadInitialLayers(urlInteraction);

        $.getScript("src/js/components/sidebar/sidebar.js").done(function(){
          const sidebarTool = new SidebarTools;
          sidebarTool.createComponent();
        })

        setProperStyleToCtrlBtns();

        //FILES
        $.getScript("src/js/components/openfiles/openfiles.js").done(function(){
          const modalgeojson = new IconModalGeojson;
          modalgeojson.createComponent();
        })
        //<!-- Leaflet Image -->
        $.getScript("https://unpkg.com/leaflet-image@0.4.0/leaflet-image.js");
        //<!-- Proj4.js -->
        $.getScript("https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.7.5/proj4.js");
        //<!-- FileLayer and dependencies -->
        $.getScript("src/js/plugins/FileLayer/omnivore/omnivore.min.js");
        $.getScript("src/js/plugins/FileLayer/shapefile/shp.min.js");
        $.getScript("src/js/plugins/FileLayer/FileLayer.js");

        /////////TABLE & TABULATOR
        $('head').append('<link rel="stylesheet" href="src/js/plugins/tabulator/tabulator.min.css">');
        $('head').append('<link rel="stylesheet" href="src/js/components/table/table.css">');
        $.getScript("src/js/plugins/tabulator/tabulator.min.js");
        $.getScript("src/js/components/table/Datatable.js");
        $.getScript("src/js/components/table/UI.js");
        $.getScript("src/js/components/table/table.js");
        $.getScript("src/js/components/table/TouchPunch.js");

        //screenshot
        $.getScript("src/js/components/screenshot/screenshot.js").done(function(){
          const sc = new Screenshot;
          sc.createComponent();
        })

        //if searchbar is active in menu.json
        if(loadSearchbar){
          $('head').append('<link rel="stylesheet" type="text/css" href="src/js/components/searchbar/searchbar.css">');
          $.getScript("src/js/components/searchbar/searchbar.js")
          .done(function() {
            var searchBar_ui =  new Searchbar_UI
            searchBar_ui.create_sarchbar();
          })
        }

        //if charts is active in menu.json
        if (loadCharts) {
          $.getScript("https://d3js.org/d3.v5.min.js");
          $.getScript("src/js/components/charts/charts.js");
          $('head').append('<link rel="stylesheet" type="text/css" href="src/js/components/charts/charts.css">');
        }

        if(loadGeoprocessing){
          $('head').append('<link rel="stylesheet" type="text/css" href="src/js/components/geoprocessing/geoprocessing.css">');
          $('head').append('<link rel="stylesheet" type="text/css" href="src/js/components/form-builder/form-builder.css">');
          $('head').append('<link rel="stylesheet" href="src/js/map/plugins/leaflet/leaflet-elevation/leaflet-elevation.css">');
          $('head').append('<link rel="stylesheet" type="text/css" href="src/js/components/form-builder/form-builder.css">');
            $.getScript("src/js/plugins/geoprocess-executor/geoprocess-executor.js").done(function(){
              $.getScript("src/js/components/form-builder/form-builder.js").done(function(){
                $.getScript("src/js/components/geoprocessing/geoprocessing.js").done(function(){
                  geoProcessingManager = new Geoprocessing();
                  geoProcessingManager.createIcon();
                  geoProcessingManager.setAvailableGeoprocessingConfig(app.geoprocessing)
                });
              })
            })

        }

      }
    }, 100);

  });
};

