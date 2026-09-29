"""Run with a local dev server and Python playwright + Chrome installed."""
from playwright.sync_api import sync_playwright, expect

with sync_playwright() as p:
    browser = p.chromium.launch(channel="chrome", headless=True)
    base = "http://localhost:3000"
    for locale, expected_locale in [("vi-VN", "vi"), ("en-US", "en"), ("fr-FR", "en")]:
        for scheme, background in [("light", "rgb(244, 247, 251)"), ("dark", "rgb(9, 12, 18)")]:
            clean = browser.new_context(locale=locale, color_scheme=scheme)
            screen = clean.new_page()
            screen.goto(f"{base}/login")
            expect(screen.locator("html")).to_have_attribute("lang", expected_locale)
            expect(screen.locator("html")).to_have_attribute("data-theme", "system")
            expect(screen.locator("body")).to_have_css("background-color", background)
            expect(screen.locator("select")).to_have_count(0)
            expect(screen.locator('a[href="/register"]')).to_have_count(0)
            assert not any(c["name"] in ["theme", "locale"] for c in clean.cookies())
            screen.emulate_media(color_scheme="dark" if scheme == "light" else "light")
            expect(screen.locator("body")).to_have_css("background-color", "rgb(9, 12, 18)" if scheme == "light" else "rgb(244, 247, 251)")
            clean.close()
    context = browser.new_context(locale="en-US", color_scheme="dark")
    page = context.new_page()
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    assert page.goto(f"{base}/register").status == 404
    for path in ["dashboard", "users", "roles", "pois", "poi-content", "audio", "languages", "settings"]:
        page.goto(f"{base}/{path}")
        expect(page).to_have_url(f"{base}/login")
    expect(page.locator("select")).to_have_count(0)
    page.get_by_label("Email", exact=True).fill("admin@mans.vn")
    page.get_by_label("Password", exact=True).fill("wrong")
    page.get_by_role("button", name="Sign In", exact=True).click()
    expect(page.locator('p[role="alert"]')).to_have_text("Invalid email or password")
    page.get_by_label("Password", exact=True).fill("admin123")
    page.get_by_role("button", name="Sign In", exact=True).click()
    expect(page).to_have_url(f"{base}/dashboard")
    session = next(c for c in context.cookies() if c["name"] == "mans-session")
    assert session["httpOnly"] and session["sameSite"] == "Lax"
    page.get_by_label("Theme", exact=True).select_option("light")
    page.get_by_label("Language", exact=True).select_option("vi")
    page.reload()
    expect(page.locator("html")).to_have_attribute("lang", "vi")
    expect(page.locator("html")).to_have_attribute("data-theme", "light")
    page.get_by_label("Ngôn ngữ", exact=True).select_option("en")
    page.get_by_label("Reporting period", exact=True).select_option("7")
    expect(page).to_have_url(f"{base}/dashboard?period=7")
    point = page.locator('svg circle[role="button"]').first
    point.focus()
    expect(page.locator(".chart-readout").first).to_contain_text("Interval 1")
    page.get_by_role("button", name="Replay animation").click()
    page.emulate_media(reduced_motion="reduce")
    assert page.locator(".trend-line").evaluate("el => getComputedStyle(el).animationName") == "none"
    page.set_viewport_size({"width": 390, "height": 844})
    assert page.evaluate("document.documentElement.scrollWidth <= window.innerWidth")
    page.get_by_role("button", name="Sign out").click()
    expect(page).to_have_url(f"{base}/login")
    expect(page.locator("select")).to_have_count(0)
    expect(page.locator("html")).to_have_attribute("data-theme", "light")
    # A future visit with different system defaults still honors saved choices.
    returning = browser.new_context(locale="vi-VN", color_scheme="dark", storage_state=context.storage_state())
    returning_page = returning.new_page()
    returning_page.goto(f"{base}/login")
    expect(returning_page.locator("html")).to_have_attribute("lang", "en")
    expect(returning_page.locator("body")).to_have_css("background-color", "rgb(244, 247, 251)")
    returning.close()
    page.goto(f"{base}/dashboard")
    expect(page).to_have_url(f"{base}/login")
    context.add_cookies([{ "name": "mans-session", "value": session["value"] + "tampered", "url": base }])
    page.goto(f"{base}/dashboard")
    expect(page).to_have_url(f"{base}/login")
    assert not errors, errors
    print("PASS: protected routes, invalid/valid login, cookie, preferences, charts, reduced motion, mobile, logout, tampered session")
    browser.close()
