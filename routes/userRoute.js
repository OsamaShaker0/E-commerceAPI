const express = require("express");
const router = express.Router();
const addPhoto = require("../middlewares/addPhoto");
const upload = addPhoto("./uploads/user");
const {
  getAllUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  updateUserPhoto,
  updateUserPassword,
} = require("../controllers/userController");
router
  .route("/:id/profilepicture")
  .put(upload.single("image"), updateUserPhoto);
router.route("/").get(getAllUsers).post(upload.single("image"), createUser);
router.route("/:id").get(getSingleUser).put(updateUser).delete(deleteUser);
router
  .route("/:id/updatepassword").put(updateUserPassword)
module.exports = router;
