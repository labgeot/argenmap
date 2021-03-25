class UIHeader{
  constructor(){
    this.html = `
    <div class="container-fluid col-12 col-xs-12 col-sm-12 col-md-12">
      <div class="navbar-header">
        <button type="button" class="hidden-lg hidden-md navbar-toggle collapsed pull-left" data-toggle="collapse"
          data-target="#sidebar-container" aria-expanded="false" aria-controls="sidebar">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand navbar-right">
          <span class="xxsmall-hide">
            <a id="top-left-logo-link" href="#" target="_blank">
              <img id="top-left-logo" src="src/styles/images/noimage.gif" alt="" title="">
            </a>
          </span>
        </a>
      </div>
      <div id="navbar" class="navbar-collapse collapse"></div>
      <span class="xxsmall-hide">
        <a id="top-right-logo-link" href="#" target="_blank">
          <img id="top-right-logo" src="src/styles/images/noimage.gif" alt="" title=""
            style="top:11px;position:absolute;right:10px;width:144px;float:right">
        </a>
      </span>
    </div>
    `;
  }

  render(){
    let nav = document.createElement("nav")
    nav.className = "navbar _navbar-inverse navbar-fixed-top"
    nav.innerHTML = this.html
    let aux = document.getElementById("Argenmap")
    aux.append(nav)
  }

}

