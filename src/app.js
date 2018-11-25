let MongoClient = require("mongodb").MongoClient;

function _queryHandler(query){
    if (!query)
        throw new Error("No query")
    if (typeof query == 'string'){
        try {
            return JSON.parse(query);
        } catch(e){
            throw new Error("Error parsing query: " + e.message);
        }
    }
    return query;
}

function _mongooseCallback(db, resolve, reject){
    return (err,data) => {
        db.close();

        if (err)
            return reject(err);
        
        resolve(data)
    }
}

function _execMongo(action){
    return new Promise((resolve, reject)=>{
        MongoClient.connect(action.params.URL, (err, db) => {
            if (err) {
                return reject("Error connecting to DB");
            }
            
            let collection = db.collection(action.params.COLLECTION);
            resolve({
                collection : collection,
                db : db
            });
        })
    })
}

function find(action) {
    return new Promise((resolve, reject) => {
        let query;
        if (!action.params.COLLECTION)
            return reject({ "err": "No collection" });
        
        try {
            query = _queryHandler(action.params.QUERY);
        } catch (e) {
            console.log(e);
            return reject({ "err": e });
        }

        _execMongo(action).then(res=>{
            res.collection.find(query).toArray(_mongooseCallback(res.db, resolve, reject));                
        }).catch(reject)
    });
}

function findOne(action) {
    return new Promise((resolve, reject) => {
        let query;
        if (!action.params.COLLECTION)
            return reject({ "err": "No collection" });
        
        try {
            query = _queryHandler(action.params.QUERY);
        } catch (e) {
            console.log(e);
            return reject({ "err": e });
        }

        _execMongo(action).then(res=>{
            res.collection.findOne(query, _mongooseCallback(res.db, resolve, reject));
        }).catch(reject)
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
            query = _queryHandler(action.params.QUERY);
        } catch (e) {
            console.log(e);
            return reject({ "err": e });
        }

        _execMongo(action).then(res=>{
            res.collection.deleteOne(query, _mongooseCallback(res.db, resolve, reject));
        }).catch(reject)
    });
}

function deleteMany(action) {
    return new Promise((resolve, reject) => {
        if (!action.params.COLLECTION)
            return reject({ "err": "No collection" });
        
        let query;
        try {
            query = _queryHandler(action.params.QUERY);
        } catch (e) {
            console.log(e);
            return reject({ "err": e });
        }

        _execMongo(action).then(res=>{
            res.collection.deleteMany(query, _mongooseCallback(res.db, resolve, reject));
        }).catch(reject)
    });
}

function updateOne(action) {
    return new Promise((resolve, reject) => {
        if (!action.params.COLLECTION)
            return reject({ "err": "No collection" });
        if (!action.params.UPDATE)
            return reject({ "err": "No update value" });

        let query;
        try {
            query = _queryHandler(action.params.QUERY);
        } catch (e) {
            console.log(e);
            return reject({ "err": e });
        }

        let update;
        try {
            update = JSON.parse(action.params.UPDATE);
        } catch (e) {
            console.log("Error parsing update query: ", e);
            reject({ "err": e });
        }

        _execMongo(action).then(res=>{
            res.collection.updateOne(query, update, _mongooseCallback(res.db, resolve, reject));
        }).catch(reject)
    });
}

function updateMany(action) {
    return new Promise((resolve, reject) => {
        if (!action.params.COLLECTION)
            return reject({ "err": "No collection" });
        
        let query;
        try {
            query = _queryHandler(action.params.QUERY);
        } catch (e) {
            console.log(e);
            return reject({ "err": e });
        }
        
        let update;
        try {
            update = JSON.parse(action.params.UPDATE);
        } catch (e) {
            console.log("Error parsing update query: ", e);
            reject({ "err": e });
        }

        _execMongo(action).then(res=>{
            res.collection.updateMany(query, update, _mongooseCallback(res.db, resolve, reject));
        }).catch(reject)
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

        _execMongo(action).then(res=>{
            res.collection.insertOne(parsedDoc, _mongooseCallback(res.db, resolve, reject));
        }).catch(reject);
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

        _execMongo(action).then(res=>{
            res.collection.insertMany(parsedDoc, _mongooseCallback(res.db, resolve, reject));
        }).catch(reject);
    });
}


module.exports = {
    find: find,
    findOne: findOne,
    insertOne: insert,
    insertMany: insertMany,
    deleteOne: deleteOne,
    deleteMany: deleteMany,
    updateOne: updateOne,
    updateMany: updateMany
};