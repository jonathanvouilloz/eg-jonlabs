"""
generate-configs.py
Génère les fichiers config.json pour tous les prospects P1.

Usage:
  python3 scripts/generate-configs.py
  python3 scripts/generate-configs.py --slug gt-paysages   # un seul
  python3 scripts/generate-configs.py --dry-run            # affiche sans écrire

Sortie: static/clients/[slug]/config.json
"""

import json
import os
import sys
import argparse
from datetime import date
from pathlib import Path

ROOT = Path(__file__).parent.parent
CLIENTS_DIR = ROOT / "static" / "clients"
HERO_PHOTOS = ROOT / "docs" / "prospects" / "hero-photos.json"
CREATED_AT = "2026-05-08"

# ── Palettes branding ──────────────────────────────────────────────────────────
PALETTES = {
    "deep": {
        "primaryColor": "#1B4332",
        "secondaryColor": "#F0F4F0",
        "accentColor": "#52B788",
        "fontFamily": "Inter",
    },
    "forest": {
        "primaryColor": "#2D6A4F",
        "secondaryColor": "#F4F8F4",
        "accentColor": "#74C69D",
        "fontFamily": "Inter",
    },
    "sage": {
        "primaryColor": "#386641",
        "secondaryColor": "#F5F7F0",
        "accentColor": "#A7C957",
        "fontFamily": "Inter",
    },
    "premium": {
        "primaryColor": "#1A3A2A",
        "secondaryColor": "#F2F5F2",
        "accentColor": "#D4A574",
        "fontFamily": "Plus Jakarta Sans",
    },
}

# ── Services standard paysagiste ───────────────────────────────────────────────
# iconName en lowercase pour matcher Services.svelte (leaf|scissors|tree|seedling|terrace|home|grass|watering-can)
SERVICES_STANDARD = [
    {
        "id": "entretien",
        "label": "Entretien & tonte",
        "description": "Tonte régulière, désherbage, bordures nettes — votre jardin impeccable toute l'année.",
        "icon": "🌿",
        "iconName": "leaf",
        "image": None,
        "active": True,
        "pricingCategory": "tonte",
    },
    {
        "id": "taille-haies",
        "label": "Taille de haies",
        "description": "Haies et arbustes taillés avec précision, pour un rendu propre et structuré.",
        "icon": "✂️",
        "iconName": "scissors",
        "image": None,
        "active": True,
        "pricingCategory": "taille_haies",
    },
    {
        "id": "creation-jardin",
        "label": "Création & aménagement",
        "description": "Conception et réalisation de jardins sur mesure — massifs, pelouses, allées, terrasses.",
        "icon": "🌱",
        "iconName": "seedling",
        "image": None,
        "active": True,
        "pricingCategory": "creation_jardin",
    },
    {
        "id": "contrat-annuel",
        "label": "Contrat d'entretien annuel",
        "description": "Tranquillité toute l'année : une équipe dédiée, des passages réguliers, rien à gérer.",
        "icon": "📅",
        "iconName": "watering-can",
        "image": None,
        "active": True,
        "pricingCategory": "entretien_annuel",
    },
]

# ── Fallbacks pour les champs obligatoires Zod ─────────────────────────────────
# Le schema Zod (src/lib/utils/validation.ts) refuse heroImage=null, email/phone vides.
# On utilise des fallbacks pour que toutes les configs valident, à compléter manuellement avant envoi.

FALLBACK_HERO_IMAGES = [
    "/_fallback/heroes/default.webp",
]

FALLBACK_EMAIL = "leads@jonlabs.ch"
FALLBACK_PHONE = "+41000000000"  # placeholder Zod-valide, à remplir manuellement

# ── Données prospects P1 ───────────────────────────────────────────────────────
# owner_first: "" = à compléter avant envoi
# owner_last: inféré du nom de l'entreprise si évident

