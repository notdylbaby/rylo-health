from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch(channel="chrome")
    pg = b.new_page(viewport={"width":1440,"height":900}, device_scale_factor=1)
    pg.goto("http://localhost:3000/index.html", wait_until="domcontentloaded", timeout=60000)
    pg.wait_for_timeout(1500)
    data = pg.evaluate("""() => {
      const out = [];
      const secs = document.querySelectorAll('section,footer,header');
      secs.forEach(s => {
        const r = s.getBoundingClientRect();
        if (r.height < 40) return;
        const id = s.id || (s.className||'').split(' ')[0] || s.tagName.toLowerCase();
        // grab eyebrow-ish small caps, headings, and first couple paragraphs
        const pick = sel => Array.from(s.querySelectorAll(sel)).map(e=>e.innerText.trim()).filter(Boolean);
        const heads = pick('h1,h2,h3').slice(0,6);
        const eye = Array.from(s.querySelectorAll('[class*=eyebrow],[class*=label],[class*=kicker]')).map(e=>e.innerText.trim()).filter(Boolean).slice(0,3);
        const paras = pick('p').slice(0,3).map(t=>t.length>140?t.slice(0,140)+'…':t);
        out.push({id, h: Math.round(r.height), eye, heads, paras});
      });
      return out;
    }""")
    for s in data:
        print(f"\n===== [{s['id']}]  {s['h']}px =====")
        if s['eye']: print("  EYEBROW:", " | ".join(s['eye']))
        for hd in s['heads']: print("  H:", hd.replace('\n',' '))
        for pa in s['paras']: print("  p:", pa.replace('\n',' '))
    b.close()
