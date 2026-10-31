"""
MECH-G / GemmaOps Motion Graphics Video Renderer
Renders high-impact industrial motion design scenes (Scenes 01, 02, 03, 04, 08, 09)
using Playwright headless Chromium and FFmpeg image2pipe.

Specifications:
- Resolution: 1920x1080 (16:9)
- Framerate: 30 fps CFR
- Codec: H.264 (libx264, yuv420p, high profile, level 4.0)
- Exact Durations:
  * scene_01.mp4: 10.0s (300 frames)
  * scene_02.mp4: 8.0s (240 frames)
  * scene_03.mp4: 8.0s (240 frames)
  * scene_04.mp4: 8.0s (240 frames)
  * scene_08.mp4: 10.0s (300 frames)
  * scene_09.mp4: 6.0s (180 frames)
"""

import os
import sys
import time
import base64
import subprocess
from playwright.sync_api import sync_playwright

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
VIDEO_DIR = os.path.join(BASE_DIR, "video")
SCENES_DIR = os.path.join(VIDEO_DIR, "scenes")
SCRIPTS_DIR = os.path.join(VIDEO_DIR, "scripts")
BRAND_DIR = os.path.join(BASE_DIR, "frontend", "public", "brand")
SAMPLES_DIR = os.path.join(BASE_DIR, "frontend", "public", "samples")

os.makedirs(SCENES_DIR, exist_ok=True)
os.makedirs(SCRIPTS_DIR, exist_ok=True)

def get_base64_asset(filepath):
    if os.path.exists(filepath):
        with open(filepath, "rb") as f:
            return base64.b64encode(f.read()).decode("utf-8")
    return ""

MASCOT_HERO_B64 = get_base64_asset(os.path.join(BRAND_DIR, "mascot-hero.webp"))
VALVE_LEAK_B64 = get_base64_asset(os.path.join(SAMPLES_DIR, "sample_valve_leak.webp"))

# Shared CSS styles for industrial dark HUD aesthetic
COMMON_HEAD = """
<head>
  <meta charset="UTF-8">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: 1920px;
      height: 1080px;
      overflow: hidden;
      background: #08090C;
      color: #F3F4F6;
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
      position: relative;
    }
    .hud-corner {
      position: absolute;
      width: 32px;
      height: 32px;
      border: 2px solid rgba(34, 211, 238, 0.4);
      pointer-events: none;
      z-index: 100;
    }
    .hud-corner.tl { top: 24px; left: 24px; border-right: none; border-bottom: none; }
    .hud-corner.tr { top: 24px; right: 24px; border-left: none; border-bottom: none; }
    .hud-corner.bl { bottom: 24px; left: 24px; border-right: none; border-top: none; }
    .hud-corner.br { bottom: 24px; right: 24px; border-left: none; border-top: none; }
    
    .hud-meta-bar {
      position: absolute;
      top: 32px;
      left: 72px;
      right: 72px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: 'Consolas', 'Courier New', monospace;
      font-size: 14px;
      letter-spacing: 0.15em;
      color: rgba(34, 211, 238, 0.7);
      z-index: 90;
      text-transform: uppercase;
      border-bottom: 1px solid rgba(34, 211, 238, 0.15);
      padding-bottom: 8px;
    }
    .hud-footer-bar {
      position: absolute;
      bottom: 32px;
      left: 72px;
      right: 72px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: 'Consolas', monospace;
      font-size: 13px;
      letter-spacing: 0.12em;
      color: rgba(156, 163, 175, 0.7);
      z-index: 90;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding-top: 8px;
    }
    .pill {
      display: inline-flex;
      align-items: center;
      padding: 6px 16px;
      border-radius: 9999px;
      font-weight: 700;
      font-size: 14px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .pill-red {
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid #EF4444;
      color: #FCA5A5;
    }
    .pill-cyan {
      background: rgba(34, 211, 238, 0.15);
      border: 1px solid #22D3EE;
      color: #22D3EE;
    }
    .pill-amber {
      background: rgba(245, 158, 11, 0.15);
      border: 1px solid #F59E0B;
      color: #FCD34D;
    }
    .pill-lime {
      background: rgba(191, 255, 98, 0.15);
      border: 1px solid #BFFF62;
      color: #BFFF62;
    }
  </style>
</head>
"""

