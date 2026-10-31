"""build_full_narration.py - Assembles 9 VO segments into full_narration.wav with sample-accurate scene cue timestamps.

Author: teamwork_worker_m1 (Audio & Voiceover Production Specialist)
Output: PROJECT-GEMMA/video/audio/full_narration.wav
Master Timeline: Exactly 76.0 seconds (3,351,600 samples at 44.1 kHz, stereo)
Scene Cue Timestamps:
  - Scene 1 (vo_01.wav):  0.0s
  - Scene 2 (vo_02.wav): 10.0s
  - Scene 3 (vo_03.wav): 18.0s
  - Scene 4 (vo_04.wav): 26.0s
  - Scene 5 (vo_05.wav): 34.0s
  - Scene 6 (vo_06.wav): 42.0s
  - Scene 7 (vo_07.wav): 51.0s
  - Scene 8 (vo_08.wav): 60.0s
  - Scene 9 (vo_09.wav): 70.0s
  - End of timeline:     76.0s
"""

import os
import wave
import numpy as np

def build_full_narration(audio_dir: str, target_duration: float = 76.0, sample_rate: int = 44100):
    print("============================================================")
    print("MECH-G Full Narration Master Assembly")
    print(f"Directory: {audio_dir}")
    print(f"Target Duration: {target_duration:.3f}s | Sample Rate: {sample_rate} Hz")
    print("============================================================")
    
    cues = [
        {"id": "vo_01", "start":  0.0, "end_limit": 10.0, "scene": "Scene 1 (Act 1: Nacelle Reality)"},
        {"id": "vo_02", "start": 10.0, "end_limit": 18.0, "scene": "Scene 2 (Act 1 -> 2: Generic RAG Failure)"},
        {"id": "vo_03", "start": 18.0, "end_limit": 26.0, "scene": "Scene 3 (Act 2: Failure Mechanics)"},
        {"id": "vo_04", "start": 26.0, "end_limit": 34.0, "scene": "Scene 4 (Act 2: Consequence)"},
        {"id": "vo_05", "start": 34.0, "end_limit": 42.0, "scene": "Scene 5 (Act 3: Walkthrough SNAP)"},
        {"id": "vo_06", "start": 42.0, "end_limit": 51.0, "scene": "Scene 6 (Act 3: Walkthrough LOCK)"},
        {"id": "vo_07", "start": 51.0, "end_limit": 60.0, "scene": "Scene 7 (Act 3: Walkthrough FIX & VERIFY)"},
        {"id": "vo_08", "start": 60.0, "end_limit": 70.0, "scene": "Scene 8 (Act 4: Metrics)"},
        {"id": "vo_09", "start": 70.0, "end_limit": 76.0, "scene": "Scene 9 (Act 4: Lockup & Close)"},
    ]
    
    total_samples = int(round(target_duration * sample_rate))
    master_audio = np.zeros((total_samples, 2), dtype=np.float32)
    
    for cue in cues:
        vo_filename = f"{cue['id']}.wav"
        vo_path = os.path.join(audio_dir, vo_filename)
        if not os.path.exists(vo_path):
            raise FileNotFoundError(f"Missing voiceover file: {vo_path}")
            
        with wave.open(vo_path, 'rb') as wf:
            n_ch = wf.getnchannels()
            sw = wf.getsampwidth()
            fr = wf.getframerate()
            n_frames = wf.getnframes()
            frames = wf.readframes(n_frames)
            
            if fr != sample_rate:
                raise ValueError(f"{vo_filename} sample rate is {fr}, expected {sample_rate}")
            if sw != 2:
                raise ValueError(f"{vo_filename} sample width is {sw}, expected 2 (16-bit)")
                
            raw_data = np.frombuffer(frames, dtype=np.int16)
            if n_ch == 2:
                vo_samples = raw_data.reshape(-1, 2).astype(np.float32) / 32768.0
            elif n_ch == 1:
                mono = raw_data.astype(np.float32) / 32768.0
                vo_samples = np.column_stack((mono, mono))
            else:
                raise ValueError(f"Unsupported channel count: {n_ch}")
                
        actual_dur = vo_samples.shape[0] / sample_rate
        start_sample = int(round(cue["start"] * sample_rate))
        end_sample = start_sample + vo_samples.shape[0]
        
        limit_dur = cue["end_limit"] - cue["start"]
        print(f"[{cue['id']}] Cue {cue['start']:5.1f}s -> {cue['end_limit']:5.1f}s | Duration: {actual_dur:5.2f}s / max {limit_dur:4.1f}s | {cue['scene']}")
        
        if end_sample > total_samples:
            raise ValueError(f"{vo_filename} extends past 76.0s master timeline! End: {end_sample / sample_rate:.2f}s")
        if actual_dur > limit_dur:
            print(f"  WARNING: {vo_filename} exceeds scene boundary by {actual_dur - limit_dur:.2f}s!")
            
        # Place into master track (adding, with small soft ramp to prevent clicks)
        master_audio[start_sample:end_sample, :] += vo_samples
        
    # Check max peak
    peak = np.max(np.abs(master_audio))
    print(f"\nMaster full_narration peak: {peak:.4f} ({20 * np.log10(peak + 1e-8):.2f} dBFS)")
    
    # Clip if any over 1.0 (should not happen since each VO is non-overlapping)
    master_audio = np.clip(master_audio, -1.0, 1.0)
    master_int16 = (master_audio * 32767.0).astype(np.int16)
    
    out_path = os.path.join(audio_dir, "full_narration.wav")
    with wave.open(out_path, 'wb') as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        wf.writeframes(master_int16.tobytes())
        
    print(f"\nSuccessfully generated: {out_path}")
    print(f"  Total Duration: {total_samples / sample_rate:.3f} s")
    print(f"  Total Samples: {total_samples}")
    print(f"  Channels: 2 (Stereo)")
    print(f"  Sample Rate: {sample_rate} Hz")
    print(f"  File Size: {os.path.getsize(out_path)} bytes")

if __name__ == "__main__":
    audio_directory = os.path.dirname(os.path.abspath(__file__))
    build_full_narration(audio_directory, target_duration=76.0, sample_rate=44100)
