class Service {

    service = null;
    name = null;

    constructor(config) {
        throw new Error('Abstract class cannot be instantiated.');
    }

    setService(config) {
    }

    getService() {
    }

    setName(name) {
    }

    getName() {
    }

    setZoomLevel(level) {
    }

    setMinZoom(value) {
    }

    setMaxZoom(value) {
    }

    setCenter(lat, lng, zoomLevel = null) {
    }

    setBounds(lat, lng) {
    }

    setMaxBounds(lat, lng) {
    }

    getZoomLevel() {
    }

    getCenter() {
    }

    addBasemap(basemap) {
    }

    hasLayer(layer) {
    }

    locate(options) {
    }

    stopLocate() {
    }

    addPlugin(plugin) {
    }

    createLayer(layerData, type) {
    }

    createWmsLayer(layerData) {
    }

    createWmtsLayer(layerData) {
    }

    createWfsLayer(layerData) {
    }

    createTplLayer(layerData) {
    }

    createGeojsonLayer(layerData) {
    }

    createKmlLayer(layerData) {
    }

    createImageLayer(layerData) {
    }

    addLayer(layer) {
    }

    removeLayer(layer) {
    }

    changeLayerOpacity(layer, opacity) {
    }

    //Events
    onCenterChange(functions) {
    }

    onZoomChange(functions) {
    }

    onLayerChange(functions) {
    }

    onClick(functions) {
    }

    onDoubleClick(functions) {
    }

    onContextMenu(functions) {
    }

    onLoad(functions) {
    }
};
