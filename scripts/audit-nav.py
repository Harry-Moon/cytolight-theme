#!/usr/bin/env python3
"""Audit de la navigation CytoLight.

Extrait toutes les URL ecrites en dur dans le theme, les teste sur la boutique en
ligne, et signale trois defauts distincts :

  * 404          — le lien mene dans le vide
  * ebauche      — la page existe mais compte moins de MIN_MOTS mots
  * non traduite — FR et EN renvoient exactement le meme nombre de mots

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

RE_HREF = re.compile(r'href="(/[a-z0-9/_-]*)"')
RE_COLLECTION = re.compile(r"collections\['([a-z0-9-]+)'\]")
RE_MAIN = re.compile(r'<main[^>]*id="MainContent"[^>]*>(.*?)</main>', re.S)
RE_NOISE = re.compile(r"<(script|style|svg)[^>]*>.*?</\1>", re.S)
RE_TAG = re.compile(r"<[^>]+>")


def collecter_urls() -> list[str]:
    """Toutes les URL internes ecrites en dur dans le theme."""
    urls = set()
    for dossier in DOSSIERS:
        for fichier in (RACINE / dossier).rglob("*.liquid"):
            texte = fichier.read_text(encoding="utf-8", errors="ignore")
            urls.update(RE_HREF.findall(texte))
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


def auditer(base: str, chemin: str) -> dict:
    code_fr, mots_fr = mesurer(base + chemin)
    code_en, mots_en = mesurer(f"{base}/en{chemin}")
    return {
        "chemin": chemin,
        "code_fr": code_fr, "mots_fr": mots_fr,
        "code_en": code_en, "mots_en": mots_en,
    }


def main() -> int:
    parseur = argparse.ArgumentParser(description=__doc__)
    parseur.add_argument("--base", default=BASE_DEFAUT, help="Racine de la boutique")
    parseur.add_argument("--min-mots", type=int, default=MIN_MOTS_DEFAUT,
                         help="Seuil en dessous duquel une page est une ebauche")
    args = parseur.parse_args()
    base = args.base.rstrip("/")

    chemins = collecter_urls()
    print(f"{len(chemins)} URL extraites du theme — test sur {base}\n")

    resultats = []
    for i, chemin in enumerate(chemins, 1):
        resultats.append(auditer(base, chemin))
        print(f"\r  {i}/{len(chemins)}", end="", file=sys.stderr, flush=True)
        time.sleep(ENTRE_REQUETES)
    print("\r" + " " * 20 + "\r", end="", file=sys.stderr)

    casses, ebauches, non_traduites = [], [], []
    for r in resultats:
        if r["code_fr"] != 200:
            casses.append(r)
            continue
        if r["mots_fr"] < args.min_mots:
            ebauches.append(r)
        if r["code_en"] == 200 and r["mots_fr"] == r["mots_en"] and r["mots_fr"] > 0:
            non_traduites.append(r)

    brides = [r for r in casses if r["code_fr"] == 429]
    casses = [r for r in casses if r["code_fr"] != 429]

    if brides:
        print(f"⚠ {len(brides)} URL non testees — Shopify a bride la connexion (429).")
        print("  Relancer plus tard ; ce n'est pas un defaut du site.\n")

    if casses:
        print(f"■ LIENS CASSES ({len(casses)})")
        for r in sorted(casses, key=lambda r: r["chemin"]):
            print(f"   HTTP {r['code_fr'] or '---'}  {r['chemin']}")
        print()

    if ebauches:
        print(f"■ EBAUCHES — moins de {args.min_mots} mots ({len(ebauches)})")
        for r in sorted(ebauches, key=lambda r: r["mots_fr"]):
            print(f"   {r['mots_fr']:>5} mots  {r['chemin']}")
        print()

    if non_traduites:
        print(f"■ NON TRADUITES — FR et EN identiques ({len(non_traduites)})")
        for r in sorted(non_traduites, key=lambda r: r["chemin"]):
            print(f"   {r['mots_fr']:>5} mots  {r['chemin']}")
        print()

    sains = len(resultats) - len({r["chemin"] for r in casses + ebauches + non_traduites})
    print(f"── {sains} saines / {len(resultats)} testees ──")
    return 1 if casses else 0


if __name__ == "__main__":
    sys.exit(main())