# ==============================================================================
# SCENE 01: Act 1 Nacelle Reality (10.0s)
# ==============================================================================
def get_scene_01_html():
    return f"""<!DOCTYPE html>
<html>
{COMMON_HEAD}
<style>
  #canvas-bg {{
    position: absolute;
    top: 0; left: 0;
    width: 1920px; height: 1080px;
    z-index: 10;
  }}
  .telemetry-grid {{
    position: absolute;
    top: 100px; right: 80px;
    background: rgba(13, 16, 23, 0.85);
    border: 1px solid rgba(34, 211, 238, 0.3);
    border-radius: 8px;
    padding: 24px;
    width: 440px;
    z-index: 50;
    backdrop-filter: blur(8px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.6);
  }}
  .telemetry-row {{
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    font-family: 'Consolas', monospace;
    font-size: 15px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    padding-bottom: 6px;
  }}
  .telemetry-label {{ color: #9CA3AF; }}
  .telemetry-val {{ color: #22D3EE; font-weight: bold; }}
  .telemetry-val.warn {{ color: #F59E0B; }}
  .telemetry-val.danger {{ color: #EF4444; }}

  .kinetic-box {{
    position: absolute;
    bottom: 140px; left: 100px;
    z-index: 60;
  }}
  .k-sub {{
    font-family: 'Consolas', monospace;
    font-size: 20px;
    letter-spacing: 0.2em;
    color: #22D3EE;
    margin-bottom: 12px;
    text-transform: uppercase;
  }}
  .k-main {{
    font-size: 88px;
    font-weight: 900;
    line-height: 1.0;
    letter-spacing: -0.02em;
    text-transform: uppercase;
    text-shadow: 0 4px 20px rgba(0,0,0,0.8);
  }}
  .k-desc {{
    font-size: 24px;
    color: #D1D5DB;
    margin-top: 16px;
    max-width: 800px;
    line-height: 1.4;
  }}
</style>
<body>
  <div class="hud-corner tl"></div>
  <div class="hud-corner tr"></div>
  <div class="hud-corner bl"></div>
  <div class="hud-corner br"></div>

  <div class="hud-meta-bar">
    <div>OFFSHORE SECTOR 4B // LAT 56°14'N LONG 03°22'E</div>
    <div>ASSET: VESTAS V112-3.45 MW NACELLE</div>
    <div id="hud-signal" class="pill pill-red">NO CELL CARRIER</div>
  </div>

  <canvas id="canvas-bg" width="1920" height="1080"></canvas>

  <div class="telemetry-grid">
    <div style="font-family:'Consolas',monospace;font-size:13px;color:#22D3EE;margin-bottom:14px;letter-spacing:0.1em;">
      [LIVE NACELLE TELEMETRY // CAN-BUS]
    </div>
    <div class="telemetry-row">
      <span class="telemetry-label">ELEVATION (HUB):</span>
      <span class="telemetry-val" id="t-alt">102.4 M</span>
    </div>
    <div class="telemetry-row">
      <span class="telemetry-label">AMBIENT AIR TEMP:</span>
      <span class="telemetry-val danger" id="t-temp">-15.2 °C</span>
    </div>
    <div class="telemetry-row">
      <span class="telemetry-label">GUST VELOCITY:</span>
      <span class="telemetry-val" id="t-wind">18.6 M/S</span>
    </div>
    <div class="telemetry-row">
      <span class="telemetry-label">HYDRAULIC MANIFOLD:</span>
      <span class="telemetry-val warn" id="t-press">210.4 BAR</span>
    </div>
    <div class="telemetry-row">
      <span class="telemetry-label">RESERVOIR FLUID TEMP:</span>
      <span class="telemetry-val warn">68.2 °C</span>
    </div>
    <div class="telemetry-row" style="border:none;margin-bottom:0;">
      <span class="telemetry-label">EDGE CONNECTION:</span>
      <span class="telemetry-val danger" id="t-conn">AIR-GAPPED (0 KBPS)</span>
    </div>
  </div>

  <div class="kinetic-box">
    <div class="k-sub" id="k-sub">ACT 1: THE FRONTLINE REALITY</div>
    <div class="k-main" id="k-main">100 METERS UP</div>
    <div class="k-desc" id="k-desc">Suspended in the freezing Atlantic mist, hydraulic oil weeping past high-pressure fittings.</div>
  </div>

  <div class="hud-footer-bar">
    <div>MECH-G FIELD DIAGNOSTIC ENGINE v4.2</div>
    <div id="hud-timecode">FRAME 000 // T+0.00s</div>
    <div>HARDWARE HARNESS: PRV-992-B</div>
  </div>

  <script>
    const canvas = document.getElementById('canvas-bg');
    const ctx = canvas.getContext('2d');

    // Particle field for arctic sleet
    const particles = [];
    for (let i = 0; i < 350; i++) {{
      particles.push({{
        x: Math.random() * 1920,
        y: Math.random() * 1080,
        len: 12 + Math.random() * 24,
        speedX: -12 - Math.random() * 10,
        speedY: 10 + Math.random() * 8,
        alpha: 0.2 + Math.random() * 0.6
      }});
    }}

    window.renderFrame = function(t, f, total) {{
      document.getElementById('hud-timecode').innerText = 'FRAME ' + String(f).padStart(3, '0') + ' // T+' + t.toFixed(2) + 's';
      
      // Clear background
      ctx.fillStyle = '#06080D';
      ctx.fillRect(0, 0, 1920, 1080);

      // Distant ocean storm gradient
      const grad = ctx.createLinearGradient(0, 0, 0, 1080);
      grad.addColorStop(0, '#04060A');
      grad.addColorStop(0.65, '#0B1320');
      grad.addColorStop(1, '#050912');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1920, 1080);

      // Ocean swell waves at horizon
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.12)';
      ctx.lineWidth = 2;
      for (let w = 0; w < 4; w++) {{
        ctx.beginPath();
        const waveY = 820 + w * 45;
        for (let x = 0; x <= 1920; x += 30) {{
          const yOffset = Math.sin(x * 0.008 + t * 2.5 + w) * 14;
          if (x === 0) ctx.moveTo(x, waveY + yOffset);
          else ctx.lineTo(x, waveY + yOffset);
        }}
        ctx.stroke();
      }}

      // Wind turbine silhouette (Tower and rotating hub)
      const towerBaseX = 720;
      const hubX = 720;
      const hubY = 320;

      // Tower
      ctx.fillStyle = '#0E131C';
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(towerBaseX - 35, 960);
      ctx.lineTo(hubX - 16, hubY);
      ctx.lineTo(hubX + 16, hubY);
      ctx.lineTo(towerBaseX + 35, 960);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Nacelle housing
      ctx.fillStyle = '#161D2B';
      ctx.beginPath();
      ctx.roundRect(hubX - 35, hubY - 22, 110, 44, 8);
      ctx.fill();
      ctx.stroke();

      // Red aviation beacon flashing on nacelle top
      const beaconFlash = (Math.sin(t * 4.0) > 0.4) ? 1 : 0.15;
      ctx.fillStyle = 'rgba(239, 68, 68, ' + beaconFlash + ')';
      ctx.beginPath();
      ctx.arc(hubX + 60, hubY - 25, 7, 0, Math.PI * 2);
      ctx.fill();
      if (beaconFlash > 0.5) {{
        ctx.fillStyle = 'rgba(239, 68, 68, 0.3)';
        ctx.beginPath();
        ctx.arc(hubX + 60, hubY - 25, 22, 0, Math.PI * 2);
        ctx.fill();
      }}

      // 3 Blades rotating
      const bladeAngle = t * 1.8; // ~17 RPM
      for (let b = 0; b < 3; b++) {{
        const angle = bladeAngle + (b * Math.PI * 2 / 3);
        const bladeLen = 290;
        const tipX = hubX + Math.cos(angle) * bladeLen;
        const tipY = hubY + Math.sin(angle) * bladeLen;

        ctx.strokeStyle = 'rgba(180, 200, 225, 0.9)';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(hubX, hubY);
        ctx.lineTo(tipX, tipY);
        ctx.stroke();

        // Red hazard stripes on blade tips
        ctx.strokeStyle = '#EF4444';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(hubX + Math.cos(angle) * (bladeLen - 30), hubY + Math.sin(angle) * (bladeLen - 30));
        ctx.lineTo(tipX, tipY);
        ctx.stroke();
      }}

      // Hub center cap
      ctx.fillStyle = '#22D3EE';
      ctx.beginPath();
      ctx.arc(hubX, hubY, 14, 0, Math.PI * 2);
      ctx.fill();

      // Targeting reticle around nacelle
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(hubX, hubY, 70, 0, Math.PI * 2);
      ctx.stroke();

      // Reticle tick marks
      ctx.beginPath();
      ctx.moveTo(hubX - 85, hubY); ctx.lineTo(hubX - 70, hubY);
      ctx.moveTo(hubX + 70, hubY); ctx.lineTo(hubX + 85, hubY);
      ctx.moveTo(hubX, hubY - 85); ctx.lineTo(hubX, hubY - 70);
      ctx.moveTo(hubX, hubY + 70); ctx.lineTo(hubX, hubY + 85);
      ctx.stroke();

      // Render drifting arctic sleet
      ctx.strokeStyle = 'rgba(215, 240, 255, 0.6)';
      ctx.lineWidth = 1.2;
      for (let p of particles) {{
        const px = (p.x + p.speedX * t * 25) % 1920;
        const py = (p.y + p.speedY * t * 25) % 1080;
        const curX = (px < 0) ? px + 1920 : px;
        const curY = (py < 0) ? py + 1080 : py;

        ctx.beginPath();
        ctx.moveTo(curX, curY);
        ctx.lineTo(curX + p.speedX * 0.8, curY + p.speedY * 0.8);
        ctx.stroke();
      }}

      // Telemetry micro-jitter
      document.getElementById('t-wind').innerText = (18.2 + Math.sin(t * 3.1) * 1.4).toFixed(1) + ' M/S';
      document.getElementById('t-press').innerText = (210.0 + Math.sin(t * 4.5) * 1.2).toFixed(1) + ' BAR';

      // Kinetic typography transitions
      const kMain = document.getElementById('k-main');
      const kSub = document.getElementById('k-sub');
      const kDesc = document.getElementById('k-desc');

      if (t < 3.5) {{
        kSub.innerText = "ACT 1: THE FRONTLINE REALITY";
        kSub.style.color = "#22D3EE";
        kMain.innerText = "100 METERS UP";
        kMain.style.color = "#FFFFFF";
        kDesc.innerText = "Suspended inside an offshore turbine nacelle with weeping hydraulic oil and zero margin for error.";
      }} else if (t < 7.0) {{
        kSub.innerText = "ENVIRONMENTAL HAZARD";
        kSub.style.color = "#A5F3FC";
        kMain.innerText = "-15°C FREEZING";
        kMain.style.color = "#A5F3FC";
        kDesc.innerText = "Sub-zero arctic winds freeze grease and numb fingertips while navigating critical emergency repairs.";
      }} else {{
        kSub.innerText = "AIR-GAPPED REALITY";
        kSub.style.color = "#EF4444";
        kMain.innerText = "ZERO CELL SIGNAL";
        kMain.style.color = "#EF4444";
        kDesc.innerText = "Completely off-grid. No cloud connectivity. Generic RAG APIs return 0 bytes and timeout.";
      }}
    }};
  </script>
</body>
</html>"""

