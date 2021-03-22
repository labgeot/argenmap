class Layer {

    id = '';
    className = '';
    name = '';
    type = '';
    host = '';
    opacity = 1;
    data = null;
    weight = null;
    icon = null;
    isActive = false;
    isAvailable = false;
    openWith = []; //Array of Layer

    service = null;
    map = null;

    constructor(layer, isAvailable, dependencies, service, map) {
        this.service = service;
        this.map = map;
        this.weight = layer.weight;
        this.host = layer.src;
        this.isAvailable = isAvailable;
        this.isActive = layer.selected;

        if (dependencies)
            this.loadDependencies(dependencies);

        map.addLayer(this);
        if (!this.isAvailable) {
            this.downloadLayer();
        } else {
            mapMethods.setLayerIsAvailable(this);

        }
    }

    loadDependencies(dependencies) {
        let layers = [];
        const interval = setInterval(() => {
            this.map.dataLayers.forEach(layer => {
                //search for section and layer
            });

            if (layers.length === dependencies.length)
                window.clearInterval(interval);
        }, 50);
    }

    async downloadLayer() {
        const layerData = await fetch(host)
        .then(res => {
            this.data = this.service.createLayer(res, this.type);
            this.isAvailable = true;
            this.map.setLayerIsAvailable(this);
        })
        .catch(error => {
            console.log(error);
            this.map.setLayerIsAvailable(this);
        })
    }

    get id() {
        return this.id;
    }

    get name() {
        return this.name;
    }

    get type() {
        return this.type;
    }

    get host() {
        return this.host;
    }

    get opacity() {
        return this.opacity;
    }

    get data() {
        return this.data;
    }

    get weight() {
        return this.weight;
    }

    get icon() {
        return this.icon;
    }

    get isActive() {
        return this.isActive;
    }

    get isAvailable() {
        return this.isAvailable;
    }

    get openWith() {
        return this.openWith;
    }

    set id(id) {
        this.id = id;
    }

    set name(name) {
        this.name = name;
    }

    set type(type) {
        this.type = type;
    }

    set host(host) {
        this.host = host;
    }

    set opacity(opacity) {
        this.opacity = opacity;
        this.service.changeLayerOpacity(this.data, opacity);
    }

    set data(data) {
        this.data = data;
    }

    set weight(weight) {
        this.weight = weight;
    }

    set icon(icon) {
        this.icon = icon;
    }

    set isActive(isActive) {
        this.isActive = isActive;
        if (this.isActive)
            this.service.addLayer(this.data);
        else
            this.service.removeLayer(this.data);
        this.openWith.forEach(layer => {
            if (this.isActive)
                this.service.addLayer(layer.data);
            else
                this.service.removeLayer(layer.data);
        });
    }

    set isAvailable(isAvailable) {
        this.isAvailable = isAvailable;
    }

    set openWith(openWith) {
        this.openWith = openWith;
    }
}
