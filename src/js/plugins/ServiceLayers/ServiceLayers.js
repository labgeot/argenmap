class ServiceLayers{
    constructor(){
        this.layers = null;
        this.url = null;
        this.rawData = null;
        this.title = null;
        this.abstract = null;
        this.id = null;
    }

    getLayers(){
        return this.layers;
    }
    
    getTitle(){
        return this.title;
    }

    getId(){
        return this.id;
    }

    loadWMS(url) {
        return new Promise((res,rej)=>{
            this.handleURL(url).then((data)=>{
                this.rawData = data;
                this.title = this.rawData.Service.Title;
                this.id = generateId(this.title);
    
                let host = getHost(this.url);
    
                this.layers = this.rawData.Capability.Layer.Layer.map((layer) => {
                    return {
                        name: layer.Name,
                        title: layer.Title,
                        srs: layer.BoundingBox[0].crs,
                        host: host,
                        minx: layer.BoundingBox[0].extent[0],
                        maxx: layer.BoundingBox[0].extent[1],
                        miny: layer.BoundingBox[0].extent[2],
                        maxy: layer.BoundingBox[0].extent[3],
                        attribution: layer.Attribution,
                        abstract: layer.Abstract,
                        legend:layer.Style[0].LegendURL[0].OnlineResource,
                        hostName:layer.Style[0].LegendURL[0].Name
                    }
                });
                res(this.layers);
    
            }).catch((error)=>{rej(error)})
        })
    }

    handleURL(url){
        return new Promise((resolve,reject)=>{
            if (!url) {
                reject('url parameter is required');
            }
    
            this.url = validateUrl(url);

            // Get data
            return fetch(this.url)
            .then(function (response) {
                return response.text();
            })
            .then(function (text) {
                // Instantiate the capabilities Parser
                const wmsParser = new WMSCapabilities();
                // Parse and resolve
                resolve(wmsParser.parse(text));
            }).catch((error)=>{
                reject('Malformed wms url',error);
            })
        })

    }
}

function generateId() {
    // A horrible but quickly way to parse String
    return 'wms-'+(new Date().getTime() + "").substr(6);
}

function getHost(getCapabilitiesURL) {
    let scheme = getCapabilitiesURL.includes('http') || getCapabilitiesURL.includes('https');
    
    let newURL = "";

    if (scheme) {
        // Se recorta la url para dejar por fuera el scheme http o https
        newURL = getCapabilitiesURL.split('//')[1];
    }else{
        newURL = getCapabilitiesURL;
    }

    if (newURL.includes('geoserver')) {
        newURL = newURL.split('/');
        newURL = newURL.splice(0,3).join('/');

    }else{
        newURL = newURL.split('/');
        newURL = newURL.splice(0,2).join('/');

    }

    return 'https://'+newURL+'/wms?';
}

/**
 * Check and transform url if it necessary, adding service=wms, getCapabilities or http scheme
 * @param {String} url to getCapabilities
 * @returns validated url
 */

// TODO https://sig.se.gob.ar/wmspubmap?service=wms&request=GetCapabilities&version=1.3.0

// https://sig.se.gob.ar/wmspubmap?service=wms&request=GetCapabilities&version=1.3.0


function validateUrl(url) {
    let service = url.includes('service=wms');
    let getCapabilities = url.includes('request=GetCapabilities');

    let newURL = "";

    if(!service || !getCapabilities){
        let scheme = url.includes('http') || url.includes('https');

        if (scheme) {
            // Se recorta la url para dejar por fuera el schemeo http o https
            newURL = url.split('//')[1];
        }else{
            newURL = url;
        }

        if (newURL.includes('geoserver')) {
            newURL = newURL.split('/');
            newURL = newURL.splice(0,3).join('/');

        }else{
            newURL = newURL.split('/');
            newURL = newURL.splice(0,2).join('/');

        }

        return 'https://'+newURL+'/ows?service=wms&version=1.3.0&request=GetCapabilities';
    }

    
    if (url.includes('https')) {
        // url = url.replace('https','http');
    }else if(!url.includes('http')) {
        url = 'https://'+url
    }

    return url;
}