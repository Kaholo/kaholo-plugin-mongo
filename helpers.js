const { ConnectionString } = require("connection-string");
const childProcess = require("child_process");
const { promisify } = require("util");

const exec = promisify(childProcess.exec);

async function mongodumpInstalled() {
  try {
    const { stdout } = await exec("which mongodump");
  } catch (error) {
    console.error("WARNING: mongodump is not installed on Kaholo agent! Attempting to install...");
    const { stdout } = await exec("apk add mongodb-tools");
    console.error("Apparent success installing mongodump!\n");
  }
}

async function runCommand(command) {
  try {
    const result = await exec(command);
    if (result.stdout) {
      console.error(result.stdout);
    }
    if (result.stderr) {
      return result.stderr;
    }
  } catch (error) {
    throw new Error(error);
  }
  return "whatever man."
}

function parseConnectionStringToShellArguments(connectionString, isDbRequired) {
  const args = [];
  const connectionStringObject = new ConnectionString(connectionString);
  if (!Reflect.has(connectionStringObject, "protocol")) {
    throw new Error("URI cannot be parsed. Should resemble pattern: mongodb://user:password@host:port/defaultauthdb")
  }
  if (connectionStringObject.protocol !== "mongodb") {
    throw new Error("Only a MongDB URI may be used with this plugin - mongodb://user:password@host:port/defaultauthdb")
  }
  if (Reflect.has(connectionStringObject, "user")) {
    args.push("--username", connectionStringObject.user);
  }
  if (Reflect.has(connectionStringObject, "password")) {
    args.push("--password", `'${connectionStringObject.password}'`);
  }
  if (Reflect.has(connectionStringObject, "hostname")) {
    args.push("--host", connectionStringObject.hostname);
  }
  if (Reflect.has(connectionStringObject, "port")) {
    args.push("--port", connectionStringObject.port);
  }
  if (Reflect.has(connectionStringObject, "path")) {
    if (connectionStringObject.path.length === 1) {
      args.push("--authenticationDatabase", connectionStringObject.path.join("/"));
    } else {
      throw new Error("The path part of the URI is for the database that holds the user's credentials. To specify a MongoDB database or collection use parameters other than URI. - mongodb://user:password@host:port/defaultauthdb")
    }
  }
  return args;
}

module.exports = {
  mongodumpInstalled,
  runCommand,
  parseConnectionStringToShellArguments,
}