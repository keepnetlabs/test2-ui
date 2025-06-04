# SonarQube Scanner Script
$sonarScannerPath = "C:\Users\user\Downloads\sonar-scanner-cli-7.0.2.4839-windows-x64\sonar-scanner-7.0.2.4839-windows-x64\bin\sonar-scanner.bat"

# SonarQube configuration parameters
$sonarParams = @(
    "-Dsonar.projectKey=Keepnet",
    "-Dsonar.sources=.",
    "-Dsonar.host.url=http://localhost:9000",
    "-Dsonar.token=sqp_9f6d7ad3bbd77ecea4111b7bc7da6eaea3e2cb26"
)

# Run SonarQube scanner
& $sonarScannerPath $sonarParams 