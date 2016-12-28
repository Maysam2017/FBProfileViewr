/**
 * Created by Trainer-PC on 11/26/2016.
 */

const User = (function(){
    let props = new WeakMap();
    class User{
        constructor(){
            // initialize with empty object
            props.set(this, {
                name: null,
                email: null,
                password: null,
                mobile: null
            });
        }

        /* Getter methods*/
        get name(){
            let propsObj = props.get(this);
            return propsObj.name;
        }
        get mobile(){
            let propsObj = props.get(this);
            return propsObj.mobile;
        }
        get email(){
            let propsObj = props.get(this);
            return propsObj.email;
        }

        get password(){
            let propsObj = props.get(this);
            return propsObj.password;
        }
        getProps(){
            return props.get(this);
        }
        // End getters method

        /* Setter Methods*/
        set name(value){
            let propsObj = props.get(this);
            propsObj.name = value;
            props.set(this,propsObj);
            return this;
        }
        set mobile(value){
            let propsObj = props.get(this);
            propsObj.mobile = value;
            props.set(this,propsObj);
            return this;
        }
        set email(value){
            let propsObj = props.get(this);
            propsObj.email = value.toLowerCase();
            props.set(this,propsObj);
            return this;
        }
        set password(value){
            let propsObj = props.get(this);
            propsObj.password = value;
            props.set(this,propsObj);
            return this;
        }
        /*
         * set data expects an object with one or all keys
         * in the below object template
         {
         name : 'name value',
         email: 'email value',
         password: 'password value',
         mobile: 'mobile value'
         }
         * */
        setProps(dataObject){
            if(typeof dataObject != 'object'){
                throw new Error('Passed parameter must be a type of object');
            }
            let propsObj = props.get(this);
            for(let propName in propsObj){
                if(dataObject.hasOwnProperty(propName)){
                    this[propName] = dataObject[propName];
                }
            }
            return this;
        }
        // End setter methods
    }
    return User;
})();

class UserModel{
    constructor(){
    }

    addUser(userObject){
        if(!(userObject instanceof User)){
            throw new Error('Passed parameter must be a User instance');
        }
        this.storage.insertEntry(
            STORAGE_NAMESPACES_USER,
            userObject.email,
            userObject.getProps()
        );
    }
    getUser(userObject){
        if(!(userObject instanceof User)){
            throw new Error('Passed parameter must be a User instance');
        }
        let storageItem = this.storage.selectEntry(
            STORAGE_NAMESPACES_USER,
            userObject.email
        );
        if(null !== storageItem){
            userObject.setProps(storageItem);
        }

        return userObject;
    }

    getUserByEmail(email){
        if(typeof email != 'string'){
            throw new Error('Passed parameter must be a string');
        }
        var userObject = new User();
        userObject.email = email;
        return this.getUser(userObject);
    }
    updateUser(userObject){
        this.storage.updateEntry(
            STORAGE_NAMESPACES_USER,
            userObject.email,
            userObject.getProps()
        );
    }
    deleteUser(userObject){
        this.storage.deleteEntry(
            STORAGE_NAMESPACES_USER,
            userObject.email
        );
    }
    getAllUsers(){
        let users = new Array();
        let entries = this.storage.selectAllEntries(STORAGE_NAMESPACES_USER);
        for(let indx in entries){
            let userObject = new User();
            userObject.setProps(entries[indx]);
            users.push(userObject);
        }
        return users;
    }

    deleteAllUsers(){
        this.storage.deleteAllEntries(STORAGE_NAMESPACES_USER);
    }

    set storage(storageObj){
        if(!(storageObj instanceof Storage)){
            throw new Error('Storage must be an instance (or subclass) of Storage class');
        }
        this._storage = storageObj;
    }

    get storage(){
        return this._storage;
    }
}

/**************************/
/* Storage Implementation */
/**************************/

class Storage{
    constructor(){
        if(new.target === Storage){
            throw new Error('Storage is an abstract class and can not ne instantiated');
        }
    }
    insertEntry(namespace, id, data){
        this.throwNotImplementedError();
    }
    updateEntry(namespace, id, data){
        this.throwNotImplementedError();
    }

    deleteEntry(namespace, id){
        this.throwNotImplementedError();
    };
    deleteAllEntries(namespace){
        this.throwNotImplementedError();
    };

    selectEntry(namespace, id){
        this.throwNotImplementedError();
    };
    selectAllEntries(namespace){
        this.throwNotImplementedError();
    };

    throwNotImplementedError(){
        throw new Error('No direct access, the sub class of Storage must implement');
    }
}


