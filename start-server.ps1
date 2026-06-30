# Know Yourself 2 - Web Server Script
# Serves files with proper Content-Type headers

Write-Host "Starting server on http://localhost:8000" -ForegroundColor Green
Start-Process "http://localhost:8000"

# Create HTTP listener
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add('http://localhost:8000/')
$listener.Start()

Write-Host "Server running on http://localhost:8000" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Content-Type mapping
$contentTypes = @{
    '.html' = 'text/html; charset=utf-8'
    '.htm'  = 'text/html; charset=utf-8'
    '.css'  = 'text/css; charset=utf-8'
    '.js'   = 'application/javascript; charset=utf-8'
    '.json' = 'application/json; charset=utf-8'
    '.txt'  = 'text/plain; charset=utf-8'
    '.xml'  = 'application/xml; charset=utf-8'
    '.jpg'  = 'image/jpeg'
    '.jpeg' = 'image/jpeg'
    '.png'  = 'image/png'
    '.gif'  = 'image/gif'
    '.svg'  = 'image/svg+xml'
    '.ico'  = 'image/x-icon'
    '.pdf'  = 'application/pdf'
    '.zip'  = 'application/zip'
}

try {
    while ($listener.IsListening) {
        # Get the request
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        # Get the requested file path
        $file = $request.Url.LocalPath
        if ($file -eq '/') {
            $file = '/index.html'
        }

        # Construct full file path
        $filepath = Join-Path (Get-Location) $file.TrimStart('/')
        
        # Log the request
        $timestamp = Get-Date -Format "HH:mm:ss"
        Write-Host "[$timestamp] $($request.HttpMethod) $file" -ForegroundColor Gray

        if (Test-Path $filepath) {
            try {
                # Read file content
                $content = [System.IO.File]::ReadAllBytes($filepath)
                
                # Set Content-Type based on file extension
                $extension = [System.IO.Path]::GetExtension($filepath).ToLower()
                if ($contentTypes.ContainsKey($extension)) {
                    $response.ContentType = $contentTypes[$extension]
                }
                else {
                    $response.ContentType = 'application/octet-stream'
                }
                
                # Enable CORS for local development
                $response.Headers.Add("Access-Control-Allow-Origin", "*")
                $response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
                $response.Headers.Add("Access-Control-Allow-Headers", "Content-Type")
                
                # Send the response
                $response.ContentLength64 = $content.Length
                $response.StatusCode = 200
                $response.OutputStream.Write($content, 0, $content.Length)
                
                Write-Host "[$timestamp] 200 OK - $file ($($content.Length) bytes)" -ForegroundColor Green
            }
            catch {
                Write-Host "[$timestamp] Error reading file: $_" -ForegroundColor Red
                $response.StatusCode = 500
            }
        }
        else {
            Write-Host "[$timestamp] 404 Not Found - $file" -ForegroundColor Red
            $response.StatusCode = 404
            $errorMessage = "404 - File Not Found: $file"
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($errorMessage)
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
        }
        
        # Close the response
        $response.Close()
    }
}
finally {
    # Clean up
    $listener.Stop()
    $listener.Close()
    Write-Host ""
    Write-Host "Server stopped." -ForegroundColor Yellow
}
