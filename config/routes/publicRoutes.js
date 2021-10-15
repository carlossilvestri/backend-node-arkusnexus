const express = require("express");
const router = express.Router();

const UserController  = require("../../api/controllers/UserController");
const LevelController  = require("../../api/controllers/LevelController");
const RoleController  = require("../../api/controllers/RoleController");
const TeamController  = require("../../api/controllers/TeamController");
const AccountController  = require("../../api/controllers/AccountController");
const Team_userController  = require("../../api/controllers/Team_userController");

const swaggerDocumentOne = require('../../api/swagger-doc/swagger-one.json');
//Middleware para proteger las rutas.
const auth = require("../../api/middlewares/auth");
const auth2 = require("../../api/middlewares/auth2");
// Swagger
const swaggerUI = require("swagger-ui-express");
const { validarTodosLosCamposDelEstado, validarPatchDelEstado } = require("../../api/middlewares/stateValidation");
const { validateNewUser, validateEditUser } = require("../../api/middlewares/userValidation");
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Medifree API",
      version: "1.0.0",
      description: "Medifree Api for managing donations of medicines",
      contact: {
        name: "Carlos Silvestri"
      },
    },
  },
  apis: ["./publicRoutes"],
};
module.exports = () => {
  /* SWAGGER */
  router.use('/api-docs-one', swaggerUI.serveFiles(swaggerDocumentOne, swaggerOptions), swaggerUI.setup(swaggerDocumentOne));
  /* USERS */
  router.get("/users", UserController.getUsers);
  /* LEVELS */
  router.post("/level", LevelController.register);
  /* ROLES */
  router.post("/role", RoleController.register);
  /* TEAMS */
  router.post("/team", TeamController.register);
  /* ACCOUNTS */
  router.post("/account", AccountController.register);
  /* TEAM_USERS */
  router.post("/team_user", Team_userController.register);
  // 
  // router.get("/users", UserController.getUsers);
  /* PRUEBAS */
  router.get("/", (req, res) => {
    res.send("inicio");
  });
  return router;
};
