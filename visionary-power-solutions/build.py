#!/usr/bin/env python3
"""Builds the static pages for the Visionary Power Solutions site.

Shared header, footer, and head tags live here so every page stays in sync.
Run `python3 build.py` after editing, then upload the folder contents
(index.html, *.html, css/, js/, assets/) to Wix. No server needed.

Anything marked TODO(owner) is an unconfirmed placeholder. Search for it
before launch and replace every one with real, confirmed information.
"""
from pathlib import Path

ROOT = Path(__file__).parent
SITE_URL = "https://www.visionarypowersolutions.com"
EMAIL = "info@visionarypowersolutions.com"

# TODO(owner): replace with the real phone number, e.g. ("(716) 555-0100", "+17165550100")
PHONE_DISPLAY = '<span class="todo">TODO(owner): phone</span>'
PHONE_HREF = None

# TODO(owner): advertised lead time, e.g. "8 weeks"
LEAD_TIME = '<span class="todo">TODO(owner): X weeks</span>'

TODO = lambda label: f'<span class="todo">TODO(owner): {label}</span>'

# ---------------------------------------------------------------- icons
# Simple line icons, 24x24, stroke uses currentColor.
def icon(paths, cls="icon"):
    return (f'<svg class="{cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
            f'stroke-width="1.6" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true">{paths}</svg>')

ICONS = {
    "shield": '<path d="M12 2l8 3v6c0 5-3.4 9.3-8 11-4.6-1.7-8-6-8-11V5z"/><path d="M12 7.5l1.3 2.7 3 .4-2.2 2.1.5 3-2.6-1.4-2.6 1.4.5-3-2.2-2.1 3-.4z"/>',
    "clock": '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    "check": '<path d="M12 2l2.4 1.8 3-.2.9 2.9 2.5 1.7-1 2.8 1 2.8-2.5 1.7-.9 2.9-3-.2L12 22l-2.4-1.8-3 .2-.9-2.9-2.5-1.7 1-2.8-1-2.8 2.5-1.7.9-2.9 3 .2z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
    "bolt": '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
    "cabinet": '<rect x="4" y="3" width="16" height="18"/><path d="M12 3v18M7 8h2M15 8h2M7 12h2M15 12h2"/>',
    "tower": '<path d="M12 2l-5 20M12 2l5 20M8.5 16h7M9.8 10.5h4.4M5 6h14M7 22h10"/>',
    "server": '<rect x="4" y="3" width="16" height="6"/><rect x="4" y="9" width="16" height="6"/><rect x="4" y="15" width="16" height="6"/><path d="M7 6h.01M7 12h.01M7 18h.01"/>',
    "factory": '<path d="M3 21V10l5 3V10l5 3V10l5 3V4h3v17z"/><path d="M7 17h2M12 17h2"/>',
    "building": '<rect x="5" y="3" width="14" height="18"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M11 21v-3h2v3"/>',
    "sun": '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    "mail": '<rect x="3" y="5" width="18" height="14"/><path d="M3 6l9 7 9-7"/>',
    "phone": '<path d="M5 3h4l2 5-2.5 1.5a11 11 0 005 5L15 12l5 2v4a2 2 0 01-2 2A16 16 0 013 5a2 2 0 012-2z"/>',
    "pin": '<path d="M12 22s7-6.2 7-12a7 7 0 10-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>',
    "flag": '<path d="M5 22V3M5 4h14l-3 4 3 4H5"/>',
}

MENU_ICON = ('<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
             'stroke-width="2" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>')

# ---------------------------------------------------------------- layout
NAV = [("products.html", "Products"), ("industries.html", "Industries"),
       ("about.html", "About"), ("contact.html", "Contact")]


