const Role = require('../models/Role');

/*
==========================================
Register a role: POST - /role Body: (x-www-form-urlencoded) name
==========================================
*/
exports.register = async (req, res) => {
    const { name } = req.body;
    if (name != '' && name) {
        try {
            const role = await Role.create({
                name
            });
            return res.status(200).json({
                ok: true,
                role
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                msg: 'Internal server error'
            });
        }
    }

    return res.status(400).json({
        msg: 'Bad Request: Please register a valid level.'
    });
}

/* ==========================================
Edit a role: PUT /role/:id_role Ejm. /role/1
name     (body)
id_role (params)
(x-www-form-urlencoded)
========================================== */
exports.edit = async (req, res) => {
    /*
    // Debugging...
    console.log("req.params ", req.params, "req.body ", req.body);
    */
    // Get the data:
    const id_role = req.params.id_role,
        name = req.body.name;
    if (id_role) {
        try {
            // Validar que no esten vacios los datos.
            if (name != '' && name) {
                const role = await Role.findOne({ where: { id_role }});
                //Cambiar el nombre del role:
                role.name = name;
                role.updatedAt = new Date();
                //Metodo save de sequelize para guardar en la BDD
                const resultado = await role.save();
                if (!resultado) return next();
                return res.status(200).json({
                    ok: true,
                    msg: 'Role was updated'
                });
            }
            return res.status(400).json({
                ok: false,
                msg: 'Bad Request'
            });

        } catch (err) {
            console.log(err);
            return res.status(500).json({
                ok: false,
                msg: 'Internal server error'
            });
        }
    } else {
        // Accion prohibida. (Error)
        return res.status(403).json({
            ok: false,
            msg: 'El id es obligatorio'
        });
    }
}

/* ==========================================
Get all roles:
This end point does not have pagination because the idea is just to get a few roles.
1.- NORMAL, 2.- ADMIN, 3.- SUPER_ADMIN.): 
GET /role 
========================================== */
exports.getAll = async (req, res) => {
    // console.log(req);
    try {
        const roles = await Role.findAll({
            order: [
              ['createdAt', 'ASC']
            ],
        });
        return res.status(200).json({
            ok: true,
            roles
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            msg: 'Internal server error'
        });
    }
}
/*==========================================
Get a specific roles by id: GET /role/:id_role == NO TOKEN REQUIRED ==
==========================================*/
exports.getById = async (req, res) => {
    // Obtener los datos por destructuring.
    const id_role = Number(req.params.id_role);
    if (id_role) {
      try {
        const role = await Role.findByPk(id_role);
        if (!role) {
          return res.status(400).json({
            ok: false,
            msg: `No results of roles for id_role = ${id_role}`,
          });
        }
        return res.status(200).json({
          ok: true,
          role,
        });
      } catch (err) {
        console.log(err);
        return res.status(500).json({
          msg: "Internal server error",
        });
      }
    } else {
      // 400 (Bad Request)
      return res.status(400).json({
        ok: false,
        msg: "Bad Request: Check your request, and id_role (int).",
      });
    }
  };
/* ==========================================
 Delete a role: DELETE /role/:id_role Ejm. /role/1 
 ========================================== */
 exports.delete = async (req, res, next) => {
    /*
    // Debugging...
    console.log("req.params ", req.params, "req.body ", req.body);
    */
    const id_role = req.params.id_role;
    if (id_role) {
        try {
            const resultado = await Role.destroy({ where: { id_role } });
            if (!resultado) {
                return res.status(400).json({
                    ok: false,
                    msg: 'id_role not found.'
                });
            }
            return res.status(200).json({
                ok: true,
                msg: 'Role was deleted'
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                msg: 'Internal server error.'
            });
        }
    } else {
        // Accion prohibida. (Error)
        return res.status(403).json({
            ok: false,
            msg: 'id_role is obligatory.'
        });
    }
}