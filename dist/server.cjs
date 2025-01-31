"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/server.ts
var import_express4 = __toESM(require("express"), 1);
var import_dotenv2 = __toESM(require("dotenv"), 1);
var import_morgan = __toESM(require("morgan"), 1);
var import_cookie_parser = __toESM(require("cookie-parser"), 1);

// src/config/db.ts
var import_mongoose = __toESM(require("mongoose"), 1);
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var DB_URI = process.env.DB_URI || "";
var connectToDB = async () => {
  try {
    await import_mongoose.default.connect(`${DB_URI}`);
    console.log("Connected to Database");
  } catch (error) {
    console.log("An error occured while connecting to the database: ");
  }
};

// src/middlewares/error-handler.ts
var globalErrorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  console.log(`[Error]: ${status}: ${message}`);
  return res.status(status).json({
    success: false,
    error: message,
    path: req.originalUrl,
    timeStamp: (/* @__PURE__ */ new Date()).toISOString()
  });
};
var AuthError = class extends Error {
  constructor(message, status = 401) {
    super(message);
    this.name = "AuthError";
    this.status = status;
    this.message = "....UNAUTHORIZED!!!...";
  }
};
var APIError = class extends Error {
  constructor(message = "Something went wrong. Please try the action again", status = 500) {
    super(message);
    this.name = "APIError";
    this.status = status;
  }
};

// src/routes/user.route.ts
var import_express = require("express");

// src/models/user.model.ts
var import_mongoose2 = __toESM(require("mongoose"), 1);
var userSchema = new import_mongoose2.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    password: { type: String, required: true, select: false },
    alias: { type: String },
    walletAddress: { type: String, unique: true },
    email: { type: String, required: true, unique: true },
    ranking: {
      type: String,
      default: "explorer",
      enum: [
        "explorer",
        "initiate",
        "pathfinder",
        "pioneer",
        "validator",
        "guardian",
        "legend"
      ]
    },
    role: { type: String, default: "regular", enum: ["admin", "regular"] }
  },
  {
    timestamps: true
  }
);
var UserModel = import_mongoose2.default.model("User", userSchema);

// src/services/user.service.ts
var bcrypt = __toESM(require("bcrypt"), 1);
var UserService = class {
  constructor(userModel) {
    this.userModel = userModel;
  }
  async createUser(userDetails) {
    const email = userDetails.email;
    const isExistingUser = await this.userModel.findOne({
      email
    });
    if (isExistingUser) {
      throw new Error("Email not available");
    }
    let hashedPassWord;
    if (userDetails.password) {
      hashedPassWord = await bcrypt.hash(userDetails.password, 13);
      userDetails.password = hashedPassWord;
    }
    if (userDetails.role) {
      userDetails.role = "regular";
    }
    const user = await this.userModel.create(userDetails);
    return user;
  }
  async findOne(id) {
    const user = await this.userModel.findById(id);
    return user;
  }
  async findAllUser() {
    return await this.userModel.find({});
  }
};

// src/controllers/user.controller.ts
var userService = new UserService(UserModel);
async function createUser(req, res, next) {
  try {
    const user = await userService.createUser(req.body);
    return res.status(201).json(user);
  } catch (error) {
    next(error);
  }
}
async function findUser(req, res, next) {
  try {
    const user = await userService.findOne(req.params.id);
    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

// src/routes/user.route.ts
var router = (0, import_express.Router)();
router.post("/", createUser);
router.get("/:id", findUser);
var user_route_default = router;

// src/routes/auth.route.ts
var import_express2 = require("express");

// src/services/auth.service.ts
var import_jsonwebtoken = __toESM(require("jsonwebtoken"), 1);
var bcrypt2 = __toESM(require("bcrypt"), 1);
var ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET;
var REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET;
var AuthService = class {
  constructor(userModel) {
    this.userModel = userModel;
  }
  generateAccessToken(user) {
    return import_jsonwebtoken.default.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: "20m" });
  }
  generateRefreshToken(user) {
    return import_jsonwebtoken.default.sign(user, REFRESH_TOKEN_SECRET, { expiresIn: "10d" });
  }
  verifyToken(token, type) {
    const secret = type === "access" ? ACCESS_TOKEN_SECRET : REFRESH_TOKEN_SECRET;
    try {
      const decodedUser = import_jsonwebtoken.default.decode(token, secret);
      return decodedUser;
    } catch (error) {
      console.log("Failed to verify user", error);
      return null;
    }
  }
  async loginUser(userCredentials) {
    const user = await this.userModel.findOne({
      email: userCredentials.email
    }).select("+password").exec();
    if (!user) {
      throw new AuthError("User Not found");
    }
    const isValidPassword = await bcrypt2.compare(
      userCredentials.password,
      user.password
    );
    if (!isValidPassword) {
      throw new AuthError("Invalid Credentials");
    }
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);
    return {
      accessToken,
      refreshToken
    };
  }
};

// src/controllers/auth.controller.ts
var authService = new AuthService(UserModel);
async function loginUser(req, res) {
  const { accessToken, refreshToken } = await authService.loginUser(req.body);
  res.cookie("gibby_accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    maxAge: 20 * 1e3 * 60
    // 20 minutes
  });
  res.cookie("gibby_refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    maxAge: 10 * 1e3 * 60 * 60 * 24
    // 10 days
  });
  return res.status(200).json({ message: "Login Successful" });
}
function logoutUser(req, res, next) {
  res.clearCookie("gibby_accessToken");
  res.clearCookie("gibby_refreshToken");
  return res.status(200).json({ message: "You are out! We hope to see you soon" });
}