# ==============================================================================
# SCENE 02: Act 1 Manual Overhead & Downtime Ticker (8.0s)
# ==============================================================================
def get_scene_02_html():
    return f"""<!DOCTYPE html>
<html>
{COMMON_HEAD}
<style>
  #canvas-manual {{
    position: absolute;
    top: 0; left: 0;
    width: 1920px; height: 1080px;
    z-index: 10;
  }}
  .ticker-container {{
    position: absolute;
    bottom: 120px;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    background: rgba(15, 17, 24, 0.92);
    border: 2px solid rgba(244, 63, 94, 0.5);
    border-radius: 16px;
    padding: 36px 64px;
    box-shadow: 0 0 60px rgba(244, 63, 94, 0.25);
    z-index: 50;
    width: 1100px;
  }}
  .ticker-label {{
    font-family: 'Consolas', monospace;
    font-size: 22px;
    letter-spacing: 0.25em;
    color: #F87171;
    text-transform: uppercase;
    margin-bottom: 10px;
  }}
  .ticker-val {{
    font-family: 'Consolas', 'Segoe UI', monospace;
    font-size: 118px;
    font-weight: 900;
    color: #F43F5E;
    text-shadow: 0 0 40px rgba(244, 63, 94, 0.7);
    letter-spacing: -0.02em;
    line-height: 1.0;
  }}
  .ticker-sub {{
    margin-top: 14px;
    font-size: 20px;
    color: #D1D5DB;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }}
  .header-card {{
    position: absolute;
    top: 90px;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    z-index: 50;
  }}
  .header-title {{
    font-size: 64px;
    font-weight: 900;
    color: #FFFFFF;
    text-transform: uppercase;
    letter-spacing: -0.01em;
  }}
  .header-sub {{
    font-family: 'Consolas', monospace;
    font-size: 20px;
    color: #F59E0B;
    letter-spacing: 0.15em;
    margin-top: 8px;
  }}
</style>
<body>
  <div class="hud-corner tl"></div>
  <div class="hud-corner tr"></div>
  <div class="hud-corner bl"></div>
  <div class="hud-corner br"></div>

  <div class="hud-meta-bar">
    <div>INCIDENT: UNPLANNED YAW SYSTEM SHUTDOWN</div>
    <div>OEM SPECIFICATION: VESTAS V112 HYDRAULICS</div>
    <div class="pill pill-red">SEVERITY 1 CRITICAL</div>
  </div>

  <div class="header-card">
    <div class="header-title">4,000-PAGE OEM MANUALS</div>
    <div class="header-sub">GREASY GLOVES &middot; SCATTERED PDF SCHEMATICS &middot; ZERO TIME</div>
  </div>

  <canvas id="canvas-manual" width="1920" height="1080"></canvas>

  <div class="ticker-container">
    <div class="ticker-label">&gt;&gt;&gt; RUNAWAY INDUSTRIAL DOWNTIME COST &gt;&gt;&gt;</div>
    <div class="ticker-val" id="ticker-number">$0 / HR</div>
    <div class="ticker-sub">PRODUCTION HALTED &bull; 3.45 MW CAPACITY OFFLINE &bull; FIELD CREW ON CLOCK</div>
  </div>

  <div class="hud-footer-bar">
    <div>MECH-G REASONING BENCHMARK // ACT 1 SCENE 2</div>
    <div id="hud-timecode">FRAME 000 // T+0.00s</div>
    <div>ALARM: PITCH PRESSURE BLEEDOUT DETECTED</div>
  </div>

  <script>
    const canvas = document.getElementById('canvas-manual');
    const ctx = canvas.getContext('2d');

    window.renderFrame = function(t, f, total) {{
      document.getElementById('hud-timecode').innerText = 'FRAME ' + String(f).padStart(3, '0') + ' // T+' + t.toFixed(2) + 's';

      ctx.fillStyle = '#08090C';
      ctx.fillRect(0, 0, 1920, 1080);

      // Blueprint grid
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < 1920; x += 60) {{
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 1080); ctx.stroke();
      }}
      for (let y = 0; y < 1080; y += 60) {{
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1920, y); ctx.stroke();
      }}

      // Rapidly flipping manual stack animation
      const stackCenterX = 960;
      const stackCenterY = 410;
      const numPages = 9;

      for (let i = numPages - 1; i >= 0; i--) {{
        const pageFlipProgress = Math.sin(t * 8.0 + i * 0.6);
        const offsetX = (i - 4) * 8;
        const offsetY = (i - 4) * 4;
        const rotation = pageFlipProgress * 0.08;

        ctx.save();
        ctx.translate(stackCenterX + offsetX, stackCenterY + offsetY);
        ctx.rotate(rotation);

        // Page card
        ctx.fillStyle = (i === 0) ? '#1E2536' : '#141824';
        ctx.strokeStyle = (i === 0) ? 'rgba(244, 63, 94, 0.6)' : 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-240, -140, 480, 280, 8);
        ctx.fill();
        ctx.stroke();

        // Technical schematic lines on page
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1.5;
        for (let l = 0; l < 5; l++) {{
          ctx.beginPath();
          ctx.moveTo(-200, -90 + l * 26);
          ctx.lineTo(-200 + 160 + (l % 2) * 80, -90 + l * 26);
          ctx.stroke();
        }}

        // Simulated CAD blueprint diagram on page
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.4)';
        ctx.beginPath();
        ctx.arc(100, -20, 45, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeRect(60, 40, 80, 30);

        // Page watermark stamp
        ctx.font = 'bold 12px Consolas';
        ctx.fillStyle = 'rgba(244, 63, 94, 0.7)';
        ctx.fillText('OEM DOC SEC 14.8.2 // PG ' + (1240 + i * 148), -200, 100);

        ctx.restore();
      }}

      // Circular ticking stopwatch on right
      const clockX = 1620;
      const clockY = 410;
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.5)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(clockX, clockY, 90, 0, Math.PI * 2);
      ctx.stroke();

      // Tick marks
      for (let a = 0; a < 12; a++) {{
        const angle = a * Math.PI / 6;
        ctx.beginPath();
        ctx.moveTo(clockX + Math.cos(angle) * 75, clockY + Math.sin(angle) * 75);
        ctx.lineTo(clockX + Math.cos(angle) * 85, clockY + Math.sin(angle) * 85);
        ctx.stroke();
      }}

      // Clock needle accelerating
      const needleAngle = -Math.PI / 2 + t * 4.5;
      ctx.strokeStyle = '#F43F5E';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(clockX, clockY);
      ctx.lineTo(clockX + Math.cos(needleAngle) * 70, clockY + Math.sin(needleAngle) * 70);
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(clockX, clockY, 6, 0, Math.PI * 2);
      ctx.fill();

      // Escalating downtime ticker calculation
      // Ramps from $0 to $30,000 across 8.0s (saturates near 6.0s)
      const progress = Math.min(1.0, t / 6.0);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentDollars = Math.round(eased * 30000);
      const formattedDollars = '$' + currentDollars.toLocaleString('en-US') + ' / HOUR';

      const tickerEl = document.getElementById('ticker-number');
      tickerEl.innerText = formattedDollars;

      // Pulse red glow as cost rises
      if (t > 5.5) {{
        tickerEl.style.color = (Math.sin(t * 12) > 0) ? '#FF2244' : '#F43F5E';
      }}
    }};
  </script>
</body>
</html>"""

