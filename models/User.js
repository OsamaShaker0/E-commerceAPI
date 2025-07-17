const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
      minlength: [3, "Name must be at least 3 characters long"],
      maxlength: [50, "Name must be at most 50 characters long"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    phone: {
      type: String,
    },
    profilePicture: {
      type: String,
      default: "https://example.com/default-profile.png",
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: true, // Exclude password from queries by default
    },
    passwordChangedAt: Date,
    passwordRestCode: String,
    passwordRestExpire: Date,
    passwordResetVerify: Boolean,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        default: [],
      },
    ],
    addresses: [
      {
        id: { type: mongoose.Schema.Types.ObjectId },
        alias: {
          type: String,
          required: [true, "please provide address name"],
          unique: [true],
        },
        details: {
          type: String,
          required: [true, "we need decsription for your address"],
          minlength: [10, "Details can not be less than 10 char"],
          maxlength: [50, "Details can not be more than 50 char"],
        },
        phoneNumber: {
          type: String,
          required: [true, "please add phone number"],
        },
        city: { type: String, required: [true, "please add location city"] },
        postalCode: {
          type: String,
          required: [true, "please add your postal code"],
        },
      },
    ],
  },
  { timestamps: true }
);
// hash password
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
// compare passwords
UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
// create token
UserSchema.methods.getToken = function () {
  let token = jwt.sign(
    {
      userId: this._id,
      userName: this.name,
      userEmail: this.email,
      userRole: this.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
  return token;
};
// generate code
UserSchema.methods.generateCode = function () {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  return code;
};
// hash code
UserSchema.methods.hashCode = function (code) {
  let hash = crypto.createHash("sha256").update(code).digest("hex");
  return hash;
};
module.exports = mongoose.model("User", UserSchema);
