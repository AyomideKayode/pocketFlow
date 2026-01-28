from playwright.sync_api import sync_playwright
import time
import random
import os

def verify_settings():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        page.on("console", lambda msg: print(f"Browser console: {msg.text}"))
        page.on("pageerror", lambda err: print(f"Browser error: {err}"))

        # Intercept API calls
        page.route("http://localhost:3001/financial-records/**", lambda route: route.fulfill(status=200, body="[]", content_type="application/json"))
        page.route("http://localhost:3001/budgets/**", lambda route: route.fulfill(status=200, body="[]", content_type="application/json"))
        page.route("http://localhost:3001/goals/**", lambda route: route.fulfill(status=200, body="[]", content_type="application/json"))
        page.route("http://localhost:3001/user-profile/**", lambda route: route.fulfill(status=200, body='{"currency":"EUR", "displayName":"Mock User"}', content_type="application/json"))

        # Navigate directly to settings
        print("Navigating directly to Settings...")
        try:
            page.goto("http://localhost:5173/settings")

            # Wait for heading
            page.wait_for_selector("h1", timeout=10000)

            # Verify Heading Text
            heading = page.locator("h1").first
            print(f"Heading: {heading.inner_text()}")
            if "Settings" in heading.inner_text():
                print("Settings Page Confirmed.")
            else:
                print("Heading mismatch.")

            # Verify Currency
            currency_select = page.locator("select").first
            assert currency_select.is_visible()
            val = currency_select.input_value()
            print(f"Currency Value: {val}")

            # Wait for mock to populate (useEffect)
            if val != "EUR":
                print("Waiting for profile load...")
                time.sleep(2)
                val = currency_select.input_value()
                print(f"Currency Value after wait: {val}")

            assert val == "EUR"

            page.screenshot(path="verification/settings_page_success.png")
            print("Verification Successful!")

        except Exception as e:
            print(f"Verification Failed: {e}")
            page.screenshot(path="verification/verification_failed.png")

        browser.close()

if __name__ == "__main__":
    verify_settings()
