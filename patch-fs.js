// patch-fs.js: Fixes Node.js v24 Windows libuv issue where readlink on regular files throws EISDIR instead of EINVAL
const fs = require("fs");
const path = require("path");

// Propagate to child processes / workers using forward slashes so NODE_OPTIONS does not escape backslashes
const patchPath = path.resolve(__dirname, "patch-fs.js").replace(/\\/g, "/");
if (!process.env.NODE_OPTIONS || !process.env.NODE_OPTIONS.includes("patch-fs.js")) {
  process.env.NODE_OPTIONS = ((process.env.NODE_OPTIONS || "") + ` -r "${patchPath}"`).trim();
}

function fixError(err) {
  if (err && (err.code === "EISDIR" || err.errno === -4068)) {
    err.code = "EINVAL";
  }
  return err;
}

const origReadlink = fs.readlink;
fs.readlink = function (...args) {
  const cb = args[args.length - 1];
  if (typeof cb === "function") {
    args[args.length - 1] = function (err, ...rest) {
      return cb(fixError(err), ...rest);
    };
  }
  return origReadlink.apply(this, args);
};

const origReadlinkSync = fs.readlinkSync;
fs.readlinkSync = function (...args) {
  try {
    return origReadlinkSync.apply(this, args);
  } catch (err) {
    throw fixError(err);
  }
};

if (fs.promises && fs.promises.readlink) {
  const origPromisesReadlink = fs.promises.readlink;
  fs.promises.readlink = async function (...args) {
    try {
      return await origPromisesReadlink.apply(this, args);
    } catch (err) {
      throw fixError(err);
    }
  };
}
