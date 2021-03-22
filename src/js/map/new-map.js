class Map {

  serviceInstance = null;
  pluginHandler = null;

  baseLayers = new SectionLayer({ name: 'BaseLayers', description: '', type: 'TMS' });
  customBaseLayers = new SectionLayer({ name: 'CustomBaseLayers', description: '', type: 'TMS' });
  
  dataLayers = [];
  customDataLayers = [];

  availableLayers = [];
  activeLayers = [];

  constructor(config, excludedPlugins, layers) {
    //Start selected service. For now, only leaflet is available.
    this.startService(config.service, config.map);
    
    //Plugins are loaded in selected service.
    this.pluginHandler = new PluginHandler(this.serviceInstance, config.service, excludedPlugins);

    //Layers is an object with every group of layers (basemaps and sections)
    this.loadLayers(layers);
  }

  get baseLayers() {
    return this.baseLayers;
  }

  get customBaseLayers() {
    return this.customBaseLayers;
  }

  get dataLayers() {
    return this.dataLayers;
  }

  get customDataLayers() {
    return this.customDataLayers;
  }

  get availableLayers() {
    return this.availableLayers;
  }

  get activeLayers() {
    return this.activeLayers;
  }

  startService(service, mapConfig) {
    switch (service) {
      case 'leaflet': {
        this.serviceInstance = new Leaflet(mapConfig);
      }
      break;
    }
  }

  loadLayers(layers) {
    this.baseLayers.addLayers(layers.baseMaps);
    const mapMethods = {
      setLayerIsAvailable: this.setLayerIsAvailable,
      addLayer: this.addLayer
    }
    layers.sections.forEach(section => {
      this.dataLayers.push(new SectionLayer(section, this.serviceInstance, mapMethods));
    });
  }

  setLayerIsAvailable(layer) {
    this.availableLayers.push(layer);
  }

  addBasemapLayer(basemap) {
    this.baseLayers.push(basemap);
  }

  addLayer(layer) {
    this.dataLayers.push(layer);
  }

  activateLayer(layer) {
    //Every time a layer is activated, it should be checked that
    //they are being placed in the right order.

    //If layer is not already active...

    //TMS -> WMTS, IMAGE -> WMS...
    if (layer.className === 'TmsLayer') {
      //Only one TMS layer at a time and WMTS layers should be re-activated.
    } else {
      layer.isActive = true;
      this.activeLayers.push(layer);
      urlInteraction.layers(this.activeLayers);
    }
  }

  checkIfLayerIsAvailable(layerId) {
    //Important method to activate param layers
    if (this.availableLayers.find(layer => layer.id === layerId))
      return true;
    else
      return false;
  }

  addLayerToSection(section, layer) {

  }

  removeLayerFromSection(section, layer) {

  }
}
