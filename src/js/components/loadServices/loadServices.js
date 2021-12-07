
let openService = false;
let serviceLayers = [];
let selectedServiceLayers = [];
let servicesLoaded = [];
let layersIndex = [];

class IconModalLoadServices {
  constructor() {
    this.component = `
    <div class="center-flex" id="modalloadservices" title="Cargar WMS">
        <div class="center-flex" id="iconloadservices-container" onClick=modalService.OpenLoadServices()>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" ><path d="M13.18 13.53c-1.24 0-2.33-.51-3.08-1.32l-1.58.72c-.23.1-.48.15-.73.15s-.49-.05-.72-.15L2.15 10.7l-1.77.8a.68.68 0 0 0 0 1.22l7.09 3.21c.2.09.44.09.65 0l5.33-2.41c-.09.01-.18.01-.27.01zM9 9.43V4.78l-.88-.4a.74.74 0 0 0-.65 0L.38 7.59a.68.68 0 0 0 0 1.22l7.09 3.22c.2.09.44.09.65 0l1.39-.63C9.18 10.81 9 10.14 9 9.43zm3.877-5.334c1.737.001 3.118 1.406 3.123 3.113v1.964a3.13 3.13 0 0 1-3.123 3.123c-1.722 0-3.124-1.401-3.123-3.123V8.094a.33.33 0 0 1 .551-.242c.267.248.572.461.907.625a.33.33 0 0 1 .186.296v.38c0 .814.65 1.49 1.465 1.498a1.48 1.48 0 0 0 1.494-1.479V7.219a1.48 1.48 0 0 0-1.48-1.48c-.107 0-.203.013-.275.026a.33.33 0 0 1-.284-.082.82.82 0 0 1-.263-.603v-.612a.33.33 0 0 1 .274-.324c.18-.032.364-.048.548-.048zM12.876 0a3.13 3.13 0 0 0-3.123 3.123v1.953c.005 1.718 1.386 3.123 3.123 3.124.184 0 .367-.016.548-.048a.33.33 0 0 0 .274-.324v-.612a.82.82 0 0 0-.263-.603.33.33 0 0 0-.284-.082c-.071.013-.167.026-.275.026a1.48 1.48 0 0 1-1.48-1.48V3.124a1.48 1.48 0 0 1 1.494-1.479c.814.008 1.465.684 1.465 1.498v.38a.33.33 0 0 0 .186.296 3.8 3.8 0 0 1 .907.625.33.33 0 0 0 .552-.242V3.123A3.13 3.13 0 0 0 12.876 0z"/></svg>
        </button>
    </div>
    `;
  }

  createComponent() {
    const elem = document.createElement("div");
    elem.innerHTML = this.component;
    document.getElementById("mapa").appendChild(elem);
  }
}

class ModalService{
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
      let modalContainer = document.createElement("div")
    modalContainer.id = "modalLoadServices"
    modalContainer.className = "modalLoadServices"

    let mainIcons = document.createElement("div")
    mainIcons.className = "icons-modalservices"

    let f_sec = document.createElement("section")
    f_sec.style = "width:95%"

    let s_sec = document.createElement("section")
    s_sec.style = "width:5%"
    let btnclose = document.createElement("a")
    btnclose.id = "btnclose-icon-modalservices"
    btnclose.className = "icon-modalservices"
    btnclose.innerHTML ='<i title="cerrar" class="fa fa-times icon_close_mf" aria-hidden="true"></i>';
    btnclose.onclick = function () {
      document.body.removeChild(modalLoadServices);
      document.getElementById("iconloadservices-container").disabled = false;
      document.getElementById("modalloadservices").style.color = "black";
      openService=false;
      // openService = false;
      // currentLayers = [];
    };
    s_sec.append(btnclose);

    mainIcons.append(f_sec)
    mainIcons.append(s_sec)

    
    let tab_div = document.createElement("div")
    tab_div.className = "tabs_upload"
    tab_div.innerHTML = `
    <span style="font-size:12px;color:#37bbed;margin:0px 10px;text-align:center;width:100%">Carga de capas a través de WMS</span>`
    
    let form = document.createElement("form")
    form.className = "wms-form"
    

    
    form.innerHTML = `
    <div class="input-group">
    <span class="input-group-addon" id="basic-addon1"><i class="fas fa-link"></i></span>
    <input value="http://nodoide.catamarca.gob.ar/geoserver/idecat/ows?service=wms&version=1.3.0&request=GetCapabilities" type="text" name="input-url" class="form-control" placeholder="http://.../geoserver/ows?service=wms&version=1.3.0....." aria-describedby="basic-addon1">
    <span class="input-group-addon" id="buttonConectar" onclick="handleURLInput()">Conectar</span>
    </div>
    `
    
    let selectLayersContainer = document.createElement("div")
    selectLayersContainer.id = 'select-layers-container';
    
    let mainContainerFile = document.createElement("div")
    mainContainerFile.id = "file_gestor"
    mainContainerFile.style = "width:80%"
    
    let alert = document.createElement("div");
    alert.className = "alert alert-danger"
    alert.setAttribute('id','wrongURL');
    alert.innerHTML = `
      <strong>Ups!</strong> El formato de la URL es incorrecto. <small>Esperado: http://dominio.com/geoserver/workspace/service</small>
    `;

