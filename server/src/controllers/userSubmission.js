import Problem from "../models/problem.js";
import Submission from "../models/submission.js";
import { getLanguageById, submitBatch, submitToken } from "../utils/ProblemUtility.js";


export const submitCode = async (req, res) => {
    try {
        const userId = req.result._id;
        const problemId = req.params.id;

        let { code, language } = req.body;

        if (!userId || !code || !language || !problemId) {
            return res.status(400).json({
                message: "Some fields are missing"
            });
        }

        const problem = await Problem.findById(problemId);

        if (!problem) {
            return res.status(404).json({
                message: "Problem not found"
            });
        }

        if (language === "cpp") {
            language = "c++";
        }

        const submittedResult = await Submission.create({
            userId,
            problemId,
            code,
            language,
            testCasePassed: 0,
            status: "pending",
            testcasesTotal: problem.hiddenTestCases.length
        });

        const languageId = getLanguageById(language);



        const submissions = problem.hiddenTestCases.map(testcase => ({
            source_code: code,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output
        }));


        const submitResult = await submitBatch(submissions);

        const tokens = submitResult.map( value => value.token);
        const TestResult = await submitToken(tokens);

        let testCasePassed = 0;
        let runtime = 0;
        let memory = 0;

        let status = "accepted";
        let errorMessage = null;

        for (const test of TestResult) {

            if (test.status_id === 3) {

                testCasePassed++;

                runtime += Number(test.time || 0);
                memory = Math.max( memory,  Number(test.memory || 0));
            } 
            else {

                status = "wrong";
                if (test.status_id === 6) {
                    status = "error";
                }
                errorMessage =
                    test.stderr ||
                    test.compile_output ||
                    "Execution failed";
            }
        }

        submittedResult.status = status;
        submittedResult.testCasePassed = testCasePassed;
        submittedResult.errorMessage = errorMessage;
        submittedResult.runtime = runtime;
        submittedResult.memory = memory;
        await submittedResult.save();

        if (
            status === "accepted" &&
            !req.result.problemSolved.includes(problemId)
        ) {

            req.result.problemSolved.push(problemId);

            await req.result.save();
        }

        return res.status(201).json({
            accepted: status === "accepted",
            totalTestCases: submittedResult.testcasesTotal,
            passedTestCases: testCasePassed,
            runtime,
            memory,
            error: errorMessage
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });

    }
};



export const runCode = async (req, res) => {

    try {

        const userId = req.result._id;
        const problemId = req.params.id;

        let { code, language } = req.body;

        if (!userId || !code || !problemId || !language) {
            return res.status(400).json({
                message:"Some fields missing"
            });
        }

        const problem = await Problem.findById(problemId);
        if(!problem){

            return res.status(404).json({
                message:"Problem not found"
            });

        }
        if(language === "cpp"){
            language="c++";
        }
        const languageId = getLanguageById(language);

        const submissions =
            problem.visibleTestCases.map(testcase => ({
                source_code: code,
                language_id: languageId,
                stdin: testcase.input,
                expected_output:testcase.output
            }));

        const submitResult =
            await submitBatch(submissions);

        const tokens = submitResult.map( value => value.token);

        const testResult = await submitToken(tokens);

        let passed = 0;
        let runtime = 0;
        let memory = 0;
        let success = true;
        let error = null;

        const formattedTestCases =
            testResult.map(test => {
                if(test.status_id === 3){
                    passed++;
                    runtime += Number(test.time || 0);
                    memory =
                    Math.max( memory,Number(test.memory || 0));
                }
                else{
                    success=false;
                    error =
                    test.stderr ||
                    test.compile_output ||
                    "Failed";
                }

                return {
                    stdin:test.stdin,
                    expected_output:
                    test.expected_output,
                    stdout:test.stdout,
                    status_id:test.status_id,
                    stderr:test.stderr,
                    compile_output:
                    test.compile_output
                };

            });

        return res.status(201).json({
            success,
            passedTestCases:passed,
            totalTestCases:
            formattedTestCases.length,
            testCases:
            formattedTestCases,
            runtime,
            memory,
            error
        });

    }
    catch(error){

        return res.status(500).json({
            message:error.message
        });

    }
};