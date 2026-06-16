import sys
from playwright.sync_api import sync_playwright
url, label = sys.argv[1], sys.argv[2]
width = int(sys.argv[3]) if len(sys.argv)>3 else 430
with sync_playwright() as p:
    b = p.chromium.launch(channel="chrome")
    pg = b.new_page(viewport={"width":width,"height":932}, device_scale_factor=2)
    pg.goto(url, wait_until="domcontentloaded", timeout=60000)
    pg.wait_for_timeout(2000)
    pg.screenshot(path=f"temporary screenshots/{label}.png")
    print("saved", label); b.close()
