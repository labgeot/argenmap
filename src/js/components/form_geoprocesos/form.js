let formularioHTML = `<form>
  <div style="background-color:white;"class="form-group">
      <label for="sel1">Seleccionar</label>
      <select class="form-control" id="sel1">
        <option>Buffer de un punto</option>
        <option>Buffer de una capa</option>
        <option>Curvas de nivel</option>
        <option>Perfil de elevación</option>
    </select>
    <br>
  <button type="submit" class="btn btn-primary">Ejecutar</button>
</form>`

const geoprocessingOptions = [
  {
    name: 'Buffer de un punto',
    fields: [
      {
        name: 'Punto',
        type: 'select',
        references: 'drawedLayers',
        allowedTypes: ['marker', 'circlemarker']
      }
    ]
  },
  {
    name: 'Buffer de una capa',
    fields: [
      {
        name: 'Capa',
        type: 'select',
        references: 'drawedLayers',
        allowedTypes: ['rectangle', 'polygon']
      }
    ]
  },
  {
    name: 'Curvas de nivel',
    fields: [
      {
        name: 'Capa',
        type: 'select',
        references: 'drawedLayers',
        allowedTypes: ['rectangle', 'polygon']
      }
    ]
  },
  {
    name: 'Perfil de elevación',
    fields: []
  }
]

class FormGeoprocesos{

  selectedGeoprocess = null;

  createElement(element, id, className) {
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
  }

  createTabContent(){
    let content = document.getElementById("main-menu-tab-Geoprocesos")
    let div = document.createElement("div")
    content.innerHTML = formularioHTML
    content.append(div)
  }

  buildForm() {
    const container = document.createElement('div');
    const form = document.createElement('form');

    const selectLabel = document.createElement('label');
    selectLabel.setAttribute('for', 'sel1');
    form.appendChild(selectLabel);

    const selectGeoprocess = document.createElement('select');
    selectGeoprocess.className = 'form-control';
    selectGeoprocess.id = 'sel1';
    form.appendChild(this.selectedGeoprocess);

    container.appendChild(form);
  }

  getTabContent() {
    //this.buildForm();

    return formularioHTML;
  }

  startGeoProcess() {
    console.log('start')
  }

}

function openGeoprocesos(){
  let formgeoprocesos = new FormGeoprocesos
  formgeoprocesos.createModal()
}