PROSPECTS = [
    # ── Genève ────────────────────────────────────────────────────────────────
    {
        "slug": "paysage-dos-santos",
        "name": "Paysage Dos Santos Sàrl",
        "locality": "Vandoeuvres",
        "canton": "GE",
        "phone": "+41227003722",
        "email": "",
        "owner_first": "",
        "owner_last": "Dos Santos",
        "founded_year": 2002,
        "lat": 46.2163,
        "lng": 6.2138,
        "zones": ["Vandoeuvres", "Cologny", "Genève"],
        "radius_km": 20,
        "communes": ["Vandoeuvres", "Cologny", "Chêne-Bourg", "Chêne-Bougeries"],
        "palette": "deep",
        "tagline_suffix": "à Vandoeuvres",
    },
    {
        "slug": "perspectives-paysage",
        "name": "Perspectives Paysage Sàrl",
        "locality": "Châtelaine",
        "canton": "GE",
        "phone": "+41225660744",
        "email": "b.garboli@perspectivespaysage.com",
        "owner_first": "",  # B. Garboli — prénom à confirmer
        "owner_last": "Garboli",
        "founded_year": 2014,
        "lat": 46.2079,
        "lng": 6.1130,
        "zones": ["Châtelaine", "Meyrin", "Vernier"],
        "radius_km": 20,
        "communes": ["Châtelaine", "Meyrin", "Vernier", "Satigny"],
        "palette": "forest",
        "tagline_suffix": "à Genève",
    },
    {
        "slug": "art-paysage",
        "name": "Art & Paysage Sàrl",
        "locality": "Vernier",
        "canton": "GE",
        "phone": "+41223413000",
        "email": "",
        "owner_first": "",
        "owner_last": "",
        "founded_year": None,
        "lat": 46.2113,
        "lng": 6.0848,
        "zones": ["Vernier", "Meyrin", "Genève"],
        "radius_km": 20,
        "communes": ["Vernier", "Meyrin", "Grand-Lancy", "Châtelaine"],
        "palette": "sage",
        "tagline_suffix": "à Vernier",
    },
    {
        "slug": "gt-paysages",
        "name": "GT Paysages Sàrl",
        "locality": "Genève",
        "canton": "GE",
        "phone": "+41788580404",
        "email": "contact@gtpaysages.ch",
        "owner_first": "",
        "owner_last": "",
        "founded_year": None,
        "lat": 46.1933,
        "lng": 6.1493,
        "zones": ["Genève", "Carouge", "Lancy"],
        "radius_km": 20,
        "communes": ["Genève", "Carouge", "Lancy", "Thônex"],
        "palette": "deep",
        "tagline_suffix": "à Genève",
    },
    {
        "slug": "lami-paysagiste",
        "name": "lami paysagiste",
        "locality": "Genève",
        "canton": "GE",
        "phone": "+41794878416",
        "email": "",
        "owner_first": "",
        "owner_last": "Lami",
        "founded_year": None,
        "lat": 46.2065,
        "lng": 6.1423,
        "zones": ["Genève", "Plainpalais", "Carouge"],
        "radius_km": 20,
        "communes": ["Genève", "Carouge", "Lancy", "Onex"],
        "palette": "forest",
        "tagline_suffix": "à Genève",
    },
    {
        "slug": "mej-paysagiste",
        "name": "M.E.J. - Paysagiste Sàrl",
        "locality": "Genève",
        "canton": "GE",
        "phone": "+41227007010",
        "email": "info@mejsarl.ch",
        "owner_first": "",
        "owner_last": "",
        "founded_year": None,
        "lat": 46.1989,
        "lng": 6.1600,
        "zones": ["Genève", "Champel", "Eaux-Vives"],
        "radius_km": 20,
        "communes": ["Genève", "Thônex", "Chêne-Bougeries", "Cologny"],
        "palette": "premium",
        "tagline_suffix": "à Genève",
    },
    {
        "slug": "paillard-paysages",
        "name": "Paillard Paysages",
        "locality": "Le Solliat",
        "canton": "VD",
        "phone": "+41796551594",
        "email": "paillardpaysages@hotmail.ch",
        "owner_first": "",
        "owner_last": "Paillard",
        "founded_year": None,
        "lat": 46.6440,
        "lng": 6.6940,
        "zones": ["Moudon", "Payerne", "Broye"],
        "radius_km": 25,
        "communes": ["Le Solliat", "Moudon", "Payerne", "Lucens"],
        "palette": "sage",
        "tagline_suffix": "dans la Broye",
    },
    {
        "slug": "a-gezim-paysagiste",
        "name": "A. Gezim Paysagiste Sàrl",
        "locality": "Genève",
        "canton": "GE",
        "phone": "",
        "email": "",
        "owner_first": "Gezim",
        "owner_last": "",
        "founded_year": None,
        "lat": 46.2124,
        "lng": 6.1490,
        "zones": ["Genève", "Plainpalais"],
        "radius_km": 20,
        "communes": ["Genève", "Carouge", "Lancy", "Onex"],
        "palette": "forest",
        "tagline_suffix": "à Genève",
    },
    {
        "slug": "berisha-jardins",
        "name": "BERISHA Jardins Sàrl",
        "locality": "Plan-les-Ouates",
        "canton": "GE",
        "phone": "+41762192629",
        "email": "berishajardins@hotmail.com",
        "owner_first": "Remzi",
        "owner_last": "Berisha",
        "founded_year": None,
        "lat": 46.1721,
        "lng": 6.1060,
        "zones": ["Plan-les-Ouates", "Lancy", "Carouge"],
        "radius_km": 20,
        "communes": ["Plan-les-Ouates", "Lancy", "Carouge", "Bernex"],
        "palette": "deep",
        "tagline_suffix": "à Plan-les-Ouates",
    },
    {
        "slug": "de-gand-paysage",
        "name": "De Gand Paysage",
        "locality": "Chêne-Bourg",
        "canton": "GE",
        "phone": "+41786238281",
        "email": "info@degandpaysage.ch",
        "owner_first": "Thomas",
        "owner_last": "De Gand",
        "founded_year": 2019,
        "lat": 46.1924,
        "lng": 6.1987,
        "zones": ["Chêne-Bourg", "Chêne-Bougeries", "Genève"],
        "radius_km": 20,
        "communes": ["Chêne-Bourg", "Chêne-Bougeries", "Cologny", "Vandoeuvres"],
        "palette": "forest",
        "tagline_suffix": "à Chêne-Bourg",
    },
    {
        "slug": "art-jardins",
        "name": "Art & Jardins SA",
        "locality": "Genève",
        "canton": "GE",
        "phone": "+41223494988",
        "email": "",
        "owner_first": "",
        "owner_last": "",
        "founded_year": None,
        "lat": 46.2010,
        "lng": 6.1440,
        "zones": ["Genève", "Carouge", "Lancy"],
        "radius_km": 20,
        "communes": ["Genève", "Carouge", "Lancy", "Onex"],
        "palette": "premium",
        "tagline_suffix": "à Genève",
    },
    {
        "slug": "durand-jardins",
        "name": "Durand Jardins",
        "locality": "Troinex",
        "canton": "GE",
        "phone": "+41762358576",
        "email": "durandjardins@bluewin.ch",
        "owner_first": "",
        "owner_last": "Durand",
        "founded_year": None,
        "lat": 46.1665,
        "lng": 6.1510,
        "zones": ["Troinex", "Carouge", "Bardonnex"],
        "radius_km": 20,
        "communes": ["Troinex", "Carouge", "Bardonnex", "Plan-les-Ouates"],
        "palette": "sage",
        "tagline_suffix": "à Troinex",
    },
    {
        "slug": "duchaine-paysagiste",
        "name": "Duchaine paysagiste",
        "locality": "Carouge",
        "canton": "GE",
        "phone": "+41228203544",
        "email": "",
        "owner_first": "",
        "owner_last": "Duchaine",
        "founded_year": None,
        "lat": 46.1858,
        "lng": 6.1393,
        "zones": ["Carouge", "Genève", "Lancy"],
        "radius_km": 20,
        "communes": ["Carouge", "Lancy", "Onex", "Bernex"],
        "palette": "deep",
        "tagline_suffix": "à Carouge",
    },
    {
        "slug": "manuel-cunha",
        "name": "Manuel Cunha Sàrl",
        "locality": "Meyrin",
        "canton": "GE",
        "phone": "+41788928634",
        "email": "",
        "owner_first": "Manuel",
        "owner_last": "Cunha",
        "founded_year": None,
        "lat": 46.2287,
        "lng": 6.0782,
        "zones": ["Meyrin", "Vernier", "Genève"],
        "radius_km": 20,
        "communes": ["Meyrin", "Vernier", "Satigny", "Grand-Saconnex"],
        "palette": "forest",
        "tagline_suffix": "à Meyrin",
    },
    {
        "slug": "randria-jardins",
        "name": "Randria Jardins Sàrl",
        "locality": "Choulex",
        "canton": "GE",
        "phone": "+41796477620",
        "email": "",
        "owner_first": "",
        "owner_last": "Randria",
        "founded_year": None,
        "lat": 46.2153,
        "lng": 6.2201,
        "zones": ["Choulex", "Vandoeuvres", "Meinier"],
        "radius_km": 20,
        "communes": ["Choulex", "Vandoeuvres", "Meinier", "Presinge"],
        "palette": "sage",
        "tagline_suffix": "à Choulex",
    },
    # ── Vaud ──────────────────────────────────────────────────────────────────
    {
        "slug": "chappuis-paysagiste",
        "name": "Chappuis Paysagiste",
        "locality": "Puidoux",
        "canton": "VD",
        "phone": "+41796865127",
        "email": "info@chappuis-paysagiste.ch",
        "owner_first": "",
        "owner_last": "Chappuis",
        "founded_year": None,
        "lat": 46.5333,
        "lng": 6.7667,
        "zones": ["Puidoux", "Chardonne", "Lutry"],
        "radius_km": 25,
        "communes": ["Puidoux", "Chardonne", "Lutry", "Savigny"],
        "palette": "forest",
        "tagline_suffix": "à Puidoux",
    },
    {
        "slug": "abeille-du-jardin",
        "name": "Abeille du Jardin Sàrl",
        "locality": "Gland",
        "canton": "VD",
        "phone": "+41794788377",
        "email": "info@abeilledujardin.com",
        "owner_first": "",
        "owner_last": "",
        "founded_year": None,
        "lat": 46.4171,
        "lng": 6.2668,
        "zones": ["Gland", "Rolle", "Nyon"],
        "radius_km": 25,
        "communes": ["Gland", "Rolle", "Nyon", "Prangins"],
        "palette": "sage",
        "tagline_suffix": "à Gland",
    },
    {
        "slug": "vos-paysages",
        "name": "Vos Paysages Sàrl",
        "locality": "Gland",
        "canton": "VD",
        "phone": "+41796289879",
        "email": "",
        "owner_first": "",
        "owner_last": "",
        "founded_year": None,
        "lat": 46.4171,
        "lng": 6.2668,
        "zones": ["Gland", "Nyon", "Rolle"],
        "radius_km": 25,
        "communes": ["Gland", "Nyon", "Rolle", "Prangins"],
        "palette": "deep",
        "tagline_suffix": "à Gland",
    },
    {
        "slug": "bs-paysagiste",
        "name": "BS Paysagiste Sàrl",
        "locality": "Montreux",
        "canton": "VD",
        "phone": "+41786150560",
        "email": "bspaysagiste@gmail.com",
        "owner_first": "",
        "owner_last": "",
        "founded_year": None,
        "lat": 46.4360,
        "lng": 6.9145,
        "zones": ["Montreux", "Vevey", "La Tour-de-Peilz"],
        "radius_km": 25,
        "communes": ["Montreux", "Vevey", "La Tour-de-Peilz", "Chardonne"],
        "palette": "forest",
        "tagline_suffix": "à Montreux",
    },
    {
        "slug": "pillonel-sebastien",
        "name": "Pillonel Sébastien",
        "locality": "Yverdon-les-Bains",
        "canton": "VD",
        "phone": "+41794312317",
        "email": "seb.pillonel@bluewin.ch",
        "owner_first": "Sébastien",
        "owner_last": "Pillonel",
        "founded_year": None,
        "lat": 46.7785,
        "lng": 6.6409,
        "zones": ["Yverdon-les-Bains", "Grandson", "Orbe"],
        "radius_km": 25,
        "communes": ["Yverdon-les-Bains", "Grandson", "Orbe", "Chavornay"],
        "palette": "sage",
        "tagline_suffix": "à Yverdon",
    },
    # ── Valais ────────────────────────────────────────────────────────────────
    {
        "slug": "germa-paysages",
        "name": "Germa Paysages Sàrl",
        "locality": "Monthey",
        "canton": "VS",
        "phone": "+41244712578",
        "email": "secretariat@germa-paysages.ch",
        "owner_first": "",
        "owner_last": "Germa",
        "founded_year": None,
        "lat": 46.2521,
        "lng": 6.9535,
        "zones": ["Monthey", "Saint-Maurice", "Martigny"],
        "radius_km": 25,
        "communes": ["Monthey", "Saint-Maurice", "Collombey-Muraz", "Martigny"],
        "palette": "deep",
        "tagline_suffix": "à Monthey",
    },
    {
        "slug": "joris-paysage",
        "name": "Joris Paysage",
        "locality": "Chippis",
        "canton": "VS",
        "phone": "+41797211842",
        "email": "",
        "owner_first": "Joris",
        "owner_last": "",
        "founded_year": None,
        "lat": 46.3043,
        "lng": 7.5348,
        "zones": ["Chippis", "Sierre", "Sion"],
        "radius_km": 25,
        "communes": ["Chippis", "Sierre", "Chalais", "Sion"],
        "palette": "forest",
        "tagline_suffix": "à Sierre",
    },
    # ── Fribourg ──────────────────────────────────────────────────────────────
    {
        "slug": "castella-pepinieres",
        "name": "Castella Pépinières et Jardins",
        "locality": "Pringy",
        "canton": "FR",
        "phone": "+41794507125",
        "email": "castellajardins@outlook.com",
        "owner_first": "",
        "owner_last": "Castella",
        "founded_year": None,
        "lat": 46.6082,
        "lng": 7.0582,
        "zones": ["Bulle", "Gruyères", "Broc"],
        "radius_km": 25,
        "communes": ["Pringy", "Bulle", "Broc", "Gruyères"],
        "palette": "sage",
        "tagline_suffix": "à Bulle",
    },
    {
        "slug": "jardins-pour-vous",
        "name": "Jardins pour vous Sàrl",
        "locality": "Matran",
        "canton": "FR",
        "phone": "+41797978657",
        "email": "info@jardins-pour-vous.ch",
        "owner_first": "",
        "owner_last": "",
        "founded_year": None,
        "lat": 46.8071,
        "lng": 7.1042,
        "zones": ["Matran", "Fribourg", "Villars-sur-Glâne"],
        "radius_km": 25,
        "communes": ["Matran", "Fribourg", "Givisiez", "Villars-sur-Glâne"],
        "palette": "deep",
        "tagline_suffix": "à Fribourg",
    },
    {
        "slug": "creavert-paysages",
        "name": "CréaVert Paysages",
        "locality": "Fribourg",
        "canton": "FR",
        "phone": "+41264240066",
        "email": "",
        "owner_first": "",  # P. Baechler — prénom à confirmer
        "owner_last": "Baechler",
        "founded_year": None,
        "lat": 46.8065,
        "lng": 7.1620,
        "zones": ["Fribourg", "Givisiez", "Marly"],
        "radius_km": 25,
        "communes": ["Fribourg", "Givisiez", "Marly", "Villars-sur-Glâne"],
        "palette": "forest",
        "tagline_suffix": "à Fribourg",
    },
    # ── Neuchâtel ─────────────────────────────────────────────────────────────
    {
        "slug": "rufener-jardins",
        "name": "Rufener Jardins",
        "locality": "Renan",
        "canton": "NE",
        "phone": "+41774201994",
        "email": "rufener.jardin@gmail.com",
        "owner_first": "",
        "owner_last": "Rufener",
        "founded_year": None,
        "lat": 47.1524,
        "lng": 6.9624,
        "zones": ["Renan", "Saint-Imier", "Sonvilier"],
        "radius_km": 20,
        "communes": ["Renan", "Saint-Imier", "Sonvilier", "Villeret"],
        "palette": "sage",
        "tagline_suffix": "dans le Vallon de Saint-Imier",
    },
    {
        "slug": "lesprit-vert",
        "name": "L'esprit vert",
        "locality": "La Chaux-de-Fonds",
        "canton": "NE",
        "phone": "+41792834197",
        "email": "",
        "owner_first": "",
        "owner_last": "",
        "founded_year": None,
        "lat": 47.1070,
        "lng": 6.8332,
        "zones": ["La Chaux-de-Fonds", "Le Locle"],
        "radius_km": 20,
        "communes": ["La Chaux-de-Fonds", "Le Locle", "La Sagne", "Les Brenets"],
        "palette": "deep",
        "tagline_suffix": "à La Chaux-de-Fonds",
    },
    {
        "slug": "arnaud-auberson-jardins",
        "name": "Arnaud Auberson Jardins",
        "locality": "Neuchâtel",
        "canton": "NE",
        "phone": "+41787231073",
        "email": "",
        "owner_first": "Arnaud",
        "owner_last": "Auberson",
        "founded_year": None,
        "lat": 46.9900,
        "lng": 6.9293,
        "zones": ["Neuchâtel", "Hauterive", "Peseux"],
        "radius_km": 20,
        "communes": ["Neuchâtel", "Hauterive", "Peseux", "Auvernier"],
        "palette": "forest",
        "tagline_suffix": "à Neuchâtel",
    },
]


