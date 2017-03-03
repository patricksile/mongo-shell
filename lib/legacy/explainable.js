const { getErrorWithCode } = require('../helpers');
const { applyCountOptions } = require('./query_helpers');
/**
 * A view of a collection against which operations are explained rather than executed
 * normally.
 */
const Explainable = (function() {
  let parseVerbosity = function(verbosity) {
    // Truthy non-strings are interpreted as 'allPlansExecution' verbosity.
    if (verbosity && (typeof verbosity !== 'string')) {
      return 'allPlansExecution';
    }

    // Falsy non-strings are interpreted as 'queryPlanner' verbosity.
    if (!verbosity && (typeof verbosity !== 'string')) {
      return 'queryPlanner';
    }

    // If we're here, then the verbosity is a string. We reject invalid strings.
    if (verbosity !== 'queryPlanner' && verbosity !== 'executionStats' &&
        verbosity !== 'allPlansExecution') {
      throw Error('explain verbosity must be one of {' + '"queryPlanner",' +
                    '"executionStats",' + '"allPlansExecution"}');
    }

    return verbosity;
  };

  let throwOrReturn = function(explainResult) {
    if (('ok' in explainResult && !explainResult.ok) || explainResult.$err) {
      throw getErrorWithCode(explainResult, 'explain failed: ' + JSON.stringify(explainResult));
    }

    return explainResult;
  };

  function constructor(collection, verbosity, options = {}) {
    //
    // Private lets.
    //

    this._collection = collection;
    this._verbosity = parseVerbosity(verbosity);
    this._log = options.log || console.log;

    //
    // Public methods.
    //

    this.getCollection = function() {
      return this._collection;
    };

    this.getVerbosity = function() {
      return this._verbosity;
    };

    this.setVerbosity = function(v) {
      this._verbosity = parseVerbosity(v);
      return this;
    };

    const log = this._log;

    this.help = function() {
      log('Explainable operations');
      log('\t.aggregate(...) - explain an aggregation operation');
      log('\t.count(...) - explain a count operation');
      log('\t.distinct(...) - explain a distinct operation');
      log('\t.find(...) - get an explainable query');
      log('\t.findAndModify(...) - explain a findAndModify operation');
      log('\t.group(...) - explain a group operation');
      log('\t.remove(...) - explain a remove operation');
      log('\t.update(...) - explain an update operation');
      log('Explainable collection methods');
      log('\t.getCollection()');
      log('\t.getVerbosity()');
      log('\t.setVerbosity(verbosity)');
      // return __magicNoPrint;
    };

    //
    // Pretty representations.
    //

    this.toString = function() {
      return 'Explainable(' + this._collection.getFullName() + ')';
    };

    this.shellPrint = function() {
      return this.toString();
    };

    //
    // Explainable operations.
    //

    /**
     * Adds 'explain: true' to 'extraOpts', and then passes through to the regular collection's
     * aggregate helper.
     */
    this.aggregate = function(pipeline, extraOpts) {
      if (!(pipeline instanceof Array)) {
        // support legacy letargs form. (Also handles db.foo.aggregate())
        pipeline = Array.from(arguments);
        extraOpts = {};
      }

      // Add the explain option.
      extraOpts = extraOpts || {};
      extraOpts.explain = true;

      return this._collection.aggregate(pipeline, extraOpts);
    };

    this.count = function(query, options) {
      query = this.find(query);
      return applyCountOptions(query, options).count();
    };

    /**
     * .explain().find() and .find().explain() mean the same thing. In both cases, we use
     * the DBExplainQuery abstraction in order to construct the proper explain command to send
     * to the server.
     */
    this.find = function(...args) {
      let cursor = this._collection.find.apply(this._collection, args);
      return cursor.explain();
    };

    this.findAndModify = function(params) {
      let famCmd = Object.assign({ 'findAndModify': this._collection.collectionName }, params);
      let explainCmd = { 'explain': famCmd, 'verbosity': this._verbosity };
      let explainResult = this._collection.runReadCommand(explainCmd);
      return throwOrReturn(explainResult);
    };

    this.group = function(params) {
      params.ns = this._collection.collectionName;
      let grpCmd = { 'group': this._collection.getDB()._groupFixParms(params) };
      let explainCmd = { 'explain': grpCmd, 'verbosity': this._verbosity };
      let explainResult = this._collection.runReadCommand(explainCmd);
      return throwOrReturn(explainResult);
    };

    this.distinct = function(keyString, query, options) {
      let distinctCmd = {
        distinct: this._collection.collectionName,
        key: keyString,
        query: query || {}
      };

      if (options && options.hasOwnProperty('collation')) {
        distinctCmd.collation = options.collation;
      }

      let explainCmd = { explain: distinctCmd, verbosity: this._verbosity };
      let explainResult = this._collection.runReadCommand(explainCmd);
      return throwOrReturn(explainResult);
    };

    this.remove = function() {
      let parsed = this._collection._parseRemove.apply(this._collection, arguments);
      let query = parsed.query;
      let justOne = parsed.justOne;
      let collation = parsed.collation;

      let bulk = this._collection.initializeOrderedBulkOp();
      let removeOp = bulk.find(query);

      if (collation) {
        removeOp.collation(collation);
      }

      if (justOne) {
        removeOp.removeOne();
      } else {
        removeOp.remove();
      }

      let explainCmd = bulk.convertToExplainCmd(this._verbosity);
      let explainResult = this._collection.runCommand(explainCmd);
      return throwOrReturn(explainResult);
    };

    this.update = function() {
      let parsed = this._collection._parseUpdate.apply(this._collection, arguments);
      let query = parsed.query;
      let obj = parsed.obj;
      let upsert = parsed.upsert;
      let multi = parsed.multi;
      let collation = parsed.collation;

      let bulk = this._collection.initializeOrderedBulkOp();
      let updateOp = bulk.find(query);

      if (upsert) {
        updateOp = updateOp.upsert();
      }

      if (collation) {
        updateOp.collation(collation);
      }

      if (multi) {
        updateOp.update(obj);
      } else {
        updateOp.updateOne(obj);
      }

      let explainCmd = bulk.convertToExplainCmd(this._verbosity);
      let explainResult = this._collection.runCommand(explainCmd);
      return throwOrReturn(explainResult);
    };
  }

  //
  // Public static methods.
  //

  constructor.parseVerbosity = parseVerbosity;
  constructor.throwOrReturn = throwOrReturn;

  return constructor;
})();

module.exports = Explainable;