# ==============================================================================
# SCENE 03: Act 2 Generic Cloud RAG Failure (8.0s)
# ==============================================================================
def get_scene_03_html():
    return f"""<!DOCTYPE html>
<html>
{COMMON_HEAD}
<style>
  #canvas-rag {{
    position: absolute;
    top: 0; left: 0;
    width: 1920px; height: 1080px;
    z-index: 10;
  }}
  .hazard-banner {{
    position: absolute;
    top: 90px;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    background: rgba(239, 68, 68, 0.15);
    border: 2px solid #EF4444;
    border-radius: 12px;
    padding: 20px 48px;
    z-index: 50;
    backdrop-filter: blur(8px);
  }}
  .hb-title {{
    font-size: 56px;
    font-weight: 900;
    color: #EF4444;
    text-transform: uppercase;
    letter-spacing: 0.02em;
    text-shadow: 0 0 30px rgba(239, 68, 68, 0.6);
  }}
  .hb-sub {{
    font-family: 'Consolas', monospace;
    font-size: 20px;
    color: #FCA5A5;
    letter-spacing: 0.15em;
    margin-top: 6px;
    text-transform: uppercase;
  }}
  .split-explainer {{
    position: absolute;
    bottom: 110px;
    left: 120px;
    right: 120px;
    display: flex;
    justify-content: space-between;
    z-index: 60;
  }}
  .explain-card {{
    flex: 1;
    margin: 0 16px;
    background: rgba(18, 20, 28, 0.9);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  }}
  .explain-card.danger {{
    border-color: rgba(239, 68, 68, 0.5);
    background: rgba(35, 15, 20, 0.9);
  }}
  .ec-badge {{
    font-family: 'Consolas', monospace;
    font-size: 13px;
    font-weight: bold;
    letter-spacing: 0.1em;
    margin-bottom: 8px;
  }}
  .ec-title {{
    font-size: 24px;
    font-weight: 800;
    margin-bottom: 8px;
  }}
  .ec-desc {{
    font-size: 16px;
    color: #9CA3AF;
    line-height: 1.4;
  }}
</style>
<body>
  <div class="hud-corner tl"></div>
  <div class="hud-corner tr"></div>
  <div class="hud-corner bl"></div>
  <div class="hud-corner br"></div>

  <div class="hud-meta-bar">
    <div>RAG ARCHITECTURE AUDIT // FAILURE MODE ANALYSIS</div>
    <div>PROTOCOL: REST API / REMOTE EMBEDDINGS</div>
    <div class="pill pill-red">FATAL PIPELINE FAILURE</div>
  </div>

  <div class="hazard-banner">
    <div class="hb-title" id="hb-title">HTTP 504 GATEWAY TIMEOUT</div>
    <div class="hb-sub" id="hb-sub">GENERIC CLOUD RAG DROPS SAFETY INTERLOCKS OFFLINE</div>
  </div>

  <canvas id="canvas-rag" width="1920" height="1080"></canvas>

  <div class="split-explainer">
    <div class="explain-card danger">
      <div class="ec-badge" style="color:#EF4444;">FAILURE MODE 1: ZERO OFF-GRID RESILIENCE</div>
      <div class="ec-title" style="color:#FFFFFF;">Cloud APIs Dead on Arrival</div>
      <div class="ec-desc">Wind turbines, mining shafts, and offshore rigs operate in air-gapped isolation. Remote LLMs fail with immediate connection drop.</div>
    </div>
    <div class="explain-card danger">
      <div class="ec-badge" style="color:#F59E0B;">FAILURE MODE 2: UNSTRUCTURED CHUNKING</div>
      <div class="ec-title" style="color:#FFFFFF;">Safety Dependencies Severed</div>
      <div class="ec-desc">Na&iuml;ve vector chunking separates LOTO isolation prerequisites from torque execution steps, creating catastrophic physical hazards.</div>
    </div>
  </div>

  <div class="hud-footer-bar">
    <div>MECH-G DETERMINISTIC ENGINE // ACT 2 SCENE 1</div>
    <div id="hud-timecode">FRAME 000 // T+0.00s</div>
    <div>SAFETY INTERLOCK: OSHA 1910.147 DISCONNECTED</div>
  </div>

  <script>
    const canvas = document.getElementById('canvas-rag');
    const ctx = canvas.getContext('2d');

    // Cloud shattering particles
    const cloudParticles = [];
    for (let i = 0; i < 180; i++) {{
      const angle = Math.random() * Math.PI * 2;
      const speed = 40 + Math.random() * 220;
      cloudParticles.push({{
        x: 960,
        y: 390,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 7,
        alpha: 1.0
      }});
    }}

    window.renderFrame = function(t, f, total) {{
      document.getElementById('hud-timecode').innerText = 'FRAME ' + String(f).padStart(3, '0') + ' // T+' + t.toFixed(2) + 's';

      ctx.fillStyle = '#08090C';
      ctx.fillRect(0, 0, 1920, 1080);

      // Grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      for (let x = 0; x < 1920; x += 80) {{
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 1080); ctx.stroke();
      }}

      // Center Cloud Icon / Shatter effect
      const centerX = 960;
      const centerY = 390;

      if (t < 2.2) {{
        // Solid pulsing red cloud with warning icon
        const pulse = 1.0 + Math.sin(t * 8.0) * 0.05;
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.scale(pulse, pulse);

        ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
        ctx.strokeStyle = '#EF4444';
        ctx.lineWidth = 4;

        // Draw cloud outline
        ctx.beginPath();
        ctx.arc(-50, 0, 45, Math.PI * 0.5, Math.PI * 1.5);
        ctx.arc(0, -40, 55, Math.PI * 0.8, Math.PI * 2.2);
        ctx.arc(60, -10, 40, Math.PI * 1.3, Math.PI * 2.1);
        ctx.arc(80, 20, 35, Math.PI * 1.7, Math.PI * 0.4);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Broken lightning bolt through cloud
        ctx.strokeStyle = '#FDE047';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(10, -50);
        ctx.lineTo(-10, 0);
        ctx.lineTo(15, 10);
        ctx.lineTo(-5, 60);
        ctx.stroke();

        ctx.restore();
      }} else {{
        // Shattered digital dust flying outward
        const explodeTime = t - 2.2;
        ctx.fillStyle = '#EF4444';
        for (let p of cloudParticles) {{
          const curX = p.x + p.vx * explodeTime;
          const curY = p.y + p.vy * explodeTime;
          const alpha = Math.max(0, 1.0 - explodeTime * 0.35);
          ctx.fillStyle = 'rgba(239, 68, 68, ' + alpha + ')';
          ctx.fillRect(curX, curY, p.size, p.size);
        }}

        // Red glitch scanlines
        ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
        for (let g = 0; g < 6; g++) {{
          const gy = ((t * 400 + g * 120) % 600) + 200;
          ctx.fillRect(400, gy, 1120, 8);
        }}
      }}

      // Graph nodes & severed edges on left and right
      // Left: Node [LOTO ISOLATION]
      const n1X = 420; const n1Y = 390;
      ctx.fillStyle = '#1E2536';
      ctx.strokeStyle = '#22D3EE';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(n1X - 120, n1Y - 40, 240, 80, 8);
      ctx.fill();
      ctx.stroke();
      ctx.font = 'bold 16px Consolas';
      ctx.fillStyle = '#22D3EE';
      ctx.fillText('[CHUNK #4102]', n1X - 90, n1Y - 10);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('OSHA 1910.147 LOTO', n1X - 90, n1Y + 16);

      // Right: Node [TORQUE SPEC]
      const n2X = 1500; const n2Y = 390;
      ctx.fillStyle = '#1E2536';
      ctx.strokeStyle = '#22D3EE';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(n2X - 120, n2Y - 40, 240, 80, 8);
      ctx.fill();
      ctx.stroke();
      ctx.font = 'bold 16px Consolas';
      ctx.fillStyle = '#22D3EE';
      ctx.fillText('[CHUNK #4103]', n2X - 90, n2Y - 10);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('35 Nm FASTENER SPEC', n2X - 90, n2Y + 16);

      // Severed connection line in middle
      if (t < 2.5) {{
        // Connected
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.8)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(n1X + 120, n1Y);
        ctx.lineTo(n2X - 120, n2Y);
        ctx.stroke();
      }} else {{
        // Severed with spark gaps
        ctx.strokeStyle = '#EF4444';
        ctx.setLineDash([12, 12]);
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(n1X + 120, n1Y);
        ctx.lineTo(centerX - 100, n1Y);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(centerX + 100, n2Y);
        ctx.lineTo(n2X - 120, n2Y);
        ctx.stroke();
        ctx.setLineDash([]);

        // Red cross over broken link
        ctx.strokeStyle = '#EF4444';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(centerX - 30, centerY - 30);
        ctx.lineTo(centerX + 30, centerY + 30);
        ctx.moveTo(centerX + 30, centerY - 30);
        ctx.lineTo(centerX - 30, centerY + 30);
        ctx.stroke();

        ctx.font = 'bold 18px Consolas';
        ctx.fillStyle = '#EF4444';
        ctx.fillText('SAFETY INTERLOCK SEVERED', centerX - 130, centerY + 65);
      }}
    }};
  </script>
</body>
</html>"""

