$ErrorActionPreference = "Stop"

$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"

if (-not $env:ANDROID_HOME) {
  $env:ANDROID_HOME = Join-Path $env:LOCALAPPDATA "Android\Sdk"
}
$env:ANDROID_SDK_ROOT = $env:ANDROID_HOME

if (-not $env:JAVA_TOOL_OPTIONS) {
  $env:JAVA_TOOL_OPTIONS = "--enable-native-access=ALL-UNNAMED"
}

npx expo run:android @args
exit $LASTEXITCODE
