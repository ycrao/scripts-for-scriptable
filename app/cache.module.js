// cache.module.js
// only run in `Scriptable` app

// ----- SecureStorage == Adapter For Keychain
const sparkMD5 = importModule("spark-md5.min");
class SecureStorage {
  constructor() {
    this.init()
  };
  init() {
    this.adapter = 'Adapter.For.Keychain'
  };
  getAdapter() {
    return this.adapter
  };
  get(key) {
    return Keychain.get(key)
  };
  set(key, value) {
    return Keychain.set(key, value)
  };
  contains(key) {
    return Keychain.contains(key)
  };
  remove(key) {
    return Keychain.remove(key)
  };
}

// ----- FileStorage == Adapter For FileManager
class FileStorage {
  constructor(prefix) {
    if (typeof prefix === "string") {
      this.prefix = prefix
    } else {
      this.prefix = ''
    }
    this.init()
  };
  init() {
    this.adapter = 'Adapter.For.FileManager'
    this.fm = FileManager.local()
    this.cacheDir = this.fm.joinPath(this.fm.documentsDirectory(), '.cache')
  };
  _safePath(filePath) {
    return this.fm.joinPath(this.cacheDir, filePath).replace(/\/+$/, '')
  };
  _touch(realPath) {
    const i = realPath.lastIndexOf("/")
    const dir = realPath.substring(0, i)
    if (!this.fm.fileExists(dir)) {
      this.fm.createDirectory(dir, true)
    }
  };
  _writeString(filePath, content) {
    const fullPath = this._safePath(filePath)
    this._touch(fullPath)
    this.fm.writeString(fullPath, content)
  };
  _readString(filePath) {
    const fullPath = this._safePath(filePath)
    if (this.fm.fileExists(fullPath)) {
      return this.fm.readString(fullPath)
    }
    return null
  };
  _fileExists(filePath) {
    const fullPath = this._safePath(filePath)
    return this.fm.fileExists(fullPath)
  };
  _deleteFile(filePath) {
    const fullPath = this._safePath(filePath)
    if (this.fm.fileExists(fullPath)) {
      this.fm.remove(fullPath)
    }
  };
  _hash(key) {
    return sparkMD5.hash(this.prefix + key)
  };
  getAdapter() {
    return this.adapter;
  };
  get(key) {
    let hashKey = this._hash(key)
    return this._readString(hashKey)
  };
  set(key, value) {
    let hashKey = this._hash(key)
    this._writeString(hashKey, value)
  };
  contains(key) {
    let hashKey = this._hash(key)
    return this._fileExists(hashKey)
  };
  remove(key) {
    let hashKey = this._hash(key)
    this._deleteFile(hashKey)
  };
}

const useSecureStorage = (adapter) => {
  return new SecureStorage();
}

const useFileStorage = () => {
  return new FileStorage();
}

module.exports = {
  useFileStorage,
  useSecureStorage,
}