class Catalog {
    constructor(){
        this.layers = {};
        this.views = {};

        console.log('%c ✓ Initialized catalog', 'color: #0f0');
    }

    addLayer(layer){
        this.layers[this.uniqueIdFrom(this.layers)] = layer;
    }

    addLayers(layers){
        layers.forEach(layer => {
            this.layers[this.uniqueIdFrom(this.layers)] = layer;
        });
    }

    addView(title,description,layers){
        let view = {
            title:title,
            description:description,
            layers:[],
            // legend: //TODO Add an icon from any Layer?
        }

        // At the moment it is only possible to add views passing the layer ID
        layers.forEach(layer_id => {
            view.layers.push(layer_id);
        });

        this.views[this.uniqueIdFrom(this.views)] = view;
        console.log(`%c ✓ view ${title} added`, 'color: #0f0');
        return view;
    }

    getViews(){ return this.views }

    showView(view_id){
        let layers_id = this.views[view_id].layers;

        for (let layer_id of layers_id) {
            L.tileLayer.wms(this.layers[layer_id].host, {
                layers: this.layers[layer_id].name,
                format: 'image/png',
                transparent: true,
            }).addTo(mapa);
        }
    }

    getLayersBy(key,value){
        let layers = {};
        Object.keys(this.layers).forEach((i)=>{
            if (this.layers[i][key]===value) layers[i] = this.layers[i];
        });
        return layers;
    }

    /**
     * Generates a unique random ID composed of numbers and letters, checking the existing IDs
     * @returns A string of a long between 9 and 12 characters
     */

    // Get a unique ID from
    uniqueIdFrom(validate){
        let random;

        do {
            // toString() accepts an optional parameter as a base, the basis is given 36 which uses a large number of characters to represent numbers.
            random = Math.random().toString(36).split('.')[1];
        } while (validate[random]!=undefined);
        
        return random;
    }
}