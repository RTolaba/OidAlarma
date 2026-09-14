# Genera los iconos de la app a partir de assets/images/logo3.jpg.
# El arte es dorado sobre morado, asi que se recorta por luminancia:
# cada pixel conserva su brillo como canal alfa y se pinta de un color plano.

Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$imagesDir = Join-Path $root 'assets\images'
$source = Join-Path $imagesDir 'logo3.jpg'

$PURPLE = [System.Drawing.ColorTranslator]::FromHtml('#170D38')
$GOLD = [System.Drawing.ColorTranslator]::FromHtml('#D5AD74')
$WHITE = [System.Drawing.Color]::White

$ART_SIZE = 640
$CANVAS = 1024

function New-Canvas([int]$size) {
  $bitmap = New-Object System.Drawing.Bitmap $size, $size, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  return @($bitmap, $graphics)
}

$src = New-Object System.Drawing.Bitmap $source

# 1. Caja que contiene el arte dorado, para recortar el aire sobrante.
$minX = $src.Width; $minY = $src.Height; $maxX = 0; $maxY = 0
for ($y = 0; $y -lt $src.Height; $y += 2) {
  for ($x = 0; $x -lt $src.Width; $x += 2) {
    if ($src.GetPixel($x, $y).GetBrightness() -gt 0.35) {
      if ($x -lt $minX) { $minX = $x }
      if ($x -gt $maxX) { $maxX = $x }
      if ($y -lt $minY) { $minY = $y }
      if ($y -gt $maxY) { $maxY = $y }
    }
  }
}

# 2. Se expande a un cuadrado centrado en el arte.
$centerX = ($minX + $maxX) / 2
$centerY = ($minY + $maxY) / 2
$side = [Math]::Max($maxX - $minX, $maxY - $minY) * 1.12
$cropX = [Math]::Max(0, $centerX - $side / 2)
$cropY = [Math]::Max(0, $centerY - $side / 2)
$side = [Math]::Min($side, [Math]::Min($src.Width - $cropX, $src.Height - $cropY))
$crop = New-Object System.Drawing.RectangleF $cropX, $cropY, $side, $side

Write-Host ("Arte recortado: {0}x{1} desde ({2}, {3})" -f [int]$side, [int]$side, [int]$cropX, [int]$cropY)

# 3. Version cuadrada del original (conserva el fondo morado).
$squared, $squaredGraphics = New-Canvas $ART_SIZE
$squaredGraphics.DrawImage($src, (New-Object System.Drawing.RectangleF 0, 0, $ART_SIZE, $ART_SIZE), $crop, [System.Drawing.GraphicsUnit]::Pixel)
$squaredGraphics.Dispose()

# 4. Arte con transparencia: el alfa sale de la luminancia.
function New-KeyedArt([System.Drawing.Color]$tint) {
  $art = New-Object System.Drawing.Bitmap $ART_SIZE, $ART_SIZE, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  for ($y = 0; $y -lt $ART_SIZE; $y++) {
    for ($x = 0; $x -lt $ART_SIZE; $x++) {
      $brightness = $squared.GetPixel($x, $y).GetBrightness()
      $alpha = [Math]::Max(0.0, [Math]::Min(1.0, ($brightness - 0.18) / 0.35))
      $art.SetPixel($x, $y, [System.Drawing.Color]::FromArgb([int]($alpha * 255), $tint))
    }
  }
  return $art
}

Write-Host 'Recortando el arte por luminancia...'
$goldArt = New-KeyedArt $GOLD
$whiteArt = New-KeyedArt $WHITE

function Save-Composition([string]$name, [System.Drawing.Bitmap]$art, [System.Drawing.Color]$background, [double]$scale, [int]$size) {
  $canvas, $graphics = New-Canvas $size
  if ($background.A -gt 0) { $graphics.Clear($background) }
  if ($art) {
    $drawn = $size * $scale
    $offset = ($size - $drawn) / 2
    $graphics.DrawImage($art, $offset, $offset, $drawn, $drawn)
  }
  $graphics.Dispose()
  $path = Join-Path $imagesDir $name
  $canvas.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $canvas.Dispose()
  Write-Host "  $name"
}

$transparent = [System.Drawing.Color]::FromArgb(0, 0, 0, 0)

Write-Host 'Escribiendo iconos:'
Save-Composition 'icon.png' $goldArt $PURPLE 0.74 $CANVAS
Save-Composition 'android-icon-background.png' $null $PURPLE 1.0 $CANVAS
Save-Composition 'android-icon-foreground.png' $goldArt $transparent 0.56 $CANVAS
Save-Composition 'android-icon-monochrome.png' $whiteArt $transparent 0.56 $CANVAS
Save-Composition 'splash-icon.png' $goldArt $transparent 0.88 512
Save-Composition 'favicon.png' $goldArt $PURPLE 0.74 64

$goldArt.Dispose(); $whiteArt.Dispose(); $squared.Dispose(); $src.Dispose()
Write-Host 'Listo.'
