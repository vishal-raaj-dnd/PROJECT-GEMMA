"""generate_bgm.py - Synthesizes 116 BPM industrial dark techno / ambient drone BGM track for MECH-G demo video.

Author: teamwork_worker_m1 (Audio & Voiceover Production Specialist)
Output: PROJECT-GEMMA/video/audio/bgm.wav
Format: Stereo, 44.1 kHz, 16-bit PCM WAV, Duration >= 76.0 seconds.
Style: Low pulsing sub-bass rhythm at 116 BPM, minimal industrial percussive clicks,
       atmospheric analog pad drone in D minor.
"""

import math
import os
import wave
import numpy as np
import scipy.signal as signal

def generate_bgm(output_path: str, duration_sec: float = 78.0, sample_rate: int = 44100):
    print(f"Generating MECH-G Industrial Dark Techno BGM...")
    print(f"  Target: {output_path}")
    print(f"  Duration: {duration_sec:.2f}s | Sample Rate: {sample_rate} Hz | BPM: 116")
    
    total_samples = int(duration_sec * sample_rate)
    t = np.linspace(0, duration_sec, total_samples, endpoint=False)
    
    # 116 BPM timing constants
    bpm = 116.0
    beat_dur = 60.0 / bpm              # ~0.51724 s
    bar_dur = 4.0 * beat_dur           # ~2.06897 s
    sixteenth_dur = beat_dur / 4.0     # ~0.12931 s
    
    # Pre-allocate stereo buffers (Left, Right)
    left = np.zeros(total_samples, dtype=np.float64)
    right = np.zeros(total_samples, dtype=np.float64)
    
    # -------------------------------------------------------------
    # LAYER 1: Analog Pad Drone (D Minor: D2, A2, D3, F3, A3)
    # -------------------------------------------------------------
    print("  Synthesizing Layer 1: Analog D Minor Drone & Atmospheric Pad...")
    freq_D1 = 36.71
    freq_D2 = 73.42
    freq_A2 = 110.00
    freq_D3 = 146.83
    freq_F3 = 174.61
    freq_A3 = 220.00
    freq_Bb2 = 116.54  # Act 2 tension
    
    # Oscillators with subtle detune for stereo width
    drone_L = (
        0.30 * np.sin(2 * np.pi * (freq_D2 * 0.998) * t) +
        0.25 * np.sin(2 * np.pi * (freq_A2 * 1.002) * t) +
        0.20 * np.sin(2 * np.pi * (freq_F3 * 0.997) * t) +
        0.15 * signal.sawtooth(2 * np.pi * (freq_D3 * 1.001) * t)
    )
    drone_R = (
        0.30 * np.sin(2 * np.pi * (freq_D2 * 1.002) * t) +
        0.25 * np.sin(2 * np.pi * (freq_A2 * 0.998) * t) +
        0.20 * np.sin(2 * np.pi * (freq_F3 * 1.003) * t) +
        0.15 * signal.sawtooth(2 * np.pi * (freq_D3 * 0.999) * t)
    )
    
    # Act 2 (18s - 34s) tension drone addition (Bb2 dissonance)
    act2_env = np.clip((t - 18.0) / 4.0, 0.0, 1.0) * np.clip((34.0 - t) / 3.0, 0.0, 1.0)
    drone_L += 0.22 * act2_env * np.sin(2 * np.pi * freq_Bb2 * t)
    drone_R += 0.22 * act2_env * np.sin(2 * np.pi * (freq_Bb2 * 1.005) * t)
    
    # Act 4 (70s - 76s) warm resolution pad swell
    act4_env = np.clip((t - 69.0) / 2.0, 0.0, 1.0) * np.clip((77.0 - t) / 2.0, 0.0, 1.0)
    drone_L += 0.25 * act4_env * (np.sin(2 * np.pi * freq_A3 * t) + np.sin(2 * np.pi * freq_D3 * t))
    drone_R += 0.25 * act4_env * (np.sin(2 * np.pi * (freq_A3 * 1.003) * t) + np.sin(2 * np.pi * (freq_D3 * 0.997) * t))
    
    # Low-pass filter for the drone with subtle LFO
    sos_drone = signal.butter(2, 450, 'low', fs=sample_rate, output='sos')
    drone_L = signal.sosfilt(sos_drone, drone_L)
    drone_R = signal.sosfilt(sos_drone, drone_R)
    
    # Warm analog saturation
    drone_L = np.tanh(1.2 * drone_L) * 0.35
    drone_R = np.tanh(1.2 * drone_R) * 0.35
    
    left += drone_L
    right += drone_R

    # -------------------------------------------------------------
    # LAYER 2: Sub-Bass Pulse (D1/D2) with 116 BPM Pumping Sidechain
    # -------------------------------------------------------------
    print("  Synthesizing Layer 2: 116 BPM Pulsing Sub-Bass...")
    sub_L = np.zeros(total_samples, dtype=np.float64)
    sub_R = np.zeros(total_samples, dtype=np.float64)
    
    # Pumping volume envelope tied to 116 BPM beats
    beat_phase = (t % beat_dur) / beat_dur
    # Exponential ducking right on the beat, opening back up
    sidechain_pump = 0.25 + 0.75 * (1.0 - np.exp(-beat_phase * 6.0))
    
    # Sub bass tone: pure deep fundamental at 36.71 Hz + 73.42 Hz
    sub_tone = (
        0.55 * np.sin(2 * np.pi * freq_D1 * t) +
        0.35 * np.sin(2 * np.pi * freq_D2 * t)
    )
    
    # In Act 3 (34s - 60s), add rhythmic 16th-note bounce
    act3_mask = (t >= 34.0) & (t < 60.0)
    sixteenth_phase = (t % sixteenth_dur) / sixteenth_dur
    bounce_env = np.where(act3_mask, 0.4 + 0.6 * np.exp(-sixteenth_phase * 4.0), 1.0)
    
    # Progressive intensity curve across the timeline
    sub_gain = np.ones(total_samples, dtype=np.float64) * 0.40
    sub_gain[t < 10.0] = 0.25 + 0.15 * (t[t < 10.0] / 10.0)    # Intro buildup
    sub_gain[(t >= 18.0) & (t < 34.0)] = 0.45                  # Act 2 tension
    sub_gain[(t >= 34.0) & (t < 60.0)] = 0.55                  # Act 3 drive
    sub_gain[(t >= 60.0) & (t < 72.0)] = 0.60                  # Act 4 peak
    sub_gain[t >= 72.0] = 0.60 * np.clip((77.0 - t[t >= 72.0]) / 5.0, 0.0, 1.0)
    
    sub_processed = sub_tone * sidechain_pump * bounce_env * sub_gain
    sub_L += sub_processed
    sub_R += sub_processed
    
    left += sub_L
    right += sub_R

    # -------------------------------------------------------------
    # LAYER 3: Industrial Sub-Kick Pulse (116 BPM)
    # -------------------------------------------------------------
    print("  Synthesizing Layer 3: Industrial Sub-Kick Pulse...")
    kick_samples = int(0.25 * sample_rate)
    kick_t = np.linspace(0, 0.25, kick_samples, endpoint=False)
    # Pitch drop from 130 Hz down to 44 Hz
    kick_f = 44.0 + (130.0 - 44.0) * np.exp(-kick_t / 0.035)
    kick_phase = 2 * np.pi * (44.0 * kick_t - (130.0 - 44.0) * 0.035 * (np.exp(-kick_t / 0.035) - 1.0))
    kick_body = np.sin(kick_phase) * np.exp(-kick_t / 0.065)
    # Click transient for mechanical definition
    click_noise = np.random.uniform(-1, 1, kick_samples) * np.exp(-kick_t / 0.006)
    single_kick = np.tanh(1.6 * (kick_body + 0.3 * click_noise)) * 0.55
    
    # Place kicks according to the arrangement
    num_beats = int(duration_sec / beat_dur)
    for b in range(num_beats):
        beat_time = b * beat_dur
        if beat_time > 75.0:
            break
            
        # Determine kick presence and velocity by scene
        kick_vel = 0.0
        if beat_time < 10.0:
            # Act 1: subtle pulse on beat 1 of each bar (every 4 beats)
            if b % 4 == 0:
                kick_vel = 0.35 + 0.05 * (beat_time / 10.0)
        elif 10.0 <= beat_time < 18.0:
            # Escalating to 2 kicks per bar (beats 1 & 3)
            if b % 2 == 0:
                kick_vel = 0.45
        elif 18.0 <= beat_time < 34.0:
            # Act 2: 4-on-the-floor industrial kick
            kick_vel = 0.55
        elif 34.0 <= beat_time < 60.0:
            # Act 3: Driving full industrial 4-on-the-floor
            kick_vel = 0.65
        elif 60.0 <= beat_time < 71.0:
            # Act 4: Peak driving kick
            kick_vel = 0.70
        elif 71.0 <= beat_time < 75.0:
            # Outro fading kick
            kick_vel = 0.40 * (75.0 - beat_time) / 4.0
            
        if kick_vel > 0:
            idx = int(beat_time * sample_rate)
            end_idx = min(idx + kick_samples, total_samples)
            kick_len = end_idx - idx
            left[idx:end_idx] += single_kick[:kick_len] * kick_vel
            right[idx:end_idx] += single_kick[:kick_len] * kick_vel

    # -------------------------------------------------------------
    # LAYER 4: Minimal Industrial Percussive Clicks & Hi-Hats
    # -------------------------------------------------------------
    print("  Synthesizing Layer 4: Minimal Industrial Percussive Clicks...")
    click_len = int(0.04 * sample_rate)
    click_t = np.linspace(0, 0.04, click_len, endpoint=False)
    
    # Resonant metallic transient (3800 Hz + 6200 Hz bandpassed noise)
    noise_raw = np.random.uniform(-1, 1, click_len)
    sos_click = signal.butter(3, [3200, 7500], 'bandpass', fs=sample_rate, output='sos')
    metallic_click = signal.sosfilt(sos_click, noise_raw) * np.exp(-click_t / 0.012)
    metallic_click = metallic_click / (np.max(np.abs(metallic_click)) + 1e-6)
    
    num_sixteenths = int(duration_sec / sixteenth_dur)
    for s_idx in range(num_sixteenths):
        s_time = s_idx * sixteenth_dur
        if s_time < 4.0 or s_time > 74.0:
            continue
            
        # Percussion pattern rules:
        # Off-beat clicks on 16th notes
        pos_in_beat = s_idx % 4  # 0, 1, 2, 3
        
        click_gain = 0.0
        # Act 1 (4s - 18s): occasional mechanical ticks on 16th position 2
        if 4.0 <= s_time < 18.0 and pos_in_beat == 2:
            click_gain = 0.12
        # Act 2 (18s - 34s): ticks on positions 1 and 3
        elif 18.0 <= s_time < 34.0 and pos_in_beat in (1, 3):
            click_gain = 0.18
        # Act 3 (34s - 60s): driving 16th pattern (positions 1, 2, 3)
        elif 34.0 <= s_time < 60.0:
            if pos_in_beat == 2:
                click_gain = 0.28  # offbeat hat
            elif pos_in_beat in (1, 3):
                click_gain = 0.16  # syncopated ticks
        # Act 4 (60s - 72s): driving groove
        elif 60.0 <= s_time < 72.0:
            if pos_in_beat == 2:
                click_gain = 0.28
            elif pos_in_beat in (1, 3):
                click_gain = 0.18
                
        if click_gain > 0:
            samp_idx = int(s_time * sample_rate)
            end_samp = min(samp_idx + click_len, total_samples)
            actual_len = end_samp - samp_idx
            
            # Stereo ping-pong alternation
            pan = 0.3 * np.sin(s_idx * 1.2)  # subtle stereo drift
            left_gain = click_gain * (0.5 - pan)
            right_gain = click_gain * (0.5 + pan)
            
            left[samp_idx:end_samp] += metallic_click[:actual_len] * left_gain
            right[samp_idx:end_samp] += metallic_click[:actual_len] * right_gain

    # -------------------------------------------------------------
    # LAYER 5: Sub-Bass Impact Booms at Metric Cues (60s, 64s, 67s)
    # -------------------------------------------------------------
    print("  Synthesizing Layer 5: Sub-Bass Impact Booms at Metric Drops...")
    boom_times = [60.0, 64.0, 67.0]  # Timed to Scene 8 kinetic metric card reveals
    boom_dur = 2.0
    boom_len = int(boom_dur * sample_rate)
    boom_t = np.linspace(0, boom_dur, boom_len, endpoint=False)
    
    # 40 Hz boom with exponential decay
    boom_sine = np.sin(2 * np.pi * 40.0 * boom_t) * np.exp(-boom_t / 0.6)
    # Low-end rumble
    boom_noise = np.random.uniform(-1, 1, boom_len)
    sos_boom = signal.butter(2, 80, 'low', fs=sample_rate, output='sos')
    boom_rumble = signal.sosfilt(sos_boom, boom_noise) * np.exp(-boom_t / 0.8) * 0.4
    single_boom = np.tanh(1.5 * (boom_sine + boom_rumble)) * 0.50
    
    for bt in boom_times:
        b_idx = int(bt * sample_rate)
        e_idx = min(b_idx + boom_len, total_samples)
        act_len = e_idx - b_idx
        left[b_idx:e_idx] += single_boom[:act_len]
        right[b_idx:e_idx] += single_boom[:act_len]

    # -------------------------------------------------------------
    # LAYER 6: Industrial Metallic Reverb & Ambience
    # -------------------------------------------------------------
    print("  Applying Industrial Space & Dynamic Master Normalization...")
    # Smooth fade in at start (0 to 1.5s)
    fade_in = np.clip(t / 1.5, 0.0, 1.0)
    left *= fade_in
    right *= fade_in
    
    # Master smooth fade out (76.0s to 78.0s)
    fade_out = np.clip((78.0 - t) / 2.0, 0.0, 1.0)
    left *= fade_out
    right *= fade_out
    
    # Soft limiter / warm tape saturation
    left = np.tanh(1.1 * left)
    right = np.tanh(1.1 * right)
    
    # Normalize peak to -1.5 dBFS (0.841)
    peak = max(np.max(np.abs(left)), np.max(np.abs(right)))
    target_peak = 0.841  # -1.5 dBFS
    if peak > 0:
        gain = target_peak / peak
        left *= gain
        right *= gain
        
    print(f"  Peak level normalized to: {20 * np.log10(np.max(np.abs(left))):.2f} dBFS")
    
    # Convert float64 to int16
    left_int16 = np.int16(np.clip(left, -1.0, 1.0) * 32767.0)
    right_int16 = np.int16(np.clip(right, -1.0, 1.0) * 32767.0)
    
    # Interleave stereo
    stereo = np.empty((total_samples * 2,), dtype=np.int16)
    stereo[0::2] = left_int16
    stereo[1::2] = right_int16
    
    # Write WAV file
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with wave.open(output_path, 'wb') as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        wf.writeframes(stereo.tobytes())
        
    print(f"Successfully generated: {output_path}")
    print(f"  Duration: {total_samples / sample_rate:.3f} s")
    print(f"  Channels: 2 (Stereo)")
    print(f"  Sample Rate: {sample_rate} Hz")
    print(f"  File Size: {os.path.getsize(output_path)} bytes")

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    out_file = os.path.join(current_dir, "bgm.wav")
    generate_bgm(out_file, duration_sec=78.0, sample_rate=44100)
