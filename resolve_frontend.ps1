# Fast conflict resolver - only processes src/ directory, skips node_modules
param(
    [string]$Dir = "c:\Users\jkgga\OneDrive\Desktop\muj code\frontend\src"
)

$conflictFiles = Get-ChildItem -Path $Dir -Recurse -File -Include *.ts, *.tsx, *.js, *.jsx, *.json, *.css | Where-Object {
    $first = Get-Content $_.FullName -First 3 -ErrorAction SilentlyContinue
    ($first -join "`n") -match '<<<<<<<'
}

Write-Host "Found $($conflictFiles.Count) conflicted files in src/"

$resolved = 0
foreach ($file in $conflictFiles) {
    try {
        $content = [System.IO.File]::ReadAllText($file.FullName)
        $lines = $content -split "`r?`n"
        $output = [System.Collections.Generic.List[string]]::new()
        $state = 'normal'

        foreach ($line in $lines) {
            if ($line -match '^<<<<<<< ') { $state = 'head'; continue }
            if ($line -eq '=======' -and $state -eq 'head') { $state = 'incoming'; continue }
            if ($line -match '^>>>>>>> ' -and $state -eq 'incoming') { $state = 'normal'; continue }
            if ($state -eq 'incoming') { continue }
            $output.Add($line)
        }

        $newContent = $output -join "`n"
        [System.IO.File]::WriteAllText($file.FullName, $newContent, [System.Text.UTF8Encoding]::new($false))
        Write-Host "  OK: $($file.FullName.Replace($Dir, ''))"
        $resolved++
    }
    catch {
        Write-Host "  FAIL: $($file.Name) - $_"
    }
}

Write-Host "`nResolved: $resolved files"

# Also resolve config files at root level
$rootDir = "c:\Users\jkgga\OneDrive\Desktop\muj code\frontend"
$rootFiles = Get-ChildItem -Path $rootDir -File -Include *.ts, *.js, *.json, *.css | Where-Object {
    $first = Get-Content $_.FullName -First 3 -ErrorAction SilentlyContinue
    ($first -join "`n") -match '<<<<<<<'
}

foreach ($file in $rootFiles) {
    try {
        $content = [System.IO.File]::ReadAllText($file.FullName)
        $lines = $content -split "`r?`n"
        $output = [System.Collections.Generic.List[string]]::new()
        $state = 'normal'

        foreach ($line in $lines) {
            if ($line -match '^<<<<<<< ') { $state = 'head'; continue }
            if ($line -eq '=======' -and $state -eq 'head') { $state = 'incoming'; continue }
            if ($line -match '^>>>>>>> ' -and $state -eq 'incoming') { $state = 'normal'; continue }
            if ($state -eq 'incoming') { continue }
            $output.Add($line)
        }

        $newContent = $output -join "`n"
        [System.IO.File]::WriteAllText($file.FullName, $newContent, [System.Text.UTF8Encoding]::new($false))
        Write-Host "  OK (root): $($file.Name)"
        $resolved++
    }
    catch {
        Write-Host "  FAIL (root): $($file.Name) - $_"
    }
}

Write-Host "`nTotal resolved: $resolved files"
