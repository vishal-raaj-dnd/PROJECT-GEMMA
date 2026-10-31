"""verify_audio.py - Runs automated ffprobe and QA checks on all generated MECH-G audio assets.

Author: teamwork_worker_m1 (Audio & Voiceover Production Specialist)
"""

import json
import os
import subprocess
import sys

def probe_file(filepath: str):
    cmd = [
        "ffprobe",
        "-v", "error",
        "-show_entries", "format=duration,size,bit_rate:stream=codec_name,sample_rate,channels,bits_per_sample",
        "-of", "json",
        filepath
    ]
    res = subprocess.run(cmd, capture_output=True, text=True, check=True)
    data = json.loads(res.stdout)
    fmt = data.get("format", {})
    stream = data.get("streams", [{}])[0]
    return {
        "file": os.path.basename(filepath),
        "duration": float(fmt.get("duration", 0)),
        "size": int(fmt.get("size", 0)),
        "bit_rate": int(fmt.get("bit_rate", 0)),
        "codec": stream.get("codec_name", ""),
        "sample_rate": int(stream.get("sample_rate", 0)),
        "channels": int(stream.get("channels", 0)),
        "bits_per_sample": int(stream.get("bits_per_sample", 16))
    }

def main():
    audio_dir = os.path.dirname(os.path.abspath(__file__))
    expected_files = [
        ("vo_01.wav", 10.0, "Scene 1 (Act 1: Nacelle Reality)"),
        ("vo_02.wav",  8.0, "Scene 2 (Act 1 -> 2: Generic RAG Failure)"),
        ("vo_03.wav",  8.0, "Scene 3 (Act 2: Failure Mechanics)"),
        ("vo_04.wav",  8.0, "Scene 4 (Act 2: Consequence)"),
        ("vo_05.wav",  8.0, "Scene 5 (Act 3: Walkthrough SNAP)"),
        ("vo_06.wav",  9.0, "Scene 6 (Act 3: Walkthrough LOCK)"),
        ("vo_07.wav",  9.0, "Scene 7 (Act 3: Walkthrough FIX & VERIFY)"),
        ("vo_08.wav", 10.0, "Scene 8 (Act 4: Metrics)"),
        ("vo_09.wav",  6.0, "Scene 9 (Act 4: Lockup & Close)"),
        ("bgm.wav",   76.0, "116 BPM Industrial Dark Techno Score (>= 76.0s)"),
        ("full_narration.wav", 76.0, "Master Narration Sequence (Exactly 76.0s)"),
    ]

    print("=========================================================================================")
    print("MECH-G Audio Asset Automated Quality Assurance & FFprobe Verification Suite")
    print(f"Target Directory: {audio_dir}")
    print("=========================================================================================\n")

    results = []
    all_passed = True

    print(f"{'Filename':<20} {'Codec':<10} {'Channels':<9} {'Sample Rate':<12} {'Duration (s)':<14} {'Target':<12} {'Status'}")
    print("-" * 90)

    for fname, target_bound, desc in expected_files:
        fpath = os.path.join(audio_dir, fname)
        if not os.path.exists(fpath):
            print(f"{fname:<20} MISSING FILE! FAIL")
            all_passed = False
            continue

        info = probe_file(fpath)
        dur = info["duration"]
        ch = info["channels"]
        sr = info["sample_rate"]
        codec = info["codec"]

        # Check validity
        if fname.startswith("vo_"):
            passed = (dur <= target_bound) and (sr == 44100) and (ch in (1, 2)) and (codec == "pcm_s16le")
            target_str = f"<= {target_bound:.1f}s"
        elif fname == "bgm.wav":
            passed = (dur >= target_bound) and (sr == 44100) and (ch == 2) and (codec == "pcm_s16le")
            target_str = f">= {target_bound:.1f}s"
        elif fname == "full_narration.wav":
            passed = (abs(dur - target_bound) < 0.05) and (sr == 44100) and (ch == 2) and (codec == "pcm_s16le")
            target_str = f"== {target_bound:.1f}s"
        else:
            passed = True
            target_str = "-"

        status = "PASS" if passed else "FAIL"
        if not passed:
            all_passed = False

        print(f"{fname:<20} {codec:<10} {ch:<9} {sr:<12} {dur:<14.3f} {target_str:<12} {status}")
        results.append((info, target_str, status, desc))

    print("-" * 90)
    print(f"Overall Verification Result: {'100% PASSED' if all_passed else 'FAILED'}")
    print("=========================================================================================\n")

    if not all_passed:
        sys.exit(1)

if __name__ == "__main__":
    main()
