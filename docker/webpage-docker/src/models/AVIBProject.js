'use strict'

export class AVIBProject {
  
  constructor(id,has_namespace){
    this.id=id;
    this.has_namespace=has_namespace;
    this.has_class=[];
  }

	addClasses(lista){
		this.has_class=lista;
	} 
}