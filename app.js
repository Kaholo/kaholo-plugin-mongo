const { MongoClient } = require("mongodb");
const { bootstrap, parsers } = require("@kaholo/plugin-library");
const helpers = require("./helpers");

async function findMany(params) {
  const {
    uri,
    username,
    password,
    database,
    collection,
    query,
  } = params;

  const newUri = await helpers.consolidateUri(uri, username, password);
  const client = new MongoClient(newUri);

  try {
    const databased = client.db(database);
    const collected = databased.collection(collection);
    const parsedQuery = await parsers.object(query);
    const documents = await collected.find(parsedQuery).toArray();
    // you can reach this point even if database and collection do not exist.
    if (documents && documents.length > 0) {
      return documents;
    }
    throw new Error("Matching document(s) not found.");
  } catch (error) {
    throw new Error(error.message);
  }
}

async function insertMany(params) {
  const {
    uri,
    username,
    password,
    database,
    collection,
    documents,
  } = params;

  const newUri = await helpers.consolidateUri(uri, username, password);
  const client = new MongoClient(newUri);

  try {
    const databased = client.db(database);
    const collected = databased.collection(collection);
    const docJsonArray = parsers.object(documents);
    const inserted = await collected.insertMany(docJsonArray);
    // you can reach this point even if database and collection do not exist.
    if (inserted && inserted.insertedCount > 0) {
      return `${inserted.insertedCount} document(s) successfully inserted.`;
    }
    throw new Error("No documents inserted.");
  } catch (error) {
    throw new Error(error.message);
  }
}

async function deleteMany(params) {
  const {
    uri,
    username,
    password,
    database,
    collection,
    query,
  } = params;

  const newUri = await helpers.consolidateUri(uri, username, password);
  const client = new MongoClient(newUri);

  try {
    const databased = client.db(database);
    const collected = databased.collection(collection);
    const parsedQuery = await parsers.object(query);
    const deleted = await collected.deleteMany(parsedQuery);
    // you can reach this point even if database and collection do not exist.
    if (deleted && deleted.deletedCount > 0) {
      return `${deleted.deletedCount} document(s) successfully deleted.`;
    }
    throw new Error("No matching document(s) were found or deleted.");
  } catch (error) {
    throw new Error(error.message);
  }
}

async function updateMany(params) {
  const {
    uri,
    username,
    password,
    database,
    collection,
    filter,
    document,
  } = params;

  const newUri = await helpers.consolidateUri(uri, username, password);
  const client = new MongoClient(newUri);

  try {
    const databased = client.db(database);
    const collected = databased.collection(collection);
    const parsedFilter = await parsers.object(filter);
    const parsedDocument = await parsers.object(document);
    const modified = await collected.updateMany(parsedFilter, parsedDocument);
    // you can reach this point even if database and collection do not exist.
    if (modified && modified.modifiedCount > 0) {
      return `${modified.modifiedCount} document(s) successfully updated.`;
    }
    throw new Error("No matching document(s) were found or updated.");
  } catch (error) {
    throw new Error(error.message);
  }
}

async function dumpDatabase(params) {
  const {
    uri,
    username,
    password,
    database,
    archivePath,
    addParams,
  } = params;

  const {
    args,
    envVars,
  } = await helpers.parseConnectionStringToShellArguments(uri, username, password);
  if (database) {
    args.push("--db", database);
  }
  if (archivePath) {
    args.push(`--archive=${archivePath}`, "--gzip");
  }
  if (addParams) {
    args.push(addParams);
  }

  await helpers.mongodumpInstalled();

  const command = `mongodump ${args.join(" ")}`;
  const result = helpers.runCommand(command, envVars);
  return result;
}

module.exports = bootstrap({
  findMany,
  insertMany,
  deleteMany,
  updateMany,
  dumpDatabase,
}, {});
