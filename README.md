# Kaholo MongoDB Plugin
MongoDB is a NoSQL database program, using JSON-like documents with optional schemas. This plugin extends Kaholo to perform basic CRUD operations on MongoDB and also to dump MongoDB databases, e.g. for backup purposes.

## Prerequisites
A MongoDB database server is required to use this plugin. The server must be reachable on the network by the Kaholo agent by means of a URI, for example `mongodb://mongo.kaholodemo.net:27017`. A username and password may also be required.

MongoDB servers can serve multiple databases, each with multiple collections. If username and password are required there will be an "authentication database". by default this is database "admin". The path portion of the URI, if provided, is not the database or collection that will be operated upon, but is the authentication database.

MongoDB servers are further partitioned into Databases and Collections. To perform CRUD operations the name of the database and collection to use must be known.

There is a Mongo Client application named "MongoDB Compass". If this is installed and connected to the MongoDB server it makes a very convenient diagnostic tool for troubleshooting Kaholo pipelines using this plugin.

## Access and Authentication
If protected with username and password, there are two ways to handle this in the Kaholo Account - by URI only, or separately using the Kaholo Vault. The Vault is recommended to prevent the username and credentials from appearing in configuration, logs, and error messages.

URI example with user/password and explicit authentication database:
    mongodb://admin:28973rt*%24%3F2@mongo.kaholodemo.net:27017/admin

URI example without user/password:
    mongodb://mongo.kaholodemo.net:27017

If username and password are provided in BOTH URI and separately, the separately configured username and password will be used. The path part of the URI is optional. If using the default authentication database it may be omitted from the URI.

Also note that passwords with special characters are represented differently in a URI than they are if specified separately in the Kaholo Vault or elsewhere. The above example uses password `28973rt*$?2`, which in the URI is represented as `28973rt*%24%3F2`. This is called URL encoding. Be certain to use the URL-encoded password if using the URI and the unencoded password if storing it in the Kaholo Vault. It is recommended to **always** use the unencoded password in the vault and omit the user/password information from the URI for security reasons.

## Plugin Installation
For download, installation, upgrade, downgrade and troubleshooting of plugins in general, see [INSTALL.md](./INSTALL.md).

## Plugin Settings
Plugin Settings provide default values for some parameters. Every method of the plugin has a parameter for "Mongo Database" and all but "Dump Database to File" have "Collection Name". When Plugin Settings are configured, all new Mongo actions will arrive preconfigured to use the database and collection specified. This is very convenient when working consistently with the same database and collection. In cases where the defaults are not correct, they can be easily reconfigured at the Action level.

### Setting: Default Mongo Database
This is the name of the Database to use by default.

### Setting: Default Collection Name
This is the collection on which to operate by default.

## Method: Find Document(s)
This method finds one or more documents that match a query from a specified database and collection. Results are returned as an array of objects (MongoDB documents).

### Parameter: Mongo Database
The name of the database in the server upon which the action will be taken.

### Parameter: Collection Name
The name of the collection in the Mongo Database upon which the action will be taken.

### Parameter: Query
The query format is [described here](https://mongodb.github.io/node-mongodb-native/markdown-docs/queries.html).

Example query: `{ "color": "green" }`

Example result:

    0:
        _id: "63b018c8ad3ff879ca7f0254"
        color: "green"
        size: "medium"

## Method: Insert Document(s)
This method inserts documents into a collection.

### Parameter: Mongo Database
The name of the database in the server upon which the action will be taken.

### Parameter: Collection Name
The name of the collection in the Mongo Database upon which the action will be taken.

### Parameter: Document(s)
An array of one or more documents to be inserted into the collection.

Example Document(s):

    [{"_id": null, "color": "orange"}]

Example result (from MongoDB Compass):

    {
        "_id": {
            "$oid": "63b84290ba525ff44617f6b6"
        },
        "color": "orange"
    }

## Method: Delete Document(s)
Similar to Find, but rather than returning found documents it deletes them from the collection.

### Parameter: Mongo Database
The name of the database in the server upon which the action will be taken.

### Parameter: Collection Name
The name of the collection in the Mongo Database upon which the action will be taken.

### Parameter: Query
See parameter Query in [Method Find Document(s)](##-Method:-Find-Document(s)), above.

## Method: Update Document(s)
This method finds documents and then applys an update to them.

### Parameter: Mongo Database
The name of the database in the server upon which the action will be taken.

### Parameter: Collection Name
The name of the collection in the Mongo Database upon which the action will be taken.

### Parameter: Filter Query
Determines which documents will be updated. See parameter Query in [Method Find Document(s)](##-Method:-Find-Document(s)), above.

### Parameter: Update Document
This document is applied to documents matching the filter query.

Example Filter Query: `{ "color": "orange" }`

Example Update Document: `{"$set":{"color":"peach","size":"large","updated":true}}`

Example result (from MongoDB Compass):

    {
        "_id": {
            "$oid": "63b84290ba525ff44617f6b6"
        },
        "color": "peach",
        "size": "large",
        "updated": true
    }

## Method: Dump Database to File
This method dumps a Mongo Database to file, which is useful to backup or move the database to another MongoDB server. Be default it dumps to a single file, which is a gzip archive.

### Parameter: Mongo Database
The name of the database in the MongoDB server to dump.

### Parameter: Archive File Path
The path on the Kaholo Agent to the file where the dump will go. This may be relative or absolute path. If only filename is given the default path is `/twiddlebug/workspace`.

### Parameter: Additional Parameters
The method simply runs command 'mongodump', which has many [optional parameters](https://www.mongodb.com/docs/database-tools/mongodump/) that may be specified here. The ones the method is using in code include `--db`, `--gzip`, and `--archive=`. 

For example if Additional Parameters is configured to contain `--collection=colorwheel`, then the dump will contain only that one collection. Otherwise the dump will contain every collection from the specified database.