def head(title, description, path):
    url = f"{SITE_URL}/{'' if path == 'index.html' else path}"
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{description}">
<link rel="canonical" href="{url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Visionary Power Solutions">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{description}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{SITE_URL}/assets/og-image.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0B1437">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Oswald:wght@500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/styles.css">
<script type="application/ld+json">
{{"@context":"https://schema.org","@type":"Organization","name":"Visionary Power Solutions LLC","url":"{SITE_URL}","email":"{EMAIL}","foundingDate":"2026","address":{{"@type":"PostalAddress","addressLocality":"Sanborn","addressRegion":"NY","addressCountry":"US"}}}}
</script>
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
"""


def header(active):
    current = ' aria-current="page"'
    items = "\n".join(
        f'        <li><a href="{href}"{current if href == active else ""}>{label}</a></li>'
        for href, label in NAV)
    return f"""<header class="site-header">
  <div class="container header-inner">
    <a class="brand" href="index.html" aria-label="Visionary Power Solutions home">
      <!-- TODO(owner): swap for assets/logo.png once the logo file is added -->
      <img src="assets/logo-placeholder.svg" alt="Visionary Power Solutions logo" width="48" height="48">
      <span class="brand-text">Visionary Power<small>Solutions LLC</small></span>
    </a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="main-nav" aria-label="Open menu">{MENU_ICON}</button>
    <nav class="main-nav" id="main-nav" aria-label="Main">
      <ul>
{items}
      </ul>
      <a class="btn btn-red btn-sm" href="contact.html#quote">Request a Quote</a>
    </nav>
  </div>
</header>
"""


def phone_link():
    return f'<a href="tel:{PHONE_HREF}">{PHONE_DISPLAY}</a>' if PHONE_HREF else PHONE_DISPLAY


def footer():
    return f"""<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div>
        <a class="brand" href="index.html">
          <img src="assets/logo-placeholder.svg" alt="Visionary Power Solutions logo" width="48" height="48">
          <span class="brand-text">Visionary Power<small>Solutions LLC</small></span>
        </a>
        <p style="margin-top:16px">Custom medium voltage switchgear. Built right. Delivered fast.</p>
        <span class="footer-vet">Veteran Owned and Operated</span>
      </div>
      <div>
        <h2>Company</h2>
        <ul>
          <li><a href="products.html">Products</a></li>
          <li><a href="industries.html">Industries</a></li>
          <li><a href="about.html">About</a></li>
          <li><a href="contact.html#quote">Request a Quote</a></li>
        </ul>
      </div>
      <div>
        <h2>Contact</h2>
        <ul>
          <li>Sanborn, NY</li>
          <li><a href="mailto:{EMAIL}">{EMAIL}</a></li>
          <li>{phone_link()}</li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">&copy; <span id="year">2026</span> Visionary Power Solutions LLC. All rights reserved.</div>
  </div>
</footer>
<script src="js/config.js"></script>
<script src="js/main.js"></script>
</body>
</html>
"""


def page_hero(eyebrow, title, lead):
    return f"""<section class="hero page-hero">
  <div class="hero-media" aria-hidden="true"></div>
  <div class="container">
    <div class="hero-content">
      <span class="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p class="lead">{lead}</p>
    </div>
  </div>
</section>
"""


STRIP = """<div class="strip" role="note">
  <span>Veteran Owned and Operated</span><span class="sep">|</span><span>Made in the USA</span><span class="sep">|</span><span>Sanborn, NY</span>
</div>
"""


def cta(title="Need switchgear on a tight timeline?",
        text="Tell us what you need and when you need it. We will get back to you with a quote."):
    return f"""<section class="cta">
  <div class="container">
    <h2>{title}</h2>
    <p>{text}</p>
    <a class="btn btn-red" href="contact.html#quote">Request a Quote</a>
  </div>
