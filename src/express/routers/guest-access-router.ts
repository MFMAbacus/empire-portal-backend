import express from "express";
import { getGuestAccessService } from "@/services/get-guest-access-service";
import { getSingleGuestAccessService } from "@/services/get-single-guest-access-service";
import { createGuestAccessService } from "@/services/create-guest-access-service";
import { updateGuestAccessService } from "@/services/update-guest-access-service";

export const guestAccessRouter = express.Router();

guestAccessRouter.get("/", async (req, res) => {
  const result = await getGuestAccessService.execute({ isArchived: req.query.isArchived === "1" });
  res.status(!result.hasFailed() ? 200 : 400).json(!result.hasFailed() ? { success: true, data: result.getValue() } : { success: false, error: result.getFailure() });
});

guestAccessRouter.get("/:id", async (req, res) => {
  const result = await getSingleGuestAccessService.execute(req.params.id);
  res.status(!result.hasFailed() ? 200 : 400).json(!result.hasFailed() ? { success: true, data: result.getValue() } : { success: false, error: result.getFailure() });
});

guestAccessRouter.post("/", async (req, res) => {
  const result = await createGuestAccessService.execute(req.body);
  res.status(!result.hasFailed() ? 200 : 400).json(!result.hasFailed() ? { success: true, data: result.getValue() } : { success: false, error: result.getFailure() });
});

// guestAccessRouter.put("/:id", async (req, res) => {
//   const result = await updateGuestAccessService.execute({ ...req.body, id: req.params.id, _id: req.body._id });
//   res.status(!result.hasFailed() ? 200 : 400).json(!result.hasFailed() ? { success: true, data: result.getValue() } : { success: false, error: result.getFailure() });
// });

guestAccessRouter.put("/:id", async (req, res) => {
  // _id ko destructure karke remove karein taake Mongoose update par error na de
  const { _id, ...updatePayload } = req.body;

  const result = await updateGuestAccessService.execute({
    ...updatePayload,
    id: req.params.id,
  });

  res
    .status(!result.hasFailed() ? 200 : 400)
    .json(
      !result.hasFailed()
        ? { success: true, data: result.getValue() }
        : { success: false, error: result.getFailure() }
    );
});