# ── Génération ─────────────────────────────────────────────────────────────────

def years_experience(founded_year):
    if founded_year:
        return max(1, 2026 - founded_year)
    return 8  # valeur par défaut si fondation inconnue


def hero_image(slug, hero_photos, index):
    """Retourne le chemin local si une photo GMB existe, sinon une URL Unsplash de fallback."""
    url = hero_photos.get("photos", {}).get(slug)
    if url:
        return f"/clients/{slug}/hero.jpg"
    # Fallback : Unsplash neutre (rotation par index pour éviter doublons visuels)
    return FALLBACK_HERO_IMAGES[index % len(FALLBACK_HERO_IMAGES)]


def maps_embed_url(name, locality):
    import urllib.parse
    q = urllib.parse.quote(f"{name} {locality}")
    return f"https://maps.google.com/maps?q={q}&output=embed"


def subject_prefix(name):
    # Nettoyage: enlève Sàrl/SA/Sàrl etc.
    clean = name.replace(" Sàrl", "").replace(" SA", "").replace(" SNC", "").strip()
    clean = clean.upper()[:30]
    return f"[DEVIS {clean}]"


def build_config(p, hero_photos, index):
    palette = PALETTES[p["palette"]]
    tagline = f"Paysagiste {p['tagline_suffix']}"

    return {
        "slug": p["slug"],
        "industry": "paysagiste",
        "createdAt": CREATED_AT,
        "business": {
            "name": p["name"],
            "ownerFirstName": p["owner_first"],
            "ownerLastName": p["owner_last"],
            "tagline": tagline,
            "phone": p["phone"] if p["phone"] else FALLBACK_PHONE,
            "email": p["email"] if p["email"] else FALLBACK_EMAIL,
            "address": f"{p['locality']}, Suisse",
            "googleProfileUrl": None,
            "googleMapsEmbedUrl": maps_embed_url(p["name"], p["locality"]),
            "logoUrl": None,
            "googleReviewUrl": None,
            "facebookUrl": None,
            "instagramUrl": None,
        },
        "credibility": {
            "yearsExperience": years_experience(p["founded_year"]),
            "chantiersCount": None,
            "googleRating": None,
            "googleReviewsCount": 0,
            "zones": p["zones"],
            "radiusKm": p["radius_km"],
            "latitude": p["lat"],
            "longitude": p["lng"],
        },
        "branding": palette,
        "heroImage": hero_image(p["slug"], hero_photos, index),
        "quizVariant": "B",
        "services": SERVICES_STANDARD,
        "realizations": [],
        "testimonials": [],
        "faq": [],
        "leadDelivery": {
            "recipientEmail": p["email"] if p["email"] else FALLBACK_EMAIL,
            "ccEmails": ["leads@jonlabs.ch"],
            "subjectPrefix": subject_prefix(p["name"]),
        },
        "salesPage": {
            "loomVideoId": "",
            "screenshotUrl": f"/screenshots/{p['slug']}.png",
            "subtitleObservation": "",
        },
        "localMarket": {
            "monthlySearches": 0,
            "topThreeCaptureRate": 0.5,
        },
        "communes": p["communes"],
        "transparencyNote": True,
        "heroPrefix": "à",
        "heroSubline": "création et entretien de jardin",
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--slug", help="Générer uniquement ce slug")
    parser.add_argument("--exclude", action="append", default=[], help="Exclure un slug (répétable)")
    parser.add_argument("--dry-run", action="store_true", help="Afficher sans écrire")
    args = parser.parse_args()

    # Charger les URLs photos
    hero_photos = {}
    if HERO_PHOTOS.exists():
        with open(HERO_PHOTOS) as f:
            hero_photos = json.load(f)

    prospects = [
        p for p in PROSPECTS
        if (not args.slug or p["slug"] == args.slug)
        and p["slug"] not in args.exclude
    ]

    if not prospects:
        print(f"❌ Aucun prospect à générer (--slug='{args.slug}', --exclude={args.exclude})")
        sys.exit(1)

    print(f"\n🌿 generate-configs — {len(prospects)} config(s) à générer\n")

    stats = {
        "created": 0,
        "updated": 0,
        "skipped": 0,
        "missing_owner": [],
        "fallback_email": [],
        "fallback_phone": [],
        "fallback_hero": [],
    }

    for index, p in enumerate(prospects):
        config = build_config(p, hero_photos, index)
        dest_dir = CLIENTS_DIR / p["slug"]
        dest_file = dest_dir / "config.json"

        # Track champs manquants (fallback appliqué mais à compléter avant envoi)
        if not p["owner_first"] or not p["owner_last"]:
            stats["missing_owner"].append(p["slug"])
        if not p["email"]:
            stats["fallback_email"].append(p["slug"])
        if not p["phone"]:
            stats["fallback_phone"].append(p["slug"])
        if not hero_photos.get("photos", {}).get(p["slug"]):
            stats["fallback_hero"].append(p["slug"])

        if args.dry_run:
            print(f"  → {p['slug']}")
            print(f"     owner: '{p['owner_first']} {p['owner_last']}'.strip()")
            print(f"     heroImage: {config['heroImage']}")
            print(f"     business.email: {config['business']['email']}")
            print(f"     business.phone: {config['business']['phone']}")
            print()
            continue

        dest_dir.mkdir(parents=True, exist_ok=True)
        existed = dest_file.exists()

        with open(dest_file, "w", encoding="utf-8") as f:
            json.dump(config, f, ensure_ascii=False, indent="\t")
            f.write("\n")

        status = "📝 màj" if existed else "✅ créé"
        warns = []
        if p["slug"] in stats["missing_owner"]:
            warns.append("owner vide")
        if p["slug"] in stats["fallback_email"]:
            warns.append("email fallback")
        if p["slug"] in stats["fallback_phone"]:
            warns.append("phone fallback")
        if p["slug"] in stats["fallback_hero"]:
            warns.append("hero fallback")
        warn_str = f" ⚠️  {', '.join(warns)}" if warns else ""
        print(f"  {status}  {p['slug']}{warn_str}")

        if existed:
            stats["updated"] += 1
        else:
            stats["created"] += 1

    if not args.dry_run:
        print(f"\n─────────────────────────────────────────")
        print(f"✅ Créés    : {stats['created']}")
        print(f"📝 Mis à jour : {stats['updated']}")

        if stats["fallback_phone"]:
            print(f"\n🚨 Phone fallback ({len(stats['fallback_phone'])}) — placeholder {FALLBACK_PHONE}, IMPÉRATIF avant envoi:")
            for slug in stats["fallback_phone"]:
                print(f"   - static/clients/{slug}/config.json  (business.phone)")

        if stats["fallback_email"]:
            print(f"\n📧 Email fallback ({len(stats['fallback_email'])}) — utilise {FALLBACK_EMAIL}, à compléter avant envoi:")
            for slug in stats["fallback_email"]:
                print(f"   - static/clients/{slug}/config.json  (business.email)")

        if stats["fallback_hero"]:
            print(f"\n🖼️  Hero fallback ({len(stats['fallback_hero'])}) — Unsplash neutre, à remplacer par photo GMB ou locale:")
            for slug in stats["fallback_hero"]:
                print(f"   - static/clients/{slug}/config.json  (heroImage)")

        if stats["missing_owner"]:
            print(f"\n👤 Noms gérant manquants ({len(stats['missing_owner'])}) — à compléter avant envoi:")
            for slug in stats["missing_owner"]:
                print(f"   - static/clients/{slug}/config.json  (ownerFirstName / ownerLastName)")

        print(f"\n💡 Prochaine étape:")
        print(f"   node scripts/fetch-heroes.mjs   ← télécharge les photos GMB")
        print(f"   npm run check-client <slug>      ← valide une config")
        print(f"   npm run dev                      ← vérifie /site/[slug]")


if __name__ == "__main__":
    main()
