# Mongo Shell
This project is an experimental shell that implements most of the end-user functionality of the current `mongo` shell but expands it to include enhanced abilities.

# Features
The shell features the following advanced behaviors

* Advanced help system
* Plugins
* Multiple display output formats (legacy shell, extended json)
* ExtJSON

## Advanced Help System
Integrated help system allowing per function help.

### Tab Completion Help
```js
mongodb [test]> db.createView(
```

Tab completion on the `db.createView` function returns full help.

```
Method: createView()

  Creates a view </core/views> as the result of the applying the specified aggregation pipeline <aggregation-pipeline> to the source collection or view. Views act as read-only collections, and are computed on demand during read operations. MongoDB executes read operations on views as part of the underlying aggregation pipeline.

Parameters:

  view      string The name of the view to create.
  source    string The name of the source collection or view from which to create the view. The
                   name is not the full namespace of the collection or view; i.e. does not include
                   the database name and implies the same database as the view to create.
  pipeline  array  An array that consists of the :ref:`aggregation pipeline stage
                   <aggregation-pipeline>`. {{op}} creates the view by applying the specified
                   ``pipeline`` to the {{source}}. .. include::
                   /includes/extracts/views-public-definition.rst
  [options] object Additional options for the method.

Return:

  Promise

Examples:

  // Create a View from a Single Collection
  db.createView(
   "managementFeedback",
   "survey",
   [ { $project: { "management": "$feedback.management", department: 1 } } ]
  )

  // Query a View
  db.managementFeedback.find()

  // Perform Aggregation Pipeline on a View
  db.managementFeedback.aggregate([ { $sortByCount: "$department" } ] )

  // Create a View from Multiple Collections
  db.createView(
    "orderDetails",
    "orders",
    [
      { $lookup: { from: "inventory", localField: "item", foreignField: "sku", as: "inventory_docs" } },
      { $project: { "inventory_docs._id": 0, "inventory_docs.sku": 0 } }
    ]
  )

  // Perform Aggregation Pipeline on a View
  db.orderDetails.aggregate( [ { $sortByCount: "$item" } ] )

  // Create a View with Default Collation
  db.createView(
   "placesView",
   "places",
   [ { $project: { category: 1 } } ],
   { collation: { locale: "fr", strength: 1 } }
  )
```

### Method Help Method
This help can also be accessed by typing the following

```js
mongodb [test]> db.createView.help()
```

## Plugins
One of the revolutionary new features is the ability to leverage first-party, third-party or write your own plugins for the new shell. Infitive expandibility is possible.

### Plugin Command
To list the available plugin commands simply type plugin once in the shell and it will print the available plugin actions.

```js
mongodb [test]> help plugin
```

You should see the following

```
------------------------
-- MongoDB Shell Help --
------------------------

help plugin               Plugin level help
help plugin install       Plugin install level help
help plugin list          Plugin list level help
help plugin search [term] Plugin search level help
help plugin remove        Plugin remove level help
```

### Search
The plugin search action lets you search for available plugins in the plugins repository. To see all available plugins simple write.

```js
mongodb [test]> plugin search
```

If you wish to narrow the search by a keyword simple do

```js
mongodb [test]> plugin search top
```

This will return all plugins that contain the word top in their package name or description.

### Install
The install command lets you install a plugin using the shell. To install the sample top plugin just type the following and push enter.

```js
mongodb [test]> plugin install top
```

After a little while the plugin should be successfully installed. If you now type help you will see the new top namespace in the list of help topics.

```js
mongodb [test]> help
```

returns

```js
------------------------
-- MongoDB Shell Help --
------------------------

Help supports:
help            Full help.
help db         Database level help
help collection Collection level help
help plugin     Plugin management help
help top        Monitor basic usage statistics for each collection
```

To execut the plugin simply write

```js
mongodb [test]> top
```

### List
The plugin list action returns the currently installed plugins. Simply enter the command.

```js
mongodb [test]> plugin list
```

and you should see something like the following if the top plugin is installed.

```
mongo-shell-top 1.0.0      Mongo Top Shell Plugin
```

### Remove
The plugin remove action will uninstall a plugin. Simply enter the command.

```js
mongodb [test]> plugin remove top
```

and the `top` plugin will be removed.

## Screen Output Format
The new shell lets you set the default output format of the shell. By default it runs the legacy output format from the existing `mongo` shell but it also supports other possible output formats. Out of the box it comes with support for the extended json format.

To list the available formats simply type output

```
mongodb [test]> ouput
```

this will list the available output formats

```
Output  Description
shell   Mongo Shell output format
extjson Extended JSON output format
```

to switch to extended json output format simply type.

```
mongodb [test]> output extjson
```

Any results returned from an operation will not be serialized to the `Extended JSON` format allowing for simple copy paste between the shell and other tools such as `compass`.

## ExtJSON
The shell also exposes an `Extended JSON` serialzier and deserializer that works exactly as the standard Javascript `JSON`. The two following methods are available.

```
ExtJSON.parse()
ExtJSON.stringify()
```

## Some experimental plugins
- https://github.com/christkv/mongo-shell-schema
- https://github.com/christkv/mongo-shell-top