const express = require("express");
const router = express.Router();
const addPhoto = require("../middlewares/addPhoto");
const upload = addPhoto("./uploads/user");
const { protect, authorize, checkSame } = require("../middlewares/protect");
const {
  getAllUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  updateUserPhoto,
  updateUserPassword,
  getMe,
} = require("../controllers/userController");
router.route("/getme").get(protect, authorize("admin", "user"), getMe);

router
  .route("/:id/profilepicture")
  .put(
    protect,
    authorize("admin", "user"),
    checkSame,
    upload.single("image"),
    updateUserPhoto
  );

router
  .route("/:id/updatepassword")
  .put(protect, authorize("admin", "user"), updateUserPassword);

router
  .route("/:id")
  .get(getSingleUser)
  .put(protect, authorize("admin", "user"), checkSame, updateUser)
  .delete(protect, authorize("admin", "user"), checkSame, deleteUser);

router
  .route("/")
  .get(getAllUsers)
  .post(protect, authorize("admin"), upload.single("image"), createUser);
module.exports = router;
