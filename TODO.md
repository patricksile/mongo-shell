# TODO

## Command Line
- Support --sslFIPSMode by restricting ssl ciphers used.
  * Will not support now as it requires a node.js binary compiled using fips argument at configure time.
- Enable extended json output support.

## Help

## ODM Export plugin
- Use Schema types plugin to create statistical model for types.
- Output Mongoose classes.
- Output Morphia classes.
- Output C# classes.
- Output Mongoid classes.

## Atlas admin plugin
-

# ALL DONE
- Support `.mongorc.js`.
- Support --norc
- Support --shell
- Support --eval
- Support --sslCRLFile function
- Add missing top level commands
  * show users
  * show roles
  * show databases
  * show log <logname>
  * show logs
- Make a better help rendered.
- Extend the examples to help better.
