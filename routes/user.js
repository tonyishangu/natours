const express = require('express')
const userControllers = require('./../controllers/users')


const router = express.Router()
router
  .route('/')
  .get(userControllers.getAllUsers)
  .post(userControllers.createUser);

router
  .route('/:id')
  .get(userControllers.getUser)
  .patch(userControllers.editUser)
  .delete(userControllers.deleteUser)

module.exports = router;