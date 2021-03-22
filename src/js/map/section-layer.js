const layerClasses = {
    wms: WmsLayer,
    wmts: WmtsLayer,
    tpl: TplLayer,
    overlay: OverlayLayer,
    vector: VectorLayer
};

const layerMethods = {
    wms: getWmsLayers,
    wmts: getWmtsLayers
};

class SectionLayer {

    name = '';
    description = '';
    image = '';

    subSections = [];
    layers = [];
    dependencies = {};

    service = null;
    mapMethods = null;

    constructor(section, service, map) {
        this.name = section.name;
        this.description = section.description;
        this.dependencies = section.dependencies;
        this.service = service;
        this.map = map;
        if (section.sections) {
            this.addSubSections(section.sections);
        }
        if (section.layers) {
            this.addLayers(section.layers);
        }
    }

    addSubSections(sections) {
        sections.forEach(section => {
            this.subSections.push(new SectionLayer(section, this.service, this.map));
        });
    }

    addLayers(layers) {
        layers.forEach(layerSource => {
            if (layerSource.isMultiLayer) {
                this.service[layerSource.type.toLowerCase()](layerSource, (result) => {
                    result.layers.forEach(downloadedLayer => {
                        this.addLayer({ ...downloadedLayer, ...layerSource}, true);
                    })
                });
            } else {
                this.addLayer(layerSource, false);
            }
        });
    }

    addLayer(layer, isAvailable) {
        const dependencies = this.dependencies.hasOwnProperty(layer.name) ? this.dependencies[layer.name] : [];
        this.layers.push(new layerClasses[layer.type.toLowerCase()](layer, isAvailable, dependencies, this.service, this.map));
    }

    removeLayer(layerToRemove) {
        const layerIdx = this.layers.findIndex(layer => layer === layerToRemove);
        if (layerIdx > -1)
            this.layers.splice(layerIdx, 1);
    }
}
