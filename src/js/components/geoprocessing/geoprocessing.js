
let geoprocessing = {
  'contour': GeoserviceFactory.Contour,
  'elevationProfile': GeoserviceFactory.ElevationProfile
}
let results_counter = 0

class Geoprocessing {

  formContainer = null;
  geoprocessId = null;
  geoprocessingConfig = null;
  geoprocessing = null;
  optionsForm = null;
  fieldsToReferenceLayers = [];

  setAvailableGeoprocessingConfig(geoprocessingConfig) {
    this.geoprocessingConfig = geoprocessingConfig;
  }

  displayResult(result) {
    switch (this.geoprocessId) {
      case 'contour': {
        let layername = 'contourResult_'+results_counter 
        results_counter++
        mapa.addGeoJsonLayerToDrawedLayers(result, layername, false);
        let item_GestorMenu = new Item_GestorMenu_UI
        item_GestorMenu.createElement("Curvas de Nivel", layername)
        break;
      }
      case 'elevationProfile':{
        //this.elevationDiv(result)
        console.log(result.coordinates[0])

      break;
      }
    }
    new UserMessage(`Geoproceso ejecutado exitosamente.`, true, 'information');
  }

  updateReferencedDrawedLayers(layers) {
    
    if (!this.optionsForm)
      return;
    if(this.geoprocessId==="contour"){
    this.fieldsToReferenceLayers.forEach(fieldId => {
      const element = this.optionsForm.getElement(fieldId);
      if (element.hasAttribute('references') && element.getAttribute('references') === 'drawedLayers') {
        const options = [];
        options.push({value: '', text: ''});
        const layerTypes = element.getAttribute('layerTypes').split(',');
        layerTypes.forEach(type => {
          if (layers.hasOwnProperty(type)) {
            layers[type].forEach(layer => {
              options.push({value: layer.name, text: layer.name});
            });
          }
        });
        this.optionsForm.setOptionsToSelect(fieldId, options);
      }
    });
  }
  if(this.geoprocessId==="elevationProfile"){
    this.fieldsToReferenceLayers.forEach(fieldId => {
      const element = this.optionsForm.getElement(fieldId);
      if (element.hasAttribute('references') && element.getAttribute('references') === 'drawedLayers') {
        const options = [];
        options.push({value: '', text: ''});
        const layerTypes = ["polyline"]
        layerTypes.forEach(type => {
          if (layers.hasOwnProperty(type)) {
            layers[type].forEach(layer => {
              options.push({value: layer.name, text: layer.name});
            });
          }
        });
        this.optionsForm.setOptionsToSelect(fieldId, options);
      }
    });
  }

  }
  

  buildOptionForm(fields) {
    this.optionsForm.clearForm();
    this.fieldsToReferenceLayers = [];
    const formFields = [];

    fields.forEach(field => {

      const id = field.name.toLowerCase().replace(/\s/g, "");

      switch (field.element) {
        case 'select': {
          const selectId = `select-${id}`;

          const options = [];
          options.push({value: '', text: ''});

          const extraProps = {};
          extraProps.title = field.name;
          if (field.references === 'drawedLayers') {
            this.fieldsToReferenceLayers.push(selectId);
            extraProps.references = 'drawedLayers';
            extraProps.layerTypes = field.allowedTypes;
            const editableLayers = mapa.getEditableLayers();

            if(this.geoprocessId==="contour"){
              field.allowedTypes.forEach(type => {
                editableLayers[type].forEach(layer => {
                  options.push({value: layer.name, text: layer.name});
                });
                
              });
            }else{
              editableLayers['polyline'].forEach(layer => {
                options.push({value: layer.name, text: layer.name});
              });
            }
          }

          const select = this.optionsForm.addElement('select', selectId, {
            title: field.name,
            events: {
              'change': (element) => {
                if (!element.value)
                  return;
                const layer = mapa.getEditableLayer(element.value);
                mapa.centerLayer(layer);
              }
            },
            extraProps: extraProps
          });
          this.optionsForm.setOptionsToSelect(selectId, options);

          formFields.push(select);
        };
        break;
        case 'input': {
          const extraProps = {};
          extraProps.type = field.type;
          extraProps.title = field.name;
          if (field.hasOwnProperty('min')) {
            extraProps.min = field.min;;
          }
          if (field.hasOwnProperty('max')) {
            extraProps.max = field.max;
          }
          const inputId = `input-${id}`;
          const input = this.optionsForm.addElement('input', inputId, {
            title: field.name,
            extraProps: extraProps
          });

          formFields.push(input);
        }
      }
    });

    this.optionsForm.addButton('Ejecutar', () => {
      let values = [];
      for (let i = 0; i < formFields.length; i++) {
        if (!formFields[i].value) {
          return new UserMessage(`El campo '${formFields[i].title}' está vacío.`, true, 'error');
        }

        if (formFields[i].hasAttribute('references') && formFields[i].getAttribute('references') === 'drawedLayers') {
          const layer = mapa.getEditableLayer(formFields[i].value);

          switch (this.geoprocessId) {
           case 'contour': {
              const sw = layer.getBounds().getSouthWest();
              values.push(sw.lng);
              values.push(sw.lat);
              const ne = layer.getBounds().getNorthEast();
              values.push(ne.lng);
              values.push(ne.lat);
              break;
            }
            case 'elevationProfile':{
              const sw = layer.getBounds().getSouthWest();
              values.push(sw.lng+" "+sw.lat);
              const ne = layer.getBounds().getNorthEast();
              values.push(ne.lng+" "+ne.lat);
              break;
            }
          }

        } else {
          values.push(+formFields[i].value);
        }
      }

      console.log("values es", values)
      console.log("geoproceso", this.geoprocessing)
      this.geoprocessing.execute(...values)
      .then(result => {
        this.displayResult(result);
        values = [];
      })
      .catch(error => {
        new UserMessage(error.message, true, 'error');
      });

      /*
      const item = this.geoprocessingConfig.availableProcesses.find( e => e.geoprocess === this.geoprocessId );
      let nuevothisgeoprocessing = ""
      nuevothisgeoprocessing = new geoprocessing[this.geoprocessId](item.baseUrl);
      console.log(...values, "valores de values")
      nuevothisgeoprocessing.execute(...values)
      .then(result => {
        this.displayResult(result);
        values = [];
      })
      .catch(error => {
        new UserMessage(error.message, true, 'error');
      });
*/


    });
  }

