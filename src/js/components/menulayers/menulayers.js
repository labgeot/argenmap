let downloadIcon = `<i class="fas fa-download"></i>`

class UIMenuLayers{
  
  createMenu(){
    let menu = document.createElement("div")
    menu.id= "menu"
    
    let tabm = document.createElement("div")
    tabm.id = "tabMenu-argenmap"
    tabm.className = "tab"
    menu.append(tabm)

    let container = document.createElement("div")
    container.id = "containerMenu-argenmap"
    container.style.display ="none"
    menu.append(container)

    let argenmap = document.getElementById("Argenmap")
    argenmap.append(menu)
  }

  createTabs(data){
    let tabs = data
    let tabcontainer = document.getElementById("tabMenu-argenmap")
    let container = document.getElementById("containerMenu-argenmap")
    let aux = ""

    tabs.forEach((element,i) => {
      //aux += `<button id="${element.id}" class="tablinks" value=false onclick="openTab(event, '${element.id}')">${element.name}</button>`
      aux += `<button id="${element.id}" class="tablinks" value=false onclick="openTab(event, '${element.id}')"><img style="width:25px" src="${element.iconsrc}" title="${element.name}"></button>`
      let content = document.createElement("div")
      content.id =  `${element.id}-tabcontent`
      content.className = "tabcontent"
      container.append(content)
    })

    tabcontainer.innerHTML =aux
  }

  createFolder(folders){
    folders.forEach((element,i) => {

    let id = element.tabid + "-tabcontent"
    let contenedor = document.getElementById(id)

    let aux = document.createElement("div")
    aux.className = "folder"
    
    aux.id=element.id
    aux.name = element.name
    let divname = document.createElement("div")
    divname.onclick = () => {
      colapseFolder(element.id);
    }
    divname.innerHTML = `<img style="width:15px" src="src/styles/icons/folder.svg"> ${element.name}`
    aux.append(divname)

    let container = document.createElement("div")
    container.className = "folderContainer"
    container.id = element.id + "-folderContainer"
    container.style.display="none"

    aux.append(container)
    contenedor.append(aux)
    })
  }

  //se va reemplazar por createFolder
  createSubfolder(folders){

    folders.forEach((element,i) => {
      let id = element.folderid+"-folderContainer"
      let contenedor = document.getElementById(id)
  
      let aux = document.createElement("div")
      aux.className = "folder"
      aux.id=element.id
      aux.name = element.name

      let divname = document.createElement("div")
      divname.onclick = () => {
        colapseFolder(element.id);
      }
      divname.innerHTML = `<img style="width:15px" src="src/styles/icons/folder.svg"> ${element.name}`
      aux.append(divname)

      let container = document.createElement("div")
      container.className = "folderContainer"
      container.id = element.id + "-folderContainer"
      container.style.display="none"

      aux.append(container)
      contenedor.append(aux)
      })
  }

  createFolderForGetCapabilities(items){
    //por ahora solo con wms
   for(var key in items) {
    let id = ""
    if(items[key].sourceid.includes("tab-")){
      id = items[key].sourceid+"-tabcontent"
    } else{id = items[key].sourceid + "-folderContainer"}
    let container = document.getElementById(id)
    let aux = document.createElement("div")

    aux.className="folder"
    aux.id = `folder${key}`
    aux.type = items[key].type
        aux.innerHTML = `
        <div onclick='loadWmslayer("${items[key].host}","${items[key].version}","${key}")' 
        id="btnfolder${key}" key="${key}" 
        class="tablinks" host="${items[key].host}" 
        version="${items[key].version}" 
        alt="${items[key].short_abstract}"><img style="width:15px" src="src/styles/icons/folder.svg"> ${items[key].nombre}
        </div>
      `
    container.append(aux)
   }
    
  }

  createSimpleItem(item){
    //item simple que no necesita hacer un getcapabilities (como idera)???
  }

  createLayer(){
    //objeto que va ser llamado en la funcion loadWmslayer
  
  }
  
}

class UIDownloadLayers{
//recibe: formatos disponibles (wms/wfs)para descargar capa.
//construye: modal para descargar capa
}

class UILayerStyle{
  //recibe: capa y funciones para modificar estilos
  //construye: div que se despliega en el menu de capas, con inputs type range

  //pruebas en consola: css filters pueden ser aplicadas en basemaps, wms y wmts
  //overlayMaps.puntos_de_comunicacion_AT010.setOpacity(0.5)
  /*
  filter: url("filters.svg#filter-id"); ----->>> se pueden armar filtros con archivo svg
  filter: blur(5px);
  filter: brightness(0.4);
  filter: contrast(200%);
  filter: drop-shadow(16px 16px 20px blue);
  filter: grayscale(50%);
  filter: hue-rotate(90deg);
  filter: invert(75%);
  filter: opacity(25%);
  filter: saturate(30%);
  filter: sepia(60%);
  */
  }

  class UISearchMenu{
    //recibe: nombre de capas?
    //construye: div en menu de capas para realizar una busqueda
    }

