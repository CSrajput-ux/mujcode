const STDIN_CODE = `
import sys

def solve():
    try:
        input_data = sys.stdin.read().split()
        if not input_data:
            return

        # Last element is target, rest are array?
        # No, format is: 
        # Line 1: nums
        # Line 2: target
        # So split() flattens it.
        # Let's rely on readlines() which is standard for file redirection
        pass
    except:
        pass

if __name__ == "__main__":
    # Robust parsing
    import sys
    lines = sys.stdin.readlines()
    if len(lines) >= 2:
        nums = list(map(int, lines[0].strip().split()))
        target = int(lines[1].strip())
        
        seen = {}
        for i, num in enumerate(nums):
            diff = target - num
            if diff in seen:
                print(f"{seen[diff]} {i}")
                break
            seen[num] = i
`;

async function run() {
    const API_URL = 'http://localhost:5000/api';

    try {
        console.log("🔐 Logging in...");
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'chhotu.2427030521@muj.manipal.edu',
                password: 'chhotu.2427030521'
            })
        });

        if (!loginRes.ok) {
            throw new Error(`Login Failed: ${await loginRes.text()}`);
        }

        const loginData = await loginRes.json();
        const token = loginData.token;
        const userId = loginData.user.id;
        console.log("✅ Logged in as", loginData.user.name);

        console.log("🚀 Submitting Code...");
        const submitRes = await fetch(`${API_URL}/judge/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                userId: userId,
                problemId: 1,
                code: STDIN_CODE,
                language: 'python',
                mode: 'submit'
            })
        });

        if (!submitRes.ok) {
            throw new Error(`Submit Failed: ${await submitRes.text()}`);
        }

        const submitData = await submitRes.json();
        const submissionId = submitData.submissionId;
        console.log("✅ Submission Queued. ID:", submissionId);

        // Polling
        console.log("⏳ Polling for result...");
        let attempts = 0;
        const interval = setInterval(async () => {
            attempts++;
            const statusRes = await fetch(`${API_URL}/judge/status/${submissionId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const statusData = await statusRes.json();

            console.log(`[Attempt ${attempts}] Status: ${statusData.verdict}`);

            if (statusData.verdict !== 'Pending') {
                clearInterval(interval);
                console.log("\n🎉 Final Verdict:", statusData.verdict);
                console.log("Output:", statusData.output);

                if (statusData.verdict === 'Accepted') {
                    console.log("✅ TEST PASSED");
                } else {
                    console.log("❌ TEST FAILED");
                    console.log("Debug it!");
                }
            }

            if (attempts > 20) {
                clearInterval(interval);
                console.log("❌ Polling Timeout");
            }
        }, 1000);

    } catch (err) {
        console.error("❌ Error:", err);
    }
}

run();
