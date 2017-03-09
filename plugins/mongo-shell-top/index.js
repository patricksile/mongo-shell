// const docs = require('./docs');

class TopPlugin {
  constructor(client, options = {}) {
    this.client = client;
    this.options = options;
    this.log = options.log || console.log;
  }

  namespace() {
    return 'top';
  }

  decorateContext(context) {
    return Promise.resolve(Object.assign(context, {
      top: plugin(this.client, this.options)
    }));
  }

  usesTerminal() {
    return true;
  }

  description() {
    return 'Monitor basic usage statistics for each collection.';
  }

  autocomplete(hint) {
    if (!hint) throw new Error('no hint passed to plugin');
    // remove namespace if it exits
    const cmd = hint[0].replace(`${this.namespace()}.`, '');
    // Do we have a docs item for this
    if (docs[cmd]) return docs[cmd];
    throw new Error(`no documentation found for ${hint}`);
  }

  help(hints) {
    return [
      ['example', 'Monitor basic usage statistics for each collection.'],
    ]
  }
}

function plugin(client, options = {}) {
  return function() {
    return new Promise((resolve, reject) => {
      var blessed = require('blessed')
        , contrib = require('blessed-contrib')
        , screen = blessed.screen()

      var table = contrib.table(
        { keys: true
        , vi: true
        , fg: 'white'
        , selectedFg: 'white'
        , selectedBg: 'blue'
        , interactive: true
        , label: 'Active Processes'
        , width: '100%'
        , height: '100%'
        , border: {type: "line", fg: "cyan"}
        , columnSpacing: 10
        , columnWidth: [16, 12]})

      table.focus()
      screen.append(table)

      screen.key(['escape', 'q', 'C-c'], function(ch, key) {
        clearInterval(intervalId);
        screen.remove(table);
        table.destroy();
        screen.destroy();      
        
        // Return control to the repl
        resolve();
      });

      const intervalId = setInterval(() => {
        var data = [];

        for(var i = 0; i < 40; i++) {
          data.push([Math.round(Math.random() * 100), Math.round(Math.random() * 100)]);
        }

        table.setData({ 
          headers: ['col1', 'col2'],
          data: data
        });
        
        screen.render()
      }, 1000);
    });
  }
}

module.exports = TopPlugin;


// var blessed = require('blessed')
//   , contrib = require('blessed-contrib')
//   , screen = blessed.screen()

// var table = contrib.table(
//    { keys: true
//    , vi: true
//    , fg: 'white'
//    , selectedFg: 'white'
//    , selectedBg: 'blue'
//    , interactive: true
//    , label: 'Active Processes'
//    , width: '100%'
//    , height: '100%'
//    , border: {type: "line", fg: "cyan"}
//    , columnSpacing: 10
//    , columnWidth: [16, 12]})

// table.focus()
// screen.append(table)

// table.setData(
//  { headers: ['col1', 'col2']
//  , data:
//   [ [1, 2]
//   , [3, 4]
//   , [5, 6]
//   , [7, 8] ]})

// screen.key(['escape', 'q', 'C-c'], function(ch, key) {
//   return process.exit(0);
// });

// setInterval(() => {
//   var data = [];

//   for(var i = 0; i < 40; i++) {
//     data.push([Math.round(Math.random() * 100), Math.round(Math.random() * 100)]);
//   }

//   table.setData({ 
//     headers: ['col1', 'col2'],
//     data: data
//   });
  
//   screen.render()
// }, 1000);

// screen.render()