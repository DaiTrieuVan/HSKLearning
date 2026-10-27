[CmdletBinding()]
param(
    [string]$AgyCommand = "agy",
    [ValidateRange(0, 2)][int]$MaxRetries = 2,
    [string]$ReportPath = "night_execution_report.log",
    [string]$StartStory = "HTT-10-CN-001",
    [switch]$AllowDirty
)

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"
$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$finalReportFile = Join-Path $repoRoot $ReportPath
$reportFile = Join-Path ([System.IO.Path]::GetTempPath()) ("hsk-night-{0}.log" -f ([guid]::NewGuid().ToString("N")))
$stories = @(
    [pscustomobject]@{ Id="HTT-10-CN-001"; Plan="docs/night_plans/PLAN_HTT-10-CN-001.md"; Test="ListeningPracticeH2Test" },
    [pscustomobject]@{ Id="HTT-10-CN-002"; Plan="docs/night_plans/PLAN_HTT-10-CN-002.md"; Test="HanziWritingH2Test" },
    [pscustomobject]@{ Id="HTT-10-CN-003"; Plan="docs/night_plans/PLAN_HTT-10-CN-003.md"; Test="PronunciationAssessmentH2Test" },
    [pscustomobject]@{ Id="HTT-10-CN-004"; Plan="docs/night_plans/PLAN_HTT-10-CN-004.md"; Test="AiLearningAssistantH2Test" }
)

function Write-NightLog {
    param([string]$Message, [ValidateSet("INFO","PASS","WARN","FAIL")][string]$Level="INFO")
    $line = "{0} [{1}] {2}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Level, $Message
    Write-Host $line
    Add-Content -LiteralPath $reportFile -Value $line -Encoding utf8
}

function Invoke-LoggedNative {
    param([string]$Label, [string]$WorkingDirectory, [string]$FilePath, [string[]]$Arguments)
    Write-NightLog "START $Label"
    Push-Location $WorkingDirectory
    $savedErrorPreference = $ErrorActionPreference
    try {
        $ErrorActionPreference = "Continue"
        & $FilePath @Arguments 2>&1 | ForEach-Object {
            Write-Host $_
            Add-Content -LiteralPath $reportFile -Value $_.ToString() -Encoding utf8
        }
        $code = $LASTEXITCODE
    } catch {
        Add-Content -LiteralPath $reportFile -Value $_.Exception.ToString() -Encoding utf8
        $code = 1
    } finally {
        $ErrorActionPreference = $savedErrorPreference
        Pop-Location
    }
    $level = if ($code -eq 0) { "PASS" } else { "FAIL" }
    Write-NightLog "END $Label (exit=$code)" $level
    return $code
}

function Invoke-AgyAttempt {
    param([pscustomobject]$Story, [int]$Attempt)
    if (-not (Test-Path -LiteralPath (Join-Path $repoRoot $Story.Plan))) {
        Write-NightLog "Plan not found: $($Story.Plan)" "FAIL"
        return 2
    }
    $prompt = @"
You are the implementation agent for HSK Master. Work only on story $($Story.Id).
Read hsk_agent_automation/docs/user-stories/$($Story.Id).md, $($Story.Plan), applicable AGENTS.md, and existing code completely.
Implement the full plan. Do not change requirements, generated story Markdown, commit/push, or use real secrets.
Preserve the Spring Boot/React architecture. Migrations must follow the highest existing version. Audit existing implementation and change only gaps.
Run targeted tests, backend tests, lint only frontend files changed by this story, frontend build, and git diff --check. Full-repository lint has known legacy debt and is informational. End with changed files, tests, and remaining risks. Attempt $Attempt.
"@
    return Invoke-LoggedNative "agy $($Story.Id) attempt $Attempt" $repoRoot $AgyCommand @(
        "--print", $prompt, "--mode", "accept-edits", "--dangerously-skip-permissions",
        "--print-timeout", "0", "--output-format", "text"
    )
}

function Invoke-AcceptanceGates {
    param([pscustomobject]$Story)
    $steps = @(
        @{ L="targeted backend"; D=(Join-Path $repoRoot "backend"); F=".\mvnw.cmd"; A=@("-B","-Dtest=$($Story.Test)","test") },
        @{ L="backend regression"; D=(Join-Path $repoRoot "backend"); F=".\mvnw.cmd"; A=@("-B","test") },
        @{ L="frontend build"; D=(Join-Path $repoRoot "frontend"); F="npm.cmd"; A=@("run","build") },
        @{ L="whitespace check"; D=$repoRoot; F="git.exe"; A=@("diff","--check") }
    )
    foreach ($step in $steps) {
        if ((Invoke-LoggedNative "$($Story.Id) $($step.L)" $step.D $step.F $step.A) -ne 0) { return $false }
    }
    $changedFrontend = @(git -C $repoRoot diff --name-only HEAD -- "frontend/src/**/*.ts" "frontend/src/**/*.tsx")
    if ($changedFrontend.Count -gt 0) {
        $relativeFrontend = @($changedFrontend | ForEach-Object { $_ -replace '^frontend/', '' })
        if ((Invoke-LoggedNative "$($Story.Id) changed frontend lint" (Join-Path $repoRoot "frontend") "npx.cmd" (@("oxlint") + $relativeFrontend)) -ne 0) {
            return $false
        }
    } else {
        Write-NightLog "$($Story.Id) has no changed frontend source files; scoped lint skipped."
    }
    $package = Get-Content -Raw -LiteralPath (Join-Path $repoRoot "frontend\package.json") | ConvertFrom-Json
    if ($null -ne $package.scripts.test) {
        if ((Invoke-LoggedNative "$($Story.Id) frontend tests" (Join-Path $repoRoot "frontend") "npm.cmd" @("test","--","--run")) -ne 0) {
            return $false
        }
    }
    return $true
}

