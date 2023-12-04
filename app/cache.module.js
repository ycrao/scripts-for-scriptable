// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: teal; icon-glyph: hands;

const _info = {
  name: 'cache.module',
  version: '1.1',
  updated_at: '2023-12-04 17:45:00',
  author: 'raoyc',
  description: 'a module for cache',
  repo_file_url: 'https://github.com/ycrao/scripts-for-scriptable/blob/main/app/cache.module.js',
  raw_file_url: 'https://raw.githubusercontent.com/ycrao/scripts-for-scriptable/main/app/cache.module.js'
}

// ----- SecureStorage == Adapter For Keychain
const sparkMD5 = importModule("spark-md5.min");
class SecureStorage {
  constructor(prefix) {
    if (typeof prefix === "string") {
      this.prefix = prefix
    } else {
      this.prefix = ''
    }
    this.init()
  };
  init() {
    this.adapter = 'Adapter.For.Keychain'
  };
  _hash(key) {
    return sparkMD5.hash(this.prefix + key)
  };
  getAdapter() {
    return this.adapter
  };
  get(key) {
    let hashKey = this._hash(key)
    return Keychain.get(hashKey)
  };
  set(key, value) {
    let hashKey = this._hash(key)
    return Keychain.set(hashKey, value)
  };
  contains(key) {
    let hashKey = this._hash(key)
    return Keychain.contains(hashKey)
  };
  remove(key) {
    let hashKey = this._hash(key)
    return Keychain.remove(hashKey)
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

const useSecureStorage = (prefix) => {
  return new SecureStorage(prefix);
}

const useFileStorage = (prefix) => {
  return new FileStorage(prefix);
}

module.exports = {
  useFileStorage,
  useSecureStorage,
}