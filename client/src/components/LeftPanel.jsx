import SubmissionHistory from "./SubmissionHistory.jsx";

const LeftPanel = ({
  problem,
  activeLeftTab,
  setActiveLeftTab,
  getDifficultyColor,
  problemId,
}) => {
  return (
    <div className="w-1/2 flex flex-col border-r border-base-300">
      {/* Left Tabs */}
      <div className="tabs tabs-bordered bg-base-200 px-4">
        <button
          className={`tab ${activeLeftTab === "description" ? "tab-active" : ""}`}
          onClick={() => setActiveLeftTab("description")}
        >
          Description
        </button>

        <button
          className={`tab ${activeLeftTab === "editorial" ? "tab-active" : ""}`}
          onClick={() => setActiveLeftTab("editorial")}
        >
          Editorial
        </button>

        <button
          className={`tab ${activeLeftTab === "solutions" ? "tab-active" : ""}`}
          onClick={() => setActiveLeftTab("solutions")}
        >
          Solutions
        </button>

        <button
          className={`tab ${activeLeftTab === "submissions" ? "tab-active" : ""}`}
          onClick={() => setActiveLeftTab("submissions")}
        >
          Submissions
        </button>
      </div>

      {/* Left Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {problem && (
          <>
            {activeLeftTab === "description" && (
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <h1 className="text-2xl font-bold">{problem?.title}</h1>

                  <div
                    className={`badge badge-outline ${getDifficultyColor(
                      problem.difficulty
                    )}`}
                  >
                    {problem.difficulty.charAt(0).toUpperCase() +
                      problem.difficulty.slice(1)}
                  </div>

                  <div className="badge badge-primary">{problem.tags}</div>
                </div>

                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {problem.description}
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Examples:</h3>

                  <div className="space-y-4">
                    {problem.visibleTestCases?.map((example, index) => (
                      <div
                        key={index}
                        className="bg-base-200 p-4 rounded-lg"
                      >
                        <h4 className="font-semibold mb-2">
                          Example {index + 1}
                        </h4>

                        <div className="space-y-2 text-sm font-mono">
                          <div>
                            <strong>Input:</strong> {example.input}
                          </div>

                          <div>
                            <strong>Output:</strong> {example.output}
                          </div>

                          <div>
                            <strong>Explanation:</strong>{" "}
                            {example.explanation}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeLeftTab === "editorial" && (
              <div className="prose max-w-none">
                <h2 className="text-xl font-bold mb-4">Editorial</h2>

                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  Editorial is here for the problem
                </div>
              </div>
            )}

            {activeLeftTab === "solutions" && (
              <div>
                <h2 className="text-xl font-bold mb-4">Solutions</h2>

                <div className="space-y-6">
                  {problem.referenceSolution?.map((solution, index) => (
                    <div
                      key={index}
                      className="border border-base-300 rounded-lg"
                    >
                      <div className="bg-base-200 px-4 py-2 rounded-t-lg">
                        <h3 className="font-semibold">
                          {problem.title} - {solution.language}
                        </h3>
                      </div>

                      <div className="p-4">
                        <pre className="bg-base-300 p-4 rounded text-sm overflow-x-auto">
                          <code>{solution.completeCode}</code>
                        </pre>
                      </div>
                    </div>
                  )) || (
                    <p className="text-gray-500">
                      Solutions will be available after you solve the problem.
                    </p>
                  )}
                </div>
              </div>
            )}

            {activeLeftTab === "submissions" && (
              <div>
                <h2 className="text-xl font-bold mb-4">My Submissions</h2>

                <SubmissionHistory problemId={problemId} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LeftPanel;