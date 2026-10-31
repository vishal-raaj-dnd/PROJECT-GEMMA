import time
import os
import sys

if sys.platform.startswith("win"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

from playwright.sync_api import sync_playwright

def test_flow():
    with sync_playwright() as p:
        browser = p.chromium.launch(
            executable_path=r"C:\Program Files\Google\Chrome\Application\chrome.exe",
            headless=True,
            args=["--no-sandbox", "--disable-infobars", "--window-size=1920,1080"]
        )
        context = browser.new_context(
            viewport={"width": 1920, "height": 1080},
        )
        page = context.new_page()
        
        print("[1] Navigating to http://localhost:3000/diagnostics...", flush=True)
        page.goto("http://localhost:3000/diagnostics", wait_until="domcontentloaded")
        
        # Verify page title and asset selector
        print("[2] Checking initial DOM elements...", flush=True)
        page.wait_for_selector("text=Telemetry Input", timeout=5000)
        select_val = page.locator("select").first.input_value()
        print(f"  [*] Target Equipment Asset: {select_val}", flush=True)
        
        # Check preset scenario button
        sample_btn = page.locator("button:has-text('Proportional Relief Valve V2')").first
        sample_btn.click()
        print("  [*] Preset button clicked", flush=True)
        
        # Verify pressure text
        page.wait_for_selector("text=210 bar", timeout=5000)
        print("  [*] Manifold pressure reads 210 bar", flush=True)
        
        # Verify image loaded
        page.wait_for_selector("img[alt='Inspection Capture']", timeout=5000)
        print("  [*] Leaking valve capture displayed", flush=True)
        
        # Click Run Hardware Diagnostic Evaluation
        print("[3] Clicking 'Run Hardware Diagnostic Evaluation'...", flush=True)
        diag_btn = page.locator("button:has-text('Run Hardware Diagnostic Evaluation')")
        diag_btn.click()
        
        # Wait for diagnostic results
        page.wait_for_selector("text=FAULT DETECTED", timeout=15000)
        print("  [*] Fault Detected banner appeared!", flush=True)
        page.wait_for_selector("text=PRV-992-B", timeout=5000)
        print("  [*] Part number PRV-992-B confirmed!", flush=True)
        page.wait_for_selector("text=96.0%", timeout=5000)
        print("  [*] Confidence 96.0% confirmed!", flush=True)
        
        # Check OSHA Gate
        print("[4] Checking OSHA 1910.147 Gate...", flush=True)
        page.wait_for_selector("text=OSHA 1910.147 Lockout/Tagout Gate", timeout=5000)
        sign_btn = page.locator("button:has-text('Sign OSHA Safety Gate')")
        sign_btn.click()
        print("  [*] Sign OSHA Safety Gate clicked", flush=True)
        
        # Wait for Modal
        page.wait_for_selector("text=OSHA 1910.147 Safety Gate Authorization", timeout=5000)
        print("  [*] Safety Gate Modal opened", flush=True)
        
        # Check checkboxes
        checkboxes = page.locator("input[type='checkbox']")
        count = checkboxes.count()
        print(f"  Found {count} checkboxes", flush=True)
        for i in range(count):
            checkboxes.nth(i).check()
        print("  [*] Checked safety items", flush=True)
        
        # Click Confirm & Unlock
        confirm_btn = page.locator("button:has-text('Confirm & Unlock Remediation Steps')")
        confirm_btn.click()
        
        # Verify gate updated to verified
        page.wait_for_selector("text=VERIFIED BY TECH-8842-OFFSHORE", timeout=10000)
        print("  [*] OSHA Gate verified by TECH-8842-OFFSHORE!", flush=True)
        
        # Check Step 4 torque spec
        print("[5] Checking Step 4 and Citations...", flush=True)
        page.wait_for_selector("text=TORQUE: 35 Nm", timeout=5000)
        print("  [*] Torque specification '35 Nm' visible on Step 4!", flush=True)
        
        # Click Citation chip
        citation_chip = page.locator("button:has-text('proportional_relief_valve_v2.md')")
        citation_chip.click()
        
        # Verify Citation modal
        page.wait_for_selector("text=Citation Verification Details", timeout=5000)
        page.wait_for_selector("text=Fastener Torque: 35 Nm", timeout=5000)
        print("  [*] Citation Verification Details modal opened with exact 35 Nm excerpt!", flush=True)
        
        browser.close()
        print("\n[ALL CHECKS PASSED SUCCESSFULLY]", flush=True)

if __name__ == "__main__":
    test_flow()
