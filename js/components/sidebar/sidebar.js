let desplegado = false

class SidebarTools {

  constructor() {
    this.component = `
    <span id="sidebar-toolbar-span"class="glyphicon glyphicon-menu-left" aria-hidden="true">
    `;
  }

  createComponent(){
    const elem = document.createElement('div');
    elem.id="sidebar-toolbar-icon"
    elem.innerHTML = this.component;
    document.getElementById('mapa').appendChild(elem);
    //let measure2 = document.getElementsByClassName("leaflet-control-measure leaflet-bar leaflet-control")
    //measure2[0].id="measure-leaflet"
    
    $("#sidebar-toolbar-icon").click(function() {
      let button = document.getElementById("sidebar-toolbar-icon")
      button.innerHTML='<span id="sidebar-toolbar-span"class="glyphicon glyphicon-menu-right" aria-hidden="true">'
      let locate = document.getElementsByClassName("leaflet-control-locate leaflet-bar leaflet-control")
      let zoomhome = document.getElementsByClassName("leaflet-control-zoomhome leaflet-bar leaflet-control")
      let fullscreen = document.getElementsByClassName("leaflet-control-zoom-fullscreen fullscreen-icon")
      let customgraticule = document.getElementsByClassName("leaflet-control leaflet-control-customgraticule")
      let measure = document.getElementsByClassName("leaflet-control-measure leaflet-bar leaflet-control")
      
      let abrirarchivo = document.getElementById("modalgeojson")

      if(desplegado){
        let button = document.getElementById("sidebar-toolbar-icon")
        button.innerHTML='<span id="sidebar-toolbar-span" class="glyphicon glyphicon-menu-left" aria-hidden="true">'
        button.style.left="44px"
        desplegado = false
        zoomhome[0].hidden = false
        fullscreen[0].style.display = ""
        customgraticule[0].hidden = false
        locate[0].hidden = false
        measure[0].hidden = false
        abrirarchivo.style.display = ""
      }
      else{
        button.style.left="10px"
        desplegado = true
        zoomhome[0].hidden = true
        fullscreen[0].style.display = "none"
        customgraticule[0].hidden = true
        locate[0].hidden = true
        measure[0].hidden = true
        abrirarchivo.style.display = "none"
      }
      
     });
  }

}


