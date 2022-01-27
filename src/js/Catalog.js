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
            active:false,
            _layers:[]
            // legend: //TODO Add an icon from any Layer?
        }

        // At the moment it is only possible to add views passing the layer ID
        layers.forEach(layer_id => {
            view.layers.push(layer_id);

            view._layers.push(
                L.tileLayer.wms(this.layers[layer_id].host, {
                    layers: this.layers[layer_id].name,
                    format: 'image/png',
                    transparent: true,
                })
            );

        });

        let id = this.uniqueIdFrom(this.views);
        this.views[id] = view;
        console.log(`%c ✓ view ${title} added`, 'color: #0f0');
        return id;
    }

    getViews(){ return this.views }

    showView(view_id){
        let layers_id = this.views[view_id].layers;

        for (let layer_id of layers_id) {
            this.views[view_id]._layers.push(
                L.tileLayer.wms(this.layers[layer_id].host, {
                    layers: this.layers[layer_id].name,
                    format: 'image/png',
                    transparent: true,
                }).addTo(mapa)
            );
        }
    }

    getLayersFromView(view_id){
        return this.views[view_id].layers.map((layer_id => {
            return this.layers[layer_id];
        }));
    }

    getBboxLayersFromView(view_id){
        return this.views[view_id].layers.map((layer_id => {
            return {
                maxx: this.layers[layer_id].maxx,
                maxy: this.layers[layer_id].maxy,
                minx: this.layers[layer_id].minx,
                miny: this.layers[layer_id].miny,
            };
        }));
    }

    getLayersBy(key,value){
        let layers = {};
        Object.keys(this.layers).forEach((i)=>{
            if (this.layers[i][key]===value) layers[i] = this.layers[i];
        });
        return layers;
    }

    searchLayers(value,searchBy,maxResults){
        if (searchBy==undefined || typeof searchBy != 'object') throw new Error('El parametro <searchBy> es obligatorio y debe ser de tipo Array');
        let results = [];
        let sanitizedValue = value.trim().toLowerCase();
        // walk through the layers
        Object.keys(this.layers).some((layer_id)=>{
            // Cut the loop when the maximum results are reached (Optional)
            if (maxResults!=undefined && results.length >= maxResults) return true; // True corta el bucle some
            // Walk through the terms of search
            searchBy.some((prop)=>{
                if (this.layers[layer_id][prop]!=undefined) {
                    if(typeof this.layers[layer_id][prop] == 'string' && this.layers[layer_id][prop].trim().toLowerCase().includes(sanitizedValue)){
                        results.push({
                            id:layer_id,
                            name: this.layers[layer_id].name,
                            title: this.layers[layer_id].title,
                        });
                        return true;
                    }
                }
            })
        });
        return results;
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