# ==============================================================================
# SCENE 04: Act 2 Torque Hallucination Risk (8.0s)
# ==============================================================================
def get_scene_04_html():
    return f"""<!DOCTYPE html>
<html>
{COMMON_HEAD}
<style>
  #canvas-torque {{
    position: absolute;
    top: 0; left: 0;
    width: 1920px; height: 1080px;
    z-index: 10;
  }}
  .split-container {{
    position: absolute;
    top: 100px; bottom: 150px;
    left: 80px; right: 80px;
    display: flex;
    gap: 40px;
    z-index: 50;
  }}
  .split-pane {{
    flex: 1;
    border-radius: 16px;
    padding: 36px;
    position: relative;
    backdrop-filter: blur(12px);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }}
  .pane-hazard {{
    background: rgba(35, 12, 16, 0.92);
    border: 2px solid #EF4444;
    box-shadow: 0 0 50px rgba(239, 68, 68, 0.2);
  }}
  .pane-oem {{
    background: rgba(10, 32, 24, 0.92);
    border: 2px solid #10B981;
    box-shadow: 0 0 50px rgba(16, 185, 129, 0.2);
  }}
  .pane-header {{
    font-family: 'Consolas', monospace;
    font-size: 16px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin-bottom: 8px;
  }}
  .stat-torque {{
    font-size: 88px;
    font-weight: 900;
    line-height: 1.0;
    margin: 8px 0;
    letter-spacing: -0.02em;
  }}
  .pane-desc {{
    font-size: 20px;
    line-height: 1.5;
    color: #D1D5DB;
  }}
  .strike {{
    text-decoration: line-through;
    text-decoration-color: #EF4444;
    text-decoration-thickness: 8px;
  }}
  .bottom-alert {{
    position: absolute;
    bottom: 45px;
    left: 80px; right: 80px;
    background: #EF4444;
    color: #FFFFFF;
    font-weight: 900;
    font-size: 24px;
    letter-spacing: 0.1em;
    text-align: center;
    padding: 16px;
    border-radius: 8px;
    z-index: 80;
    text-transform: uppercase;
    box-shadow: 0 0 30px rgba(239, 68, 68, 0.7);
  }}
</style>
<body>
  <div class="hud-corner tl"></div>
  <div class="hud-corner tr"></div>
  <div class="hud-corner bl"></div>
  <div class="hud-corner br"></div>

  <div class="hud-meta-bar">
    <div>PHYSICAL RISK COMPARISON // MANIFOLD INTEGRITY</div>
    <div>FASTENER: M10 CLASS 10.9 INTO CAST ALUMINUM</div>
    <div class="pill pill-red">CATASTROPHIC RISK LEVEL</div>
  </div>

  <canvas id="canvas-torque" width="1920" height="1080"></canvas>

  <div class="split-container">
    <!-- Left: Hallucinated 55 Nm -->
    <div class="split-pane pane-hazard">
      <div>
        <div class="pane-header" style="color:#FCA5A5;">GENERIC VECTOR RAG (HALLUCINATED)</div>
        <div class="stat-torque" style="color:#EF4444;" id="stat-hallucinated">55 Nm</div>
        <div class="pill pill-red" style="margin-bottom:16px;">+57% OVER-TORQUE HAZARD</div>
        <div class="pane-desc">
          Guessed torque strips M10 female threads in the soft aluminum manifold block. Flange tilts under 210 bar pressure, violently extruding the Viton O-ring seal.
        </div>
      </div>
      <div style="font-family:'Consolas',monospace;font-size:15px;color:#FCA5A5;border-top:1px solid rgba(239,68,68,0.3);padding-top:12px;">
        &gt; RESULT: EXPLOSIVE HYDRAULIC DISCHARGE &middot; FIRE RISK
      </div>
    </div>

    <!-- Right: OEM Spec 35 Nm -->
    <div class="split-pane pane-oem">
      <div>
        <div class="pane-header" style="color:#6EE7B7;">MECH-G DETERMINISTIC (OEM SPEC)</div>
        <div class="stat-torque" style="color:#10B981;">35 Nm</div>
        <div class="pill pill-lime" style="margin-bottom:16px;">CALIBRATED 3-PASS SEQUENCE</div>
        <div class="pane-desc">
          Cross-diagonal tightening in 3 incremental stages: 15 Nm &rarr; 25 Nm &rarr; final 35 Nm. Uniform clamp load prevents seal extrusion and thread galling.
        </div>
      </div>
      <div style="font-family:'Consolas',monospace;font-size:15px;color:#6EE7B7;border-top:1px solid rgba(16,185,129,0.3);padding-top:12px;">
        &gt; RESULT: 100% PRESSURE CONTAINMENT &middot; OSHA COMPLIANT
      </div>
    </div>
  </div>

  <div class="bottom-alert" id="bottom-alert">
    CRITICAL WARNING: 55 Nm DESTROYS THE FLANGE UNDER 210 BAR PRESSURE
  </div>

  <div class="hud-footer-bar" style="bottom:15px;">
    <div>MECH-G PRECISION PROTOCOL // ACT 2 SCENE 2</div>
    <div id="hud-timecode">FRAME 000 // T+0.00s</div>
    <div>PROOF: AST EVIDENCE CITATION PRV-992-B#SPEC</div>
  </div>

  <script>
    const canvas = document.getElementById('canvas-torque');
    const ctx = canvas.getContext('2d');

    window.renderFrame = function(t, f, total) {{
      document.getElementById('hud-timecode').innerText = 'FRAME ' + String(f).padStart(3, '0') + ' // T+' + t.toFixed(2) + 's';

      ctx.fillStyle = '#08090C';
      ctx.fillRect(0, 0, 1920, 1080);

      // Flash bottom alert
      const alertEl = document.getElementById('bottom-alert');
      const statHallucinated = document.getElementById('stat-hallucinated');

      if (t > 3.0) {{
        statHallucinated.className = 'stat-torque strike';
      }}

      if (t > 4.5) {{
        alertEl.style.background = (Math.sin(t * 10) > 0) ? '#DC2626' : '#991B1B';
      }}

      // Background technical schematics
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let y = 0; y < 1080; y += 40) {{
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1920, y); ctx.stroke();
      }}
    }};
  </script>
</body>
</html>"""

