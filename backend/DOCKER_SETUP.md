# Docker Setup for Code Execution

This document explains how to set up Docker for the code execution engine.

## Prerequisites

1. **Install Docker Desktop** (Windows/Mac) or Docker Engine (Linux)
   - Download from: https://www.docker.com/products/docker-desktop
   - Ensure Docker is running before starting the backend

2. **Pull Required Docker Images**

Run these commands to download the necessary Docker images:

```bash
# Python
docker pull python:3.11-alpine

# Java
docker pull openjdk:11-slim

# C/C++
docker pull gcc:latest

# Node.js (JavaScript)
docker pull node:18-alpine
```

## Verify Installation

Test that Docker is working:

```bash
docker --version
docker ps
```

## Test Individual Languages

### Python
```bash
docker run --rm python:3.11-alpine python --version
```

### Java
```bash
docker run --rm openjdk:11-slim java -version
```

### C/C++
```bash
docker run --rm gcc:latest gcc --version
```

### JavaScript
```bash
docker run --rm node:18-alpine node --version
```

## Security Features

The code executor implements the following security measures:

1. **Network Isolation**: `--network none` (no internet access)
2. **Memory Limits**: `--memory="256m"` (configurable)
3. **CPU Limits**: `--cpus="1.0"` (one CPU core max)
4. **Process Limits**: `--pids-limit 50` (max 50 processes)
5. **Timeout**: `timeout` command with configurable seconds
6. **Read-only Filesystem**: Code runs in isolated container
7. **Auto-cleanup**: Containers removed after execution (`--rm`)

## Troubleshooting

### Docker Not Found
- Ensure Docker Desktop is installed and running
- Restart your terminal/IDE
- Check system PATH includes Docker

### Permission Denied (Linux)
```bash
sudo usermod -aG docker $USER
# Logout and login again
```

### Images Too Large
- Use Alpine-based images (smaller)
- Clean up unused images: `docker image prune`

### Windows Path Issues
- Ensure paths use forward slashes in Docker commands
- The codeExecutor service handles path conversion

## Performance Tips

1. **Keep Docker Running**: First execution is slower (image pull)
2. **Pre-pull Images**: Run the pull commands above
3. **Increase Resources**: Docker Desktop > Settings > Resources
4. **Clean Up**: Regularly remove stopped containers

```bash
docker container prune
docker image prune
```

## API Endpoints

Once Docker is set up, these endpoints will be available:

- `POST /api/compile/run` - Execute single code snippet
- `POST /api/compile/submit/:questionId` - Submit code for a question
- `POST /api/compile/test` - Test code against custom test cases

## Example API Usage

### Run Code
```bash
curl -X POST http://localhost:5000/api/compile/run \
  -H "Content-Type: application/json" \
  -d '{
    "language": "python",
    "code": "print(\"Hello, World!\")",
    "input": "",
    "timeLimit": 5,
    "memoryLimit": 256
  }'
```

### Submit to Question
```bash
curl -X POST http://localhost:5000/api/compile/submit/QUESTION_ID \
  -H "Content-Type: application/json" \
  -d '{
    "language": "python",
    "code": "def solve():\n    print(42)"
  }'
```

## Notes

- First execution may take longer (Docker image pull)
- Compiled languages (Java, C, C++) have two-step process (compile + run)
- Temporary files are auto-deleted after execution
- All code runs in isolated Docker containers for security