const STORAGE_NAMESPACES_USER = 'user';
//const STORAGE_NAMESPACES_BOOK = 'book';
const STORAGE_NAMESPACES_AUTH = 'auth';
const STORAGE_NAMESPACES = [
    STORAGE_NAMESPACES_USER,
    STORAGE_NAMESPACES_AUTH
    //STORAGE_NAMESPACES_BOOK
];


class LocalStorage extends Storage{
    constructor(){
        super();
    }
    insertEntry(namespace, id, data){
        if(null != this.selectEntry(namespace, id)){
            throw new Error('Can not insert, id already exists');
        }
        this.validateData(data);
        let storageKey = this.generateStorageId(namespace, id);
        data = JSON.stringify(data);
        this.getStorage().setItem(storageKey, data);
    }
    selectEntry(namespace, id){
        this.validateNamespace(namespace);
        this.validateId(id);
        let storageKey = this.generateStorageId(namespace, id);
        let storageData = this.getStorage().getItem(storageKey);
        if(null != storageData){
            storageData = JSON.parse(storageData);
        }
        return storageData;
    }
    updateEntry(namespace, id, data){
        if(null == this.selectEntry(namespace,id)) {
            throw new Error("Entry does not exist for update");
        }
        this.validateData(data);
        data = JSON.stringify(data);
        let storageKey = this.generateStorageId(namespace,id);
        this.getStorage().setItem(storageKey, data);
    }

    deleteEntry(namespace, id){
        if(null == this.selectEntry(namespace,id)) {
            throw new Error("Entry does not exist for update");
        }

        let storageKey = this.generateStorageId(namespace,id);
        this.getStorage().removeItem(storageKey);
    };

    deleteAllEntries(namespace){
        let prefix = this.generateStorageIdPrefix(namespace);
        for(let storageKey in this.getStorage()){
            if(storageKey.startsWith(prefix)){
                this.getStorage().removeItem(storageKey);
            }
        }
    };

    selectAllEntries(namespace){
        let prefix = this.generateStorageIdPrefix(namespace);
        let entries=[];
        for(let storageKey in this.getStorage()){
            if(storageKey.startsWith(prefix)){
                let data = this.getStorage().getItem(storageKey);
                data = JSON.parse(data);
                entries.push(data);
            }
        }
        return entries;
    };



    /* Validators */
    validateData(data){
        if(typeof data != 'object'){
            this.throwNotValidData();
        }
    }
    validateId(id){
        if(typeof id != 'string' && typeof id != 'number'){
            this.throwNotValidId();
        }
        return true;
    }
    validateNamespace(namespace){
        if(-1 == STORAGE_NAMESPACES.indexOf(namespace)){
            this.throwNotValidNamespace();
        }
    }

    // End validators

    generateStorageId(namespace, id){
        let prefix = this.generateStorageIdPrefix(namespace);
        this.validateId(id);
        return prefix+id;
    }

    generateStorageIdPrefix(namespace){
        this.validateNamespace(namespace);
        return namespace+'__';
    }

    throwNotValidId(){
        throw new Error('id must be of type string or number');
    }

    throwNotValidNamespace(){
        throw new Error('Namespace is not valid');
    }

    throwNotValidData(){
        throw new Error('Data must be a type of object');
    }
    getStorage(){
        return window.localStorage;
    }
}

class SessionStorage extends LocalStorage{
    constructor(){
        super();
    }
    getStorage(){
        return window.sessionStorage;
    }
}


