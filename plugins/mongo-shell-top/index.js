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
  return function(seconds) {
    return new Promise((resolve, reject) => {
      var blessed = require('blessed')
        , contrib = require('blessed-contrib')
        , screen = blessed.screen()

      // Set the interval time
      const intervalTime = typeof seconds == 'number'
        ? seconds * 1000
        : 1000;

      var table = contrib.table(
        { keys: true
        , vi: true
        , fg: 'white'
        , selectedFg: 'white'
        , selectedBg: 'blue'
        , interactive: true
        , label: `Mongo Top (Update every ${seconds || 1} seconds) [Press escape, q or cntrl-c to quit]`
        , width: '100%'
        , height: '100%'
        , border: {type: "line", fg: "cyan"}
        , columnSpacing: 10
        , columnWidth: [50, 10, 10, 10]})

      table.focus()
      screen.append(table)

      // Terminate plugin
      function terminate() {
        clearInterval(intervalId);
        screen.remove(table);
        table.destroy();
        screen.destroy();      
        
        // Return control to the repl
        resolve();
      }

      // When the user presses escape, q or control-c escape
      screen.key(['escape', 'q', 'C-c'], function(ch, key) {
        terminate();
      });

      // Last document (used for diff calculations)
      let lastResult = null;

      // Update table
      function updateTable() {
        // Run the top command
        client.db('admin').command({top: true}, function(err, result) {
          if(err) {
            return terminate();
          }

          // Is the last last result null
          if (!lastResult) {
            lastResult = result;
          }

          // Contains the rows we will be using
          var data = [];

          // Add the data
          for (const name in result.totals) {
            if (name.indexOf('.') != -1) {
              let total = 0;
              let read = 0;
              let write = 0;

              // Calculate the total, read + write
              if (lastResult.totals[name]) {
                total = Math.round((result.totals[name].total.time - lastResult.totals[name].total.time)/1000);
                read = Math.round((result.totals[name].readLock.time - lastResult.totals[name].readLock.time)/1000);
                write = Math.round((result.totals[name].writeLock.time - lastResult.totals[name].writeLock.time)/1000);
              }

              data.push([
                name.length > 50 ? name.substring(0, 29) : name, 
                `${total}ms`,
                `${read}ms`,
                `${write}ms`,
              ]);
            }

          }

          // Set the data
          table.setData({ 
            headers: ['ns', 'total', 'read', 'write'],
            data: data
          });

          // Update the last result          
          lastResult = result;
          // Render the table
          screen.render();
        });
      }

      // Sample the data
      const intervalId = setInterval(() => {
        updateTable();
      }, intervalTime);

      // Update table immediately
      updateTable();
    });
  }
}

module.exports = TopPlugin;