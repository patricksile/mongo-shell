'use strict';

function jsTestLog(msg) {
  console.log(`\n\n----\n${msg}\n----\n\n`);
}

let TestData;
if (typeof TestData === 'undefined') {
  TestData = undefined;
}

let jsTestName = function() {
  if (TestData) {
    return TestData.testName;
  }

  return '__unknown_name__';
};

let _jsTestOptions = { enableTestCommands: true };  // Test commands should be enabled by default

let jsTestOptions = function() {
  if (TestData) {
    return Object.assign(_jsTestOptions, {
      setParameters: TestData.setParameters,
      setParametersMongos: TestData.setParametersMongos,
      storageEngine: TestData.storageEngine,
      storageEngineCacheSizeGB: TestData.storageEngineCacheSizeGB,
      wiredTigerEngineConfigString: TestData.wiredTigerEngineConfigString,
      wiredTigerCollectionConfigString: TestData.wiredTigerCollectionConfigString,
      wiredTigerIndexConfigString: TestData.wiredTigerIndexConfigString,
      noJournal: TestData.noJournal,
      noJournalPrealloc: TestData.noJournalPrealloc,
      auth: TestData.auth,
      keyFile: TestData.keyFile,
      authUser: TestData.authUser || '__system',
      authPassword: TestData.keyFileData,
      authenticationDatabase: TestData.authenticationDatabase || 'admin',
      authMechanism: TestData.authMechanism,
      adminUser: TestData.adminUser || 'admin',
      adminPassword: TestData.adminPassword || 'password',
      useLegacyConfigServers: TestData.useLegacyConfigServers || false,
      useLegacyReplicationProtocol: TestData.useLegacyReplicationProtocol || false,
      enableMajorityReadConcern: TestData.enableMajorityReadConcern,
      writeConcernMajorityShouldJournal: TestData.writeConcernMajorityShouldJournal,
      enableEncryption: TestData.enableEncryption,
      encryptionKeyFile: TestData.encryptionKeyFile,
      auditDestination: TestData.auditDestination,
      minPort: TestData.minPort,
      maxPort: TestData.maxPort,
      // Note: does not support the array version
      mongosBinVersion: TestData.mongosBinVersion || '',
      shardMixedBinVersions: TestData.shardMixedBinVersions || false,
      networkMessageCompressors: TestData.networkMessageCompressors,
      skipValidationOnInvalidViewDefinitions: TestData.skipValidationOnInvalidViewDefinitions,
      forceValidationWithFeatureCompatibilityVersion:
          TestData.forceValidationWithFeatureCompatibilityVersion
    });
  }
  return _jsTestOptions;
};

let setJsTestOption = function(name, value) {
  _jsTestOptions[name] = value;
};

let jsTest = {};
jsTest.name = jsTestName;
jsTest.options = jsTestOptions;
jsTest.setOption = setJsTestOption;
jsTest.log = jsTestLog;
jsTest.readOnlyUserRoles = [ 'read' ];
jsTest.basicUserRoles = [ 'dbOwner' ];
jsTest.adminUserRoles = [ 'root' ];

module.exports = {
  decorate: function(context) {
    context.jsTestLog = jsTestLog;
    context.jsTest = jsTest;
  }
};
