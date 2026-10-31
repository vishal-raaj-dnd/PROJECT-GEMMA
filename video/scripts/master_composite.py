#!/usr/bin/env python3
r"""
master_composite.py — Master Video Composite & Audio Ducking Engine
Project: MECH-G / GemmaOps Hybrid Pitch Video Production
Target Deliverable: c:\Users\pnara\Downloads\MECH-G\PROJECT-GEMMA\video\mech_g_pitch.mp4

Specifications:
- Video: 1920x1080, 30.0 fps CFR, H.264 (High Profile, Level 4.0, YUV420p)
- Audio: Dynamic sidechain ducked BGM under narration (AAC 256 kbps, 44100 Hz stereo)
- Duration: Exactly 76.0 seconds (2280 frames)
- Container: MP4 with +faststart (moov atom placed before mdat)
"""

import sys
import os
import subprocess
import json
import time

def log(msg):
    timestamp = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    print(f"[{timestamp}] [MASTER_COMPOSITE] {msg}", flush=True)

def verify_faststart(mp4_path):
    """Parses top-level MP4 atoms to verify 'moov' atom precedes 'mdat' atom."""
    atoms = []
    file_size = os.path.getsize(mp4_path)
    with open(mp4_path, "rb") as f:
        pos = 0
        while pos < file_size:
            f.seek(pos)
            header = f.read(8)
            if len(header) < 8:
                break
            size = int.from_bytes(header[:4], "big")
            name = header[4:8].decode("latin1", errors="replace")
            atoms.append((name, pos, size))
            if size == 1:
                extended = f.read(8)
                if len(extended) < 8:
                    break
                size = int.from_bytes(extended, "big")
            elif size == 0:
                break
            if size <= 0:
                break
            pos += size
    
    moov_pos = None
    mdat_pos = None
    for name, offset, size in atoms:
        if name == "moov" and moov_pos is None:
            moov_pos = offset
        elif name == "mdat" and mdat_pos is None:
            mdat_pos = offset
            
    is_faststart = (moov_pos is not None and mdat_pos is not None and moov_pos < mdat_pos)
    return is_faststart, atoms, moov_pos, mdat_pos

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    video_dir = os.path.abspath(os.path.join(script_dir, ".."))
    scenes_dir = os.path.join(video_dir, "scenes")
    audio_dir = os.path.join(video_dir, "audio")
    output_path = os.path.join(video_dir, "mech_g_pitch.mp4")
    concat_list_path = os.path.join(scenes_dir, "concat_list.txt")
    bgm_path = os.path.join(audio_dir, "bgm.wav")
    narration_path = os.path.join(audio_dir, "full_narration.wav")

    log("=" * 70)
    log("MECH-G Master Video Composite & Sidechain Audio Ducking Engine")
    log("=" * 70)
    log(f"Video Root:     {video_dir}")
    log(f"Scenes Dir:     {scenes_dir}")
    log(f"Audio Dir:      {audio_dir}")
    log(f"Concat List:    {concat_list_path}")
    log(f"BGM Asset:      {bgm_path}")
    log(f"Narration:      {narration_path}")
    log(f"Final Output:   {output_path}")

    # 1. Validate all source prerequisites
    missing = []
    if not os.path.isfile(bgm_path):
        missing.append(bgm_path)
    if not os.path.isfile(narration_path):
        missing.append(narration_path)
    if not os.path.isfile(concat_list_path):
        missing.append(concat_list_path)

    expected_scenes = [f"scene_{i:02d}.mp4" for i in range(1, 10)]
    for s in expected_scenes:
        sp = os.path.join(scenes_dir, s)
        if not os.path.isfile(sp) or os.path.getsize(sp) == 0:
            missing.append(sp)

    if missing:
        log(f"ERROR: Missing required input files: {missing}")
        sys.exit(1)

    log("All 9 scene files, concat_list.txt, and audio assets verified present.")

    # 2. Construct FFmpeg command
    # Input 0: bgm.wav
    # Input 1: full_narration.wav
    # Input 2: concat_list.txt via concat demuxer
    # Filter: sidechaincompress ducking bgm under narration
    filter_complex = (
        "[1:a]asplit=2[sc][vox_clean];"
        "[0:a][sc]sidechaincompress=threshold=0.03:ratio=10:attack=20:release=300[ducked_bgm];"
        "[ducked_bgm][vox_clean]amix=inputs=2:duration=first[aout]"
    )

    ffmpeg_cmd = [
        "ffmpeg",
        "-y",
        "-i", bgm_path,
        "-i", narration_path,
        "-f", "concat",
        "-safe", "0",
        "-i", concat_list_path,
        "-filter_complex", filter_complex,
        "-map", "2:v",
        "-map", "[aout]",
        "-c:v", "libx264",
        "-preset", "medium",
        "-crf", "18",
        "-pix_fmt", "yuv420p",
        "-r", "30",
        "-c:a", "aac",
        "-b:a", "256k",
        "-ar", "44100",
        "-ac", "2",
        "-movflags", "+faststart",
        "-t", "76.0",
        output_path
    ]

    log("Executing FFmpeg master composite...")
    log("Command: " + " ".join(f'"{arg}"' if " " in arg else arg for arg in ffmpeg_cmd))

    t0 = time.time()
    proc = subprocess.run(ffmpeg_cmd, cwd=scenes_dir, capture_output=True, text=True)
    t_elapsed = time.time() - t0

    if proc.returncode != 0:
        log(f"ERROR: FFmpeg failed with exit code {proc.returncode}")
        log("FFmpeg STDERR:")
        print(proc.stderr)
        sys.exit(proc.returncode)

    log(f"FFmpeg composite succeeded in {t_elapsed:.2f} seconds.")

    # 3. Comprehensive Verification via FFprobe & Atom Inspector
    if not os.path.isfile(output_path):
        log(f"ERROR: Output file does not exist: {output_path}")
        sys.exit(1)

    file_size = os.path.getsize(output_path)
    log(f"Output File Size: {file_size:,} bytes ({file_size / (1024 * 1024):.2f} MB)")

    ffprobe_cmd = [
        "ffprobe",
        "-v", "quiet",
        "-print_format", "json",
        "-show_streams",
        "-show_format",
        output_path
    ]
    probe_proc = subprocess.run(ffprobe_cmd, capture_output=True, text=True)
    if probe_proc.returncode != 0:
        log("ERROR: Failed to run ffprobe on output file.")
        sys.exit(probe_proc.returncode)

    probe_data = json.loads(probe_proc.stdout)
    streams = probe_data.get("streams", [])
    format_info = probe_data.get("format", {})

    v_stream = next((s for s in streams if s.get("codec_type") == "video"), None)
    a_stream = next((s for s in streams if s.get("codec_type") == "audio"), None)

    if not v_stream or not a_stream:
        log(f"ERROR: Expected both video and audio streams. Found: {len(streams)} streams.")
        sys.exit(1)

    # Video stream checks
    v_codec = v_stream.get("codec_name")
    v_width = v_stream.get("width")
    v_height = v_stream.get("height")
    v_fps = v_stream.get("r_frame_rate")
    v_nb_frames = int(v_stream.get("nb_frames", 0))
    v_duration = float(v_stream.get("duration", 0))
    v_pix_fmt = v_stream.get("pix_fmt")

    # Audio stream checks
    a_codec = a_stream.get("codec_name")
    a_channels = a_stream.get("channels")
    a_sample_rate = a_stream.get("sample_rate")
    a_duration = float(a_stream.get("duration", 0))

    # Container checks
    container_duration = float(format_info.get("duration", 0))
    container_format = format_info.get("format_name")

    # Faststart check
    is_faststart, atoms, moov_pos, mdat_pos = verify_faststart(output_path)

    log("\n" + "=" * 70)
    log("MASTER DELIVERABLE EMPIRICAL VERIFICATION REPORT")
    log("=" * 70)
    log(f"File:               {output_path}")
    log(f"Container:          {container_format}")
    log(f"Container Duration: {container_duration:.3f} s (Target: 76.000 s)")
    log(f"Video Codec:        {v_codec} ({v_pix_fmt})")
    log(f"Resolution:         {v_width}x{v_height} (Target: 1920x1080)")
    log(f"Video Framerate:    {v_fps} CFR (Target: 30/1)")
    log(f"Total Video Frames: {v_nb_frames} (Target: 2280)")
    log(f"Video Duration:     {v_duration:.3f} s")
    log(f"Audio Codec:        {a_codec} ({a_channels} channels, {a_sample_rate} Hz)")
    log(f"Audio Duration:     {a_duration:.3f} s")
    log(f"Faststart (+moov):  {'PASS (moov @ byte ' + str(moov_pos) + ' < mdat @ byte ' + str(mdat_pos) + ')' if is_faststart else 'FAIL'}")
    log(f"Top-level Atoms:    {[a[0] for a in atoms]}")

    errors = []
    if abs(container_duration - 76.0) > 0.05:
        errors.append(f"Duration mismatch: got {container_duration}s, expected 76.0s")
    if v_width != 1920 or v_height != 1080:
        errors.append(f"Resolution mismatch: got {v_width}x{v_height}, expected 1920x1080")
    if v_codec != "h264":
        errors.append(f"Video codec mismatch: got {v_codec}, expected h264")
    if v_pix_fmt != "yuv420p":
        errors.append(f"Pixel format mismatch: got {v_pix_fmt}, expected yuv420p")
    if v_fps != "30/1":
        errors.append(f"Framerate mismatch: got {v_fps}, expected 30/1")
    if v_nb_frames != 2280:
        errors.append(f"Frame count mismatch: got {v_nb_frames}, expected 2280")
    if a_codec != "aac":
        errors.append(f"Audio codec mismatch: got {a_codec}, expected aac")
    if a_channels != 2:
        errors.append(f"Audio channel mismatch: got {a_channels}, expected 2 (stereo)")
    if a_sample_rate != "44100":
        errors.append(f"Audio sample rate mismatch: got {a_sample_rate}, expected 44100")
    if not is_faststart:
        errors.append("Faststart validation failed: moov atom is not before mdat atom")

    if errors:
        log("\nVERIFICATION FAILED:")
        for err in errors:
            log(f"  - {err}")
        sys.exit(1)

    log("\n" + "=" * 70)
    log("ALL VERIFICATIONS PASSED (100% COMPLIANT WITH SPECIFICATION)")
    log("=" * 70)

if __name__ == "__main__":
    main()
