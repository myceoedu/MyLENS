export function isPageRoute(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("/#");
}

export function navigateTo(href: string, pathname: string, router: { push: (url: string) => void }) {
  if (href === "#") return;

  if (isPageRoute(href)) {
    router.push(href);
    return;
  }

  if (href.startsWith("#")) {
    if (pathname !== "/") {
      router.push(`/${href}`);
      return;
    }
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }
}
