"""
Makes the two resume PDFs from the /resume page. Run it again whenever the resume content changes.

    npm run dev                      (in another terminal)
    python scripts/resume_pdf.py     (or pass a different base URL)

public/Kurt-Michael-Salut-Resume.pdf   No phone number. This is the site's Download PDF button.
resume-private/...-Resume.pdf          With phone number. Gitignored; send this one to companies directly.

The phone number comes from RESUME_PHONE in .env.local and is added only while printing the private
copy, so it never reaches the public page, the public PDF, or the repo.
"""
import re
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
FILENAME = "Kurt-Michael-Salut-Resume.pdf"
PUBLIC_PDF = ROOT / "public" / FILENAME
PRIVATE_PDF = ROOT / "resume-private" / FILENAME

ADD_PHONE = """(phone) => {
  const email = document.querySelector('.resume-sheet a[href^="mailto:"]');
  const separator = document.createElement("span");
  separator.textContent = "|";
  const link = document.createElement("a");
  link.href = "tel:" + phone.replace(/[^\\d+]/g, "");
  link.textContent = phone;
  email.after(separator, link);
}"""


def read_phone() -> str:
    env = ROOT / ".env.local"
    if env.exists():
        match = re.search(r"^RESUME_PHONE=(.+)$", env.read_text(encoding="utf-8"), re.M)
        if match:
            return match.group(1).strip().strip('"')
    sys.exit("RESUME_PHONE is missing from .env.local")


def main() -> None:
    base = sys.argv[1].rstrip("/") if len(sys.argv) > 1 else "http://localhost:3000"
    phone = read_phone()
    PRIVATE_PDF.parent.mkdir(exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(reduced_motion="reduce")
        page.goto(f"{base}/resume", wait_until="networkidle", timeout=90000)
        page.wait_for_selector(".resume-sheet")
        page.wait_for_timeout(1000)

        page.pdf(path=PUBLIC_PDF, prefer_css_page_size=True, print_background=True)
        page.evaluate(ADD_PHONE, phone)
        page.pdf(path=PRIVATE_PDF, prefer_css_page_size=True, print_background=True)
        browser.close()

    print(f"Public:  {PUBLIC_PDF}\nPrivate: {PRIVATE_PDF}")


if __name__ == "__main__":
    main()
