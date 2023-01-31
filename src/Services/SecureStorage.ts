import SecureStorages from 'secure-web-storage';
import CryptoJS from 'crypto-js';

const HAPRSC = "PZxG7WKEnaUvW5Hy";

const secureStorage = new SecureStorages(localStorage, {
    hash: function hash(key) {
      key = CryptoJS.SHA256(key, HAPRSC);

      return key.toString();
    },
    encrypt: function encrypt(data) {
      data = CryptoJS.AES.encrypt(data, HAPRSC);

      data = data.toString();

      return data;
    },
    decrypt: function decrypt(data) {
      data = CryptoJS.AES.decrypt(data, HAPRSC);

      data = data.toString(CryptoJS.enc.Utf8);

      return data;
    }
  })

export default secureStorage;
