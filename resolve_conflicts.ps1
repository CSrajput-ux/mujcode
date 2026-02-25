# resolve_conflicts.ps1
# Resolves all git merge conflicts in the backend directory by keeping the HEAD version
# Skips files larger than 500KB to avoid getting stuck on package-lock.json

param(
    [string]$Dir = "c:\Users\jkgga\OneDrive\Desktop\muj code\backend"
)

$conflictFiles = Get-ChildItem -Path $Dir -Recurse -File | Where-Object {
    $_.Length -lt 500KB
} | Where-Object {
    $first = Get-Content $_.FullName -First 3 -ErrorAction SilentlyContinue
    ($first -join "`n") -match '<<<<<<<'
}

Write-Host "Found $($conflictFiles.Count) files with merge conflicts (skipping files > 500KB)"

$resolved = 0
$failed = 0

foreach ($file in $conflictFiles) {
    try {
        $content = [System.IO.File]::ReadAllText($file.FullName)
        
        if (-not $content.Contains('<<<<<<< HEAD')) {
            Write-Host "  SKIP (no HEAD marker): $($file.Name)"
            continue
        }

        $lines = $content -split "`r?`n"
        $output = [System.Collections.Generic.List[string]]::new()
        $state = 'normal'  # normal | head | incoming

        foreach ($line in $lines) {
            if ($line -match '^<<<<<<< ') {
                $state = 'head'
                continue
            }
            if ($line -eq '=======' -and $state -eq 'head') {
                $state = 'incoming'
                continue
            }
            if ($line -match '^>>>>>>> ' -and $state -eq 'incoming') {
                $state = 'normal'
                continue
            }

            if ($state -eq 'incoming') {
                # Skip incoming changes
                continue
            }

            $output.Add($line)
        }

        $newContent = $output -join "`n"
        [System.IO.File]::WriteAllText($file.FullName, $newContent, [System.Text.UTF8Encoding]::new($false))
        Write-Host "  OK: $($file.Name)"
        $resolved++
    }
    catch {
        Write-Host "  FAIL: $($file.Name) - $_"
        $failed++
    }
}

Write-Host ""
Write-Host "==============================="
Write-Host "Resolved: $resolved files"
Write-Host "Failed:   $failed files"
Write-Host "==============================="

# Verify
$remaining = Get-ChildItem -Path $Dir -Recurse -File | Where-Object {
    $_.Length -lt 500KB
} | Where-Object {
    $c = Get-Content $_.FullName -Raw -ErrorAction SilentlyContinue
    $c -and $c.Contains('<<<<<<< HEAD')
}

if ($remaining.Count -eq 0) {
    Write-Host "ALL CONFLICT MARKERS REMOVED SUCCESSFULLY!"
}
else {
    Write-Host "$($remaining.Count) files still have conflict markers:"
    foreach ($f in $remaining) { Write-Host "  - $($f.Name)" }
}
