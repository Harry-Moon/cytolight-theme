#!/usr/bin/env python3
"""Audit de la navigation CytoLight.

Extrait toutes les URL ecrites en dur dans le theme, les teste sur la boutique en
ligne, et signale trois defauts distincts :

  * 404          — le lien mene dans le vide
  * ebauche      — la page existe mais compte moins de MIN_MOTS mots
  * non traduite — les deux langues renvoient exactement le meme nombre de mots

Les prefixes de langue ne sont pas ecrits en dur : Shopify Markets attache la
langue principale au DOMAINE. Sur `antared.care` le francais est a la racine et
l'anglais sous `/en` ; sur `cytolight.myshopify.com` — le defaut de --base —
c'est l'inverse. Ils sont donc lus sur la boutique testee.

Aucune dependance : bibliotheque standard Python 3 uniquement, conformement au
principe IV de la constitution.

    python3 scripts/audit-nav.py
    python3 scripts/audit-nav.py --base https://cytolight.myshopify.com
    python3 scripts/audit-nav.py --min-mots 250
"""

import argparse
import re
import time
import ssl
import sys
import urllib.error
import urllib.request
from pathlib import Path

RACINE = Path(__file__).resolve().parent.parent
DOSSIERS = ("sections", "snippets", "templates", "layout")
BASE_DEFAUT = "https://cytolight.myshopify.com"
MIN_MOTS_DEFAUT = 200
DELAI_429 = 20      # secondes avant la 1re nouvelle tentative
ENTRE_REQUETES = 0.4  # politesse : Shopify bride le storefront
UA = "Mozilla/5.0 (CytoLight nav audit)"

# Trois formes coexistent dans le theme, et l'extracteur doit voir les trois.
# La deuxieme est devenue la norme le 2026-09-01 : un lien interne ecrit en dur
# perd le prefixe de langue, donc il porte desormais `locale_root`. Tant que ce
# motif manquait ici, l'audit ne voyait plus que 7 URL sur 40 et se declarait
# vert sur une navigation qu'il n'avait pas testee.
RE_HREF = re.compile(r'href="(/[a-z0-9/_-]*)"')
RE_HREF_LOCALISE = re.compile(r'href="\{\{ locale_root \}\}(/[a-z0-9/_-]*)"')
# Le chemin doit se terminer par un segment : `append: '/pages/'` est un
# prefixe complete par une variable a la ligne suivante, pas une URL.
RE_APPEND = re.compile(r"append: '(/[a-z0-9/_-]*[a-z0-9_-])'")
RE_COLLECTION = re.compile(r"collections\['([a-z0-9-]+)'\]")
RE_MAIN = re.compile(r'<main[^>]*id="MainContent"[^>]*>(.*?)</main>', re.S)
RE_NOISE = re.compile(r"<(script|style|svg)[^>]*>.*?</\1>", re.S)
RE_TAG = re.compile(r"<[^>]+>")
RE_LANG_RACINE = re.compile(r'<html[^>]+lang="([a-z]{2})', re.I)
RE_LOCALE_CODE = re.compile(r'name="locale_code"\s+value="([a-z]{2})"')
LOCALES_REPLI = (("fr", ""), ("en", "/en"))


RE_MOT_DE_PASSE = re.compile(
    r"<title>\s*(?:Please Log In|Mot de passe|Password)\s*</title>"
    r"|name=[\"']password[\"'][^>]*type=[\"']password[\"']", re.I)


def collecter_urls() -> list[str]:
    """Toutes les URL internes ecrites en dur dans le theme."""
    urls = set()
    for dossier in DOSSIERS:
        for fichier in (RACINE / dossier).rglob("*.liquid"):
            texte = fichier.read_text(encoding="utf-8", errors="ignore")
            urls.update(RE_HREF.findall(texte))
            urls.update(RE_HREF_LOCALISE.findall(texte))
            urls.update(RE_APPEND.findall(texte))
            urls.update(f"/collections/{c}" for c in RE_COLLECTION.findall(texte))
    urls.discard("/")
    return sorted(urls)


def mesurer(url: str, essais: int = 5) -> tuple[int, int]:
    """Renvoie (code HTTP, nombre de mots visibles dans <main>).

    Shopify limite le debit du storefront. Un 429 n'est pas un lien casse, c'est
    une demande d'attendre : on respecte l'en-tete Retry-After quand il est la,
    sinon on double le delai a chaque tentative. Rapporter un 429 comme un defaut
    du site rendrait l'audit inutilisable — c'est precisement le bug qui a fait
    passer 42 pages saines pour cassees.
    """
    requete = urllib.request.Request(url, headers={"User-Agent": UA})
    delai = DELAI_429
    for tentative in range(essais):
        try:
            with urllib.request.urlopen(
                requete, timeout=30, context=ssl.create_default_context()
            ) as reponse:
                html = reponse.read().decode("utf-8", "ignore")
                code = reponse.status
            break
        except urllib.error.HTTPError as err:
            if err.code == 429 and tentative < essais - 1:
                attente = err.headers.get("Retry-After")
                time.sleep(int(attente) if (attente or "").isdigit() else delai)
                delai *= 2
                continue
            return err.code, 0
        except Exception:
            return 0, 0
    else:
        return 429, 0

    corps = RE_MAIN.search(html)
    texte = RE_TAG.sub(" ", RE_NOISE.sub(" ", corps.group(1) if corps else ""))
    return code, len(re.sub(r"\s+", " ", texte).strip().split())


