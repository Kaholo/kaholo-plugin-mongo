const { MongoClient } = require("mongodb");
const childProcess = require("child_process");

function queryHandler(query) {
  if (!query) {
    throw new Error("No query");
  }
  if (typeof query === "string") {
    try {
      return JSON.parse(query);
    } catch (e) {
      throw new Error(`Error parsing query: ${e.message}`);
    }
  }
  return query;
}

function mongooseCallback(db, resolve, reject) {
  return (err, data) => {
    db.close();

    if (err) {
      reject(err);
    }

    return resolve(data);
  };
}

function execMongo(action) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(action.params.URL, (err, db) => {
      if (err) {
        reject(new Error("Error connecting to DB"));
      }

      const collection = db.collection(action.params.COLLECTION);
      return resolve({
        collection,
        db,
      });
    });
  });
}

function find(action) {
  return new Promise((resolve, reject) => {
    let query;
    if (!action.params.COLLECTION) {
      reject(new Error("No collection"));
    }

    try {
      query = queryHandler(action.params.QUERY);
    } catch (e) {
      console.error(e);
      reject(e);
    }

    execMongo(action).then((res) => {
      res.collection.find(query).toArray(mongooseCallback(res.db, resolve, reject));
    }).catch(reject);
  });
}

function findOne(action) {
  return new Promise((resolve, reject) => {
    let query;
    if (!action.params.COLLECTION) {
      reject(new Error("No collection"));
    }

    try {
      query = queryHandler(action.params.QUERY);
    } catch (e) {
      console.error(e);
      reject(e);
    }

    execMongo(action).then((res) => {
      res.collection.findOne(query, mongooseCallback(res.db, resolve, reject));
    }).catch(reject);
  });
}

function deleteOne(action) {
  return new Promise((resolve, reject) => {
    if (!action.params.QUERY) {
      reject(new Error("No query"));
    }
    if (!action.params.COLLECTION) {
      reject(new Error("No collection"));
    }

    let query;
    try {
      query = queryHandler(action.params.QUERY);
    } catch (e) {
      console.error(e);
      reject(e);
    }

    execMongo(action).then((res) => {
      res.collection.deleteOne(query, mongooseCallback(res.db, resolve, reject));
    }).catch(reject);
  });
}

function deleteMany(action) {
  return new Promise((resolve, reject) => {
    if (!action.params.COLLECTION) {
      reject(new Error("No collection"));
    }

    let query;
    try {
      query = queryHandler(action.params.QUERY);
    } catch (e) {
      console.error(e);
      reject(e);
    }

    execMongo(action).then((res) => {
      res.collection.deleteMany(query, mongooseCallback(res.db, resolve, reject));
    }).catch(reject);
  });
}

function updateOne(action) {
  return new Promise((resolve, reject) => {
    if (!action.params.COLLECTION) {
      reject(new Error("No collection"));
    }
    if (!action.params.UPDATE) {
      reject(new Error("No update value"));
    }

    let query;
    try {
      query = queryHandler(action.params.QUERY);
    } catch (e) {
      console.error(e);
      reject(e);
    }

    let update;
    try {
      update = JSON.parse(action.params.UPDATE);
    } catch (e) {
      console.error("Error parsing update query: ", e);
      reject(e);
    }

    execMongo(action).then((res) => {
      res.collection.updateOne(query, update, mongooseCallback(res.db, resolve, reject));
    }).catch(reject);
  });
}

function updateMany(action) {
  return new Promise((resolve, reject) => {
    if (!action.params.COLLECTION) {
      reject(new Error("No collection"));
    }

    let query;
    try {
      query = queryHandler(action.params.QUERY);
    } catch (e) {
      console.error(e);
      reject(e);
    }

    let update;
    try {
      update = JSON.parse(action.params.UPDATE);
    } catch (e) {
      console.error("Error parsing update query: ", e);
      reject(e);
    }

    execMongo(action).then((res) => {
      res.collection.updateMany(query, update, mongooseCallback(res.db, resolve, reject));
    }).catch(reject);
  });
}

function insert(action) {
  return new Promise((resolve, reject) => {
    if (!action.params.COLLECTION) {
      reject(new Error("No collection"));
    }
    if (!action.params.DOCUMENT) {
      reject(new Error("No document"));
    }
    let parsedDoc;
    try {
      parsedDoc = JSON.parse(action.params.DOCUMENT);
    } catch (e) {
      console.error("Error parsing document: ", e);
      reject(e);
    }

    execMongo(action).then((res) => {
      res.collection.insertOne(parsedDoc, mongooseCallback(res.db, resolve, reject));
    }).catch(reject);
  });
}

function insertMany(action) {
  return new Promise((resolve, reject) => {
    if (!action.params.DOCUMENTS) {
      reject(new Error("No document"));
    }
    let parsedDoc;
    try {
      parsedDoc = JSON.parse(action.params.DOCUMENTS);
    } catch (e) {
      console.error("Error parsing document: ", e);
      reject(e);
    }

    execMongo(action).then((res) => {
      res.collection.insertMany(parsedDoc, mongooseCallback(res.db, resolve, reject));
    }).catch(reject);
  });
}

function mongodump(action) {
  const url = action.params.URL;
  const params = action.params.OTHER;
  const path = action.params.OUT;
  const cmd = `mongodump --uri=${url} -o ${path} ${params}`;
  return new Promise((resolve, reject) => {
    console.info(`executing:${cmd}`);
    childProcess.exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`exec error: ${error}`));
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        reject(new Error(`exec error: ${stderr}`));
      }
      console.info(stdout);
      return resolve(stdout);
    });
  });
}

module.exports = {
  find,
  findOne,
  insertOne: insert,
  insertMany,
  deleteOne,
  deleteMany,
  updateOne,
  updateMany,
  mongodump,
};
