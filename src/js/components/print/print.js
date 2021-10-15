class Print {
  constructor() {
    this.component = `
      <div class="center-flex" id="print" title="print" onclick=printMap('mapa')>
          <div class="center-flex" id="iconPR-container">
            <div id="iconPR"><span class="fas fa-print" aria-hidden="true"></span></div>
          </div>
      </div>
    `;
  }

  createComponent() {
    const elem = document.createElement("div");
    elem.innerHTML = this.component;
    document.getElementById("mapa").appendChild(elem);
  }
}

const printMap = async (el) => {
  // Change icon state
  var icon = document.querySelector('#iconPR .fas');
  icon.classList.remove("fa-print");
  icon.classList.add('fa-spinner');
  // Animate the icon with the CSS animation property
  document.getElementById('iconPR').style.animation = 'spin 1s linear infinite';

  
  // Get the map element
  let mapElm = document.getElementById(el);
  // Get map sizes
  let width = mapElm.offsetWidth;
  let height = mapElm.offsetHeight;

  leafletImage(mapa, function(err,canvas) {
    if(err){
      alert('Ocurrio un error al descargar la imagen');
      console.warn(err);

      document.getElementById('iconSC').style.animation = 'none';
      icon.classList.remove('fa-spinner');
      icon.classList.add("fa-camera");

      return null;
    }

    // Create an img element where set the image
    var img = document.createElement('img');
    img.width = width;
    img.height = height;
    // Set the src with the obtained canvas
    img.src = canvas.toDataURL();

    let today = new Date();
    
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    
    var yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    
    let formatedDate = dd + '/' + mm + '/' + yyyy;

    
    var doc = new jsPDF({
      orientation: 'l', // landscape
      unit: 'pt',
      format: [canvas.width, canvas.height+42] // added 42 pt for the watermark
    });
    
    doc.addImage(img.src, "JPEG", 0, 0, img.width, img.height,'mapa','SLOW',0); 
    
    // IGN logo in base64 format
    let logo = "data:image/png;base64,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";
    doc.addImage(logo, "PNG", img.width-55, img.height+2, 53, 38,'logo','SLOW',0); 
    
    doc.text(img.width-38-440, img.height+27, `Impreso el día ${formatedDate} mediante el visor ARGENMAP`);

    let filename = `argenmap-${today.getTime()}`; 
    
    doc.save(filename + '.pdf');

    // Leave the icon as it was initially
    document.getElementById('iconPR').style.animation = 'none';
    icon.classList.remove('fa-spinner');
    icon.classList.add("fa-print");

  });




}