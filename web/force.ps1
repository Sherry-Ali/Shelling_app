$job = Start-Job -ScriptBlock { Set-Location "c:\Users\alial\AntigravityProjects\ShellingApp\web"; npm run dev }
$timeout = 40
$watch = [System.Diagnostics.Stopwatch]::StartNew()
$serverReady = $false

Write-Output "Waiting for Next.js server to start..."

while ($watch.Elapsed.TotalSeconds -lt $timeout) {
    try {
        $test = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -ErrorAction Stop
        $serverReady = $true
        break
    } catch {
        Start-Sleep -Seconds 2
    }
}

if ($serverReady) {
    Write-Output "Server is ready, triggering cron endpoint..."
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/cron/update-conditions" -UseBasicParsing
    Write-Output "API Response:"
    Write-Output $response.Content
} else {
    Write-Output "Server failed to start in time. Logs:"
    Receive-Job -Job $job
}

Stop-Job -Job $job | Out-Null
Remove-Job -Job $job | Out-Null
