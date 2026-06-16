from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch(channel="chrome")
    for w in (1440, 390):
        pg = b.new_page(viewport={"width":w,"height":900}, device_scale_factor=1)
        pg.goto("http://localhost:3000/index.html", wait_until="domcontentloaded", timeout=60000)
        pg.wait_for_timeout(1500)
        h = pg.evaluate("document.body.scrollHeight")
        print(f"width={w}: total height={h}px  ≈ {h/900:.1f} viewport-heights (scrolls)")
        if w==390:
            secs = pg.evaluate("""() => Array.from(document.querySelectorAll('section,footer')).map(s=>{
                const r=s.getBoundingClientRect();
                const id=s.id||s.className.split(' ')[0]||s.tagName.toLowerCase();
                return {id, h: Math.round(r.height)};
            }).filter(x=>x.h>40)""")
            print("  --- sections (mobile) ---")
            for s in secs: print(f"    {s['h']:>5}px  {s['id']}")
        pg.close()
    b.close()
