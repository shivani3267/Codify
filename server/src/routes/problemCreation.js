import express from 'express'
import adminMiddleware from '../middleware/adminMiddleware.js'
import userMiddleware from '../middleware/userMiddleware.js'
import { createProblem,updateProblem, deleteProblem, getProblembyId, getAllProblem ,solvedAllProblembyUser, submittedProblem} from '../controllers/problemcontroller.js';

const problemRouter = express.Router();

//create
problemRouter.post("/create",adminMiddleware, createProblem);
problemRouter.patch("/update/:id",adminMiddleware,updateProblem)
problemRouter.delete('/delete/:id',adminMiddleware,deleteProblem);

problemRouter.get("/ProblemById/:id",userMiddleware,getProblembyId);
problemRouter.get("/getAllProblem",userMiddleware, getAllProblem);
problemRouter.get("/ProblemSolvedByUser",userMiddleware,solvedAllProblembyUser);
problemRouter.get("/submittedProblem/:pid",userMiddleware,submittedProblem)

export default problemRouter;