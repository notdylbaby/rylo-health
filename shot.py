#!/usr/bin/env python3
import sys
from playwright.sync_api import sync_playwright

url = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3000/waitlist.html"
label = sys.argv[2] if len(sys.argv) > 2 else "shot"
width = int(sys.argv[3]) if len(sys.argv) > 3 else 1440
full = "--full" in sys.argv

with sync_playwright() as p:
    b = p.chromium.launch(channel="chrome")
    pg = b.new_page(viewport={"width": width, "height": 900}, device_scale_factor=2)
    pg.goto(url, wait_until="networkidle")
    # force-reveal any scroll-animated sections so full-page capture shows them
    pg.evaluate("document.querySelectorAll('.reveal').forEach(e=>e.classList.add('visible'))")
    pg.wait_for_timeout(900)
    out = f"temporary screenshots/{label}.png"
    pg.screenshot(path=out, full_page=full)
    print("saved", out)
    b.close()