# ==============================================================================
# SCENE 08: Act 4 Empirical Metric Cards (10.0s)
# ==============================================================================
def get_scene_08_html():
    return f"""<!DOCTYPE html>
<html>
{COMMON_HEAD}
<style>
  .metric-deck {{
    position: absolute;
    top: 130px; bottom: 120px;
    left: 80px; right: 80px;
    display: flex;
    gap: 36px;
    z-index: 50;
  }}
  .m-card {{
    flex: 1;
    background: rgba(15, 18, 26, 0.95);
    border-radius: 20px;
    padding: 48px 40px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.6);
    position: relative;
    overflow: hidden;
    transition: transform 0.3s ease;
  }}
  .card-lime {{
    border: 2px solid #BFFF62;
    box-shadow: 0 0 50px rgba(191, 255, 98, 0.18);
  }}
  .card-cyan {{
    border: 2px solid #22D3EE;
    box-shadow: 0 0 50px rgba(34, 211, 238, 0.18);
  }}
  .card-amber {{
    border: 2px solid #F59E0B;
    box-shadow: 0 0 50px rgba(245, 158, 11, 0.18);
  }}
  .stat-big {{
    font-size: 104px;
    font-weight: 900;
    line-height: 0.95;
    letter-spacing: -0.03em;
    margin: 16px 0;
  }}
  .m-title {{
    font-size: 28px;
    font-weight: 900;
    color: #FFFFFF;
    text-transform: uppercase;
    letter-spacing: 0.02em;
    margin-bottom: 8px;
  }}
  .m-detail {{
    font-size: 18px;
    color: #9CA3AF;
    line-height: 1.4;
  }}
  .bar-bg {{
    width: 100%;
    height: 12px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    overflow: hidden;
    margin: 20px 0;
  }}
  .bar-fill {{
    height: 100%;
    border-radius: 6px;
  }}
</style>
<body>
  <div class="hud-corner tl"></div>
  <div class="hud-corner tr"></div>
  <div class="hud-corner bl"></div>
  <div class="hud-corner br"></div>

  <div class="hud-meta-bar">
    <div>BENCHMARK PROOF // FRONT-LINE INDUSTRIAL PERFORMANCE</div>
    <div>HARDWARE: EDGE INTEL/ARM ACCELERATOR</div>
    <div class="pill pill-lime">VERIFIED PRODUCTION METRICS</div>
  </div>

  <div class="metric-deck">
    <!-- Card 1: 84% MTTR -->
    <div class="m-card card-lime" id="card-1">
      <div>
        <div class="pill pill-lime">FIELD RECOVERY SPEED</div>
        <div class="stat-big" style="color:#BFFF62;" id="stat-1">84%</div>
        <div class="m-title">MTTR REDUCTION</div>
        <div class="m-detail">Mean Time to Repair slashes from 4.2 hours to under 40 minutes via deterministic guided triage.</div>
        <div class="bar-bg">
          <div class="bar-fill" id="bar-1" style="background:#BFFF62;width:84%;"></div>
        </div>
      </div>
      <div style="font-family:'Consolas',monospace;font-size:14px;color:#9CA3AF;">
        &gt; 4.2 HOURS &rarr; 40 MINUTES RECOVERY
      </div>
    </div>

    <!-- Card 2: < 500 ms Latency -->
    <div class="m-card card-cyan" id="card-2">
      <div>
        <div class="pill pill-cyan">EDGE COMPUTATION</div>
        <div class="stat-big" style="color:#22D3EE;" id="stat-2">&lt; 500 ms</div>
        <div class="m-title">GRAPH LATENCY</div>
        <div class="m-detail">In-memory NetworkX directed graph traversals execute sub-millisecond AST lookups directly in local RAM.</div>
        <div class="bar-bg">
          <div class="bar-fill" id="bar-2" style="background:#22D3EE;width:95%;"></div>
        </div>
      </div>
      <div style="font-family:'Consolas',monospace;font-size:14px;color:#9CA3AF;">
        &gt; SUB-MILLISECOND EDGE LOOKUP IN RAM
      </div>
    </div>

    <!-- Card 3: 100% Offline -->
    <div class="m-card card-amber" id="card-3">
      <div>
        <div class="pill pill-amber">ZERO CLOUD DEPENDENCY</div>
        <div class="stat-big" style="color:#F59E0B;" id="stat-3">100%</div>
        <div class="m-title">AIR-GAPPED &amp; OFFLINE</div>
        <div class="m-detail">Native on-device Google Gemma 4 vision and AST citation auditor require zero external internet egress.</div>
        <div class="bar-bg">
          <div class="bar-fill" id="bar-3" style="background:#F59E0B;width:100%;"></div>
        </div>
      </div>
      <div style="font-family:'Consolas',monospace;font-size:14px;color:#9CA3AF;">
        &gt; 0 BYTES EGRESS &middot; TOTAL SOVEREIGNTY
      </div>
    </div>
  </div>

  <div class="hud-footer-bar">
    <div>MECH-G PERFORMANCE AUDIT // ACT 4 SCENE 1</div>
    <div id="hud-timecode">FRAME 000 // T+0.00s</div>
    <div>BENCHMARK VALIDATION: 100% TEST PASS</div>
  </div>

  <script>
    window.renderFrame = function(t, f, total) {{
      document.getElementById('hud-timecode').innerText = 'FRAME ' + String(f).padStart(3, '0') + ' // T+' + t.toFixed(2) + 's';

      const c1 = document.getElementById('card-1');
      const c2 = document.getElementById('card-2');
      const c3 = document.getElementById('card-3');

      // Sequential slam entrance
      // Card 1: 0.0s - 0.6s
      const p1 = Math.min(1.0, Math.max(0.0, t / 0.6));
      c1.style.opacity = p1;
      c1.style.transform = 'translateY(' + ((1 - p1) * 80) + 'px)';

      // Card 2: 3.0s - 3.6s
      const p2 = Math.min(1.0, Math.max(0.0, (t - 3.0) / 0.6));
      c2.style.opacity = p2;
      c2.style.transform = 'translateY(' + ((1 - p2) * 80) + 'px)';

      // Card 3: 6.0s - 6.6s
      const p3 = Math.min(1.0, Math.max(0.0, (t - 6.0) / 0.6));
      c3.style.opacity = p3;
      c3.style.transform = 'translateY(' + ((1 - p3) * 80) + 'px)';

      // Animated counter for Card 1
      if (t < 2.0) {{
        const cnt = Math.round((t / 2.0) * 84);
        document.getElementById('stat-1').innerText = cnt + '%';
      }} else {{
        document.getElementById('stat-1').innerText = '84%';
      }}
    }};
  </script>
</body>
</html>"""

