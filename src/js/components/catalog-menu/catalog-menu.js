var CATALOG_MENU_MODAL_OPEN = false;

class CatalogMenuModal {
	constructor() {
		this.component = `
    <div id="catalog-menu-button" title="Catálogo de capas">
        <div id="catalog-menu-button-content" class="center-flex" onClick=cmModal.open()>
            <img src="src/js/components/catalog-menu/catalog-menu-icon.svg" width="18" height="18">
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

CATALOG_NEW_VIEW = {
	layers:[],
	title:null
}

class CMModal {
	constructor() {
		
		// this.actions = [
		// 	{
		// 		name: 'WMS',
		// 		id: 'wms-action',
		// 		icon: 'src/js/components/loadServices/icon-load-services.svg',
		// 		component: new IconModalLoadServices
		// 	},
		// 	{
		// 		name: 'Archivos',
		// 		id: 'files-action',
		// 		icon: 'src/js/components/openfiles/folder-open-solid.svg',
		// 		component: new IconModalGeojson
		// 	},
		// 	// {
		// 	// 	name: 'WMTS',
		// 	// 	id: 'wmts-action',
		// 	// 	icon: 'src/js/components/wmts/wmts-solid.svg',
		// 	// 	component: new WmtsLoadLayers
		// 	// },
		// ];

		// this.selectedAction = 0;
	}


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
		let divContainer = document.createElement("div")
		divContainer.id = "catalog-menu-modal"
		divContainer.className = "catalog-menu-modal"


		let header = document.createElement('div');
		header.classList.add('modalHeader');

		let modalTitle = document.createElement('h4');
		modalTitle.innerText = 'Catálogo de recursos';

		let closeButton = document.createElement('button');
		closeButton.classList.add('modalCloseButton');


		closeButton.innerHTML = '<i title="cerrar" class="fa fa-times icon_close_mf" aria-hidden="true"></i>';
		closeButton.onclick = function () {
			document.body.removeChild(document.getElementById("catalog-menu-modal"));
			document.getElementById("catalog-menu-button-content").style.backgroundColor = "rgba(255, 255, 255, 0.9)";
			CATALOG_MENU_MODAL_OPEN = false;
		};




		header.appendChild(modalTitle);
		header.appendChild(closeButton);

		divContainer.appendChild(header);


		/**
		 * Search section
		 */
		divContainer.appendChild(this.createTitleElement('h6','Búsqueda de capas'));
		let form = document.createElement('form');
        form.id = 'catalog-menu-search';
        form.innerHTML = `
            <input type="text" class="form-control" disabled>
            <button class="btn btn-primary">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
					<path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
				</svg>
            </button>
        `;
        divContainer.appendChild(form);

		let newViewContainer = document.createElement('div');
		newViewContainer.id = 'catalog-new-view-container';
		divContainer.appendChild(newViewContainer);


		/**
		 * Resource list
		 */

		 let divResoucesList = document.createElement('div');
		 divResoucesList.classList.add('mt-3');
		 divResoucesList.appendChild(this.createTitleElement('h6','Todos los servicios'));
		 let catalogList = document.createElement('div');
		 catalogList.id ='catalog-list';

		 resources.forEach((rsrc)=>{
			let catalogItem = document.createElement('div');
			catalogItem.classList.add('catalog-list-item');
			// Add title
			catalogItem.appendChild(this.createTitleElement('h6',rsrc.name));
	
			// Add layers count and action button
			let countAction = document.createElement('div');
			countAction.classList.add('layers-count-action');
	
			let span = document.createElement('span');
			span.innerHTML = `
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-layers" viewBox="0 0 16 16"> <path d="M8.235 1.559a.5.5 0 0 0-.47 0l-7.5 4a.5.5 0 0 0 0 .882L3.188 8 .264 9.559a.5.5 0 0 0 0 .882l7.5 4a.5.5 0 0 0 .47 0l7.5-4a.5.5 0 0 0 0-.882L12.813 8l2.922-1.559a.5.5 0 0 0 0-.882l-7.5-4zm3.515 7.008L14.438 10 8 13.433 1.562 10 4.25 8.567l3.515 1.874a.5.5 0 0 0 .47 0l3.515-1.874zM8 9.433 1.562 6 8 2.567 14.438 6 8 9.433z"/> </svg>
				${Object.keys(catalog.getLayersBy('resource_id',rsrc.id)).length} Capas`
			countAction.appendChild(span);
	
			let button = document.createElement('button');
			button.innerText = `Seleccionar capas`;
			button.classList.add('btn');
			button.classList.add('btn-link');
			button.onclick = (e) => {
				if (document.getElementById('checklist-container')) document.getElementById('checklist-container').remove();
				// console.log(rsrc);
				e.target.innerText = 'Cerrar'
	
				let checkList = document.createElement('div');
				checkList.id = 'checklist-container';
				
				Object.keys(catalog.getLayersBy('resource_id',rsrc.id)).forEach((layer_id)=>{
					let label = document.createElement('label');
					label.classList.add('checkbox-item');
					let input = document.createElement('input');
					input.type = 'checkbox';
					input.name = layer_id;
	
					input.onchange = (e) => {
						if(e.target.checked){
							CATALOG_NEW_VIEW.layers.push(layer_id);
	
							if (document.getElementById('catalog-new-view')) document.getElementById('catalog-new-view').remove();
		
							let catalogNewView = document.createElement('div');
							catalogNewView.id ='catalog-new-view';
	
							catalogNewView.append(this.createTitleElement('h6','Capas seleccionadas'));
							
							
							let ul = document.createElement('ul');
							CATALOG_NEW_VIEW.layers.forEach((layerViewId,i)=>{
								let li = document.createElement('li');
								li.innerHTML = `&#9900; ${catalog.layers[layerViewId].title}`;
								let buttonRemove = document.createElement('button');
								buttonRemove.innerHTML = `x`;
								buttonRemove.onclick = function() {
									CATALOG_NEW_VIEW.layers.splice(i,1);
									li.remove();
									input.checked = false;
								}
								li.append(buttonRemove);
								ul.append(li);
							})
							
							catalogNewView.append(ul);

							let viewForm = document.createElement('form');
							viewForm.id = 'catalog-new-view-form';

							let input = document.createElement('input');
							input.classList.add('form-control');
							input.placeholder = "Nombre de la vista";
							input.onchange = (e) => {
								CATALOG_NEW_VIEW.title = e.target.value;
							}
							viewForm.append(input);
	
							let buttonView = document.createElement('button');
							buttonView.innerText = `Crear vista`;
							buttonView.classList.add('btn');
							buttonView.classList.add('btn-sm');
							buttonView.classList.add('btn-info');
							buttonView.onclick = (e) => {
								e.preventDefault();
								let newId = catalog.addView(CATALOG_NEW_VIEW.title,'test description',CATALOG_NEW_VIEW.layers);
								menu_ui.addCatalogViewToMenu('Vistas del catálogo','catalog-views', newId, CATALOG_NEW_VIEW.title);
								// updateLayersMenu(argenmap.views);
								catalogNewView.remove();
								CATALOG_NEW_VIEW = {
									title:null,
									layers:[]
								}
							}
							viewForm.append(buttonView);
							catalogNewView.append(viewForm);
							newViewContainer.append(catalogNewView);
	
						}
	
	
	
					}
	
					label.appendChild(input);
					label.appendChild(document.createTextNode(this.humanize(catalog.layers[layer_id].title)));
	
					checkList.appendChild(label);
				})
	
				catalogItem.appendChild(checkList)
	
	
			}
			countAction.appendChild(button);
	
			// Add to item
			catalogItem.appendChild(countAction);
	
			// Add item to list
			catalogList.appendChild(catalogItem);
		})
	
		// Add list to container
		divResoucesList.appendChild(catalogList);

		divContainer.appendChild(divResoucesList);







		// let mainSection = document.createElement('div');
		// mainSection.classList.add('modalMainSection');

		// let nav = document.createElement('div');
		// nav.classList.add('modalNav');

		// let content = document.createElement('div');
		// content.classList.add('modalContent');

		// this.actions.forEach((action, i) => {
		// 	let btn = document.createElement('button');
		// 	if (action.icon && action.icon.length) {
		// 		btn.innerHTML = `<img src="${action.icon}" width="18" height="18">`
		// 	} else {
		// 		btn.innerText = action.name;
		// 	}
		// 	btn.classList.add('modalNavButton');
		// 	btn.addEventListener('click', function () {
		// 		this.selectedAction = i;
		// 		modal.showActions(this.selectedAction);
		// 	})

		// 	nav.appendChild(btn);

		// 	let actionContent = document.createElement('div');
		// 	actionContent.id = action.id;
		// 	actionContent.classList.add('actionContent');
		// 	actionContent.classList.add('disableAction');
		// 	actionContent.innerText = action.content;

		// 	content.appendChild(actionContent);

		// })



		// mainSection.appendChild(nav);
		// mainSection.appendChild(content);

		// divContainer.appendChild(mainSection);


		document.body.appendChild(divContainer);

		$("#catalog-menu-modal").draggable({
			containment: "#mapa"
		})
	}


	open() {
		if(!CATALOG_MENU_MODAL_OPEN){
			document.getElementById("catalog-menu-button-content").style.backgroundColor = "rgba(238, 238, 238, 0.9)";
			cmModal.createModal();
			// modal.showActions(0);
			CATALOG_MENU_MODAL_OPEN = true;
		}
	}

	createTitleElement(type,text) {
		let el = document.createElement(type);
		el.innerText = text;
		return el;
	}

	humanize(str) {
		var i, frags = str.split('_');
		for (i=0; i<frags.length; i++) {
			frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1).toLowerCase();
		}
		return frags.join(' ');
	}

	
	

	// showActions(actionIndx) {
	// 	let elements = document.querySelectorAll('.actionContent');
	// 	elements.forEach(el => el.classList.add('disableAction'))
	// 	elements[actionIndx].classList.remove('disableAction');

	// 	let buttons = document.querySelectorAll('.modalNavButton');
	// 	buttons.forEach(el => el.classList.remove('modalNavButtonActive'))
	// 	buttons[actionIndx].classList.add('modalNavButtonActive');

	// 	// console.log(this.actions);

	// 	// Remove previous
	// 	// if (previous) this.actions[previous].component.removeComponent();

	// 	let component = this.actions[actionIndx].component.createComponent();
	// 	document.getElementById(this.actions[actionIndx].id).innerHTML = '';
	// 	document.getElementById(this.actions[actionIndx].id).append(component);
	// }
}

let cmModal = new CMModal();