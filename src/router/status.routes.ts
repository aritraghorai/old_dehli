import extractUser from "@/controller/extractUser.ts";
import statusController from "@/controller/status.controller.ts";
import ValidateRequestNew from "@/middleware/ValidateRequestNew.ts";
import restrictUser from "@/middleware/restrictUser.middleware.ts";
import { ROLES } from "@/utils/Constant.ts";
import { praramIdValidator } from "@/validator/common.validator.ts";
import { NewStatusValidator, UpdateStatusValidator } from "@/validator/status.validator.ts";
import { Router } from "express";

const statusRouter = Router()

statusRouter.get("/", statusController.getStatus)

statusRouter.use(extractUser)

statusRouter.use(restrictUser(ROLES.ADMIN, ROLES.SUPER_ADMIN))

statusRouter.post("/", ValidateRequestNew({
  reqBodySchema: NewStatusValidator,

}), statusController.createStatus)

statusRouter.route("/:id").patch(ValidateRequestNew({
  reqBodySchema: UpdateStatusValidator,
  paramSchema: praramIdValidator
}), statusController.updateStatus).
  delete(ValidateRequestNew({
    paramSchema: praramIdValidator
  }), statusController.deleteStatus)


export default statusRouter
