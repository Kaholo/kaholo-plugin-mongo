const { MongoClient, ServerApiVersion } = require("mongodb");
const { bootstrap, parsers } = require("@kaholo/plugin-library");

// The Stable API feature (serverApi) requires MongoDB Server 5.0 or later.
const stableApi = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

async function find(params) {
  const {
    uri,
    database,
    collection,
    query,
  } = params;

  const client = new MongoClient(uri, stableApi);

  try {
    const databased = await client.db(database);
    const collected = await databased.collection(collection);
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
    database,
    collection,
    documents,
  } = params;

  const client = new MongoClient(uri, stableApi);

  try {
    const databased = await client.db(database);
    const collected = await databased.collection(collection);
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
    database,
    collection,
    query,
  } = params;

  const client = new MongoClient(uri, stableApi);

  try {
    const databased = await client.db(database);
    const collected = await databased.collection(collection);
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
    database,
    collection,
    filter,
    document,
  } = params;

  const client = new MongoClient(uri, stableApi);

  try {
    const databased = await client.db(database);
    const collected = await databased.collection(collection);
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

module.exports = bootstrap({
  find,
  insertMany,
  deleteMany,
  updateMany,
}, {});
