export default class dispatchObj {
    constructor(name) {
      this.name = name;
      this.obj = {};
    }
  
    set setObj(obj) {
      Object.keys(obj).forEach(key => {
        this.obj[key] = obj[key];
      });
    }
  
    get getObj() {
      return this.obj;
    }
  
    getAll() {
      return {name: this.name, dispathObj: this.obj};
    }
  }