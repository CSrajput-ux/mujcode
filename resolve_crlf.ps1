# Fixed CRLF-aware conflict resolver
param(
    [string]$Dir = "c:\Users\jkgga\OneDrive\Desktop\muj code\frontend\src"
)

$conflictFiles = Get-ChildItem -Path $Dir -Recurse -File -Include *.ts, *.tsx, *.js, *.jsx, *.json, *.css | Where-Object {
    $c = [System.IO.File]::ReadAllText($_.FullName)
    $c.Contains('<<<<<<< HEAD') -or $c.Contains('<<<<<<< ')
}

Write-Host "Found $($conflictFiles.Count) remaining conflicted files"

$resolved = 0
foreach ($file in $conflictFiles) {
    try {
        $content = [System.IO.File]::ReadAllText($file.FullName)
        # Normalize line endings first
        $content = $content.Replace("`r`n", "`n")
        $lines = $content -split "`n"
        $output = [System.Collections.Generic.List[string]]::new()
        $state = 'normal'

        foreach ($line in $lines) {
            $trimmed = $line.TrimEnd()
            if ($trimmed -match '^<<<<<<< ') { $state = 'head'; continue }
            if (($trimmed -eq '=======') -and $state -eq 'head') { $state = 'incoming'; continue }
            if ($trimmed -match '^>>>>>>> ' -and $state -eq 'incoming') { $state = 'normal'; continue }
            if ($state -eq 'incoming') { continue }
            $output.Add($line)
        }

        $newContent = $output -join "`n"
        [System.IO.File]::WriteAllText($file.FullName, $newContent, [System.Text.UTF8Encoding]::new($false))
        Write-Host "  OK: $($file.Name)"
        $resolved++
    }
    catch {
        Write-Host "  FAIL: $($file.Name) - $_"
    }
}

Write-Host "Resolved: $resolved files"

# Verify
$rem = Get-ChildItem -Path $Dir -Recurse -File -Include *.ts, *.tsx, *.js, *.jsx, *.json, *.css | Where-Object {
    $c = [System.IO.File]::ReadAllText($_.FullName)
    $c.Contains('<<<<<<< ')
}
if ($rem.Count -eq 0) { Write-Host "ALL CLEAN!" } else {
    Write-Host "$($rem.Count) still have markers:"
    $rem | ForEach-Object { Write-Host "  - $($_.Name)" }
}
