const uiHeader = new UIHeader
const uimenuLayers = new UIMenuLayers
const uimapa = new UIMapa

class UIApp {
  /*  
  constructor(){
    theme = {}
  }

  set theme(){}
  get theme(){}
 */

  createArgenmap(){
    uiHeader.render()
   
    //create container - original HTML structure
    let container = document.createElement("div")
    container.className ="container-fluid row"

    container.append(uimenuLayers.printHTML())

    container.append(uimapa.printHTML())


    let argenmap = document.getElementById("Argenmap")
    argenmap.append(container)
  }

}



