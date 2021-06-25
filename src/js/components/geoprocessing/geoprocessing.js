const geoprocessing = {
  'contour': GeoserviceFactory.Contour
}

class Geoprocessing{

  formContainer = null;
  geoprocessId = null;
  geoprocessingConfig = null;
  geoprocessing = null;
  optionContentForm = null;

  setAvailableGeoprocessingConfig(geoprocessingConfig) {
    this.geoprocessingConfig = geoprocessingConfig;
  }

  /* createElement(element, id, className) {
    let aux = document.createElement(element);
    if (id) {
      aux.id = id;
    }
    if (className) {
      aux.className = className;
    }
    return aux;
  }

  createModal() {
    let divContainer = this.createElement(
      "div",
      "modalGeoprocesos",
      "modalGeoprocesos"
    );
    divContainer.appendChild(this.createElement("div", "icons-modalfile"));
  
    document.body.appendChild(divContainer);

    let btnclose = this.createElement(
      "a",
      "btnclose-icon-modalfile",
      "icon-modalfile"
    );
    btnclose.innerHTML =
      '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>';
    btnclose.onclick = function () {
      document.body.removeChild(modalGeoprocesos);
      document.getElementById("iconopenfile-container").disabled = false;
      document.getElementById("modalgeojson").style.color = "black";
      geojsonfile = "";
    };

    let spantitle = this.createElement(
      "span",
      "title-icon-modalfile",
      "icon-modalfile"
    );
    spantitle.innerHTML = "Geoprocesos";
    document.getElementById("icons-modalfile").append(spantitle);
    document.getElementById("icons-modalfile").append(btnclose);

    let formulario = this.createElement("div", "formgeo");
    formulario.innerHTML = formularioHTML
    document.getElementById("modalGeoprocesos").append(formulario);
  } */

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
    if (!this.optionContentForm)
      return;
    
    Array.from(this.optionContentForm.childNodes).forEach(element => {
      if (element.hasAttribute('references') && element.getAttribute('references') === 'drawedLayers') {
        element.innerHTML = '';
        element.appendChild(this.createOption('', ''));
        const layerTypes = element.getAttribute('layerTypes').split(',');
        layerTypes.forEach(type => {
          if (layers.hasOwnProperty(type)) {
            layers[type].forEach(layer => {
              element.appendChild(this.createOption(layer.name, layer.name));
            });
          }
        });
      }
    });
  }

  createOption(value, text) {
    const option = document.createElement('option');
    option.value = value;
    option.text = text;
    return option;
  }

  buildOptionForm(fields) {
    this.optionContentForm.innerHTML = '';
    const formFields = [];

    fields.forEach(field => {

      const name = field.name.toLowerCase().replace(/\s/g, "");
      const elementLabel = document.createElement('label');
      elementLabel.setAttribute('for', name);
      elementLabel.innerHTML = field.name;
      this.optionContentForm.appendChild(elementLabel);

      switch (field.element) {
        case 'select': {

          const element = document.createElement('select');
          element.className = 'geoprocessing-form-input';
          element.id = name;
          formFields.push(element);

          element.appendChild(this.createOption('', ''));

          element.addEventListener("change", (e) => {
            if (!element.value)
              return;
            
            const layer = mapa.getEditableLayer(element.value);
            mapa.centerLayer(layer);
          });

          if (field.references === 'drawedLayers') {
            element.setAttribute('references', 'drawedLayers');
            element.setAttribute('layerTypes', field.allowedTypes);
            const editableLayers = mapa.getEditableLayers();
            field.allowedTypes.forEach(type => {
              editableLayers[type].forEach(layer => {
                element.appendChild(this.createOption(layer.name, layer.name));
              });
            });
          }

          this.optionContentForm.appendChild(element);
        };
        break;
        case 'input': {
          const element = document.createElement('input');
          element.className = 'geoprocessing-form-input';
          element.id = name;
          element.type = field.type;
          formFields.push(element);

          if (field.hasOwnProperty('min')) {
            element.min = field.min;
          }
          if (field.hasOwnProperty('max')) {
            element.max = field.max;
          }
          this.optionContentForm.appendChild(element);
        }
      }
    });

    const executeBtn = document.createElement('div');
    executeBtn.className = 'geoprocessing-btn non-selectable-text';
    executeBtn.innerHTML = 'Ejecutar';
    executeBtn.onclick = (e) => {
      e.preventDefault();

      const values = [];
      for (let i = 0; i < formFields.length; i++) {
        if (!formFields[i].value) {
          return new UserMessage(`El campo ${formFields[i].id} está vacío.`, true, 'error');
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
    }
    this.optionContentForm.appendChild(executeBtn);
  }

  buildForm() {
    const container = document.createElement('div');
    container.className = 'geoprocessing-form-container';
    const form = document.createElement('form');
    form.className = 'geoprocessing-form';

    const selectLabel = document.createElement('label');
    selectLabel.setAttribute('for', 'sel1');
    selectLabel.innerHTML = 'Seleccione el geoproceso';
    form.appendChild(selectLabel);

    const selectGeoprocess = document.createElement('select');
    selectGeoprocess.className = 'geoprocessing-form-input';
    selectGeoprocess.id = 'sel1';
    selectGeoprocess.addEventListener("change", (e) => {
      if (!selectGeoprocess.value) {
        this.optionContentForm.innerHTML = '';
        return;
      }

      this.geoprocessId = selectGeoprocess.value;
      this.geoprocessing = new geoprocessing[selectGeoprocess.value](this.geoprocessingConfig.baseUrl);
      this.buildOptionForm(this.geoprocessing.getFields());
    });
    form.appendChild(selectGeoprocess);

    selectGeoprocess.appendChild(this.createOption('', ''));

    this.geoprocessingConfig.availableProcesses.forEach(geoprocess => {
      selectGeoprocess.appendChild(this.createOption(geoprocess.geoprocess, geoprocess.name));
    });

    const optionContentForm = document.createElement('form');
    optionContentForm.className = 'geoprocessing-form';
    this.optionContentForm = optionContentForm;

    container.appendChild(form);
    container.appendChild(optionContentForm);

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

  /* getTabContent() {
    //this.buildForm();
    let contour = new GeoserviceFactory.Contour(
      "http://172.20.205.70:8080/geoserver/ows?service=WPS&version=1.0.0"
    );
    console.log(contour.getFields());
    contour
    .execute(-69.84479, -34.17065, -69.82531, -34.15469, 100)
    .then((result) => {
      console.log(result);
    })
    .catch(error => {
      console.log(error);
    });

    //return formularioHTML;
    return this.buildForm();
  } */

  /* startGeoProcess() {
    console.log('start')
  } */

}

/* function openGeoprocesos(){
  let formgeoprocesos = new FormGeoprocesos
  formgeoprocesos.createModal()
}
 */
