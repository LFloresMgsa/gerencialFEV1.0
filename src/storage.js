import CryptoJS from 'crypto-js';

export const storage = {
  IniciaVariablesGlobales,
  SetStorage,
  GetStorage,
  DelStorage,
  SetStorageObj,
  GetStorageObj,
  hideAccesoSubida,
  isAccesoSubidaHidden,
  SetCookie,
  GetCookie,
  DelCookie,
  cifrarConClave
};

let variablesEncriptadas = {}; // Objeto para almacenar las variables encriptadas

function IniciaVariablesGlobales() {
  SetStorage('soft_cCodSoft','011');
  return true;
}

function generarClaveAleatoria(longitud) {
  const caracteres = 'あいうえおかきくけこさしすせそたちつてと' +
    'なにぬねのはひふへほまみむめもやゆよら' +
    'りるれろわをん漢字汉字1234567890' +
    '!@#$%^&*()-_=+[{]}\\|;:\'",<.>/?' +
    '🔒' 
  let clave = '';
  for (let i = 0; i < longitud; i++) {
    const indice = Math.floor(Math.random() * caracteres.length);
    clave += caracteres.charAt(indice);
  }
  return clave;
}

const claveSecreta = generarClaveAleatoria(45); // Genera una clave de 64 caracteres

function SetStorage(pVariable, pValue, storageType = sessionStorage) {
  if (pValue !== undefined) {
    try {
      const encryptedValue = cifrarConClave(pValue);
      storageType.setItem(pVariable, encryptedValue);
      // Almacenar la versión encriptada de la variable
      variablesEncriptadas[pVariable] = encryptedValue;
      return true;
    } catch (error) {
      console.error('Error durante el cifrado:', error);
      return false;
    }
  } else {
    console.error('pValue es indefinido');
    return false;
  }
}

function GetStorage(pVariable, storageType = sessionStorage) {
  try {
    const encryptedValue = storageType.getItem(pVariable) || "";
    if (encryptedValue === "") {
      return "";
    }
    // Si la variable está en la lista de variables encriptadas, retornar su valor desencriptado
    if (variablesEncriptadas.hasOwnProperty(pVariable)) {
      return descifrarConClave(variablesEncriptadas[pVariable]);
    }
    const decryptedValue = descifrarConClave(encryptedValue);
    return decryptedValue || "";
  } catch (error) {
    console.error('Error durante el descifrado:', error);
    return "";
  }
}

function cifrarConClave(valor) {
  // Primero, ciframos en base64
  const base64 = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(valor));
  // Luego, mezclamos con caracteres japoneses, chinos y números
  let encryptedValue = '';
  for (let i = 0; i < base64.length; i++) {
    encryptedValue += base64.charAt(i) + generarClaveAleatoria(1); // Mezclamos con caracteres japoneses, chinos y números
  }
  return encryptedValue;
}

function descifrarConClave(encryptedValue) {
  let base64 = '';
  // Deshacemos la mezcla, extrayendo solo los caracteres base64
  for (let i = 0; i < encryptedValue.length; i++) {
    if (i % 2 === 0) {
      base64 += encryptedValue.charAt(i);
    }
  }
  // Desciframos el valor base64
  const decryptedValue = CryptoJS.enc.Base64.parse(base64).toString(CryptoJS.enc.Utf8);
  return decryptedValue;
}

function SetStorageObj(pVariable, pValue, storageType = sessionStorage) {
  const obj = JSON.stringify(pValue);
  try {
    const encryptedValue = cifrarConClave(obj);
    storageType.setItem(pVariable, encryptedValue);
    // Almacenar la versión encriptada del objeto
    variablesEncriptadas[pVariable] = encryptedValue;
    return true;
  } catch (error) {
    console.error('Error durante el cifrado:', error);
    return false;
  }
}

function DelStorage(pVariable, storageType = sessionStorage) {
  storageType.removeItem(pVariable);
  // Eliminar la variable encriptada de la lista
  delete variablesEncriptadas[pVariable];
  return true;
}

function GetStorageObj(pVariable, storageType = sessionStorage) {
  const encryptedValue = storageType.getItem(pVariable) || "";

  if (encryptedValue === "") {
    return [];
  }

  try {
    // Si la variable está en la lista de variables encriptadas, retornar su valor desencriptado
    if (variablesEncriptadas.hasOwnProperty(pVariable)) {
      return JSON.parse(descifrarConClave(variablesEncriptadas[pVariable]));
    }
    const decryptedValue = descifrarConClave(encryptedValue);
    return JSON.parse(decryptedValue) || [];
  } catch (error) {
    console.error('Error during decryption:', error);
    return [];
  }
}

function hideAccesoSubida() {
  storage.Sgm_cAccesodeSubidaHidden = true;
}

function isAccesoSubidaHidden() {
  return storage.Sgm_cAccesodeSubidaHidden === true;
}

function SetCookie(name, value, days) {
  if (value !== undefined) {
    try {
      const encryptedValue = cifrarConClave(value);
      let expires = "";
      if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 10000));
        expires = "; expires=" + date.toUTCString();
      }
      document.cookie = name + "=" + (encryptedValue || "") + expires + "; path=/";
      return true;
    } catch (error) {
      console.error('Error durante el cifrado:', error);
      return false;
    }
  } else {
    console.error('El valor es indefinido');
    return false;
  }
}


function GetCookie(name) {
  const nameEQ = name + "=";
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1, cookie.length);
    }
    if (cookie.indexOf(nameEQ) === 0) {
      const encryptedValue = cookie.substring(nameEQ.length, cookie.length);
      return descifrarConClave(encryptedValue) || null;
    }
  }
  return null;
}



function DelCookie(name) {
  document.cookie = name + '=; Max-Age=-99999999;';
}