  buildForm() {
    const geoprocessingForm = new FormBuilder();
    const container = document.createElement('div');
    container.className = 'geoprocessing-form-container';

    container.appendChild(geoprocessingForm.form);

    const selectProcessId = 'select-process';
    geoprocessingForm.addElement('select', selectProcessId, {
      title: 'Seleccione el geoproceso',
      events: {
        'change': (element) => {
          if (!element.value) {
            this.optionsForm.clearForm();
            return;
          }
          this.geoprocessId = element.value;
          const item = this.geoprocessingConfig.availableProcesses.find( e => e.geoprocess === this.geoprocessId );
          this.geoprocessing = new geoprocessing[this.geoprocessId](item.baseUrl);
          this.buildOptionForm(this.geoprocessing.getFields());
        }
      }
    });

    const options = [];
    options.push({value: '', text: ''});
    this.geoprocessingConfig.availableProcesses.forEach(geoprocess => {
      options.push({value: geoprocess.geoprocess, text: geoprocess.name});
    });
    geoprocessingForm.setOptionsToSelect(selectProcessId, options);

    this.optionsForm = new FormBuilder();
    container.appendChild(this.optionsForm.form);

    return container;
  }

  getForm() {
    if (!this.formContainer) {
      this.formContainer = this.buildForm();
      mapa.addMethodToEvent(this.updateReferencedDrawedLayers.bind(this), 'add-layer');
      mapa.addMethodToEvent(this.updateReferencedDrawedLayers.bind(this), 'delete-layer');
    }
    return this.formContainer;
  }

  elevationDiv(result){
    let dive = document.createElement("div")
        dive.id = "elevation-div"
        dive.className = "elevation-div"
        let modal = document.createElement("div")
        modal.innerHTML =`
        <div id="ContainerER" class="ContainerTable ui-draggable ui-draggable-handle ui-resizable">
        <div id="icons-table">
        <a id="btnclose" class="icon-table"><span onclick='$("#ContainerER").remove();' id="remove" class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></div>
        <div id="elevation-div-results"></div>
        </div>`
        document.body.appendChild(modal)
         let aux = document.getElementById("elevation-div-results")
         aux.innerHTML = ""
         aux.append(dive)
        let otraresp = `{"name":"response","type":"FeatureCollection","features":[{"type":"Feature","geometry":${JSON.stringify(result)},"properties":null}]}`      
        var opts = {
            data: otraresp,
             options: {
              summary: "inline",
              detachedView: false,
              elevationDiv: '#elevation-div',
              zFollow: 12,
             legend: false,
            },
          }
        var controlElevation = L.control.elevation(opts.options);
        controlElevation.addTo(mapa);
        controlElevation.load(opts.data);
  }
}

