let MongoClient = require("mongodb").MongoClient;


function find(action) {
    return new Promise((resolve, reject) => {
        let query;
        if (!action.params.COLLECTION)
            return reject({ "err": "No collection" });
        if (!action.params.QUERY)
            query = null;
        else {
            try {
                query = JSON.parse(action.params.QUERY);
            } catch (e) {
                console.log("Error parsing query: ", e);
                reject({ "err": e });
            }
        }
        MongoClient.connect(action.params.URL, (err, db) => {
            if (err) {
                reject("Error connecting to DB");
            }
            let collection = db.collection(action.params.COLLECTION);

            collection.find(query).toArray((err, docs) => {
                db.close();
                resolve(docs);
            });
        })
    });
}

function findOne(action) {
    return new Promise((resolve, reject) => {
        let query;
        if (!action.params.COLLECTION)
            return reject({ "err": "No collection" });
        if (!action.params.QUERY)
            query = null;
        else {
            try {
                query = JSON.parse(action.params.QUERY);
            } catch (e) {
                console.log("Error parsing query: ", e);
                reject({ "err": e });
            }
        }
        MongoClient.connect(action.params.URL, (err, db) => {
            if (err) {
                reject("Error connecting to DB");
            }
            let collection = db.collection(action.params.COLLECTION);

            collection.findOne(query).toArray((err, docs) => {
                db.close();
                resolve(docs);
            });
        })
    });
}

function deleteOne(action) {
    return new Promise((resolve, reject) => {
        if (!action.params.QUERY)
            return reject({ "err": "No query" });
        if (!action.params.COLLECTION)
            return reject({ "err": "No collection" });
        let query;
        try {
            query = JSON.parse(action.params.QUERY);
        } catch (e) {
            console.log("Error parsing document: ", e);
            reject({ "err": e });
        }

        MongoClient.connect(action.params.URL, (err, db) => {
            if (err) {
                reject("Error connecting to DB");
            }
            let collection = db.collection(action.params.COLLECTION);

            collection.deleteOne(query, (err, r) => {
                if (err) {
                    console.log("Error deleting document");
                    db.close();
                    return reject({ "err": e })
                }
                return resolve(r);
            });
        })
    });
}

function deleteMany(action) {
    return new Promise((resolve, reject) => {
        if (!action.params.QUERY)
            return reject({ "err": "No query" });
        if (!action.params.COLLECTION)
            return reject({ "err": "No collection" });
        let query;
        try {
            query = JSON.parse(action.params.QUERY);
        } catch (e) {
            console.log("Error parsing document: ", e);
            reject({ "err": e });
        }

        MongoClient.connect(action.params.URL, (err, db) => {
            if (err) {
                reject("Error connecting to DB");
            }
            let collection = db.collection(action.params.COLLECTION);

            collection.deleteMany(query, (err, r) => {
                if (err) {
                    console.log("Error deleting document");
                    db.close();
                    return reject({ "err": e })
                }
                return resolve(r);
            });
        })
    });
}

function updateOne(action) {
    return new Promise((resolve, reject) => {
        if (!action.params.QUERY)
            return reject({ "err": "No query" });
        if (!action.params.COLLECTION)
            return reject({ "err": "No collection" });
        if (!action.params.UPDATE)
            return reject({ "err": "No update value" });

        let query;
        try {
            query = JSON.parse(action.params.QUERY);
        } catch (e) {
            console.log("Error parsing document: ", e);
            reject({ "err": e });
        }

        let update;
        try {
            update = JSON.parse(action.params.UPDATE);
        } catch (e) {
            console.log("Error parsing update query: ", e);
            reject({ "err": e });
        }

        MongoClient.connect(action.params.URL, (err, db) => {
            if (err) {
                reject("Error connecting to DB");
            }
            let collection = db.collection(action.params.COLLECTION);

            collection.updateOne(query, update, (err, r) => {
                if (err) {
                    console.log("Error updating document");
                    db.close();
                    return reject({ "err": e })
                }
                return resolve(r);
            });
        })
    });
}

function updateMany(action) {
    return new Promise((resolve, reject) => {
        if (!action.params.QUERY)
            return reject({ "err": "No query" });
        if (!action.params.COLLECTION)
            return reject({ "err": "No collection" });
        let query;
        try {
            query = JSON.parse(action.params.QUERY);
        } catch (e) {
            console.log("Error parsing document: ", e);
            reject({ "err": e });
        }
        let update;
        try {
            update = JSON.parse(action.params.UPDATE);
        } catch (e) {
            console.log("Error parsing update query: ", e);
            reject({ "err": e });
        }

        MongoClient.connect(action.params.URL, (err, db) => {
            if (err) {
                reject("Error connecting to DB");
            }
            let collection = db.collection(action.params.COLLECTION);

            collection.updateMany(query, update, (err, r) => {
                if (err) {
                    console.log("Error deleting document");
                    db.close();
                    return reject({ "err": e })
                }
                return resolve(r);
            });
        })
    });
}

function insert(action) {
    return new Promise((resolve, reject) => {
        if (!action.params.COLLECTION)
            return reject({ "err": "No collection" });
        if (!action.params.DOCUMENT)
            reject({ "err": "No document" })
        let parsedDoc;
        try {
            parsedDoc = JSON.parse(action.params.DOCUMENT);
        } catch (e) {
            console.log("Error parsing document: ", e);
            reject({ "err": e });
        }

        MongoClient.connect(action.params.URL, (err, db) => {
            if (err) {
                reject("Error connecting to DB");
            }
            let collection = db.collection(action.params.COLLECTION);

            collection.insertOne(parsedDoc, (err, r) => {
                if (err) {
                    console.log("Error inserting document");
                    db.close();
                    return reject({ "err": e })
                }
                return resolve(r);
            });
        })
    });
}

function insertMany(action) {
    return new Promise((resolve, reject) => {
        if (!action.params.DOCUMENTS)
            reject({ "err": "No document" })
        let parsedDoc;
        try {
            parsedDoc = JSON.parse(action.params.DOCUMENTS);
        } catch (e) {
            console.log("Error parsing document: ", e);
            reject({ "err": e });
        }

        MongoClient.connect(action.params.URL, (err, db) => {
            if (err) {
                reject("Error connecting to DB");
            }
            let collection = db.collection(action.params.COLLECTION);

            collection.insertMany(parsedDoc, (err, r) => {
                if (err) {
                    console.log("Error inserting document");
                    db.close();
                    return reject({ "err": e })
                }
                return resolve(r);
            });
        })
    });
}


let functions = {
    find: find,
    findOne: findOne,
    insertOne: insert,
    insertMany: insertMany,
    deleteOne: deleteOne,
    deleteMany: deleteMany,
    updateOne: updateOne,
    updateMany: updateMany
};

function main(argv) {
    if (argv.length < 3) {
        console.log('{error: "not enough parameters"}');
        // Invalid Argument - Either an unknown option was specified, or an option requiring a value was provided without a value.
        process.exit(9);
    }
    let action = JSON.parse(argv[2]);
    functions[action.method.name](action).then(function (res) {
        console.log(res);
        process.exit(0); // Success
    }).catch(function (error) {
        console.log("Error : ", error);
        // Uncaught Fatal Exception - There was an uncaught exception, and it was not handled by a domain or an 'uncaughtException' event handler.
        process.exit(1);
    });
}

main(process.argv);