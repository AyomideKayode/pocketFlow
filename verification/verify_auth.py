from playwright.sync_api import Page, expect, sync_playwright

def verify_auth_page(page: Page):
    page.on("console", lambda msg: print(f"Console: {msg.text}"))
    page.on("pageerror", lambda err: print(f"Page Error: {err}"))

    print("Navigating to auth page...")
    page.goto("http://localhost:5173/auth")

    page.wait_for_timeout(3000)

    print("Current URL:", page.url)

    # Dump body HTML (first 500 chars)
    body_html = page.inner_html("body")
    print(f"Body HTML: {body_html[:500]}...")

    if page.url.rstrip('/') == "http://localhost:5173":
        expect(page.get_by_text("Dashboard")).to_be_visible(timeout=5000)
    else:
        expect(page.get_by_role("heading", name="Welcome back")).to_be_visible(timeout=5000)

    page.screenshot(path="verification/auth_page.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_auth_page(page)
        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
            raise e
        finally:
            browser.close()