# ==============================================================================
# SCENE 09: Act 4 MECH-G Pitch Close & Lockup (6.0s)
# ==============================================================================
def get_scene_09_html():
    mascot_img_tag = f'<img src="data:image/webp;base64,{MASCOT_HERO_B64}" style="width:240px;height:240px;object-fit:contain;filter:drop-shadow(0 0 40px rgba(34,211,238,0.5));">' if MASCOT_HERO_B64 else '<div style="font-size:90px;">🛡️</div>'

    return f"""<!DOCTYPE html>
<html>
{COMMON_HEAD}
<style>
  .lockup-container {{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    z-index: 50;
    width: 1300px;
  }}
  .logo-title {{
    font-size: 104px;
    font-weight: 900;
    letter-spacing: -0.02em;
    color: #FFFFFF;
    text-transform: uppercase;
    margin-top: 16px;
    background: linear-gradient(135deg, #FFFFFF 0%, #22D3EE 60%, #10B981 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    line-height: 1.0;
  }}
  .logo-tagline {{
    font-family: 'Consolas', monospace;
    font-size: 32px;
    font-weight: bold;
    letter-spacing: 0.25em;
    color: #22D3EE;
    text-transform: uppercase;
    margin-top: 16px;
    text-shadow: 0 0 20px rgba(34, 211, 238, 0.6);
  }}
  .badge-row {{
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 36px;
  }}
  .cta-link {{
    margin-top: 32px;
    font-family: 'Consolas', monospace;
    font-size: 22px;
    letter-spacing: 0.15em;
    color: #9CA3AF;
  }}
  .cta-link span {{
    color: #BFFF62;
    border-bottom: 2px solid #BFFF62;
    padding-bottom: 2px;
  }}
</style>
<body>
  <div class="hud-corner tl"></div>
  <div class="hud-corner tr"></div>
  <div class="hud-corner bl"></div>
  <div class="hud-corner br"></div>

  <div class="hud-meta-bar">
    <div>MECH-G / GEMMAOPS // OFFLINE INDUSTRIAL EDGE ENGINE</div>
    <div>GOOGLE GEMMA 4 MULTIMODAL ECOSYSTEM</div>
    <div class="pill pill-cyan">PRODUCTION VERIFIED</div>
  </div>

  <div class="lockup-container">
    <div>{mascot_img_tag}</div>
    <div class="logo-title">MECH-G &middot; GemmaOps</div>
    <div class="logo-tagline">MISSION-CRITICAL EDGE INTELLIGENCE</div>
    <div class="badge-row">
      <div class="pill pill-cyan">GOOGLE GEMMA 4 VISION</div>
      <div class="pill pill-lime">OMNI-OKF COMPILER</div>
      <div class="pill pill-amber">OSHA 1910.147 LOTO GATE</div>
      <div class="pill pill-red">100% AIR-GAPPED</div>
    </div>
    <div class="cta-link">
      OPEN SOURCE REPOSITORY &middot; <span>github.com/PROJECT-GEMMA</span>
    </div>
  </div>

  <div class="hud-footer-bar">
    <div>MISSION-CRITICAL EDGE INTELLIGENCE &middot; 2026</div>
    <div id="hud-timecode">FRAME 000 // T+0.00s</div>
    <div>OFFLINE DETERMINISTIC AUDITOR ACTIVE</div>
  </div>

  <script>
    window.renderFrame = function(t, f, total) {{
      document.getElementById('hud-timecode').innerText = 'FRAME ' + String(f).padStart(3, '0') + ' // T+' + t.toFixed(2) + 's';
    }};
  </script>
</body>
</html>"""