</section>
"""


# ---------------------------------------------------------------- content
# TODO(owner): confirm which product types are actually built. Names below are
# common medium voltage categories used as placeholders only.
PRODUCTS = [
    ("cabinet", "Metal-Clad Switchgear",
     "Draw-out breaker lineups with fully compartmented construction for critical distribution."),
    ("bolt", "Metal-Enclosed Switchgear",
     "Load interrupter and fused switch lineups for reliable medium voltage distribution."),
    ("tower", "Pad-Mounted Switchgear",
     "Outdoor rated equipment for underground distribution and site power."),
]

# TODO(owner): confirm industries served. Names below are placeholders only.
INDUSTRIES = [
    ("tower", "Utilities",
     "Grid upgrades and substation work run on tight outage windows. Equipment that shows up late pushes the whole schedule.",
     "Delivered when the outage window is scheduled, built to your utility specs."),
    ("server", "Data Centers",
     "Capacity is sold before the building is finished. Every week waiting on switchgear is a week of lost revenue.",
     "Fast lead times that keep energization dates on track."),
    ("factory", "Industrial and Manufacturing",
     "Plant expansions and retrofits need equipment that fits the existing system and runs for decades.",
     "Custom engineered lineups matched to your facility."),
    ("building", "Commercial and Institutional",
     "Hospitals, campuses, and large buildings depend on power that cannot fail.",
     "Tested, documented equipment you can count on."),
    ("sun", "Renewable Energy",
     "Solar and storage projects face interconnection deadlines that do not move.",
     "Collection and interconnection gear delivered on schedule."),
]


def product_card(ic, name, text, detail=False):
    specs = ""
    if detail:
        specs = f"""
          <ul class="spec-list">
            <li><span>Voltage class</span><span>{TODO("voltage range")}</span></li>
            <li><span>Continuous current</span><span>{TODO("ratings")}</span></li>
            <li><span>Interrupting rating</span><span>{TODO("ratings")}</span></li>
            <li><span>Standards</span><span>{TODO("UL / ANSI / IEEE")}</span></li>
            <li><span>Lead time</span><span>{LEAD_TIME}</span></li>
          </ul>
          <a class="btn btn-outline-navy btn-sm" href="contact.html#quote" style="align-self:flex-start">Request a Quote</a>"""
    else:
        specs = '\n          <a class="link-arrow" href="products.html">View details</a>'
    return f"""      <article class="card reveal">
        <div class="placeholder-img" role="img" aria-label="{name} photo placeholder">Photo coming soon</div>
        <div class="card-body">
          <h3>{name} {TODO("confirm")}</h3>
          <p>{text}</p>{specs}
        </div>
      </article>"""


def home():
    products = "\n".join(product_card(*p) for p in PRODUCTS)
    industries = "\n".join(f"""      <div class="tile reveal">
        {icon(ICONS[ic])}
        <h3>{name}</h3>
        <p>{short}</p>
      </div>""" for ic, name, _long, short in INDUSTRIES)
    return (head("Visionary Power Solutions | Industrial Power Solutions",
                 "Veteran owned manufacturer of custom medium voltage switchgear in Sanborn, NY. Quality equipment with the industry's fastest lead times.",
                 "index.html")
            + header("index.html") + f"""<main id="main">
<section class="hero">
  <div class="hero-media" role="img" aria-label="Industrial switchgear photo placeholder"></div>
  <div class="container">
    <div class="hero-content">
      <span class="eyebrow">Veteran Owned and Operated</span>
      <h1>Custom Medium Voltage Switchgear. Built Right. Delivered Fast.</h1>
      <p class="lead">Visionary Power Solutions is a veteran owned and operated manufacturer delivering quality switchgear with the industry's fastest lead times.</p>
      <div class="hero-actions">
        <a class="btn btn-red" href="contact.html#quote">Request a Quote</a>
        <a class="btn btn-outline" href="products.html">View Products</a>
      </div>
    </div>
  </div>
