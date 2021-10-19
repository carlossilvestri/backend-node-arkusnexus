
// const Ciudad = require("../models/Ciudad");
const User = require("../models/User");
const Role = require("../models/Role");
const Level = require("../models/Level");
const authService = require("../services/auth.service");
const bcryptService = require("../services/bcrypt.service");
const { lePerteneceElToken } = require("../functions/function");

/*
==========================================
Get Users: GET - /users Params: ?desde=0 (Devuelve un arreglo de Users limitandolo a 10 y decidiendo desde para la paginacion) sino se envia un desde por default sera 0.
 Los mas recientes primero. (Order by DESC) 
==========================================
*/
exports.getAll = async (req, res) => {
  let desde = req.query.desde || 0;
  desde = Number(desde);

  if (desde == 0 || desde > 0) {
    try {
      let users = await User.findAll({
        limit: 10,
        offset: desde,
        order: [["createdAt", "DESC"]],
        where: {
          is_active_user: true
        },
        include: [
          {
            model: Role,
            as: "Role",
            required: true
          },
          {
            model: Level,
            as: "Level",
            required: true
          },
        ],
      });
      const UsersQuantity = users.length;
      return res.status(200).json({
        ok: true,
        users_quantity_for_the_request: UsersQuantity,
        users,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        ok: false,
        msg: "Internal server error",
      });
    }
  } else {
    // 400 (Bad Request)
    return res.status(400).json({
      ok: false,
      msg: "El parametro desde no es válido",
    });
  }
};

/*
==========================================
            Get a specific user by id.
GET - /user/:id_user
==========================================
*/
exports.getUserById = async (req, res) => {
  let id_user = req.params.id_user;
  id_user = Number(id_user);
  if (!id_user || id_user <= 0) {
    return res.status(400).json({
      ok: false,
      mensaje: "id_user is not valid.",
    });
  }
  // Find the user
  try {
    let user = await User.findByPk(id_user, {
      include: [
        {
          model: Role,
          as: "Role",
          required: true
        },
        {
          model: Level,
          as: "Level",
          required: true
        },
      ],
    });
    // If the user exists:
    if (user) {
      return res.status(200).json({
        ok: true,
        user,
      });
    }
    // The user does not exist:
    return res.status(400).json({
      ok: false,
      mensaje: "Could not find the user.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Internal server error",
    });
  }
};

/*
==========================================
                  Edit a user: 
PUT - /user/:id_user Body: (x-www-form-urlencoded)

id_english_level_f
id_role_f
technical_knoledge
link_cv
is_active_user
role
password
email
name
==========================================
*/
exports.editUserById = async (req, res) => {
  // Debugging
  const id_user = Number(req.params.id_user);
  const user = req.user; // with auth middleware I have access to req.user
  /* Preguntar si el idQR le pertenece al usuario del token */
  let lePertenecee = await lePerteneceElToken(user, id_user, User);
  if (!lePertenecee) {
    // Forbidden action
    return res.status(403).json({
      ok: false,
      msg: "You have no permissions.",
    });
  }
  // Get the data by a destructuring.
  const { id_english_level_f, id_role_f, technical_knoledge, link_cv, is_active_user, role,password, email, name } = req.body;
  try {
    let user = await User.findByPk(id_user);
    // Update data:
    user.id_english_level_f = id_english_level_f;
    user.id_role_f = id_role_f;
    user.technical_knoledge = technical_knoledge;
    user.link_cv = link_cv;
    user.is_active_user = is_active_user;
    user.role = role;
    user.name = name;
    user.password = password;
    user.password = bcryptService().password(user);
    console.log('bcryptService().password(user); ', bcryptService().password(user));
    user.updatedAt = new Date();
    //Metodo save de sequelize para guardar en la BDD
    const resultado = await user.save();
    if (!resultado) {
      return res.status(400).json({
        ok: false,
        msg: "There was an error, trying to save the user.",
        user,
      });
    }
    user = await User.findByPk(id_user, {
      include: [
        {
          model: Role,
          as: "Role",
          required: true
        },
        {
          model: Level,
          as: "Level",
          required: true
        },
      ],
    });
    return res.status(200).json({
      ok: true,
      msg: "User was updated",
      user
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      ok: false,
      msg: "Internal server error",
    });
  }
};
/*
==========================================
                Register a new user: 

POST - /user Body: (x-www-form-urlencoded)
id_english_level_f
id_role_f
technical_knoledge
link_cv
is_active_user
role
password
email
name
==========================================
*/
exports.register = async (req, res) => {
  // Debugging
  // console.log('req.body ', req.body);

  // Get the data.
  const { id_english_level_f, id_role_f, technical_knoledge, link_cv, is_active_user, role,password, email, name } = req.body;
  const objUser = { id_english_level_f, id_role_f, technical_knoledge, link_cv, is_active_user, role,password, email, name };

  try {
    // Create the new user.
    await User.create(objUser);
    // Find the user
    const userFound = await User.findOne({
      where: {
        email,
      },
      include: [
        {
          model: Role,
          as: "Role",
          required: true
        },
        {
          model: Level,
          as: "Level",
          required: true
        },
      ],
    });
    const token = authService().issue({
      user: userFound
    });

    return res.status(201).json({
      ok: true,
      token,
      user: userFound,
    });
  } catch (err) {
    if (err.original) {
      if (err.original.errno == 1452 || err.original.errno == 1062) {
        // Accion Prohibida
        return res.status(403).json({
          ok: false,
          msg: "Correo/Identificación ya registrado.",
          // msg: err.original.sqlMessage,
        });
      }
    }
    /*
    if (err.errors[0]) {
      if (err.errors[0].type == "Validation error") {
        // Accion Prohibida
        return res.status(403).json({
          ok: false,
          msg: "Correo/Identificación ya registrado.",
          // msg: err.errors[0].message,
        });
      }
    }
    */
    console.log(err);
    // console.log('err.errors[0] ', err.errors[0].type == 'Validation error');
    return res.status(500).json({
      ok: false,
      msg: "Internal server error",
    });
  }
};
/*
==========================================
POST - /user (Devuelve un usuario logueado con su token valido)
==========================================
*/
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (email && password) {
    try {
      const user = await User.findOne({
        where: {
          email,
        },
        include: [
          {
            model: Role,
            as: "Role",
            required: true
          },
          {
            model: Level,
            as: "Level",
            required: true
          },
        ],
      });

      if (!user) {
        return res.status(400).json({
          msg: "Bad Request: User not found",
        });
      }
      if(!user.is_active_user){
        return res.status(403).json({
          msg: "Su usuario está deshabilitado",
        });
      }
      if (bcryptService().comparePassword(password, user.password)) {
        const token = authService().issue({
          user
        });
        // No mostrar el hash del password
        // user.password = ":)";
        return res.status(200).json({
          token,
          user,
        });
      }

      return res.status(401).json({
        msg: "Credenciales inválidas",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        msg: "Internal server error",
      });
    }
  }

  return res.status(400).json({
    msg: "Bad Request: Email or password is wrong",
  });
};
