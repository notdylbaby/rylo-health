#!/usr/bin/env python3
import sys
from playwright.sync_api import sync_playwright

url = sys.argv[1]
selector = sys.argv[2]
label = sys.argv[3]
width = int(sys.argv[4]) if len(sys.argv) > 4 else 1440

with sync_playwright() as p:
    b = p.chromium.launch(channel="chrome")
    pg = b.new_page(viewport={"width": width, "height": 900}, device_scale_factor=2)
    pg.goto(url, wait_until="domcontentloaded", timeout=60000)
    pg.evaluate("document.querySelectorAll('.reveal').forEach(e=>e.classList.add('visible'))")
    pg.wait_for_timeout(600)
    el = pg.query_selector(selector)
    out = f"temporary screenshots/{label}.png"
    el.screenshot(path=out)
    print("saved", out)
    b.close()