    let button = document.createElement("button");
    button.className = "btn btn-info"
    button.setAttribute('id','buttonEnd');
    button.innerText = 'Terminar';
    button.onclick = function () {
      document.body.removeChild(modalLoadServices);
      document.getElementById("iconloadservices-container").disabled = false;
      document.getElementById("modalloadservices").style.color = "black";
      openService=false;
    };

    modalContainer.append(mainIcons);
    modalContainer.append(tab_div);
    modalContainer.append(form);
    modalContainer.append(alert);
    modalContainer.append(selectLayersContainer);
    modalContainer.append(button);
    document.body.appendChild(modalContainer);


  $( "#modalLoadServices" ).draggable({containment: "#mapa"}) }

  OpenLoadServices() {
    if(!openService){
      openService=true;
      document.getElementById("iconloadservices-container").disabled = true;
      document.getElementById("modalloadservices").style.color = "grey";
      modalService.createModal();
      servicesLoaded = [];
      layersIndex = [];
    }
  }

}

let modalService = new ModalService();


function handleURLInput() {
  let url = document.getElementsByName('input-url')[0].value;

  const serviceLayer = new ServiceLayers();

  serviceLayer.loadWMS(url).then((layers)=>{
    document.getElementById('wrongURL').style.display = 'none';
    document.getElementById('buttonEnd').style.display = 'block';
    // Add the service and layers to the array with loaded layers
    servicesLoaded[serviceLayer.getId()] = {
      title:serviceLayer.title,
      id:serviceLayer.id,
      abstract:serviceLayer.abstract,
      layers:[]
    }
    // Create the container and show the data
    let wmsResultContainer = document.createElement('div');
    // Show title and layers count
    let title = serviceLayer.getTitle();
    let serviceID = serviceLayer.getId();
    let header = document.createElement('div');
    header.classList.add("page-header");
    header.innerHTML = `
        <div class="title-service">
          <h5 id="title-text-${serviceID}">${title}</h5>
          <input type="text" class="title-input-service" id="title-input-${serviceID}">
        </div>
        <small>${layers.length} capas obtenidas</small>
      `;
    let editButton = document.createElement('button');
    editButton.classList.add('fas');
    editButton.classList.add('fa-pen-square');
    editButton.setAttribute('id',`title-edit-${serviceID}`);
    editButton.onclick = function (event) {
      editServiceTitle(serviceID,event)
    };     

    let saveButton = document.createElement('button');
    saveButton.classList.add('fas');
    saveButton.classList.add('fa-save');
    saveButton.setAttribute('id',`title-save-${serviceID}`);
    saveButton.onclick = function (event) {
      saveServiceTitle(serviceID,event)
    };
    saveButton.style.display = 'none';
    
    header.childNodes[1].append(editButton);
    header.childNodes[1].append(saveButton);

    wmsResultContainer.append(header);
    // Show layers and checkboxes
    layers.forEach((layer)=>{
      // serviceLayers.push(layer);
      layersIndex[layer.name] = serviceLayer.getId();
      servicesLoaded[serviceLayer.getId()].layers[layer.name] = layer;

      let checkLabel = document.createElement('label');
      checkLabel.innerHTML = `
      <input type="checkbox" value="${layer.name}" onchange="handleLayerCheck(event)">&nbsp;${capitalize(layer.title)}
      `;
      wmsResultContainer.append(checkLabel);
    })
    // Add the container to the modal
    document.getElementById('select-layers-container').prepend(wmsResultContainer);

  }).catch((error)=>{ 
    console.error(error); 
    document.getElementById('wrongURL').style.display = 'block';
  });
}

function editServiceTitle(serviceID,event) {
  event.target.style.display = 'none';

  let text = document.getElementById(`title-text-${serviceID}`);
  let input = document.getElementById(`title-input-${serviceID}`);
  let value = text.innerText;

  text.style.display = 'none';
  input.style.display = 'block';
  
  let button = document.getElementById(`title-save-${serviceID}`);
  button.style.display = 'block';
  input.value = value;

  input.focus();
}

function saveServiceTitle(serviceID,event) {
  event.target.style.display = 'none';
  
  let text = document.getElementById(`title-text-${serviceID}`);
  let input = document.getElementById(`title-input-${serviceID}`);
  let value = input.value;
  
  menu_ui.editGroupName(serviceID,text.innerText,value);
  servicesLoaded[serviceID].title = value;
  text.innerText = value;
  
  text.style.display = 'block';
  input.style.display = 'none';

  let editButton = document.getElementById(`title-edit-${serviceID}`);
  editButton.style.display = 'block';
}


function handleLayerCheck(e) {
  if(e.target.checked){
    selectedServiceLayers.push(e.target.value);
    menu_ui.addLayerToGroup(servicesLoaded[layersIndex[e.target.value]].title,e.target.value,layersIndex[e.target.value],e.target.value,servicesLoaded[layersIndex[e.target.value]].layers[e.target.value])
  }else{
    let layerIndex = selectedServiceLayers.findIndex(l=> l == e.target.value );
    if(layerIndex!=-1) selectedServiceLayers.splice(layerIndex,1);
  }
}

function capitalize(word) {
  return word[0].toUpperCase() + word.slice(1).toLowerCase();
}