Set-Location $repoRoot
Set-Content -LiteralPath $reportFile -Value "HSK Master overnight report`nStarted: $(Get-Date -Format o)`nRepository: $repoRoot" -Encoding utf8

try {
    if (-not (Get-Command $AgyCommand -ErrorAction SilentlyContinue)) { throw "agy CLI not found: $AgyCommand" }
    $dirty = @(git status --porcelain=v1 | Where-Object { $_ -notmatch [regex]::Escape($ReportPath) })
    if ($LASTEXITCODE -ne 0) { throw "Cannot read Git status." }
    if ($dirty.Count -gt 0 -and -not $AllowDirty) { throw "Worktree must be clean. Commit/stash plans and script first, or use -AllowDirty for an intentional resume. Dirty: $($dirty -join '; ')" }

    $startIndex = -1
    for ($index = 0; $index -lt $stories.Count; $index++) {
        if ($stories[$index].Id -eq $StartStory) { $startIndex = $index; break }
    }
    if ($startIndex -lt 0) { throw "Unknown StartStory: $StartStory" }
    $stories = @($stories[$startIndex..($stories.Count - 1)])

    $summary = [System.Collections.Generic.List[object]]::new()
    foreach ($story in $stories) {
        Write-NightLog "===== START $($story.Id) ====="
        $passed = $false
        $attemptUsed = 0
        for ($attempt=1; $attempt -le (1 + $MaxRetries); $attempt++) {
            $attemptUsed = $attempt
            if ((Invoke-AgyAttempt $story $attempt) -eq 0) { $passed = Invoke-AcceptanceGates $story }
            if ($passed) { break }
            Write-NightLog "$($story.Id) failed attempt $attempt; retrying when allowed." "WARN"
        }

        if ($passed) {
            & git add --all
            if ($LASTEXITCODE -ne 0) { throw "git add failed for $($story.Id)" }
            & git reset --quiet HEAD -- $ReportPath
            $staged = @(git diff --cached --name-only)
            if ($staged.Count -eq 0) {
                Write-NightLog "$($story.Id) passed with no new changes to commit." "PASS"
            } else {
                $commitTemplate = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String("ZmVhdChTVE9SWSk6IEhvw6BuIHRow6BuaCB0cmnhu4NuIGtoYWkgc3RvcnkgU1RPUlk="))
                $commitMessage = $commitTemplate.Replace("STORY", $story.Id)
                if ((Invoke-LoggedNative "$($story.Id) git commit" $repoRoot "git.exe" @("commit","-m",$commitMessage)) -ne 0) {
                    throw "git commit failed for $($story.Id)"
                }
                Write-NightLog "$($story.Id) tests passed and commit succeeded." "PASS"
            }
            $summary.Add([pscustomobject]@{ Story=$story.Id; Result="PASS"; Attempts=$attemptUsed })
        } else {
            $failedChanges = @(git status --porcelain=v1 | Where-Object { $_ -notmatch [regex]::Escape($ReportPath) })
            if ($failedChanges.Count -gt 0) {
                $stash = "night-failed-$($story.Id)-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
                if ((Invoke-LoggedNative "$($story.Id) git stash" $repoRoot "git.exe" @("stash","push","--include-untracked","--message",$stash,"--",":(exclude)$ReportPath")) -ne 0) {
                    throw "Failed to stash $($story.Id); stopping to avoid mixed story changes."
                }
                Write-NightLog "$($story.Id) failed; recoverable changes saved in stash '$stash'." "FAIL"
            } else { Write-NightLog "$($story.Id) failed without changes." "FAIL" }
            $summary.Add([pscustomobject]@{ Story=$story.Id; Result="FAIL"; Attempts=$attemptUsed })
        }
        Write-NightLog "===== END $($story.Id) ====="
    }

    Write-NightLog "===== SUMMARY ====="
    foreach ($item in $summary) {
        $level = if ($item.Result -eq "PASS") { "PASS" } else { "FAIL" }
        Write-NightLog "$($item.Story): $($item.Result), attempts=$($item.Attempts)" $level
    }
    Copy-Item -LiteralPath $reportFile -Destination $finalReportFile -Force
    if (@($summary | Where-Object Result -eq "FAIL").Count -gt 0) { exit 1 }
    exit 0
} catch {
    Write-NightLog $_.Exception.Message "FAIL"
    Copy-Item -LiteralPath $reportFile -Destination $finalReportFile -Force
    exit 1
}
