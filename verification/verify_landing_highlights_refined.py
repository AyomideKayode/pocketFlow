from playwright.sync_api import sync_playwright

def verify_landing_highlights():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Capture console logs
        page.on("console", lambda msg: print(f"Console: {msg.text}"))

        try:
            print("Navigating to landing page...")
            page.goto("http://localhost:5173/")

            page.wait_for_timeout(3000)

            if page.get_by_text("Control Your Money").count() > 0:
                print("Found 'Control Your Money'")
                loc = page.get_by_text("Control Your Money").first
                loc.scroll_into_view_if_needed()
                page.screenshot(path="verification/landing_highlights_refined.png", full_page=True)
                print("Screenshot saved.")
            else:
                print("Could not find text.")
                page.screenshot(path="verification/debug_fail_refined.png")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_landing_highlights()
