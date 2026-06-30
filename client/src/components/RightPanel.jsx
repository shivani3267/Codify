import Editor from "@monaco-editor/react";

const RightPanel = ({
  activeRightTab,
  setActiveRightTab,
  selectedLanguage,
  handleLanguageChange,
  getLanguageForMonaco,
  code,
  handleEditorChange,
  handleEditorDidMount,
  loading,
  handleRun,
  handleSubmitCode,
  runResult,
  submitResult,
}) => {
  return (
    <div className="w-1/2 flex flex-col">

      {/* Right Tabs */}
      <div className="tabs tabs-bordered bg-base-200 px-4">
        <button
          className={`tab ${activeRightTab === "code" ? "tab-active" : ""}`}
          onClick={() => setActiveRightTab("code")}
        >
          Code
        </button>

        <button
          className={`tab ${activeRightTab === "testcase" ? "tab-active" : ""}`}
          onClick={() => setActiveRightTab("testcase")}
        >
          Testcase
        </button>

        <button
          className={`tab ${activeRightTab === "result" ? "tab-active" : ""}`}
          onClick={() => setActiveRightTab("result")}
        >
          Result
        </button>
      </div>

      <div className="flex-1 flex flex-col">

        {/* ================= CODE ================= */}

        {activeRightTab === "code" && (
          <div className="flex-1 flex flex-col">

            {/* Language Selector */}

            <div className="flex justify-between items-center p-4 border-b border-base-300">
              <div className="flex gap-2">
                {["javascript", "java", "cpp"].map((lang) => (
                  <button
                    key={lang}
                    className={`btn btn-sm ${
                      selectedLanguage === lang
                        ? "btn-primary"
                        : "btn-ghost"
                    }`}
                    onClick={() => handleLanguageChange(lang)}
                  >
                    {lang === "cpp"
                      ? "C++"
                      : lang === "javascript"
                      ? "JavaScript"
                      : "Java"}
                  </button>
                ))}
              </div>
            </div>

            {/* Monaco */}

            <div className="flex-1">
              <Editor
                height="100%"
                language={getLanguageForMonaco(selectedLanguage)}
                value={code}
                onChange={handleEditorChange}
                onMount={handleEditorDidMount}
                theme="vs-dark"
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  insertSpaces: true,
                  wordWrap: "on",
                  lineNumbers: "on",
                  glyphMargin: false,
                  folding: true,
                  lineDecorationsWidth: 10,
                  lineNumbersMinChars: 3,
                  renderLineHighlight: "line",
                  selectOnLineNumbers: true,
                  roundedSelection: false,
                  readOnly: false,
                  cursorStyle: "line",
                  mouseWheelZoom: true,
                }}
              />
            </div>

            {/* Buttons */}

            <div className="p-4 border-t border-base-300 flex justify-between">

              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setActiveRightTab("testcase")}
              >
                Console
              </button>

              <div className="flex gap-2">
                <button
                  className={`btn btn-outline btn-sm ${
                    loading ? "loading" : ""
                  }`}
                  onClick={handleRun}
                  disabled={loading}
                >
                  Run
                </button>

                <button
                  className={`btn btn-primary btn-sm ${
                    loading ? "loading" : ""
                  }`}
                  onClick={handleSubmitCode}
                  disabled={loading}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TESTCASE  */}

        {activeRightTab === "testcase" && (
          <div className="flex-1 p-4 overflow-y-auto">

            <h3 className="font-semibold mb-4">
              Test Results
            </h3>

            {runResult ? (
              <div
                className={`alert ${
                  runResult.success
                    ? "alert-success"
                    : "alert-error"
                } mb-4`}
              >
                <div>

                  {runResult.success ? (
                    <div>

                      <h4 className="font-bold">
                        ✅ All test cases passed!
                      </h4>

                      <p className="text-sm mt-2">
                        Runtime: {runResult.runtime} sec
                      </p>

                      <p className="text-sm">
                        Memory: {runResult.memory} KB
                      </p>

                      <div className="mt-4 space-y-2">

                        {runResult.testCases.map((tc, i) => (
                          <div
                            key={i}
                            className="bg-base-100 p-3 rounded text-xs"
                          >
                            <div className="font-mono">

                              <div>
                                <strong>Input:</strong> {tc.stdin}
                              </div>

                              <div>
                                <strong>Expected:</strong>{" "}
                                {tc.expected_output}
                              </div>

                              <div>
                                <strong>Output:</strong> {tc.stdout}
                              </div>

                              <div className="text-green-600">
                                ✓ Passed
                              </div>

                            </div>
                          </div>
                        ))}

                      </div>

                    </div>
                  ) : (
                    <div>

                      <h4 className="font-bold">
                        ❌ Error
                      </h4>

                      <div className="mt-4 space-y-2">

                        {runResult.testCases.map((tc, i) => (
                          <div
                            key={i}
                            className="bg-base-100 p-3 rounded text-xs"
                          >
                            <div className="font-mono">

                              <div>
                                <strong>Input:</strong> {tc.stdin}
                              </div>

                              <div>
                                <strong>Expected:</strong>{" "}
                                {tc.expected_output}
                              </div>

                              <div>
                                <strong>Output:</strong> {tc.stdout}
                              </div>

                              <div
                                className={
                                  tc.status_id == 3
                                    ? "text-green-600"
                                    : "text-red-600"
                                }
                              >
                                {tc.status_id == 3
                                  ? "✓ Passed"
                                  : "✗ Failed"}
                              </div>

                            </div>
                          </div>
                        ))}

                      </div>

                    </div>
                  )}

                </div>
              </div>
            ) : (
              <div className="text-gray-500">
                Click "Run" to test your code with the example test cases.
              </div>
            )}
          </div>
        )}

        {/* ================= RESULT ================= */}

        {activeRightTab === "result" && (
          <div className="flex-1 p-4 overflow-y-auto">

            <h3 className="font-semibold mb-4">
              Submission Result
            </h3>

            {submitResult ? (
              <div
                className={`alert ${
                  submitResult.accepted
                    ? "alert-success"
                    : "alert-error"
                }`}
              >
                <div>

                  {submitResult.accepted ? (
                    <div>

                      <h4 className="font-bold text-lg">
                        🎉 Accepted
                      </h4>

                      <div className="mt-4 space-y-2">
                        <p>
                          Test Cases Passed:
                          {" "}
                          {submitResult.passedTestCases}/
                          {submitResult.totalTestCases}
                        </p>

                        <p>
                          Runtime: {submitResult.runtime} sec
                        </p>

                        <p>
                          Memory: {submitResult.memory} KB
                        </p>
                      </div>

                    </div>
                  ) : (
                    <div>

                      <h4 className="font-bold text-lg">
                        ❌ {submitResult.error}
                      </h4>

                      <div className="mt-4 space-y-2">
                        <p>
                          Test Cases Passed:
                          {" "}
                          {submitResult.passedTestCases}/
                          {submitResult.totalTestCases}
                        </p>
                      </div>

                    </div>
                  )}

                </div>
              </div>
            ) : (
              <div className="text-gray-500">
                Click "Submit" to submit your solution for evaluation.
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

export default RightPanel;