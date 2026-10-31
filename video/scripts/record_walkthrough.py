import os
import sys
import time
import subprocess
from pathlib import Path

# Configure UTF-8 encoding for Windows standard output
if sys.platform.startswith("win"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

from playwright.sync_api import sync_playwright

BASE_DIR = Path(__file__).resolve().parent.parent
SCENES_DIR = BASE_DIR / "scenes"
TEMP_DIR = BASE_DIR / "raw_recordings"

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
FRONTEND_URL = "http://localhost:3000/diagnostics"

SCENES_DIR.mkdir(parents=True, exist_ok=True)
TEMP_DIR.mkdir(parents=True, exist_ok=True)


def inject_ui_enhancements(page, badge_text, badge_color, badge_glow):
    """
    Injects a kinetic on-screen HUD badge and a visible interactive cursor
    into the browser DOM for broadcast-quality walkthrough capture.
    """
    js_code = f"""
    (() => {{
        // Ensure tour modal is permanently suppressed
        localStorage.setItem('mechg_tour_completed', 'true');

        // Remove existing badge or cursor if present
        const oldBadge = document.getElementById('__kinetic_badge__');
        if (oldBadge) oldBadge.remove();
        const oldCursor = document.getElementById('__custom_cursor__');
        if (oldCursor) oldCursor.remove();

        // 1. Kinetic Badge
        const badge = document.createElement('div');
        badge.id = '__kinetic_badge__';
        badge.style.cssText = `
            position: fixed;
            top: 18px;
            right: 24px;
            z-index: 9999999;
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 9px 18px;
            background: rgba(14, 15, 18, 0.94);
            border: 1.5px solid {badge_color};
            border-radius: 9999px;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.7), 0 0 22px {badge_glow};
            backdrop-filter: blur(16px);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Plus Jakarta Sans', sans-serif;
            letter-spacing: 0.05em;
            font-size: 13px;
            font-weight: 800;
            text-transform: uppercase;
            color: #FFFFFF;
            opacity: 0;
            transform: translateY(-20px) scale(0.96);
            transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
            pointer-events: none;
        `;

        const dot = document.createElement('span');
        dot.style.cssText = `
            display: inline-block;
            width: 9px;
            height: 9px;
            border-radius: 50%;
            background: {badge_color};
            box-shadow: 0 0 12px {badge_color};
        `;

        const label = document.createElement('span');
        label.style.cssText = `
            color: {badge_color};
            font-family: 'JetBrains Mono', 'Courier New', monospace;
            font-weight: 800;
            letter-spacing: 0.04em;
        `;
        label.innerText = "{badge_text}";

        badge.appendChild(dot);
        badge.appendChild(label);
        document.body.appendChild(badge);

        // Animate in badge
        requestAnimationFrame(() => {{
            badge.style.opacity = '1';
            badge.style.transform = 'translateY(0) scale(1)';
        }});

        // 2. Interactive Cursor Overlay
        const cursor = document.createElement('div');
        cursor.id = '__custom_cursor__';
        cursor.style.cssText = `
            position: fixed;
            top: 540px;
            left: 960px;
            width: 22px;
            height: 22px;
            border-radius: 50%;
            border: 2px solid rgba(255, 255, 255, 0.95);
            background: radial-gradient(circle, {badge_color} 0%, rgba(34, 211, 238, 0.3) 60%, transparent 100%);
            box-shadow: 0 0 16px {badge_glow}, 0 2px 6px rgba(0, 0, 0, 0.6);
            pointer-events: none;
            z-index: 10000000;
            transform: translate(-50%, -50%);
            transition: width 0.15s ease, height 0.15s ease, background 0.15s ease, transform 0.05s ease-out;
        `;
        document.body.appendChild(cursor);

        window.__setCursorPos = (x, y) => {{
            cursor.style.left = x + 'px';
            cursor.style.top = y + 'px';
        }};

        window.__triggerCursorClick = () => {{
            cursor.style.width = '30px';
            cursor.style.height = '30px';
            cursor.style.background = 'rgba(255, 255, 255, 0.95)';
            cursor.style.boxShadow = '0 0 24px #FFFFFF';
            setTimeout(() => {{
                cursor.style.width = '22px';
                cursor.style.height = '22px';
                cursor.style.background = 'radial-gradient(circle, {badge_color} 0%, rgba(34, 211, 238, 0.3) 60%, transparent 100%)';
                cursor.style.boxShadow = '0 0 16px {badge_glow}, 0 2px 6px rgba(0, 0, 0, 0.6)';
            }}, 180);
        }};
    }})();
    """
    page.evaluate(js_code)


def move_cursor_smoothly(page, start_x, start_y, target_x, target_y, steps=25, duration=0.45):
    """Interpolates visual cursor coordinates for fluid natural movement."""
    sleep_interval = duration / steps
    for i in range(1, steps + 1):
        alpha = i / steps
        ease = alpha * alpha * (3 - 2 * alpha)
        cx = start_x + (target_x - start_x) * ease
        cy = start_y + (target_y - start_y) * ease
        page.evaluate(f"window.__setCursorPos({cx:.1f}, {cy:.1f})")
        time.sleep(sleep_interval)
    return target_x, target_y


def click_locator_with_cursor(page, locator, cur_x, cur_y, duration=0.45):
    """Smoothly moves cursor to target element center, pulses click effect, and clicks."""
    box = locator.bounding_box()
    if box:
        tx = box["x"] + box["width"] / 2
        ty = box["y"] + box["height"] / 2
        cur_x, cur_y = move_cursor_smoothly(page, cur_x, cur_y, tx, ty, steps=20, duration=duration)
    page.evaluate("window.__triggerCursorClick()")
    time.sleep(0.08)
    locator.click(force=True)
    time.sleep(0.12)
    return cur_x, cur_y


def transcode_and_normalize(raw_path, output_path, target_duration):
    """
    Transcodes raw Playwright WebM to exact broadcast specs:
    1920x1080, 30 fps CFR, libx264, pix_fmt yuv420p, exact duration.
    """
    print(f"[*] Transcoding {raw_path.name} -> {output_path.name} (Duration: {target_duration}s)...")
    cmd = [
        "ffmpeg",
        "-y",
        "-i", str(raw_path),
        "-t", f"{target_duration:.3f}",
        "-c:v", "libx264",
        "-profile:v", "high",
        "-level", "4.0",
        "-preset", "slow",
        "-crf", "18",
        "-pix_fmt", "yuv420p",
        "-r", "30",
        "-fps_mode", "cfr",
        "-video_track_timescale", "30000",
        "-movflags", "+faststart",
        str(output_path)
    ]
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if res.returncode != 0:
        print(f"[-] FFmpeg error:\n{res.stderr}")
        raise RuntimeError(f"FFmpeg failed with exit code {res.returncode}")
    print(f"[✓] Created {output_path.name} successfully.")


def record_scene_05():
    """
    Scene 05 (8.0s): Step 1 — SNAP
    Vestas V112 scenario, sample_valve_leak.webp, 210 bar manifold pressure.
    Click "Run Hardware Diagnostic Evaluation". Gemma vision scans and reveals
    Fault Detected banner: Proportional Pressure Relief Valve V2 (PRV-992-B)
    with 96.0% confidence and Viton seal weepage.
    Kinetic badge: "1. SNAP — GEMMA 4 MULTIMODAL (PRV-992-B)"
    """
    print("\n" + "=" * 60)
    print("[*] RECORDING SCENE 05: Step 1 — SNAP (8.0s)")
    print("=" * 60)
    scene_temp_dir = TEMP_DIR / "s05"
    scene_temp_dir.mkdir(parents=True, exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(
            executable_path=CHROME_PATH,
            headless=True,
            args=["--no-sandbox", "--disable-infobars", "--window-size=1920,1080"]
        )
        context = browser.new_context(
            viewport={"width": 1920, "height": 1080},
            record_video_dir=str(scene_temp_dir),
            record_video_size={"width": 1920, "height": 1080}
        )
        # Suppress tour overlay permanently
        context.add_init_script("localStorage.setItem('mechg_tour_completed', 'true');")
        page = context.new_page()

        # Navigate
        page.goto(FRONTEND_URL, wait_until="domcontentloaded")
        page.wait_for_selector("text=Telemetry Input", timeout=5000)

        # Inject kinetic badge & cursor
        inject_ui_enhancements(
            page,
            badge_text="1. SNAP — GEMMA 4 MULTIMODAL (PRV-992-B)",
            badge_color="#22D3EE",
            badge_glow="rgba(34, 211, 238, 0.45)"
        )

        cur_x, cur_y = 400, 200
        page.evaluate(f"window.__setCursorPos({cur_x}, {cur_y})")
        time.sleep(0.8)

        # Select preset scenario "Proportional Relief Valve V2"
        preset_btn = page.locator("button:has-text('Proportional Relief Valve V2')").first
        cur_x, cur_y = click_locator_with_cursor(page, preset_btn, cur_x, cur_y, duration=0.5)
        time.sleep(0.4)

        # Highlight telemetry slider / pressure 210 bar
        slider_area = page.locator("text=210 bar")
        sbox = slider_area.bounding_box()
        if sbox:
            cur_x, cur_y = move_cursor_smoothly(page, cur_x, cur_y, sbox["x"] + sbox["width"]/2, sbox["y"] + sbox["height"]/2, steps=15, duration=0.4)
        time.sleep(0.4)

        # Move to "Run Hardware Diagnostic Evaluation" button
        diag_btn = page.locator("button:has-text('Run Hardware Diagnostic Evaluation')")
        cur_x, cur_y = click_locator_with_cursor(page, diag_btn, cur_x, cur_y, duration=0.5)

        # Wait for diagnostic result banner
        page.wait_for_selector("text=FAULT DETECTED", timeout=10000)
        time.sleep(0.3)

        # Move cursor to highlight Fault Detected banner and 96.0% confidence / PRV-992-B tag
        fault_tag = page.locator("text=FAULT DETECTED")
        fbox = fault_tag.bounding_box()
        if fbox:
            cur_x, cur_y = move_cursor_smoothly(page, cur_x, cur_y, fbox["x"] + 150, fbox["y"] + 20, steps=20, duration=0.6)

        # Hover over 96.0% confidence
        conf_tag = page.locator("text=96.0%")
        cbox = conf_tag.bounding_box()
        if cbox:
            cur_x, cur_y = move_cursor_smoothly(page, cur_x, cur_y, cbox["x"] + cbox["width"]/2, cbox["y"] + cbox["height"]/2, steps=15, duration=0.5)

        # Hold on completed view (total >= 8.5s)
        time.sleep(3.5)

        # Close page and context to finalize recording
        video_path = page.video.path()
        context.close()
        browser.close()

    output_path = SCENES_DIR / "scene_05.mp4"
    transcode_and_normalize(Path(video_path), output_path, target_duration=8.0)


def record_scene_06():
    """
    Scene 06 (9.0s): Step 2 — LOCK
    Pulsing amber OSHA 1910.147 Lockout/Tagout Gate banner triggers.
    Steps 2-4 hard-locked at 40% opacity. Click "Sign OSHA Safety Gate".
    Safety modal opens: badge ID TECH-8842-OFFSHORE, check 0 PSI bleed and
    480V ACB breaker lockout, click "Confirm & Unlock Remediation Steps".
    Gate transforms to glowing emerald "VERIFIED".
    Kinetic badge: "2. LOCK — OSHA 1910.147 ZERO ENERGY GATE"
    """
    print("\n" + "=" * 60)
    print("[*] RECORDING SCENE 06: Step 2 — LOCK (9.0s)")
    print("=" * 60)
    scene_temp_dir = TEMP_DIR / "s06"
    scene_temp_dir.mkdir(parents=True, exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(
            executable_path=CHROME_PATH,
            headless=True,
            args=["--no-sandbox", "--disable-infobars", "--window-size=1920,1080"]
        )
        context = browser.new_context(
            viewport={"width": 1920, "height": 1080},
            record_video_dir=str(scene_temp_dir),
            record_video_size={"width": 1920, "height": 1080}
        )
        context.add_init_script("localStorage.setItem('mechg_tour_completed', 'true');")
        page = context.new_page()

        # Navigate and set up diagnostic state
        page.goto(FRONTEND_URL, wait_until="domcontentloaded")
        page.wait_for_selector("text=Telemetry Input", timeout=5000)

        # Trigger diagnostic evaluation
        diag_btn = page.locator("button:has-text('Run Hardware Diagnostic Evaluation')")
        diag_btn.click(force=True)
        page.wait_for_selector("text=FAULT DETECTED", timeout=10000)

        # Inject kinetic badge & cursor for Scene 6
        inject_ui_enhancements(
            page,
            badge_text="2. LOCK — OSHA 1910.147 ZERO ENERGY GATE",
            badge_color="#F59E0B",
            badge_glow="rgba(245, 158, 11, 0.45)"
        )

        cur_x, cur_y = 1100, 250
        page.evaluate(f"window.__setCursorPos({cur_x}, {cur_y})")
        time.sleep(0.8)

        # Cursor hovers over locked step 2 showing hard-locked opacity 40%
        step2 = page.locator("text=Loosen 4x M10 hex socket head cap screws")
        s2box = step2.bounding_box()
        if s2box:
            cur_x, cur_y = move_cursor_smoothly(page, cur_x, cur_y, s2box["x"] + 100, s2box["y"] + 20, steps=18, duration=0.6)
        time.sleep(0.5)

        # Cursor moves up to amber button "Sign OSHA Safety Gate"
        sign_btn = page.locator("button:has-text('Sign OSHA Safety Gate')")
        cur_x, cur_y = click_locator_with_cursor(page, sign_btn, cur_x, cur_y, duration=0.5)

        # Wait for modal
        page.wait_for_selector("text=OSHA 1910.147 Safety Gate Authorization", timeout=5000)
        time.sleep(0.5)

        # Check Checkbox 1: 0 PSI bleed
        cb1 = page.locator("input[type='checkbox']").nth(0)
        cur_x, cur_y = click_locator_with_cursor(page, cb1, cur_x, cur_y, duration=0.5)
        time.sleep(0.4)

        # Check Checkbox 2: 480V ACB breaker lockout
        cb2 = page.locator("input[type='checkbox']").nth(1)
        cur_x, cur_y = click_locator_with_cursor(page, cb2, cur_x, cur_y, duration=0.5)
        time.sleep(0.4)

        # Click "Confirm & Unlock Remediation Steps"
        confirm_btn = page.locator("button:has-text('Confirm & Unlock Remediation Steps')")
        cur_x, cur_y = click_locator_with_cursor(page, confirm_btn, cur_x, cur_y, duration=0.5)

        # Wait for gate transition to VERIFIED
        page.wait_for_selector("text=VERIFIED BY TECH-8842-OFFSHORE", timeout=10000)

        # Cursor glides to the glowing emerald gate
        gate_header = page.locator("text=VERIFIED BY TECH-8842-OFFSHORE")
        gbox = gate_header.bounding_box()
        if gbox:
            cur_x, cur_y = move_cursor_smoothly(page, cur_x, cur_y, gbox["x"] + 50, gbox["y"] + 10, steps=15, duration=0.5)

        # Hold on verified gate view (total >= 9.5s)
        time.sleep(3.2)

        video_path = page.video.path()
        context.close()
        browser.close()

    output_path = SCENES_DIR / "scene_06.mp4"
    transcode_and_normalize(Path(video_path), output_path, target_duration=9.0)


def record_scene_07():
    """
    Scene 07 (9.0s): Step 3 — FIX & VERIFY
    Procedural repair checklist unlocks. Highlight Step 4 with calibrated torque spec:
    "35 Nm (M10 Class 10.9 in 3 passes: 15, 25, 35 Nm)".
    Click citation chip [^components/proportional_relief_valve_v2.md#specifications].
    Evidence Drawer modal slides out displaying verbatim AST-verified markdown text.
    Kinetic badge: "3. FIX & VERIFY — 35 Nm CALIBRATED TORQUE & AST EVIDENCE DRAWER"
    """
    print("\n" + "=" * 60)
    print("[*] RECORDING SCENE 07: Step 3 — FIX & VERIFY (9.0s)")
    print("=" * 60)
    scene_temp_dir = TEMP_DIR / "s07"
    scene_temp_dir.mkdir(parents=True, exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(
            executable_path=CHROME_PATH,
            headless=True,
            args=["--no-sandbox", "--disable-infobars", "--window-size=1920,1080"]
        )
        context = browser.new_context(
            viewport={"width": 1920, "height": 1080},
            record_video_dir=str(scene_temp_dir),
            record_video_size={"width": 1920, "height": 1080}
        )
        context.add_init_script("localStorage.setItem('mechg_tour_completed', 'true');")
        page = context.new_page()

        # Navigate and set up diagnostic + safety acknowledged state
        page.goto(FRONTEND_URL, wait_until="domcontentloaded")
        page.wait_for_selector("text=Telemetry Input", timeout=5000)

        # Run diagnosis
        diag_btn = page.locator("button:has-text('Run Hardware Diagnostic Evaluation')")
        diag_btn.click(force=True)
        page.wait_for_selector("text=FAULT DETECTED", timeout=10000)

        # Unlock safety gate
        sign_btn = page.locator("button:has-text('Sign OSHA Safety Gate')")
        sign_btn.click(force=True)
        page.wait_for_selector("text=OSHA 1910.147 Safety Gate Authorization", timeout=5000)
        cbs = page.locator("input[type='checkbox']")
        for i in range(cbs.count()):
            cbs.nth(i).check()
        confirm_btn = page.locator("button:has-text('Confirm & Unlock Remediation Steps')")
        confirm_btn.click(force=True)
        page.wait_for_selector("text=VERIFIED BY TECH-8842-OFFSHORE", timeout=10000)

        # Inject kinetic badge & cursor for Scene 7
        inject_ui_enhancements(
            page,
            badge_text="3. FIX & VERIFY — 35 Nm CALIBRATED TORQUE & AST EVIDENCE DRAWER",
            badge_color="#10B981",
            badge_glow="rgba(16, 185, 129, 0.45)"
        )

        cur_x, cur_y = 1200, 300
        page.evaluate(f"window.__setCursorPos({cur_x}, {cur_y})")
        time.sleep(0.8)

        # Focus on Step 4 calibrated torque badge
        step4_torque = page.locator("text=TORQUE: 35 Nm").last
        tbox = step4_torque.bounding_box()
        if tbox:
            cur_x, cur_y = move_cursor_smoothly(page, cur_x, cur_y, tbox["x"] + tbox["width"]/2, tbox["y"] + tbox["height"]/2, steps=20, duration=0.6)
        time.sleep(0.6)

        # Toggle Step 4 checkbox to mark completed
        step4_item = page.locator("text=Seat valve flush into manifold")
        cur_x, cur_y = click_locator_with_cursor(page, step4_item, cur_x, cur_y, duration=0.5)
        time.sleep(0.5)

        # Move cursor down to Citation Chip: [^components/proportional_relief_valve_v2.md#specifications]
        citation_chip = page.locator("button:has-text('proportional_relief_valve_v2.md')")
        cur_x, cur_y = click_locator_with_cursor(page, citation_chip, cur_x, cur_y, duration=0.5)

        # Wait for Citation Verification Details Modal
        page.wait_for_selector("text=Citation Verification Details", timeout=5000)
        time.sleep(0.4)

        # Cursor moves to highlight the verified 35 Nm source excerpt
        excerpt = page.locator("text=Fastener Torque: 35 Nm")
        ebox = excerpt.bounding_box()
        if ebox:
            cur_x, cur_y = move_cursor_smoothly(page, cur_x, cur_y, ebox["x"] + 150, ebox["y"] + 25, steps=20, duration=0.6)

        # Hold on Citation Details Modal (total >= 9.5s)
        time.sleep(3.5)

        video_path = page.video.path()
        context.close()
        browser.close()

    output_path = SCENES_DIR / "scene_07.mp4"
    transcode_and_normalize(Path(video_path), output_path, target_duration=9.0)


def verify_all_scenes():
    """Validates generated MP4s with ffprobe."""
    print("\n" + "=" * 60)
    print("[*] VERIFYING GENERATED SCENES WITH FFPROBE")
    print("=" * 60)
    scenes = [
        ("scene_05.mp4", 8.0),
        ("scene_06.mp4", 9.0),
        ("scene_07.mp4", 9.0),
    ]

    for fname, exp_dur in scenes:
        fpath = SCENES_DIR / fname
        if not fpath.exists():
            print(f"[-] ERROR: {fname} does not exist!")
            continue

        cmd = [
            "ffprobe",
            "-v", "error",
            "-select_streams", "v:0",
            "-show_entries", "stream=width,height,r_frame_rate,duration,codec_name,pix_fmt,nb_frames",
            "-of", "default=noprint_wrappers=1:nokey=0",
            str(fpath)
        ]
        res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        print(f"\n--- {fname} (Target: {exp_dur}s, 1920x1080 @ 30fps) ---")
        print(res.stdout.strip())


if __name__ == "__main__":
    t0 = time.time()
    record_scene_05()
    record_scene_06()
    record_scene_07()
    verify_all_scenes()
    print(f"\n[✓] All walkthrough scenes recorded and verified in {time.time() - t0:.1f}s.")
