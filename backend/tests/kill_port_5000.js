const { exec } = require('child_process');

const port = 5000;

const command = process.platform === 'win32'
    ? `netstat -ano | findstr :${port}`
    : `lsof -i tcp:${port} | grep LISTEN | awk '{print $2}'`;

exec(command, (err, stdout) => {
    if (stdout) {
        const lines = stdout.trim().split('\n');
        const pids = lines.map(line => {
            const parts = line.trim().split(/\s+/);
            return parts[parts.length - 1];
        }).filter(pid => pid && pid !== '0' && pid !== 'LISTENING');

        const uniquePids = [...new Set(pids)];
        console.log(`PIDs found on port ${port}:`, uniquePids);

        uniquePids.forEach(pid => {
            console.log(`Killing PID ${pid}`);
            exec(`taskkill /F /PID ${pid}`, (kErr) => {
                if (kErr) console.error(`Error killing ${pid}:`, kErr.message);
                else console.log(`Killed ${pid}`);
            });
        });
    } else {
        console.log(`Nothing found on port ${port}`);
    }
});
