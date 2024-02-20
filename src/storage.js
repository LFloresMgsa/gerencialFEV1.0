
export const storage = {
  IniciaVariablesGlobales,
  SetStorage,
  GetStorage,
  GetStorageN,
  DelStorage,
  SetStorageObj,
  GetStorageObj
};


function IniciaVariablesGlobales() {

//SetStorage('Emp_cCodigo', '');
  //SetStorage('Pan_cAnio', '');
  //SetStorage('Carrito', []);
  SetStorage('soft_cCodSoft','011');
  


  return true;
}

function SetStorageObj(pVariable, pValue) {

  let obj = JSON.stringify(pValue);
  localStorage.setItem(pVariable, obj);

  return true;
}


function GetStorageObj(pVariable) {



  let nsVariable = localStorage.getItem(pVariable)
  ? localStorage.getItem(pVariable)
  : "";

  

  let obj =[];

  if (nsVariable == ""){
    return [];
  }
  
  return JSON.parse(nsVariable);
}

function SetStorage(pVariable, pValue) {

  localStorage.setItem(pVariable, pValue);

  return true;
}


function GetStorage(pVariable) {

  let nsVariable = localStorage.getItem(pVariable);

  return nsVariable;
}

function GetStorageN(pVariable) {

  let nsVariable = localStorage.getItem(pVariable);

  return nsVariable;
}

function DelStorage(pVariable) {

  localStorage.removeItem(pVariable);

  return true;
}


