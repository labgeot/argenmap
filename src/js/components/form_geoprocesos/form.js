let formularioHTML = `<form>
  <div class="form-group">
      <label for="sel1">Seleccionar</label>
      <select class="form-control" id="sel1">
        <option>Buffer de un punto</option>
        <option>Buffer de una capa</option>
        <option>Curvas de nivel</option>
        <option>Perfil de elevación</option>
    </select>
    <br>
  <button type="submit" class="btn btn-primary">execute</button>
</form>`

class FormGeoprocesos{

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
    console.log(content)
  }

}

function openGeoprocesos(){
  let formgeoprocesos = new FormGeoprocesos
  formgeoprocesos.createModal()
}