</section>
{STRIP}
<section class="section" aria-labelledby="why-title">
  <div class="container">
    <div class="section-head">
      <hr class="rule">
      <h2 id="why-title">Why Visionary Power</h2>
      <p>Quality equipment, delivered on a schedule you can plan around.</p>
    </div>
    <div class="grid grid-3">
      <div class="feature reveal">
        {icon(ICONS["shield"])}
        <h3>Veteran Owned and Operated</h3>
        <p>Military discipline, accountability, and attention to detail on every build. When we commit to a date, we hit it.</p>
      </div>
      <div class="feature reveal">
        {icon(ICONS["clock"])}
        <h3>Industry Leading Lead Times</h3>
        <p>Waiting months for switchgear stalls projects. We deliver in {LEAD_TIME} so your job stays on schedule.</p>
      </div>
      <div class="feature reveal">
        {icon(ICONS["check"])}
        <h3>Quality You Can Count On</h3>
        <p>Every unit custom engineered, built, and tested to your specs and to {TODO("standards")} standards.</p>
      </div>
    </div>
  </div>
</section>

<section class="section section-gray" aria-labelledby="build-title">
  <div class="container">
    <div class="section-head">
      <hr class="rule">
      <h2 id="build-title">What We Build</h2>
      <p>Custom medium voltage switchgear engineered to your project.</p>
    </div>
    <div class="grid grid-3">
{products}
    </div>
    <div class="section-foot"><a class="btn btn-outline-navy" href="products.html">All Products</a></div>
  </div>
</section>

<section class="section" aria-labelledby="ind-title">
  <div class="container">
    <div class="section-head">
      <hr class="rule">
      <h2 id="ind-title">Industries We Serve</h2>
      <p>When power equipment is late, the whole project waits. {TODO("confirm industries")}</p>
    </div>
    <div class="grid grid-3">
{industries}
    </div>
    <div class="section-foot"><a class="btn btn-outline-navy" href="industries.html">All Industries</a></div>
  </div>
</section>

<section class="section section-navy" aria-labelledby="vet-title">
  <div class="container">
    <div class="badge-block reveal">
      {icon(ICONS["flag"])}
      <div>
        <h2 id="vet-title">Veteran Owned. Mission Focused.</h2>
        <p>The values we learned in service run our shop: integrity, reliability, and mission focus. Every lineup is built like the mission depends on it.</p>
      </div>
    </div>
  </div>
</section>
</main>
""" + cta() + footer())


def products():
    cards = "\n".join(product_card(*p, detail=True) for p in PRODUCTS)
    return (head("Medium Voltage Switchgear Products | Visionary Power Solutions",
                 "Custom medium voltage switchgear built in Sanborn, NY by a veteran owned manufacturer. Engineered to your specs and delivered fast.",
                 "products.html")
            + header("products.html") + "<main id=\"main\">\n"
            + page_hero("Products", "Custom Medium Voltage Switchgear",
                        "Every lineup is engineered to your specifications, built in our Sanborn, NY shop, and tested before it ships.")
            + STRIP + f"""
<section class="section section-gray" aria-labelledby="prod-title">
  <div class="container">
    <div class="section-head">
      <hr class="rule">
      <h2 id="prod-title">Our Equipment</h2>
      <p>Do not see exactly what you need? Every build is custom. Send us your specs.</p>
    </div>
    <div class="grid grid-3">
{cards}
    </div>
  </div>
</section>

<section class="section" aria-labelledby="custom-title">
  <div class="container split">
    <div>
      <hr class="rule">
      <h2 id="custom-title">Built to Your Specs</h2>
      <p>Send us a one-line diagram, a spec sheet, or a rough scope. Our team works with your engineers and contractors to configure the right lineup, then builds it to the schedule we commit to.</p>
      <a class="btn btn-red" href="contact.html#quote">Start a Quote</a>
    </div>
    <ul class="values">
      <li><strong>Engineered</strong><span>Configured to your ratings, layout, and site conditions.</span></li>
      <li><strong>Built</strong><span>Manufactured in Sanborn, NY by a veteran led team.</span></li>
      <li><strong>Tested</strong><span>Tested to {TODO("standards")} before it leaves the shop.</span></li>
      <li><strong>Delivered</strong><span>Shipped in {LEAD_TIME} so your project stays on schedule.</span></li>
    </ul>
  </div>
