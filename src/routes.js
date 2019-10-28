import { Router } from "express";
import multer from "multer";
import multerConfig from "./config/multer";

import ConvertVaisalaController from "./app/controllers/ConvertVaisalaController";
import ConvertEgsController from "./app/controllers/ConvertEgsController";

const routes = new Router();
const upload = multer(multerConfig);

routes.get("/convertVaisala", ConvertVaisalaController.index);
routes.post(
  "/convertVaisala",
  upload.single("file"),
  ConvertVaisalaController.store
);

routes.get("/convertEgs", ConvertEgsController.index);
routes.post("/convertEgs", upload.single("file"), ConvertEgsController.store);

export default routes;
