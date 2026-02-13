// Example Frontend Integration for Run & Submit Modes

// 📌 Scenario A: "Run" Button (Custom Input Test)
const handleRunCode = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/judge/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: currentUser.college_id,
                problemId: currentProblem._id,
                code: editorCode,
                language: selectedLanguage,
                mode: 'run',                    // <-- RUN MODE
                userInput: customInputBox       // <-- User ka custom input
            })
        });

        const data = await response.json();
        console.log('Run Result:', data);

        // Poll for result
        pollSubmissionStatus(data.submissionId);

    } catch (error) {
        console.error('Run error:', error);
    }
};

// 📌 Scenario B: "Submit" Button (All Test Cases)
const handleSubmitCode = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/judge/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: currentUser.college_id,
                problemId: currentProblem._id,
                code: editorCode,
                language: selectedLanguage,
                mode: 'submit'                  // <-- SUBMIT MODE
                // No userInput needed - uses all test cases
            })
        });

        const data = await response.json();
        console.log('Submit Result:', data);

        // Poll for result
        pollSubmissionStatus(data.submissionId);

    } catch (error) {
        console.error('Submit error:', error);
    }
};

// 📌 Poll for Result
const pollSubmissionStatus = async (submissionId) => {
    const interval = setInterval(async () => {
        const res = await fetch(`http://localhost:5000/api/judge/status/${submissionId}`);
        const data = await res.json();

        if (data.verdict !== 'Pending') {
            clearInterval(interval);
            console.log('Final Verdict:', data.verdict);
            console.log('Output:', data.output);

            // Update UI with result
            setVerdict(data.verdict);
            setOutput(data.output);
        }
    }, 1000); // Check every second
};
