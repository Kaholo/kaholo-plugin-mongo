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
    // stdout is typically null
    // stderr has the details about what mongodump has done
    if (result.stdout) {
      console.error(result.stdout);
    }
    if (result.stderr) {
      return result.stderr;
    }
  } catch (error) {
    throw new Error(error);
  }
  return "The command seems to have somehow produced neither results nor errors."
}

async function consolidateUri(uri, username, password) {
  const uriObject = new ConnectionString(uri);
  if (!Reflect.has(uriObject, "protocol")) {
    throw new Error("URI cannot be parsed. Should resemble pattern: mongodb://user:password@host:port/defaultauthdb")
  }
  if (uriObject.protocol !== "mongodb") {
    throw new Error("Only a MongDB URI may be used with this plugin - mongodb://user:password@host:port/defaultauthdb")
  }
  if (username) {
    uriObject.setDefaults({ user: username });
  }
  if (password) {
    uriObject.setDefaults({ password: password });
  }
  return uriObject.toString();
}

async function parseConnectionStringToShellArguments(uri, username, password) {
  const args = [];
  const uriObject = new ConnectionString(uri);
  if (!Reflect.has(uriObject, "protocol")) {
    throw new Error("URI cannot be parsed. Should resemble pattern: mongodb://user:password@host:port/defaultauthdb")
  }
  if (uriObject.protocol !== "mongodb") {
    throw new Error("Only a MongDB URI may be used with this plugin - mongodb://user:password@host:port/defaultauthdb")
  }

  if (username) {
    args.push("--username", username);
  } else {
    if (Reflect.has(uriObject, "user")) {
      args.push("--username", uriObject.user);
    }  
  }

  if (password) {
    args.push("--password", `'${password}'`);
  } else {
    if (Reflect.has(uriObject, "password")) {
      args.push("--password", `'${uriObject.password}'`);
    }  
  }

  if (Reflect.has(uriObject, "hostname")) {
    args.push("--host", uriObject.hostname);
  }
  if (Reflect.has(uriObject, "port")) {
    args.push("--port", uriObject.port);
  }
  if (Reflect.has(uriObject, "path")) {
    if (uriObject.path.length === 1) {
      args.push("--authenticationDatabase", uriObject.path[0]);
    } else {
      throw new Error("The path part of the URI is for the database that holds the user's credentials. To specify a MongoDB database or collection use parameters other than URI. - mongodb://user:password@host:port/defaultauthdb")
    }
  } else {
    args.push("--authenticationDatabase", "admin");
  }
  return args;
}

module.exports = {
  mongodumpInstalled,
  runCommand,
  consolidateUri,
  parseConnectionStringToShellArguments,
}