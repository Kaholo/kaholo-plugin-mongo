# kaholo-plugin-mongo
MongoDB plugin for Kaholo. This plugin wraps MongoClient SDK

## Method find
Find documents
### Parameters
1) URL (String)
2) COLLECTION (String)
3) QUERY (String)

## Method findOne
Find one document
### Parameters
1) URL (String)
2) COLLECTION (String)
3) QUERY (String)

## Method insertOne
Insert a document
### Parameters
1) URL (String)
2) COLLECTION (String)
3) DOCUMENT (String)

## Method insertMany
Insert many documents
### Parameters
1) URL (String)
2) COLLECTION (String)
3) DOCUMENT (String)

## Method deleteOne
Delete one document
### Parameters
1) URL (String)
2) COLLECTION (String)
3) QUERY (String)

## Method deleteMany
Delete many documents
### Parameters
1) URL (String)
2) COLLECTION (String)
3) QUERY (String)

## Method updateOne
Update a document
### Parameters
1) URL (String)
2) COLLECTION (String)
3) QUERY (String)

## Method updateMany
Update many documents
### Parameters
1) URL (String)
2) COLLECTION (String)
3) QUERY (String)

## Method deleteMany
Delete many documents
### Parameters
1) URL (String)
2) COLLECTION (String)
3) QUERY (String)

## Method mongodump
This command wraps mongodb CLI based on documentation [here](https://docs.mongodb.com/database-tools/mongodump/)
### Parameters
1) URL (String)
2) OUT (String) - Output path
3) OTHER (String) - Other params for the Dump 
