class TabGeometry {

  createGeometryLayer(group, name){

    let container =  document.getElementById("main-menu-tab-Geometrias")
    if(container){
      
      //busco carpeta si no esta la creo
      let folder = document.getElementById(group+"-folder")
      if(!folder){
        folder = document.createElement("div")
        folder.id = group+"-folder"
        folder.className = "folder-geometrias"
        folder.innerHTML = `<span>${group}</span></div>`
        container.append(folder)
      }

      let newlayer = document.createElement("div")
      newlayer.id = "geometria-"+name

      let div= document.createElement("div")
      div.className = "capa-geometria"
      let eliminar = `onClick="deleteLayerGeometry('${name}')"`
      let showhide = `onClick="clickGeometryLayer('${name}')"`
      //mapa.editableLayers.rectangle[0].downloadGeoJSON()

      div.innerHTML = ` 
      <div id ="geometry-name-${name}" ${showhide} class="geometry-name-active" style="display:flex; flex-direction:row;">
        <div style="width:60%;"><span>${name}</span></div>
        <div class="icon-layer-geo"><i  ${eliminar} class="fas fa-edit" title="editar"></i></div>
        <div class="icon-layer-geo"><i  ${eliminar} class="fas fa-search-plus" title="acercar"></i></div>
        <div class="icon-layer-geo"><i  ${eliminar} class="fas fa-download" title="descargar"></i></div>
        <div class="icon-layer-geo"><i  ${eliminar} class="far fa-trash-alt" title="eliminar"></i></div>
      </div>
      `
      newlayer.append(div)
      folder.append(newlayer)
      //hide tabs  $("#li-Geometrias").click()

    }
  }
}

function deleteLayerGeometry(layer){
  mapa.deleteLayer(layer)
  let id = "geometria-"+layer
  let aux = document.getElementById(id)
  console.log(aux)
  aux.innerHTML= ""
}

function clickGeometryLayer(layer){
  let aux = document.getElementById("geometry-name-"+layer)
  if(aux.className === "geometry-name-active"){
    aux.className = "geometry-name" 
    mapa.hideLayer(layer)
  }
  else{
    aux.className = "geometry-name-active"
    mapa.showLayer(layer)
  }
}