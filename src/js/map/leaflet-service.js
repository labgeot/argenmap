class Leaflet extends Service {
    constructor(config) {
        this.setService(config);
    }

    setService(config) {
        this.service = new Leaflet(config);
    }

    getService() {
        return this.service;
    }

    setName(name) {
        this.name = name;
    }

    getName() {
        return this.name;
    }

    createLayer(layerData, type) {
        if (!LAYER_TYPES.find(layerType => layerType === type)) {
            console.warn(`Type ${type} is not valid.`);
            return null;
        }
        const capitalizedType = type[0].toUpperCase() + type.slice(1).toLowerCase();
        const methodName = `create${capitalizedType}Layer`;
        return this[methodName](layerData);
    }

    createWmsLayer(layerData) {
        //
        return layer;
    }

    createWmtsLayer(layerData) {
        //
        return layer;
    }

    createWfsLayer(layerData) {
        //
        return layer;
    }

    createTplLayer(layerData) {
        //
        return layer;
    }

    createGeojsonLayer(layerData) {
        //
        return layer;
    }

    createKmlLayer(layerData) {
        //
        return layer;
    }

    createImageLayer(layerData) {
        //
        return layer;
    }

    addLayer(layer) {
        if (!this.service.hasLayer(layer))
            this.service.addLayer(layer);
    }

    removeLayer(layer) {
        if (this.service.hasLayer(layer))
            this.service.removeLayer(layer);
    }

    changeLayerOpacity(layer, type, opacity) {
        switch (type.toLowerCase()) {
            case 'wms': {
            }
            break;
            case 'wmts': {
            }
            break;
            case 'wfs': {
            }
            break;
            case 'tpl': {
            }
            break;
            case 'geojson': {
            }
            break;
            case 'kml': {
            }
            break;
            case 'image': {
            }
            break;
        }
    }
}