//funcion provisoria para obtener datos reales de un getcapabilities
function loadWmslayer(host, version,key){
  let container = document.getElementById("foldercontent"+key)
  let capa = new UIMenuLayers

  if(!container){
    let folder = document.getElementById("folder"+key)

    let divfolder = document.createElement("div")
    divfolder.id = "foldercontent"+key
    folder.appendChild(divfolder)

      let url = `${host}/ows?service=wms&version=${version}&request=GetCapabilities`
      let xml =""
      fetch (url)
      .then(response => response.text())
      .then(data => {
        const parser = new DOMParser();
        xml = parser.parseFromString(data, "application/xml");
        let aux = xml.getElementsByTagName("Capability")[0].getElementsByTagName("Layer")[0].getElementsByTagName("Layer")
        let container = document.getElementById("foldercontent"+key)
        let lista = document.createElement("div")
        let auxHtml = ``
        let getmap = xml.getElementsByTagName("GetMap")[0].getElementsByTagName("Format")
        
        //reemplazar por la clase UIdownloadLayers
        let formats = "Formatos disponibles WMS ------>"
        for (let i = 0; i < getmap.length; i++){
          formats += "   "+getmap[i].textContent
        }

        for (let i = 0; i < aux.length; i++){
          let title = aux[i].getElementsByTagName("Title")[0].textContent
          let imgurl=aux[i].getElementsByTagName("Style")[0].getElementsByTagName("LegendURL")[0].getElementsByTagName("OnlineResource")[0].getAttribute('xlink:href')+"&scale=1"
          let name = aux[i].getElementsByTagName("Name")[0].textContent
          let bbox = aux[i].getElementsByTagName("BoundingBox") //BBox es necesario para downloadlayers
          let id = `layeritem${key}-${i}`

           //reemplazar por createlayers//
          auxHtml+= `
          <div>
            <div  id="${id}" class="layerItem layeroff">
            <div class="imgLayer" onClick="addLayerUI('${name}','${id}')"><img style="width:20px; height: 20px" src="${imgurl}" alt="logo de capa ${title}"></div>  
            <div class="nameLayer" onClick="addLayerUI('${name}','${id}')">${title}</div>
            <div class="downloadLayerIcon" onClick="alert('${formats}')"><i class="fas fa-download"></i></i></i></div>
            <div class="editLayerIcon" onClick="editLayerUI('edit-${id}')"><i class="fas fa-edit"></i></div>
            </div>
            <div id="edit-${id}" class="editLayer" ></div>
            </div>
            `

        }
    
        lista.innerHTML= auxHtml
        container.appendChild(lista)


      })
      .catch(console.error);

  }else{
    if (container.style.display != "none"){
      container.style.display = "none"
    }else{container.style.display = "block"}
  }

}

function colapseFolder(id){
  let iditem =  id+"-folderContainer"
  let container = document.getElementById(iditem)
  if (container.style.display != "none"){
    container.style.display = "none"
  }else{container.style.display = "block"}
}

//funcion provisoria para activar capas
function addLayerUI(name,id){
  gestorMenu.muestraCapa(gestorMenu.getLayerIdByName(name))
  let classitem = document.getElementById(id).className

  if (classitem === "layerItem layeroff"){
    document.getElementById(id).className = "layerItem layeron"
  }else{
    document.getElementById(id).className = "layerItem layeroff"
  }
}

function openTab(evt, id) {
  let container = document.getElementById("containerMenu-argenmap")
  container.style.display ="block"
  let name = id+"-tabcontent"
  let cond =document.getElementById(name).style.display

  if (cond != "block"){

    let i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
      container.style.display ="block"
    }

    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    let aux = name
    document.getElementById(aux).style.display = "block"
    evt.currentTarget.className += " active";
  
  }else{
    document.getElementById(name).style.display = "none"
    container.style.display ="none"
    evt.currentTarget.className = "tablinks"
  }
}


function editLayerUI(id){
  let aux =  document.getElementById(id)
  
  if(aux.innerHTML===""){
    aux.display="block"
    //provisorio de clase UILayerStyle
    aux.innerHTML= `edicion de capa filters css + Opacidad<input type="range" id="vol" name="opacidad" min="0" max="1">`
  }else{
    aux.innerHTML=""
  }
  
}