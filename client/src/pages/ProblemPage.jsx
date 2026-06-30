import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Editor from '@monaco-editor/react';
import { useParams } from 'react-router';
import axiosClient from "../utils/axiosClient.js"
import SubmissionHistory from "../components/SubmissionHistory.jsx"
import LeftPanel from '../components/LeftPanel.jsx';
import RightPanel from '../components/RightPanel.jsx';
import toast from "react-hot-toast";
import Loader from '../components/Loader.jsx';


const langMap = {
        cpp: 'C++',
        java: 'Java',
        javascript: 'JavaScript'
};

const ProblemPage = () => {
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('java');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState('description');
  const [activeRightTab, setActiveRightTab] = useState('code');
  const editorRef = useRef(null);

  let {problemId}  = useParams();

  const { handleSubmit } = useForm();

// Fetch problem data
  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        
        const response = await axiosClient.get(`/problem/ProblemById/${problemId}`);
        
        const initialCode = response.data.startCode.find(sc => sc.language === langMap[selectedLanguage]).initialCode;

        setProblem(response.data);    
        setCode(initialCode);
        setLoading(false);
        
      } catch (error) {
        console.error('Error fetching problem:', error);
        setLoading(false);
      }
    };

    fetchProblem();
  }, [problemId]);

  // Update code when language changes
  useEffect(() => {
    if (problem) {
      const initialCode = problem.startCode.find(sc => sc.language === langMap[selectedLanguage]).initialCode;
      setCode(initialCode);
    }
  }, [selectedLanguage, problem]);

  const handleEditorChange = (value) => {
    setCode(value || '');
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  const handleRun = async () => {
    setLoading(true);
    setRunResult(null);
    
    try {
      const response = await axiosClient.post(`/submission/run/${problemId}`, {
        code,
        language: selectedLanguage
      });

      setRunResult(response.data);
      setLoading(false);
      setActiveRightTab('testcase');
      
    } catch (error) {
      toast.error('Error running code:', error);
      setRunResult({
        success: false,
        error: 'Internal server error'
      });
      setLoading(false);
      setActiveRightTab('testcase');
    }
  };

  const handleSubmitCode = async () => {
    setLoading(true);
    setSubmitResult(null);
    
    try {
        const response = await axiosClient.post(`/submission/submit/${problemId}`, {code:code, language: selectedLanguage});

       setSubmitResult(response.data);
       setLoading(false);
       setActiveRightTab('result');
      
    } catch (error) {
      toast.error('Error submitting code:', error);
      setSubmitResult(null);
      setLoading(false);
      setActiveRightTab('result');
    }
  };

  const getLanguageForMonaco = (lang) => {
    switch (lang) {
      case 'javascript': return 'javascript';
      case 'java': return 'java';
      case 'cpp': return 'cpp';
      default: return 'javascript';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'hard': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  if (loading && !problem) {
    return <Loader />;
  }

  return (
    <div className="h-screen flex bg-base-100">
      {/* Left Panel */}

        <LeftPanel problem={problem} activeLeftTab={activeLeftTab} 
            setActiveLeftTab={setActiveLeftTab} getDifficultyColor={getDifficultyColor}
            problemId={problemId}
        />

      {/* Right Panel */}
      <RightPanel  activeRightTab={activeRightTab}  setActiveRightTab={setActiveRightTab}  selectedLanguage={selectedLanguage}
            handleLanguageChange={handleLanguageChange} getLanguageForMonaco={getLanguageForMonaco} code={code} handleEditorChange={handleEditorChange} 
            handleEditorDidMount={handleEditorDidMount} loading={loading} handleRun={handleRun} handleSubmitCode={handleSubmitCode} runResult={runResult} submitResult={submitResult} 
       />
    </div>
  );
};

export default ProblemPage;