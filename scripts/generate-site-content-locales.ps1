$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$sourcePath = Join-Path $root "src\data\site-content.ts"
$outputPath = Join-Path $root "messages\site-content-locales.json"
$targetLocales = @("de", "fr", "es", "id", "th", "vi", "ar")
$batchSize = 30

$sourceFile = Get-Content -LiteralPath $sourcePath -Raw -Encoding UTF8
$matches = [regex]::Matches($sourceFile, 'b\("((?:[^"\\]|\\.)*)",\s*"(?:[^"\\]|\\.)*"\)')
$sources = @($matches | ForEach-Object { ConvertFrom-Json ('"' + $_.Groups[1].Value + '"') })
if (-not $sources.Count) { throw "No site-content strings were found." }
if (($sources | Select-Object -Unique).Count -ne $sources.Count) { throw "English site-content strings must be unique." }

function Invoke-Translation {
  param([string]$Text, [string]$Locale)
  $query = [uri]::EscapeDataString($Text)
  $url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=$Locale&dt=t&q=$query"
  for ($attempt = 1; $attempt -le 4; $attempt++) {
    try {
      $response = Invoke-RestMethod -Uri $url -TimeoutSec 30
      return (($response[0] | ForEach-Object { $_[0] }) -join "").Trim()
    } catch {
      if ($attempt -eq 4) { throw }
      Start-Sleep -Milliseconds (500 * $attempt)
    }
  }
}

function Invoke-TranslationBatch {
  param([object[]]$Batch, [string]$Locale)
  $segments = for ($index = 0; $index -lt $Batch.Count; $index++) {
    if ($index) { "[[[COBIOER_SEGMENT_$($index.ToString('000'))]]]`n$($Batch[$index])" } else { [string]$Batch[$index] }
  }
  $translated = Invoke-Translation -Text ($segments -join "`n") -Locale $Locale
  $parts = @([regex]::Split($translated, '\s*\[\[\[COBIOER_SEGMENT_\d{3}\]\]\]\s*'))
  if ($parts.Count -eq $Batch.Count -and -not ($parts | Where-Object { -not $_ })) { return $parts }
  return @($Batch | ForEach-Object { Invoke-Translation -Text ([string]$_) -Locale $Locale })
}

function Save-Result {
  param([System.Collections.IDictionary]$Data)
  $json = ($Data | ConvertTo-Json -Depth 6) + "`n"
  [System.IO.File]::WriteAllText($outputPath, $json, [System.Text.UTF8Encoding]::new($false))
}

$result = [ordered]@{ sources = $sources }
if (Test-Path -LiteralPath $outputPath) {
  $existing = Get-Content -LiteralPath $outputPath -Raw -Encoding UTF8 | ConvertFrom-Json
  if ((ConvertTo-Json @($existing.sources) -Compress) -eq (ConvertTo-Json $sources -Compress)) {
    foreach ($locale in $targetLocales) {
      if ($existing.$locale) { $result[$locale] = @($existing.$locale) }
    }
  }
}

foreach ($locale in $targetLocales) {
  $values = New-Object System.Collections.ArrayList
  if ($result.Contains($locale)) { @($result[$locale]) | ForEach-Object { [void]$values.Add($_) } }
  for ($offset = $values.Count; $offset -lt $sources.Count; $offset += $batchSize) {
    $end = [Math]::Min($offset + $batchSize - 1, $sources.Count - 1)
    $batch = @($sources[$offset..$end])
    [void]$values.AddRange([object[]](Invoke-TranslationBatch -Batch $batch -Locale $locale))
    $result[$locale] = @($values)
    Save-Result -Data $result
    Write-Host "$locale`: $($values.Count)/$($sources.Count)"
    Start-Sleep -Milliseconds 120
  }
  if ($values.Count -ne $sources.Count) { throw "$locale produced $($values.Count) translations." }
}

# Curated terminology and headline corrections after automatic first-pass translation.
$overrides = @{
  de = @{ 1 = "Wissenschaft in zuverlässige Produkte umgesetzt" }
  fr = @{ 32 = "Du concept de cible au test validé" }
  es = @{ 14 = "Cómo trabajamos" }
  id = @{ 59 = "Kepercayaan yang dibangun dalam setiap batch" }
  vi = @{ 2 = "Cobioer BioSciences phát triển các mô hình tế bào đã được xác thực, vật liệu tham chiếu chẩn đoán và các giải pháp IVD tích hợp cho khách hàng dược phẩm, công nghệ sinh học và chẩn đoán trên toàn thế giới." }
  ar = @{
    1 = "تحويل العلم إلى منتجات موثوقة"
    32 = "من مفهوم الهدف إلى اختبار مُتحقَّق من صلاحيته"
  }
}
foreach ($locale in $overrides.Keys) {
  foreach ($index in $overrides[$locale].Keys) { $result[$locale][$index] = $overrides[$locale][$index] }
}

Save-Result -Data $result
Write-Host "Wrote $outputPath"
