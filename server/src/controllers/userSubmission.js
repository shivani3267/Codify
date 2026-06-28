import Problem from "../models/problem.js";
import Submission from "../models/submission.js"
import User from "../models/user.js";
import { getLanguageById, submitBatch } from "../utils/ProblemUtility.js";


export const submitCode = async (req,res) => {
    try {
        //req.result have user info kepth in middleware
        const userId = req.result._id;
        const problemId = req.params.id;
        
        const {code, language } = req.body;

        if(!userId || !code  || !language || !problemId){
            return req.status(400).send("Some fields are missing")
        }
        //fetch problem
        const problem = await Problem.findById(problemId);
        //save to db-> update aafter judging
        const submittedResult = await Submission.create({
            userId,
            problemId,
            code,
            language,
            testCasePassed:0,
            status:'pending',
            testcasesTotal:problem.hiddenTestCases.length,
        });

        //judge0 ko submit karna
        const languageId = getLanguageById(language);

        const submissions = problem.hiddenTestCases.map((testcase)=> ({
                source_code:code,
                language_id:languageId,
                stdin:testcase.input,
                expected_output:testcase.output
        } ));

        const submitResult = await submitBatch(submissions)
        const resultToken = submittedResult.map((value) => value.token)//arr of token
        const TestResult = await submitToken(resultToken);
        
        //submitResult ko update kro
        let testCasePassed=0;
        let runtime=0, memory=0;
        let status = 'accepted';
        let errorMessage= null;
        for(const test of TestResult){
            if(test.status_id == 3){
                testCasePassed++;
            }
            else{
                if(test.status_id==4){
                    status ='error';
                    errorMessage= test.stderr;
                }
                else{
                    status = 'wrong'
                    errorMessage= test.stderr;
                }
            }
        }
        //store in db after updating
        submittedResult.status=status;
        submittedResult.testCasePassed=testCasePassed;
        submittedResult.errorMessage=errorMessage;
        submittedResult.runtime = runtime;
        submittedResult.memory = memory;

        await submittedResult.save();

        //if submited put in user solved problem if not solve eralier
        if(status==='accepted' && !req.result.problemSolved.includes(problemId) ){
            req.result.problemSolved.push(problemId);
            await req.result.save();
        }


        return res.status(200).send(submittedResult);

    } catch (error) {
        return res.status(500).send("ERR!!" + error.message)
    }
}

export const runCode = async (req,res) => {
    try {
        //req.result have user info kepth in middleware
        const userId = req.result._id;
        const problemId = req.params.id;
        
        const {code, language } = req.body;

        if(!userId || !code  || !language || !problemId){
            return req.status(400).send("Some fields are missing")
        }
        //fetch problem
        const problem = await Problem.findById(problemId);

        //judge0 ko submit karna
        const languageId = getLanguageById(language);

        const submissions = problem.visibleTestCases.map((testcase)=> ({
                source_code:code,
                language_id:languageId,
                stdin:testcase.input,
                expected_output:testcase.output
        } ));

        const submitResult = await submitBatch(submissions)
        const resultToken = submittedResult.map((value) => value.token)//arr of token
        const TestResult = await submitToken(resultToken);
        
        return res.status(200).send(TestResult);

    } catch (error) {
        return res.status(500).send("ERR!!" + error.message)
    }
}