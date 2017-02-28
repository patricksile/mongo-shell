'use strict';

module.exports = {
  decorate: context => {
    context.Object = Object;
    context.Object.keySet = function(o) {
      let ret = new Array();
      for (let i in o) {
        if (!(i in o.__proto__ && o[i] === o.__proto__[i])) { // eslint-disable-line
          ret.push(i);
        }
      }

      return ret;
    };
  }
};
