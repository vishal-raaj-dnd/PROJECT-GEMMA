# generate_vo.ps1 - Generates 9 scene voiceovers using Windows SAPI SpeechSynthesizer
# Author: teamwork_worker_m1 (Audio & Voiceover Production Specialist)

param(
    [string]$OutputDir = $PSScriptRoot
)

$ErrorActionPreference = "Stop"

Write-Host "============================================================"
Write-Host "MECH-G Voiceover Synthesis (Windows Native SAPI + FFmpeg)"
Write-Host "Output Directory: $OutputDir"
Write-Host "============================================================"

Add-Type -AssemblyName System.Speech

# Define 9 approved scene scripts with target durations and speech rates
$scenes = @(
    @{
        id = "vo_01"
        scene = "Scene 1 (Act 1: Nacelle Reality)"
        target = 10.0
        rate = 5
        text = "Suspended one hundred meters inside a freezing turbine nacelle, hydraulic oil is weeping, and there is zero cell signal. You're flipping through four thousand pages of PDF manuals with greasy gloves, while downtime costs thirty thousand dollars an hour."
    },
    @{
        id = "vo_02"
        scene = "Scene 2 (Act 1 -> Act 2: Generic RAG Failure)"
        target = 8.0
        rate = 2
        text = "Generic cloud AI is dead on arrival up here. And standard vector RAG is dangerous."
    },
    @{
        id = "vo_03"
        scene = "Scene 3 (Act 2: Failure Mechanics)"
        target = 8.0
        rate = 2
        text = "It drops upstream safety interlocks through arbitrary chunking, and hallucinates torque specs—guessing fifty-five Newton meters instead of thirty-five."
    },
    @{
        id = "vo_04"
        scene = "Scene 4 (Act 2: Consequence)"
        target = 8.0
        rate = 2
        text = "On a high-pressure manifold, that error strips aluminum threads and causes explosive flange failure."
    },
    @{
        id = "vo_05"
        scene = "Scene 5 (Act 3: Walkthrough Step 1 - SNAP)"
        target = 8.0
        rate = 5
        text = "Meet MECH-G. Built on Google Gemma 4 and an offline knowledge graph. Step one: SNAP. Multimodal vision instantly identifies the leaking valve and part number with ninety-six percent confidence."
    },
    @{
        id = "vo_06"
        scene = "Scene 6 (Act 3: Walkthrough Step 2 - LOCK)"
        target = 9.0
        rate = 2
        text = "Step two: LOCK. The OSHA 1910.147 safety gate hard-blocks wrenching until zero-energy pressure and badge sign-off are verified."
    },
    @{
        id = "vo_07"
        scene = "Scene 7 (Act 3: Walkthrough Step 3 - FIX AND VERIFY)"
        target = 9.0
        rate = 3
        text = "Step three: FIX AND VERIFY. Follow the step-by-step checklist with calibrated thirty-five Newton-meter torque specs, and audit exact source manual citations in the Evidence Drawer."
    },
    @{
        id = "vo_08"
        scene = "Scene 8 (Act 4: Metrics)"
        target = 10.0
        rate = 2
        text = "Eighty-four percent reduction in MTTR. Sub-five-hundred millisecond in-memory graph latency. Zero cloud dependencies."
    },
    @{
        id = "vo_09"
        scene = "Scene 9 (Act 4: Lockup & Close)"
        target = 6.0
        rate = 2
        text = "MECH-G: Mission-critical edge intelligence for frontline engineering."
    }
)

foreach ($s in $scenes) {
    $rawWav = Join-Path $OutputDir "$($s.id)_raw.wav"
    $finalWav = Join-Path $OutputDir "$($s.id).wav"

    Write-Host "`n[$($s.id)] Synthesizing $($s.scene)..."
    Write-Host "  Target duration: $($s.target)s | Rate: $($s.rate)"
    Write-Host "  Text: `"$($s.text)`""

    $synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
    $synth.SelectVoice("Microsoft David Desktop")
    $synth.Rate = $s.rate
    $synth.SetOutputToWaveFile($rawWav)
    $synth.Speak($s.text)
    $synth.Dispose()

    # Post-process with FFmpeg:
    # 1. Resample to 44.1 kHz, 16-bit PCM, 2 channels (stereo)
    # 2. Apply gentle loudness normalization (EBU R128 -16 LUFS) and clarity EQ
    $filterGraph = "volume=1.2,equalizer=f=1200:width_type=h:width=1000:g=1.5,loudnorm=I=-16:TP=-1.5:LRA=11"
    & ffmpeg -y -v error -i $rawWav -af $filterGraph -ar 44100 -ac 2 -c:a pcm_s16le $finalWav

    Remove-Item -Force $rawWav

    # Probe duration and format
    $durationStr = & ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 $finalWav
    $duration = [double]$durationStr
    $channels = & ffprobe -v error -select_streams a:0 -show_entries stream=channels -of default=noprint_wrappers=1:nokey=1 $finalWav
    $sampleRate = & ffprobe -v error -select_streams a:0 -show_entries stream=sample_rate -of default=noprint_wrappers=1:nokey=1 $finalWav

    $fit = if ($duration -le $s.target) { "PASS" } else { "EXCEEDS TARGET" }
    Write-Host "  Result: $duration s | Channels: $channels | Sample Rate: $sampleRate Hz | Status: $fit"

    if ($duration -gt $s.target) {
        Write-Warning "File $($s.id).wav ($duration s) exceeds target ($($s.target)s)"
    }
}

Write-Host "`nAll 9 scene voiceovers synthesized successfully in $OutputDir"
