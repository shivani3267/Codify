import Problem from "../models/problem.js";
import Submission from "../models/submission.js";
import User from "../models/user.js";
import {getLanguageById,submitBatch,submitToken} from "../utils/ProblemUtility.js";


export const createProblem = async (req,res) => {
    const {title, description, difficulty, tags,
         visibleTestCases,  hiddenTestCases, startCode,
         referenceSolution,problemCreater
        } = req.body;

        try {
            //validate data like user soln and all
            //check ref soln is valid or not
            for(const {language,completeCode} of referenceSolution){
                //each ele is object - (lang,soln)
                 //source_code, language_id, stdin, expectedOutput for judge)API
                
                const languageId = getLanguageById(language);
                //create batch submission for each language
                const submissions = visibleTestCases.map((testcase)=> ({
                    source_code:completeCode,
                    language_id:language_id,
                    stdin:testcase.input,
                    expected_output:testcase.output
                } ));

                const submitResult = await submitBatch(submissions)
                const resultToken = submitResult.map((value) => value.token)//arr of token
                const TestResult = await submitToken(resultToken);

                for(const test of TestResult){
                    if(test.status_id != 3){
                       return res.status(400).send("Error occured fails!!");
                    }
                }

            }
            //save to db after all pass
            const userProblem = await Problem.create({
                ...req.body,
                problemCreater:req.result._id
            });

           return res.status(201).send("Problem Saved Successfully");
            
        } catch (error) {
            return res.status(400).send("Error!!" + error.message)
        }
}

export const updateProblem = async (req,res) => {
   const {id} =  req.params;
   try {
     const {title, description, difficulty, tags,
         visibleTestCases,  hiddenTestCases, startCode,
         referenceSolution,problemCreater
        } = req.body;
        if(!id){
            return res.status(404).send("Problem not found");
        }
        const problem = Problem.findById(id);
        if(!problem){
           return res.status(400).send("Missing problem id");
        }
        //validate data like user soln and all
            //check ref soln is valid or not
            for(const {language,completeCode} of referenceSolution){

                const languageId = getLanguageById(language);
                //create batch submission for each language
                const submissions = visibleTestCases.map((testcase)=> ({
                    source_code:completeCode,
                    language_id:language_id,
                    stdin:testcase.input,
                    expected_output:testcase.output
                } ));

                const submitResult = await submitBatch(submissions)
                const resultToken = submitResult.map((value) => value.token)//arr of token
                const TestResult = await submitToken(resultToken);

                for(const test of TestResult){
                    if(test.status_id != 3){
                       return res.status(400).send("Error occured fails!!");
                    }
                }

            }
            //update to db after all pass
            const newProblem = await Problem.findByIdAndUpdate(id,{ ...req.body}, {runValidators:true,new:true},{problemCreater:req.result._id});
            return res.status(200).send("Problem Updated successfully")

   } catch (error) {
    return res.status(500).send("error!!"+error.message)
   }
}

export const deleteProblem =async (req,res) => {
    const {id} = req.params;
    try {
        if(!id){
            return res.status(400).send("Problem Id missing");
        }
        const deletedproblem = await Problem.findByIdAndDelete(id);
        if(!deleteProblem){
            return res.status(404).send("Problem not found")
        }
        return res.status(201).send("Succefully deleted");
    } catch (error) {
        return res.status(400).send("ERROR!!" + error.message)
    }
}


export const getProblembyId = async (req,res) => {
    const {id} = req.params;
    try {
        if(!id){
            return res.status(400).send("Problem Id missing");
        }
        const getProblem = await Problem.findById(id).select('_id title description difficulty tags visibleTestcases startCode referenceSolution');
        if(!getProblem){
            return res.status(404).send("Problem not found")
        }
        return res.status(201).send(getProblem);
    } catch (error) {
        return res.status(400).send("ERROR!!" + error.message)
    }
}


export const getAllProblem = async (req,res) => {
    try {
        const getllproblem = await Problem.find({}).select('_id title difficulty tags');;
        //pagination -- await Problem.find({}).skip((page-1)*limitval).limit(limitval)
        //filtarartion -- await Problem.find({difficulty:'easy'})

        if(getllproblem.length===0){
            return res.status(404).send("No problem found");
        }
        return res.status(201).send(getllproblem);
    } catch (error) {
        return res.status(400).send("ERROR!!" + error.message);
    }
}

export const solvedAllProblembyUser = async (req,res) => {
    try {
        const userId = req.result._id;
        const user = await User.findById(userId).populate({
            path:"problemSolved",
            select:"_id title difficulty tags"
        });//jisko refer kar rha uski info
        
        res.status(200).send(user.problemSolved);
        
    } catch (error) {
        return res.status(500).send("ERROR!!" + error.message);
    }
}


export const submittedProblem = async (req,res) => {
    try {
        const userId = req.result._id;
        const problemId = req.params.pid;
        const ans  = await Submission.find({userId,problemId});
        if(ans.length==0){
            return res.status(200).send("No- Submissions");
        }
        return res.status(200).send(ans);
    } catch (error) {
        return res.status(500).send("Server error!!");
    }
}