/**************/
/* Form Class */
/**************/
const Form = (function(){
    let props = new WeakMap();
    let propertiesList = [
        'id', 'name', 'action', 'method', 'enctype'
    ];
    class Form{
        constructor(formId){
            props.set(this, {
                id: null,
                name: null,
                method: null,
                action: null,
                enctype: null,
                dom: null,
                invalidInputs: null,
                errorMessages: null
            });

            let formElement = document.getElementById(formId);
            if(null == formElement || 'form' != formElement.tagName.toLowerCase() ){
                throw new Error('Could not find an HTML form with the specified id: '+formId);
            }
            let propsObj = props.get(this);
            propsObj.dom = formElement;
            props.set(this, propsObj);

            for(let indx in propertiesList){
                let propertyName = propertiesList[indx];
                this[propertyName] = formElement.getAttribute(propertyName);
            }
        }

        on(eventName, callBack){
            this.dom.addEventListener(eventName, callBack);
        }

        disableElements(elementsNames){
            for(let i in elementsNames){
                let elementName = elementsNames[i];
                let element = this.dom.querySelector('input[name="'+elementName+'"]');
                if(element){
                    element.disabled = true;
                    element.readonly = true;
                }
            }
        }

        checkValidity(){
            let propsObject = props.get(this);
            let isValid = this.dom.checkValidity();
            if(!isValid){
                propsObject.invalidInputs = this.dom.querySelectorAll('input[class="form-control"]:invalid');
                propsObject.errorMessages = new Array();
                let len = propsObject.invalidInputs.length;
                // jQuery .each method also helps here
                // $(propsObject.invalidInputs).each(function(){
                //     console.log('input '+this);
                // });
                for(let i=0;i<len;i++){
                    let input = propsObject.invalidInputs[i];
                    propsObject.errorMessages.push(input.validationMessage)
                }
            }else{
                propsObject.invalidInputs = null;
                propsObject.errorMessages = null;
            }
            props.set(this, propsObject);

            return isValid;
        }

        getData(){
            let data = {};
            let inputs = this.dom.querySelectorAll('input[class="form-control"]');
            let len = inputs.length;
            for(let i=0;i<len;i++){
                let input = inputs[i];

                let inputName = input.name || null;
                let inputValue = input.value || null;
                if(null != inputName && null != inputValue){
                    data[inputName] = inputValue;
                }
            }
            return data;
        }

        setData(data){
            if( typeof data != 'object'){
                throw new Error('Passed data parameter must be a type of object');
            }
            let inputs = this.dom.querySelectorAll('input[class="form-control"]');
            let len = inputs.length;
            for(let i=0;i<len;i++){
                let input = inputs[i];
                let inputName = input.name || null;
                let inputValue = data[inputName] || null;
                if(null != inputName && null != inputValue){
                    input.value = inputValue;
                }
            }
            return this;
        }


        get invalidInputs(){
            return props.get(this).invalidInputs;
        }

        get errorMessages(){
            return props.get(this).errorMessages;
        }



        get dom(){
            return props.get(this).dom;
        }

        get id(){
            return props.get(this).id;
        }
        get name(){
            return props.get(this).name;
        }
        get method(){
            return props.get(this).method;
        }
        get action(){
            return props.get(this).action;
        }
        get enctype(){
            return props.get(this).enctype;
        }

        set id(value){
            let propsObj = props.get(this);
            propsObj.id = value;
            props.set(this, propsObj);
            return this;
        }
        set name(value){
            let propsObj = props.get(this);
            propsObj.name = value;
            props.set(this, propsObj);
            return this;
        }
        set method(value){
            let propsObj = props.get(this);
            propsObj.method = value;
            props.set(this, propsObj);
            return this;
        }
        set action(value){
            let propsObj = props.get(this);
            propsObj.action = value;
            props.set(this, propsObj);
            return this;
        }
        set enctype(value){
            let propsObj = props.get(this);
            propsObj.enctype = value;
            props.set(this, propsObj);
            return this;
        }
    }
    return Form;
})();

class Auth{
    constructor(){}

    authenticate(passwordKey, passwordValue) {
        let data = this._credentialStorage.selectEntry(
            this._credentialNamespace,
            this._credentialId
        );
        if(null != data && passwordValue == data[passwordKey]){
            delete data[passwordKey];
            let identity = this._sessionStorage.selectEntry(
                STORAGE_NAMESPACES_AUTH,'flag');
            if(null == identity){
                this._sessionStorage.insertEntry(
                    STORAGE_NAMESPACES_AUTH,'flag',
                    data
                );
            }else{
                this._sessionStorage.updateEntry(
                    STORAGE_NAMESPACES_AUTH,'flag',
                    data
                );
            }
            return data;
        }

        return null;
    }

    getAuthorizationData(){
        return this._sessionStorage.selectEntry(
            STORAGE_NAMESPACES_AUTH,'flag'
        );
    }

    clearAuthorizationData(){
        this._sessionStorage.deleteEntry(
            STORAGE_NAMESPACES_AUTH,'flag'
        );
    }

    isAuthorized() {
        // if(null == this.getAuthorizationData()){
        //     return false;
        // }
        // return true;
        return (null == this.getAuthorizationData()) ? false : true;
    }

    set credentialId(credentialId){
        this._credentialId = credentialId;
    }
    set credentialNamespace(credentialNamespace){
        this._credentialNamespace = credentialNamespace;
    }
    set credentialStorage(credentialStorage){
        if(!(credentialStorage instanceof Storage)){
            throw new Error('Passed credential storage must be instance of Storage')
        }
        this._credentialStorage = credentialStorage;
    }

    set sessionStorage(sessionStorage){
        if(!(sessionStorage instanceof Storage)){
            throw new Error('Passed session storage must be instance of Storage')
        }
        this._sessionStorage = sessionStorage;
    }

}















