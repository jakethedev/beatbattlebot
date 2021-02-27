/*
* Provided by @magnusjt on medium: https://medium.com/@magnusjt/ioc-container-in-nodejs-e7aea8a89600
*
* Provides a nice IOC scaffold to globalize static functions and such
*/
class Container {
    constructor(){
        this.services = {};
    }

    service(name, cb){
        Object.defineProperty(this, name, {
            get: () => {
                if(!this.services.hasOwnProperty(name)){
                    this.services[name] = cb(this);
                }

                return this.services[name];
            },
            configurable: true,
            enumerable: true
        });

        return this;
    }
}