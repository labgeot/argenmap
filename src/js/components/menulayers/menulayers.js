class UIMenuLayers{
  constructor(){
    this.html = `
      <div class="loading"><img src="src/styles/images/loading.gif"></div>
      <div id="sidebar" class="nav nav-sidebar panel panel-default"></div>
    `;
  }

  printHTML() {
    let aux = document.createElement("div")
    aux.id = "sidebar-container"
    aux.className="col-12 col-xs-12 col-sm-12 col-md-2 collapse sidebar _panel-group"
    aux.setAttribute("aria-expanded", false);
    aux.innerHTML = this.html
    return aux
  }

}