/*
Params: user = {}, idQR = Number.
Devuelve un booleano.
Si no le pertenece idQR al usuario del token. Simplemente lo demas no se ejecutara.
*/
exports.lePerteneceElToken = async (user = "", id = "", model = "") => {
  if (user == "" || id == "" || model == "") {
    return false;
  }
  /*console.log("typeof id ", typeof id);
    console.log("id ", id);*/
  // if(typeof id == 'object'){}
  /* Buscar la pregunta de seguridad. */
  // Obtener la pregunta
  try {
    // Existe la pregunta?
    const resultado = await model.findByPk(id);
    /*console.log("resultado ", resultado);
      console.log("resultado.idUsuarioF ", resultado.idUsuarioF);*/
    if (!resultado) {
      return false;
    } else {
      /* Preguntar si el id no le pertenece al usuario del token */
      if (resultado.id_user) {
        // console.log('Resultado ', resultado);
        if (resultado.id_user == user.id_user) {
          return true;
        } else {
          return false;
        }
      }
    }
  } catch (error) {
    console.log("En lePerteneceElToken function ", error);
    return false;
  }
};
exports.stringToBoolean = (string) => {
  switch (string.toLowerCase().trim()) {
    case "true":
    case "yes":
    case "1":
      return true;
    case "false":
    case "no":
    case "0":
    case null:
      return false;
    default:
      return Boolean(string);
  }
};

/**
 * Method: isObjAccountValid. Validate if the object sent through the API is valid / or not empty.
 * @param { is_active : boolean, id_team_f : int, responsible_operations_name : string, name_client : string, account_name : string } objAccount
 * @returns boolean
 */
exports.isObjAccountValid = (objAccount) => {
  console.log("objAccount ", objAccount);
  let isValid = false;
  // Check for OBLIGATORY fields.
  if (
    objAccount.id_team_f &&
    objAccount.id_team_f != "" &&
    objAccount.responsible_operations_name &&
    objAccount.responsible_operations_name != "" &&
    objAccount.name_client &&
    objAccount.name_client != "" &&
    objAccount.account_name &&
    objAccount.account_name != ""
  ) {
    isValid = true;
  } else {
    isValid = false;
  }
  return isValid;
};
/**
 * Method: isObjTeamUserValid. Validate if the object sent through the API is valid / or not empty.
 * @param { 
 *      ending_date : Date,
        beggining_date : Date,
        id_user_f : int,
        id_team_f : int
    } objTeamUser 
 * @returns boolean
 */
exports.isObjTeamUserValid = (objTeamUser) => {
  console.log("TeamUser ", objTeamUser);
  let isValid = false;
  // Check for OBLIGATORY fields.
  if (
    objTeamUser.ending_date &&
    objTeamUser.ending_date != "" &&
    objTeamUser.beggining_date &&
    objTeamUser.beggining_date != "" &&
    objTeamUser.id_user_f &&
    objTeamUser.id_user_f != "" &&
    objTeamUser.id_team_f &&
    objTeamUser.id_team_f != ""
  ) {
    isValid = true;
  } else {
    isValid = false;
  }
  return isValid;
};

/**
 * 
 * @param {
 * id_english_level_f : int, id_role_f : int, technical_knoledge : string, link_cv : string,is_active_user : boolean, password : string, email : string, name : string, id_user : int,
 Role : {
    name:      string;
    createdAt: Date;
    updatedAt: Date;
    id_role:  number;
 }
 Level : {
    id_level: number;
    name:      string;
    createdAt: Date;
    updatedAt: Date;
 }
 * } objUser
 @return boolean 
 */
exports.isSuperAdmin = (objUser) => {
  let isSuperAdmin = false;
  if(objUser?.Role?.name === 'SUPER_ADMIN'){
    isSuperAdmin = true;
  }
  return isSuperAdmin;
};
