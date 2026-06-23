import express from 'express'
import adminMiddleware from '../middleware/adminMiddleware.js'


const problemRouter = express.Router();

//create
problemRouter.post("/create",adminMiddleware, problemCreate);
problemRouter.patch("/:id",adminMiddleware,problemUpdate)
problemRouter.delete('/:id',adminMiddleware,problemDelete);

problemRouter.get("/:id",problemFetch);
problemRouter.get("/", getAllProblem);
problemRouter.get("/user",solvedProblem);

export default problemRouter;