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

var _catalogNewView = {
	layers:[],
	title:null
}

class CMModal {
	constructor() {
	
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

		let inputSearch = document.createElement('input');
		inputSearch.classList.add('form-control');

		let buttonSearch = document.createElement('button')
		buttonSearch.classList.add('btn');
		buttonSearch.classList.add('btn-primary');
		buttonSearch.innerHTML= `
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
				<path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
			</svg>
        `;

		let searchResults = document.createElement('div');
		searchResults.id = 'catalog-search-results';


		inputSearch.oninput = (e) => {
			setTimeout(() => {
				if (e.target.value.length) {
					let results = catalog.searchLayers(e.target.value,['name','title','abstract'],5).flatMap((resultLayer)=>{
						if (_catalogNewView.layers.find((l)=>l==resultLayer.id)) return []
						return resultLayer;
					});
					// console.log(results);
					// searchResults.innerText = results.toString();
					listSearchResults(results,searchResults);
				}else {
					listSearchResults([],searchResults);
				}
			}, 500);
		}

		function listSearchResults(results,container){
			container.innerHTML = '';
			if (!results.length) return null;
			
			let h = document.createElement('h6');
			h.innerText = `${results.length} ${(results.length>1)?'resultados':'resultado'}`;
			container.appendChild(h);

			let listResults = document.createElement('ul');
			listResults.classList.add('list-group');
			results.forEach((layer)=>{
				let li = document.createElement('li');
				li.classList.add('list-group-item');

				let label = document.createElement('span');
				label.innerText = layer.title;
				label.classList.add('label-add-result');

				label.onclick = (e)=>{
					_catalogNewView.layers.push(layer.id);
					if(e.target.parentElement.parentElement.childNodes.length>1){
						e.target.parentElement.remove();
					}else{
						// El elemento padre 'catalog-search-results' no deberia ser removido, solo vaciado
						e.target.parentElement.parentElement.parentElement.innerHTML = '';
					}
					updateNewViewList();
				}

				li.appendChild(label);

				let btnAdd = document.createElement('span');
				btnAdd.classList.add('badge');
				btnAdd.classList.add('btn-add-result');
				btnAdd.innerText='+';
				btnAdd.onclick = (e)=>{
					_catalogNewView.layers.push(layer.id);
					if(e.target.parentElement.parentElement.childNodes.length>1){
						e.target.parentElement.remove();
					}else{
						// El elemento padre 'catalog-search-results' no deberia ser removido, solo vaciado
						e.target.parentElement.parentElement.parentElement.innerHTML = '';
					}
					updateNewViewList();
				}

				li.appendChild(btnAdd);
				listResults.appendChild(li);
			})	

			container.appendChild(listResults);


		}

		form.append(inputSearch);
		form.append(buttonSearch);
        divContainer.appendChild(form);
        divContainer.appendChild(searchResults);

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
			button.setAttribute('state','closed');

			button.onclick = (e) => {
				// Si el contenedor estaba cerrado
				if(e.target.getAttribute('state')=='opened'){
					// Cambiamos el estado a abierto
					e.target.innerText = 'Seleccionar capas'
					e.target.setAttribute('state','closed');
					if(document.getElementById('checklist-container')) document.getElementById('checklist-container').remove();
					return null;
				}

				// Close other checklist container if was open
				if (document.getElementById('checklist-container')) document.getElementById('checklist-container').remove();
				// Change btn link text
				document.querySelectorAll(`.layers-count-action .btn-link`).forEach((btn)=>btn.innerText='Seleccionar capas');
				// Set btn link open
				e.target.setAttribute('state','opened');
				e.target.innerText = 'Cerrar'
	
				let checkList = document.createElement('div');
				checkList.id = 'checklist-container';
				
				Object.keys(catalog.getLayersBy('resource_id',rsrc.id)).forEach((layer_id)=>{
					let label = document.createElement('label');
					label.classList.add('checkbox-item');
					let input = document.createElement('input');
					input.type = 'checkbox';
					input.name = layer_id;

					if(_catalogNewView.layers.find((l)=>l==layer_id)) input.checked = true;
	
					input.onchange = (e) => {
						if(e.target.checked){
							_catalogNewView.layers.push(layer_id);
	
							// if (document.getElementById('catalog-new-view')) document.getElementById('catalog-new-view').remove();
		
							// let catalogNewView = document.createElement('div');
							// catalogNewView.id ='catalog-new-view';
	
							// catalogNewView.append(this.createTitleElement('h6','Capas seleccionadas'));
							
							
							// let ul = document.createElement('ul');
							
							// _catalogNewView.layers.forEach((layerViewId,i)=>{
							// 	let li = document.createElement('li');
							// 	li.innerHTML = `&#9900; ${catalog.layers[layerViewId].title}`;
							// 	li.setAttribute('layerid', layerViewId);
							// 	let buttonRemove = document.createElement('button');
							// 	buttonRemove.innerHTML = `x`;
							// 	buttonRemove.onclick = function() {
							// 		let indx = _catalogNewView.layers.findIndex((l)=>l==layerViewId);
							// 		if(indx!=-1) _catalogNewView.layers.splice(indx,1);
							// 		li.remove();
							// 		input.checked = false;

							// 		if(!_catalogNewView.layers.length) document.getElementById('catalog-new-view').remove();
								
							// 		if(document.getElementById('checklist-container')){
							// 			// Update checkboxes
							// 			for(let i of document.getElementById('checklist-container').childNodes){
											
							// 				let layerId = i.firstElementChild.name;
							// 				let indx = _catalogNewView.layers.findIndex((l)=>l==layerId);
							// 				console.log(indx);
							// 				if(indx!=-1) {
							// 					i.firstElementChild.checked = true
							// 				}else {
							// 					i.firstElementChild.checked = false
							// 				}
							// 			}
							// 		}
							// 	}
							// 	li.append(buttonRemove);
							// 	ul.append(li);
							// })
							
							// catalogNewView.append(ul);

							// let viewForm = document.createElement('form');
							// viewForm.id = 'catalog-new-view-form';

							// let input = document.createElement('input');
							// input.classList.add('form-control');
							// input.placeholder = "Nombre de la vista";
							// input.onchange = (e) => {
							// 	_catalogNewView.title = e.target.value;
							// }
							// viewForm.append(input);
	
							// let buttonView = document.createElement('button');
							// buttonView.innerText = `Crear vista`;
							// buttonView.classList.add('btn');
							// buttonView.classList.add('btn-sm');
							// buttonView.classList.add('btn-info');
							// buttonView.onclick = (e) => {
							// 	e.preventDefault();
							// 	let newId = catalog.addView(_catalogNewView.title,'test description',_catalogNewView.layers);
							// 	menu_ui.addCatalogViewToMenu('Vistas del catálogo','catalog-views', newId, _catalogNewView.title);
							// 	// updateLayersMenu(argenmap.views);
							// 	catalogNewView.remove();
							// 	_catalogNewView = {
							// 		title:null,
							// 		layers:[]
							// 	}
							// }
							// viewForm.append(buttonView);
							// catalogNewView.append(viewForm);
							// newViewContainer.append(catalogNewView);
						}else {
							// Si el input no esta checked se quita de las newView layers
							// Se obtiene el elemento li a traves del atributo layerid seteado inicialmente
							// let el = document.querySelector(`li[layerid='${e.target.name}'`);
							// if(el) el.remove();

							// Se elimina la capa seleccionada para newView
							let indx = _catalogNewView.layers.findIndex((l)=>l==e.target.name);
							if(indx!=-1) _catalogNewView.layers.splice(indx,1);

							
							// // Si no hay mas capas seleccionadas se quita el elemento newView
							// if(!_catalogNewView.layers.length) document.getElementById('catalog-new-view').remove();
						}
						updateNewViewList();
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


function updateNewViewList(){
	if (document.getElementById('catalog-new-view')) document.getElementById('catalog-new-view').remove();
	
	let newViewContainer = document.getElementById('catalog-new-view-container');

	let catalogNewView = document.createElement('div');
	catalogNewView.id ='catalog-new-view';


	let h = document.createElement('h6');
	h.innerText = 'Capas seleccionadas';
	catalogNewView.append(h);
	
	
	let ul = document.createElement('ul');
	
	if(_catalogNewView.layers.length){
		_catalogNewView.layers.forEach((layerViewId,i)=>{
			let li = document.createElement('li');
			li.innerHTML = `&#9900; ${catalog.layers[layerViewId].title}`;
			li.setAttribute('layerid', layerViewId);
			let buttonRemove = document.createElement('button');
			buttonRemove.innerHTML = `x`;
			buttonRemove.onclick = function() {
				let indx = _catalogNewView.layers.findIndex((l)=>l==layerViewId);
				if(indx!=-1) _catalogNewView.layers.splice(indx,1);
				li.remove();
				input.checked = false;

				if(!_catalogNewView.layers.length) document.getElementById('catalog-new-view').remove();
			
				if(document.getElementById('checklist-container')){
					// Update checkboxes
					for(let i of document.getElementById('checklist-container').childNodes){
						
						let layerId = i.firstElementChild.name;
						let indx = _catalogNewView.layers.findIndex((l)=>l==layerId);
						console.log(indx);
						if(indx!=-1) {
							i.firstElementChild.checked = true
						}else {
							i.firstElementChild.checked = false
						}
					}
				}
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
			_catalogNewView.title = e.target.value;
		}
		viewForm.append(input);

		let buttonView = document.createElement('button');
		buttonView.innerText = `Crear vista`;
		buttonView.classList.add('btn');
		buttonView.classList.add('btn-sm');
		buttonView.classList.add('btn-info');
		buttonView.onclick = (e) => {
			e.preventDefault();
			let newId = catalog.addView(_catalogNewView.title,'test description',_catalogNewView.layers);
			menu_ui.addCatalogViewToMenu('Vistas del catálogo','catalog-views', newId, _catalogNewView.title);
			// updateLayersMenu(argenmap.views);
			catalogNewView.remove();
			_catalogNewView = {
				title:null,
				layers:[]
			}
			if(document.getElementById('checklist-container')) document.getElementById('checklist-container').remove();
		}
		viewForm.append(buttonView);
		catalogNewView.append(viewForm);
		newViewContainer.append(catalogNewView);

	}else {
		document.getElementById('catalog-new-view').remove();
	}
}