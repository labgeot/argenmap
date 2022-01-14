class Resource {
    constructor(name, abstract, type, version, host){
        this.name = name;
        this.abstract = abstract;
        this.type = type;
        this.version = version;
        this.host = host;
        this.id = this.getUniqueId();

        
        console.log(`%c ✓ Resource ${name} added`, 'color: #0f0');
    }

    getName(){ return this.name }
    getAbstract(){ return this.abstract }
    getType(){ return this.type }
    getVersion(){ return this.version }
    getHost(){ return this.host }
    getId(){ return this.id }
    
    setName(name){ this.name = name }
    setAbstract(name){ this.name = name }

    /**
     * Generates a unique random ID composed of numbers and letters
     * @returns A string of a long between 9 and 12 characters
     */
    getUniqueId(){ 
        // Lo que hace único a este ID es que utiliza date.now() y si bien a los milisegundos que trabaja el procesador 
        // no existe tanta variacion, la hay ya que se procesan muchas otras cosas.
        // además se espera un número reducido de recursos en el Argenmap.
        // Sumando el string '0.' a Date.now() y parseandolo a float se obtiene un decimal a este se le resta un aleatorio
        // Luego se transofrma a string en base 16 y se obtienen letras. Se quita la parte entera y solo queda la parte decimal en base 16
        return (parseFloat('0.'+Date.now()) - Math.random()).toString(16).split('.')[1]
    }
}