// src/middlewares/jwt-verification.ts
var authService2 = new AuthService(UserModel);
async function authenticateJWT(req, res, next) {
  try {
    const accessToken = req.cookies.gibby_accessToken;
    const refreshToken = req.cookies.gibby_refreshToken;
    if (!accessToken && !refreshToken) {
      return next(new AuthError("....Missing Authentication Token...."));
    }
    const isValidAccessToken = accessToken ? authService2.verifyToken(accessToken, "access") : null;
    const isValidRefreshToken = refreshToken ? authService2.verifyToken(refreshToken, "refresh") : null;
    if (!isValidAccessToken && !isValidRefreshToken) {
      return next(new AuthError("Invalid or Expired Token"));
    }
    if (!isValidAccessToken && isValidRefreshToken) {
      console.log("[MESSAGE]: ", "Token Renewed_______");
      const userPayload = isValidRefreshToken;
      const newAccessToken = authService2.generateAccessToken(userPayload._doc);
      req.user = userPayload._doc;
      res.cookie("gibby_accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        maxAge: 20 * 1e3 * 60
        // 20 minutes
      });
    }
    next();
  } catch (error) {
    console.log({ error });
    next(error);
  }
}

// src/routes/auth.route.ts
var router2 = (0, import_express2.Router)();
router2.post("/login", loginUser);
router2.post("/logout", authenticateJWT, logoutUser);
router2.get(
  "/protected",
  authenticateJWT,
  (req, res, next) => {
    return res.status(200).json({ message: "Welcome to the protected Route" });
  }
);
var auth_route_default = router2;

// src/routes/task.route.ts
var import_express3 = require("express");

// src/services/task.service.ts
var TaskService = class {
  constructor(taskModel) {
    this.taskModel = taskModel;
  }
  async createTask(taskDto) {
    console.log(taskDto);
    const task = await this.taskModel.findOne({
      name: taskDto.name,
      owner: taskDto.owner
    });
    if (task) {
      throw new APIError("Task Already Exists", 400);
    }
    const newTask = await this.taskModel.create(taskDto);
    return newTask;
  }
  /**
   * Returns all tasks based on the query parameters
   * @param taskDto
   * @returns {tasks, nestCursor: string}
   */
  async fetchUserTasks(taskDto) {
    let _a = taskDto, { limit, cursor } = _a, others = __objRest(_a, ["limit", "cursor"]);
    if (!limit) {
      limit = 20;
    }
    const query = { others };
    if (cursor) {
      query._id = { $lt: cursor };
    }
    const tasks = await this.taskModel.find(query).sort({ _id: -1 }).limit(limit + 1);
    const hasNextPage = tasks.length > limit;
    const nextCursor = hasNextPage ? tasks[limit]._id : null;
    return {
      tasks,
      nextCursor
    };
  }
  async fetchSingleTask(id) {
    const task = await this.taskModel.findById(id);
    return task;
  }
};

// src/models/task.model.ts
var import_mongoose3 = __toESM(require("mongoose"), 1);
var TaskSchema = new import_mongoose3.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 255 },
    description: { type: String, trim: true },
    category: { type: String, trim: true },
    tags: [{ type: String, trim: true }],
    tools: [{ type: String, trim: true }],
    owner: {
      type: import_mongoose3.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      trim: true
    },
    isStillOpen: { type: Boolean, default: true },
    source: { type: String },
    closeDate: { type: Date },
    workStatus: {
      type: String,
      enum: ["initialised", "completed"],
      default: "initialised"
    }
  },
  {
    timestamps: true
  }
);
var TaskModel = import_mongoose3.default.model("Task", TaskSchema);

// src/controllers/task.controller.ts
var taskService = new TaskService(TaskModel);
async function createTask(req, res, next) {
  try {
    const taskObj = req.body;
    console.log("user: ", req.user);
    taskObj.owner = req.user._id;
    const newTask = await taskService.createTask(req.body);
    return res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
}
async function findSingleTask(req, res, next) {
  try {
    const task = await taskService.fetchSingleTask(req.params.id);
    return res.status(200).json(task);
  } catch (error) {
    next(error);
  }
}
async function findAllTask(req, res, next) {
  try {
    const task = await taskService.fetchUserTasks(req.query);
    return res.status(200).json(task);
  } catch (error) {
    next(error);
  }
}

// src/routes/task.route.ts
var router3 = (0, import_express3.Router)();
router3.post("/", authenticateJWT, createTask);
router3.get("/", authenticateJWT, findAllTask);
router3.get("/:id", authenticateJWT, findSingleTask);
var task_route_default = router3;

// src/server.ts
import_dotenv2.default.config();
var PORT = process.env.PORT || 7e3;
var startServer = async () => {
  try {
    await connectToDB();
    const app = (0, import_express4.default)();
    app.use(import_express4.default.json());
    app.use(import_express4.default.urlencoded());
    app.use((0, import_morgan.default)("dev"));
    app.use((0, import_cookie_parser.default)());
    app.use("/api/auth", auth_route_default);
    app.use("/api/user", user_route_default);
    app.use("/api/task", task_route_default);
    app.use(globalErrorHandler);
    app.listen(PORT, async () => {
      console.log(
        `(${process.env.NODE_ENV}) `,
        "Server listening on port: ",
        PORT
      );
    });
  } catch (error) {
    console.log("Failed to start server: ", error.message);
    process.exit(1);
  }
};
startServer();
//# sourceMappingURL=server.cjs.map