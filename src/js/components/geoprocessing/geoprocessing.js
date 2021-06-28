const geoprocessing = {
  'contour': GeoserviceFactory.Contour
}

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

  createTabContent(){
    /* let content = document.getElementById("main-menu-tab-Geoprocesos")
    let div = document.createElement("div")
    content.innerHTML = formularioHTML
    content.append(div) */
  }

  displayResult(result) {
    switch (this.geoprocessId) {
      case 'contour': {
        mapa.addGeoJsonLayerToDrawedLayers(result, 'a', false);
      }
      break;
    }
    new UserMessage(`Geoproceso ejecutado exitosamente.`, true, 'information');
  }

  updateReferencedDrawedLayers(layers) {
    if (!this.optionsForm)
      return;

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
            field.allowedTypes.forEach(type => {
              editableLayers[type].forEach(layer => {
                options.push({value: layer.name, text: layer.name});
              });
            });
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
      const values = [];
      for (let i = 0; i < formFields.length; i++) {
        if (!formFields[i].value) {
          return new UserMessage(`El campo '${formFields[i].title}' está vacío.`, true, 'error');
        }

        if (formFields[i].hasAttribute('references') && formFields[i].getAttribute('references') === 'drawedLayers') {
          const layer = mapa.getEditableLayer(formFields[i].value);

          switch (layer.type) {
            case 'rectangle': {
              const sw = layer.getBounds().getSouthWest();
              values.push(sw.lng);
              values.push(sw.lat);
              const ne = layer.getBounds().getNorthEast();
              values.push(ne.lng);
              values.push(ne.lat);
            }
            break;
          }

        } else {
          values.push(+formFields[i].value);
        }
      }
      this.geoprocessing.execute(...values)
      .then(result => {
        this.displayResult(result);
      })
      .catch(error => {
        new UserMessage(error.message, true, 'error');
      });
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
          this.geoprocessing = new geoprocessing[element.value](this.geoprocessingConfig.baseUrl);
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
}
