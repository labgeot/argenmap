class UIHeader{

  render(){
    
    let nav = document.createElement("nav")
    nav.className = "header"
    nav.innerHTML =  `
        <a id="top-left-logo-link" href="${app.website}" target="_blank">
            <img id="top-left-logo" src="src/styles/images/noimage.gif" alt="Logo ${app.title}" title="${app.title}">
        </a>
        <a id="top-right-logo-link" href="#" target="_blank">
          <img id="top-right-logo" src="" alt="" title="" style="top:11px;position:absolute;right:10px;float:right">
        </a>
    `;
    
    let aux = document.getElementById("Argenmap")
    aux.append(nav)

    let topright = document.getElementById("top-right-logo")
    if (app.referencias.show){
      topright.src = app.referencias.src
      topright.alt = "Referencias"
      topright.title = "Referencias"
      topright.style.width = app.referencias.width
      topright.style.height = app.referencias.height
      topright.onclick = function (){
        event.preventDefault();
            $.fancybox.open({
                src : 'src/styles/images/referencias.png',
                type : 'image',
                closeBtn: 'true'
            });
      }
    }
  }
}