</section>
</main>
""" + cta() + footer())


def industries():
    blocks = "\n".join(f"""    <div class="industry-block reveal">
      <div class="placeholder-img" role="img" aria-label="{name} photo placeholder">Photo coming soon</div>
      <div>
        {icon(ICONS[ic])}
        <h3>{name} {TODO("confirm")}</h3>
        <p>{long}</p>
        <p><strong>{short}</strong></p>
      </div>
    </div>""" for ic, name, long, short in INDUSTRIES)
    return (head("Industries Served | Visionary Power Solutions",
                 "Medium voltage switchgear for projects where lead time and quality matter. Veteran owned manufacturer in Sanborn, NY.",
                 "industries.html")
            + header("industries.html") + "<main id=\"main\">\n"
            + page_hero("Industries", "Power for Projects That Cannot Wait",
                        "Every industry we serve has one thing in common: a late switchgear delivery stalls the entire job.")
            + STRIP + f"""
<section class="section" aria-label="Industries">
  <div class="container">
{blocks}
  </div>
</section>
</main>
""" + cta() + footer())


def about():
    return (head("About Us | Visionary Power Solutions",
                 "Founded in 2026 in Sanborn, NY, Visionary Power Solutions is a veteran owned and operated manufacturer of custom medium voltage switchgear.",
                 "about.html")
            + header("about.html") + "<main id=\"main\">\n"
            + page_hero("About Us", "Veteran Owned. Built on Service.",
                        "Integrity, reliability, and mission focus. The values we learned in service drive every build.")
            + STRIP + f"""
<section class="section" aria-labelledby="story-title">
  <div class="container split">
    <div class="story">
      <hr class="rule">
      <h2 id="story-title">Our Story</h2>
      <p>Founded in 2026 in Sanborn, New York, Visionary Power Solutions was built on the values we learned in service: integrity, reliability, and mission focus.</p>
      <p>We saw an industry where customers waited too long for critical equipment, and we set out to change that.</p>
      <p>Every switchgear lineup that leaves our shop is built to perform and delivered when you need it.</p>
    </div>
    <div class="placeholder-img" role="img" aria-label="Team photo placeholder" style="aspect-ratio:4/5">Team photo coming soon</div>
  </div>
</section>

<section class="section section-navy" aria-labelledby="values-title">
  <div class="container">
    <div class="section-head">
      <hr class="rule">
      <h2 id="values-title">What We Stand For</h2>
    </div>
    <ul class="values grid grid-3">
      <li class="reveal"><strong>Integrity</strong><span>We tell you the real schedule and the real price. Then we deliver on both.</span></li>
      <li class="reveal"><strong>Reliability</strong><span>Equipment built to perform for decades, backed by a team that answers the phone.</span></li>
      <li class="reveal"><strong>Mission Focus</strong><span>Your project is the mission. We keep it moving.</span></li>
    </ul>
  </div>
</section>

<section class="section section-gray" aria-labelledby="facts-title">
  <div class="container">
    <div class="section-head">
      <hr class="rule">
      <h2 id="facts-title">At a Glance</h2>
    </div>
    <div class="grid grid-3">
      <div class="tile reveal">{icon(ICONS["shield"])}<h3>Veteran Owned</h3><p>Owned and operated by veterans.</p></div>
      <div class="tile reveal">{icon(ICONS["pin"])}<h3>Sanborn, NY</h3><p>Built in Western New York. Made in the USA.</p></div>
      <div class="tile reveal">{icon(ICONS["bolt"])}<h3>Founded 2026</h3><p>Custom medium voltage switchgear with the industry's fastest lead times.</p></div>
    </div>
  </div>
</section>
</main>
""" + cta() + footer())


def contact():
    return (head("Request a Quote | Visionary Power Solutions",
                 "Request a quote for custom medium voltage switchgear. Veteran owned manufacturer in Sanborn, NY with the industry's fastest lead times.",
                 "contact.html")
            + header("contact.html") + "<main id=\"main\">\n"
            + page_hero("Contact", "Request a Quote",
                        "Tell us about your project. Our team will get back to you with a quote.")
            + f"""
