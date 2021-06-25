class FormBuilder {
    form = null;
    elements = {};

    constructor() {
        this.form = document.createElement('form');
        this.form.className = 'form';
    }

    addProps(element, props) {
        for (const propKey in props) {
            element.setAttribute(propKey, props[propKey]);
        }
    }

    addEvents(element, events) {
        for (const eventKey in events) {
            element.addEventListener(eventKey, (e) => {
                e.preventDefault();
                events[eventKey](element.value);
            });
        }
    }

    addButton(name, onclick) {
        const button = document.createElement('div');
        button.className = 'form-button';
        button.innerHTML = name;
        button.onclick = () => {
            onclick();
        }
        this.form.appendChild(button);
    }

    addElement(type, id, options) {
        const label = document.createElement('label');
        label.setAttribute('for', id);
        label.innerHTML = options.title;
        this.form.appendChild(label);

        const element = document.createElement(type);
        element.className = 'form-element';
        element.id = id;
        this.elements[id] = element;
        this.form.appendChild(element);

        //More props
        if (options.hasOwnProperty('extraProps')) {
            this.addProps(element, options.extraProps);
        }

        //Events
        if (options.hasOwnProperty('events')) {
            this.addEvents(element, options.events);
        }
    }

    getElementValue(id) {
        if (!this.elements.hasOwnProperty(id)) {
            return;
        }
        return this.elements[id].value;
    }

    getElementsValues() {
        const values = {};
        for (const elementKey in this.elements) {
            values[elementKey] = this.elements[elementKey].value;
        }
        return values;
    }

    createOption(value, text) {
        const option = document.createElement('option');
        option.value = value;
        option.text = text;
        return option;
    }

    setOptionsToSelect(id, options) {
        if (!this.elements.hasOwnProperty(id)) {
            return;
        }
        this.elements[id].innerHTML = '';
        options.forEach((option) => {
            this.elements[id].appendChild(this.createOption(option.value, option.text));
        });
    }
}