def lire(url: str) -> str:
    """Le HTML brut d'une page, ou une chaine vide si elle ne repond pas."""
    try:
        requete = urllib.request.Request(url, headers={"User-Agent": UA})
        with urllib.request.urlopen(
                requete, timeout=30, context=ssl.create_default_context()) as reponse:
            return reponse.read().decode("utf-8", "ignore")
    except Exception:
        return ""


def detecter_locales(base: str, accueil: str) -> tuple:
    """Les langues publiees et leur prefixe, lus sur la boutique testee.

    La racine vient de <html lang>, les autres langues des boutons du selecteur
    du header, et chaque prefixe candidat est verifie avant d'etre retenu. Sans
    cela le controle de parite comparait une page a une URL en 404 : la condition
    `code_autre == 200` ne passait jamais et le defaut ne se signalait plus.
    """
    racine = RE_LANG_RACINE.search(accueil or "")
    if not racine:
        return LOCALES_REPLI
    principale = racine.group(1)
    locales = [(principale, "")]
    for code in sorted(set(RE_LOCALE_CODE.findall(accueil))):
        if code == principale:
            continue
        if RE_LANG_RACINE.search(lire(f"{base}/{code}")):
            locales.append((code, f"/{code}"))
    return tuple(locales) if len(locales) > 1 else LOCALES_REPLI


def auditer(base: str, chemin: str, locales: tuple) -> dict:
    (langue_a, prefixe_a), (langue_b, prefixe_b) = locales[0], locales[1]
    code_a, mots_a = mesurer(f"{base}{prefixe_a}{chemin}")
    code_b, mots_b = mesurer(f"{base}{prefixe_b}{chemin}")
    return {
        "chemin": chemin,
        "langue_a": langue_a, "code_a": code_a, "mots_a": mots_a,
        "langue_b": langue_b, "code_b": code_b, "mots_b": mots_b,
    }


def main() -> int:
    parseur = argparse.ArgumentParser(description=__doc__)
    parseur.add_argument("--base", default=BASE_DEFAUT, help="Racine de la boutique")
    parseur.add_argument("--min-mots", type=int, default=MIN_MOTS_DEFAUT,
                         help="Seuil en dessous duquel une page est une ebauche")
    args = parseur.parse_args()
    base = args.base.rstrip("/")

    # Une vitrine protegee repond 200 en servant la page de mot de passe. Sans ce
    # garde-fou, l'audit decrit cette page et conclut que tout le site fait 31 mots
    # et n'est pas traduit.
    accueil = lire(base + "/")
    if RE_MOT_DE_PASSE.search(accueil):
        print("La vitrine est protegee par mot de passe : l'audit decrirait\n"
              "cette page et pas la boutique. Levez la protection dans\n"
              "Online Store > Preferences, ou visez un theme de developpement\n"
              "avec --base http://127.0.0.1:9292")
        return 2

    locales = detecter_locales(base, accueil)
    chemins = collecter_urls()
    paire = " / ".join(l.upper() for l, _ in locales[:2])
    print(f"{len(chemins)} URL extraites du theme — test sur {base} en {paire}\n")

    resultats = []
    for i, chemin in enumerate(chemins, 1):
        resultats.append(auditer(base, chemin, locales))
        print(f"\r  {i}/{len(chemins)}", end="", file=sys.stderr, flush=True)
        time.sleep(ENTRE_REQUETES)
    print("\r" + " " * 20 + "\r", end="", file=sys.stderr)

    casses, ebauches, non_traduites = [], [], []
    for r in resultats:
        if r["code_a"] != 200:
            casses.append(r)
            continue
        if r["mots_a"] < args.min_mots:
            ebauches.append(r)
        if r["code_b"] == 200 and r["mots_a"] == r["mots_b"] and r["mots_a"] > 0:
            non_traduites.append(r)

    brides = [r for r in casses if r["code_a"] == 429]
    casses = [r for r in casses if r["code_a"] != 429]

    if brides:
        print(f"⚠ {len(brides)} URL non testees — Shopify a bride la connexion (429).")
        print("  Relancer plus tard ; ce n'est pas un defaut du site.\n")

    if casses:
        print(f"■ LIENS CASSES ({len(casses)})")
        for r in sorted(casses, key=lambda r: r["chemin"]):
            print(f"   HTTP {r['code_a'] or '---'}  {r['chemin']}")
        print()

    if ebauches:
        print(f"■ EBAUCHES — moins de {args.min_mots} mots ({len(ebauches)})")
        for r in sorted(ebauches, key=lambda r: r["mots_a"]):
            print(f"   {r['mots_a']:>5} mots  {r['chemin']}")
        print()

    if non_traduites:
        print(f"■ NON TRADUITES — {paire} identiques ({len(non_traduites)})")
        for r in sorted(non_traduites, key=lambda r: r["chemin"]):
            print(f"   {r['mots_a']:>5} mots  {r['chemin']}")
        print()

    sains = len(resultats) - len({r["chemin"] for r in casses + ebauches + non_traduites})
    print(f"── {sains} saines / {len(resultats)} testees ──")
    return 1 if casses else 0


if __name__ == "__main__":
    sys.exit(main())
