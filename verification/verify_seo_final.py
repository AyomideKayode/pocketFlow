import time
from playwright.sync_api import sync_playwright

def verify_seo():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        try:
            print("Navigating to http://localhost:5173/")
            page.goto("http://localhost:5173/")
            time.sleep(2)

            # Check Title (native)
            title = page.title()
            print(f"Title: {title}")

            # Check Meta Description (native)
            desc = page.locator("meta[name=\"description\"]").first.get_attribute("content")
            print(f"Description: {desc}")

            # Check Canonical (native)
            canonical = page.locator("link[rel=\"canonical\"]").first.get_attribute("href")
            print(f"Canonical: {canonical}")

            # Check Twitter Site (should NOT be present)
            twitter_site_count = page.locator("meta[name=\"twitter:site\"]").count()
            print(f"Twitter Site Count: {twitter_site_count}")

            # Check Loading State (should NOT be present)
            loading_text = page.get_by_text("Loading...").count()
            print(f"Loading Text Count: {loading_text}")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_seo()