<section class="section section-gray" id="quote" aria-labelledby="form-title">
  <div class="container contact-grid">
    <div class="form-panel">
      <h2 id="form-title" style="font-size:1.8rem">Project Details</h2>
      <p class="form-note">Fields marked <span class="req" style="color:var(--red)">*</span> are required.</p>
      <form id="quote-form" novalidate>
        <div class="form-row">
          <div class="field">
            <label for="firstName">First name <span class="req">*</span></label>
            <input id="firstName" name="firstName" type="text" autocomplete="given-name" required>
            <div class="field-error" aria-live="polite"></div>
          </div>
          <div class="field">
            <label for="lastName">Last name <span class="req">*</span></label>
            <input id="lastName" name="lastName" type="text" autocomplete="family-name" required>
            <div class="field-error" aria-live="polite"></div>
          </div>
        </div>
        <div class="field">
          <label for="company">Company <span class="req">*</span></label>
          <input id="company" name="company" type="text" autocomplete="organization" required>
          <div class="field-error" aria-live="polite"></div>
        </div>
        <div class="form-row">
          <div class="field">
            <label for="email">Email <span class="req">*</span></label>
            <input id="email" name="email" type="email" autocomplete="email" required>
            <div class="field-error" aria-live="polite"></div>
          </div>
          <div class="field">
            <label for="phone">Phone</label>
            <input id="phone" name="phone" type="tel" autocomplete="tel">
            <div class="field-error" aria-live="polite"></div>
          </div>
        </div>
        <div class="form-row">
          <div class="field">
            <label for="voltageClass">Voltage class</label>
            <select id="voltageClass" name="voltageClass">
              <option value="">Select one</option>
              <option>5 kV class</option>
              <option>15 kV class</option>
              <option>27 kV class</option>
              <option>38 kV class</option>
              <option>Not sure yet</option>
            </select>
            <div class="field-error" aria-live="polite"></div>
          </div>
          <div class="field">
            <label for="timeline">Timeline</label>
            <select id="timeline" name="timeline">
              <option value="">Select one</option>
              <option>ASAP</option>
              <option>1 to 3 months</option>
              <option>3 to 6 months</option>
              <option>6+ months</option>
            </select>
            <div class="field-error" aria-live="polite"></div>
          </div>
        </div>
        <div class="field">
          <label for="details">Project details</label>
          <textarea id="details" name="details" placeholder="Scope, ratings, quantities, site location, delivery date"></textarea>
          <div class="field-error" aria-live="polite"></div>
        </div>
        <div class="visually-hidden" aria-hidden="true">
          <label for="website">Leave this field empty</label>
          <input id="website" name="website" type="text" tabindex="-1" autocomplete="off">
        </div>
        <button class="btn btn-red" type="submit">Request a Quote</button>
      </form>
      <div id="form-status" class="form-status" role="status" tabindex="-1"></div>
    </div>

    <aside class="contact-info" aria-label="Contact information">
      <div class="contact-item">
        {icon(ICONS["mail"], "")}
        <div><h3>Email</h3><a href="mailto:{EMAIL}">{EMAIL}</a></div>
      </div>
      <div class="contact-item">
        {icon(ICONS["phone"], "")}
        <div><h3>Phone</h3><p>{phone_link()}</p></div>
      </div>
      <div class="contact-item">
        {icon(ICONS["pin"], "")}
        <div><h3>Location</h3><p>Sanborn, NY</p></div>
      </div>
      <div class="contact-item">
        {icon(ICONS["shield"], "")}
        <div><h3>Veteran Owned and Operated</h3><p>Made in the USA.</p></div>
      </div>
    </aside>
  </div>
</section>
</main>
""" + footer())


PAGES = {
    "index.html": home,
    "products.html": products,
    "industries.html": industries,
    "about.html": about,
    "contact.html": contact,
}

if __name__ == "__main__":
    for name, fn in PAGES.items():
        (ROOT / name).write_text(fn(), encoding="utf-8")
        print("wrote", name)