# ==============================================================================
# Rendering Engine
# ==============================================================================
SCENE_CONFIGS = [
    ("scene_01.mp4", 10.0, get_scene_01_html),
    ("scene_02.mp4", 8.0, get_scene_02_html),
    ("scene_03.mp4", 8.0, get_scene_03_html),
    ("scene_04.mp4", 8.0, get_scene_04_html),
    ("scene_08.mp4", 10.0, get_scene_08_html),
    ("scene_09.mp4", 6.0, get_scene_09_html),
]

def render_scene(page, name, duration, html_fn, fps=30):
    total_frames = int(round(duration * fps))
    output_path = os.path.join(SCENES_DIR, name)
    print(f"\n[RENDER] Starting {name}: {duration:.1f}s ({total_frames} frames @ {fps}fps)")
    
    html_content = html_fn()
    page.set_content(html_content)
    # Wait briefly for layout and any images
    page.wait_for_timeout(300)

    cmd = [
        "ffmpeg", "-y",
        "-f", "image2pipe",
        "-vcodec", "png",
        "-framerate", str(fps),
        "-i", "-",
        "-c:v", "libx264",
        "-profile:v", "high",
        "-level:v", "4.0",
        "-pix_fmt", "yuv420p",
        "-r", str(fps),
        output_path
    ]

    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    t0 = time.time()
    
    for frame_idx in range(total_frames):
        t = frame_idx / float(fps)
        page.evaluate(f"window.renderFrame({t}, {frame_idx}, {total_frames})")
        shot = page.screenshot(type="png")
        proc.stdin.write(shot)
        
        if (frame_idx + 1) % 60 == 0 or frame_idx + 1 == total_frames:
            elapsed = time.time() - t0
            fps_speed = (frame_idx + 1) / max(0.001, elapsed)
            print(f"  -> {name}: Frame {frame_idx + 1}/{total_frames} ({fps_speed:.1f} fps rendering speed)")
            
    proc.stdin.close()
    proc.wait()
    total_time = time.time() - t0
    print(f"[RENDER] Completed {name} in {total_time:.1f}s -> {output_path}")

    # Verify with ffprobe immediately
    verify_scene(output_path, expected_duration=duration, expected_frames=total_frames)

def verify_scene(filepath, expected_duration, expected_frames):
    cmd = [
        "ffprobe", "-v", "error",
        "-select_streams", "v:0",
        "-show_entries", "stream=width,height,r_frame_rate,codec_name,pix_fmt,nb_frames,duration",
        "-of", "default=noprint_wrappers=1",
        filepath
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    print(f"[VERIFY] ffprobe output for {os.path.basename(filepath)}:\n" + res.stdout.strip())

def is_already_valid(output_path, expected_duration, expected_frames):
    if not os.path.exists(output_path):
        return False
    try:
        cmd = [
            "ffprobe", "-v", "error",
            "-select_streams", "v:0",
            "-show_entries", "stream=nb_frames,duration",
            "-of", "default=noprint_wrappers=1",
            output_path
        ]
        res = subprocess.run(cmd, capture_output=True, text=True)
        lines = dict(line.split("=") for line in res.stdout.strip().splitlines() if "=" in line)
        frames = int(lines.get("nb_frames", 0))
        dur = float(lines.get("duration", 0.0))
        if frames == expected_frames and abs(dur - expected_duration) < 0.05:
            return True
    except Exception:
        pass
    return False

def main():
    print(f"=== MECH-G MOTION SCENE RENDERER ===")
    print(f"Output directory: {SCENES_DIR}")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(
            executable_path=r"C:\Program Files\Google\Chrome\Application\chrome.exe",
            headless=True
        )
        
        total_t0 = time.time()
        for name, duration, html_fn in SCENE_CONFIGS:
            output_path = os.path.join(SCENES_DIR, name)
            total_frames = int(round(duration * 30))
            if is_already_valid(output_path, duration, total_frames):
                print(f"[SKIP] {name} is already valid ({duration}s, {total_frames} frames) -> {output_path}")
                verify_scene(output_path, duration, total_frames)
                continue
                
            page = browser.new_page(viewport={"width": 1920, "height": 1080})
            render_scene(page, name, duration, html_fn, fps=30)
            page.close()
            
        browser.close()
        print(f"\n=== ALL 6 MOTION SCENES RENDERED IN {time.time() - total_t0:.1f}s ===")

if __name__ == "__main__":
    main()

