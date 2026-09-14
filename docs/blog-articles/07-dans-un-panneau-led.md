# Article 7 — Ce qu'il y a dans un panneau LED

| Champ | Français | Anglais |
|---|---|---|
| Titre | Le papillotement, la norme et le driver : ce qu'aucune fiche produit n'affiche | Flicker, the standard and the driver: what no product page shows you |
| Handle | `le-papillotement-la-norme-et-le-driver` | `flicker-the-standard-and-the-driver` |
| Page title (SEO) | Papillotement, IEC 62471, lumière bleue : la technologie d'un panneau LED | Flicker, IEC 62471, blue light: the technology inside an LED panel |
| Meta description | Une LED ne s'allume pas, elle se pilote. Le papillotement vient du driver, la sécurité photobiologique d'une norme (IEC 62471), et la lumière bleue d'un avis de l'ANSES. Trois paramètres absents des fiches, et deux tests à faire chez soi. | An LED is not switched on, it is driven. Flicker comes from the driver, photobiological safety from a standard (IEC 62471), and blue light from an ANSES opinion. Three parameters missing from spec sheets, and two tests you can run at home. |
| Extrait | Longueur d'onde, irradiance, surface : les trois chiffres d'une fiche produit. Il en manque trois autres, que presque personne ne publie — et qui décident du confort d'usage autant que de la sécurité. | Wavelength, irradiance, area: the three numbers on a spec sheet. Three more are missing, that almost nobody publishes — and they decide comfort of use as much as safety. |
| Tags | technologie, sécurité, papillotement, normes | technology, safety, flicker, standards |

---

## Corps — français

```html
<p>Une fiche produit de luminothérapie rouge parle de longueurs d'onde, d'irradiance et de nombre de LED. Elle ne parle jamais de ce qui se trouve <strong>entre la prise et la diode</strong> — et c'est pourtant là que se décident le confort d'une séance, le vieillissement de l'appareil et une partie de sa sécurité.</p>

<p>Troisième article de notre série sur la science et la technologie. Les deux précédents portaient sur <a href="/blogs/news">la différence entre laser et LED</a> et sur <a href="/blogs/news">la façon de lire une étude</a>.</p>

<h2>Une LED ne s'allume pas, elle se pilote</h2>

<p>Une diode ne se branche pas sur une tension comme une ampoule : elle exige un <strong>courant</strong> maîtrisé. Trop peu, elle éclaire faiblement ; trop, sa jonction chauffe, son rendement chute et sa durée de vie s'effondre. Entre le secteur et les diodes se trouve donc toujours un circuit qui redresse, régule et distribue : le <em>driver</em>.</p>

<p>Ce composant fait deux choses qui vous concernent directement.</p>

<p><strong>Il fixe l'intensité lumineuse.</strong> Et il le fait le plus souvent en hachant le courant très vite — allumé, éteint, allumé — plutôt qu'en le réduisant de façon continue. C'est la modulation de largeur d'impulsion, le procédé de gradation le plus répandu de l'électronique LED. À l'œil, une LED hachée à haute fréquence paraît simplement moins brillante.</p>

<p><strong>Il détermine le papillotement.</strong> Si le hachage est lent, ou si le filtrage du secteur est insuffisant, la lumière varie à une fréquence que l'œil ne perçoit pas toujours, mais que le système visuel enregistre. Ce n'est pas un défaut de la diode : c'est un choix d'alimentation.</p>

<h2>Le papillotement : une norme existe, personne ne la cite</h2>

<p>Elle s'appelle <strong>IEEE 1789-2015</strong>, et son titre dit son objet : <em>Recommended Practices for Modulating Current in High-Brightness LEDs for Mitigating Health Risks to Viewers</em> — les bonnes pratiques de modulation du courant dans les LED de forte luminosité pour réduire les risques sanitaires.</p>

<p>Son apport principal est de découper le problème par bande de fréquence, ce qui évite les raccourcis.</p>

<p><strong>Le papillotement visible, en gros de 3 à 70 Hz.</strong> C'est la zone la plus sensible : elle inclut la bande impliquée dans les crises d'épilepsie photosensible, autour de 15 à 20 Hz.</p>

<p><strong>Le papillotement non conscient, au-dessus d'environ 80 Hz.</strong> On ne le voit pas, et il reste associé dans la littérature à des maux de tête et à une fatigue visuelle lorsque la profondeur de modulation est importante.</p>

<p><strong>L'effet stroboscopique</strong>, qui peut persister bien plus haut en fréquence, et fige apparemment les objets en mouvement.</p>

<p>La recommandation pratique qui en découle est simple : plus la fréquence de modulation est élevée, plus le risque devient négligeable, la norme considérant qu'au-delà de quelques kilohertz aucun effet n'est mis en évidence.</p>

<h2>Pulser volontairement n'est pas papilloter</h2>

<p>Il faut distinguer deux choses que le mot « clignotement » confond.</p>

<p>Le <strong>papillotement subi</strong> est un défaut : personne ne l'a demandé, il vient de l'alimentation, et il n'est écrit nulle part.</p>

<p>La <strong>pulsation choisie</strong> est un réglage : une fréquence basse appliquée délibérément à la lumière, proposée par une partie des appareils du marché — les nôtres compris. Nos panneaux à sept spectres offrent une pulsation réglable de 1 à 40 Hz, et c'est écrit sur leur fiche.</p>

<p>Ces deux choses ont la même conséquence sur un point, et il vaut mieux l'écrire franchement : <strong>une lumière modulée entre quelques hertz et quelques dizaines de hertz tombe dans la bande que la littérature associe aux crises photosensibles.</strong> C'est la raison pour laquelle un antécédent d'épilepsie photosensible est une contre-indication à l'usage d'un mode pulsé, et pourquoi, dans le doute, un avis médical prévaut sur une notice — la nôtre incluse. Les autres précautions d'usage — grossesse, traitement photosensibilisant, pathologie oculaire — sont rassemblées sur <a href="/pages/comment-ca-marche">comment ça marche</a>.</p>

<p>La différence entre les deux reste entière : un paramètre affiché et réglable se coupe. Un papillotement d'alimentation, non.</p>

<h2>La sécurité photobiologique tient dans une seconde norme</h2>

<p><strong>IEC 62471</strong> — reprise en Europe sous le titre EN 62471 — définit comment évaluer la sécurité photobiologique des lampes et systèmes de lampes. Elle couvre les sources incohérentes de 200 à 3 000 nm, donc les LED, et laisse les lasers à d'autres textes. Elle mesure plusieurs risques distincts : ultraviolet, lumière bleue, thermique rétinien, infrarouge pour l'œil, et effets cutanés. Elle en tire un <strong>groupe de risque</strong>, du groupe exempt au groupe 3.</p>

<p>Le point utile pour un acheteur est ce qu'en fait l'autorité sanitaire française. Dans son expertise sur les LED, l'ANSES rappelle que seules les lampes des <strong>groupes de risque 0 ou 1</strong> ont vocation à être vendues au grand public, les groupes 2 et 3 relevant d'usages professionnels avec protections.</p>

<p>Voilà donc une question à poser à n'importe quelle marque, y compris à nous : <em>quel groupe de risque, mesuré à quelle distance, sur quel canal ?</em> Nous affichons CE et FDA listed sur chaque fiche produit. Nous n'affichons pas, à ce jour, un groupe de risque IEC 62471 appareil par appareil — tant que le rapport d'essai correspondant n'est pas sous nos yeux, l'écrire serait inventer un chiffre, et nous nous l'interdisons. C'est la même règle qui nous empêche d'afficher des étoiles avant d'avoir des avis clients vérifiés, expliquée sur <a href="/pages/nos-valeurs">nos valeurs</a>.</p>

<h2>Le canal bleu, et pourquoi il ne se traite pas comme les autres</h2>

<p>Une partie des appareils du marché — dont notre masque — embarque un canal bleu à 460 nm en plus du rouge et du proche infrarouge. Ce canal n'a pas le même statut que les autres, et il mérite d'être traité à part.</p>

<p>L'ANSES a publié en mai 2019 une expertise consacrée aux effets sanitaires des LED. Elle y confirme la toxicité de la lumière bleue pour l'œil, et pointe des effets de perturbation des rythmes biologiques et du sommeil liés à une exposition à la lumière riche en bleu le soir et la nuit — en recommandant de limiter cette exposition, en particulier chez les enfants, avant le coucher.</p>

<p>Deux conséquences concrètes, et elles ne coûtent rien à appliquer. Le bleu n'a d'intérêt que dans une routine de surface, sur la peau : c'est le spectre le moins pénétrant de la gamme, comme l'explique <a href="/pages/wavelengths">la page longueurs d'onde</a>. Et une séance qui l'utilise a sa place le matin ou en journée, pas dans l'heure qui précède le coucher. Un appareil dont les canaux s'allument séparément permet précisément de faire ce choix ; un appareil qui allume tout ensemble ne le permet pas.</p>

<h2>Deux choses que vous pouvez vérifier vous-même</h2>

<p><strong>La lumière invisible est-elle vraiment là ?</strong> Le proche infrarouge ne se voit pas à l'œil nu. Beaucoup de capteurs photo le voient encore, sous forme d'une lueur violacée : pointez la caméra d'un téléphone vers l'appareil allumé en mode proche infrarouge. Attention à la conclusion inverse : de nombreux capteurs arrière sont équipés d'un filtre infrarouge efficace, et l'absence de lueur ne prouve donc rien. La caméra frontale, souvent moins filtrée, donne parfois un meilleur résultat.</p>

<p><strong>La lumière est-elle stable ?</strong> Filmez le panneau allumé, à intensité réduite, avec l'appareil photo de votre téléphone. Des bandes sombres défilant à l'écran trahissent une modulation rapide du courant — c'est l'obturateur déroulant du capteur qui échantillonne la lumière plus vite que votre œil. Ce n'est pas une mesure, et un résultat propre ne garantit rien : un papillotement se quantifie avec un photomètre, pas avec un téléphone. Mais des bandes très marquées à intensité réduite disent quelque chose de la gradation de l'appareil.</p>

<h2>Ce que cet article ne dit pas</h2>

<p>Décrire une norme n'est pas revendiquer une conformité, et citer un avis sanitaire n'est pas une allégation de santé. Les appareils Antared sont des produits de bien-être : ils ne diagnostiquent, ne traitent et ne guérissent aucune maladie. « CE » et « FDA listed » sont des mentions réglementaires, et non la preuve d'un bénéfice clinique — un point que nous répétons parce qu'il est largement instrumentalisé dans ce secteur.</p>

<p>Aucune des références citées ici ne porte sur un appareil Antared. Les chiffres d'usage — durée, fréquence, distance — ne s'écrivent pas dans un article de blog : ils vivent sur <a href="/pages/comment-ca-marche">comment ça marche</a>, et les références scientifiques du site sur <a href="/pages/science">la page Science</a>.</p>

<h2>Sources</h2>

<ul>
  <li><cite>IEEE 1789-2015 — Recommended Practices for Modulating Current in High-Brightness LEDs for Mitigating Health Risks to Viewers</cite>. <a href="https://ieeexplore.ieee.org/document/7118618" target="_blank" rel="noopener">IEEE Xplore</a> — la norme sur le papillotement.</li>
  <li>DIAL. <a href="https://www.dial.de/en-GB/articles/ieee-1789-a-new-standard-for-evaluating-flickering-leds" target="_blank" rel="noopener">IEEE 1789: a new standard for evaluating flickering LEDs?</a> — lecture accessible des bandes de fréquence et des seuils.</li>
  <li><cite>IEC 62471:2006 — Photobiological safety of lamps and lamp systems</cite>. <a href="https://webstore.iec.ch/en/publication/7076" target="_blank" rel="noopener">IEC Webstore</a> — groupes de risque, 200 à 3 000 nm.</li>
  <li>ANSES. <a href="https://www.anses.fr/fr/content/led-et-lumiere-bleue" target="_blank" rel="noopener">LED et lumière bleue</a> — expertise de mai 2019 : toxicité pour l'œil, rythmes biologiques, groupes de risque pour l'usage domestique.</li>
  <li>Jenkins PA, Carroll JD. <cite>Photomed Laser Surg</cite> 2011;29(12):785–787. <a href="https://doi.org/10.1089/pho.2011.9895" target="_blank" rel="noopener">10.1089/pho.2011.9895</a> — les paramètres de pulsation font partie des huit à publier.</li>
</ul>
```

---

## Corps — anglais

```html
<p>A red light therapy spec sheet talks about wavelengths, irradiance and LED counts. It never talks about what sits <strong>between the wall socket and the diode</strong> — and that is where the comfort of a session, the ageing of the device and part of its safety are decided.</p>

<p>Third article in our series on science and technology. The previous two covered <a href="/en/blogs/news">the difference between laser and LED</a> and <a href="/en/blogs/news">how to read a study</a>.</p>

<h2>An LED is not switched on, it is driven</h2>

<p>A diode is not connected to a voltage like a bulb: it requires a controlled <strong>current</strong>. Too little and it glows weakly; too much and its junction heats, its efficiency drops and its lifetime collapses. Between the mains and the diodes there is therefore always a circuit that rectifies, regulates and distributes: the <em>driver</em>.</p>

<p>That component does two things that concern you directly.</p>

<p><strong>It sets the light output.</strong> And it usually does so by chopping the current very fast — on, off, on — rather than reducing it continuously. This is pulse-width modulation, the most widespread dimming method in LED electronics. To the eye, an LED chopped at high frequency simply looks dimmer.</p>

<p><strong>It determines flicker.</strong> If the chopping is slow, or the mains filtering insufficient, the light varies at a frequency the eye does not always perceive but the visual system registers. That is not a flaw of the diode: it is a power-supply choice.</p>

<h2>Flicker: a standard exists, nobody quotes it</h2>

<p>It is called <strong>IEEE 1789-2015</strong>, and its title states its purpose: <em>Recommended Practices for Modulating Current in High-Brightness LEDs for Mitigating Health Risks to Viewers</em>.</p>

<p>Its main contribution is to split the problem by frequency band, which avoids shortcuts.</p>

<p><strong>Visible flicker, roughly 3 to 70 Hz.</strong> This is the most sensitive region: it includes the band involved in photosensitive epileptic seizures, around 15 to 20 Hz.</p>

<p><strong>Unconsciously perceived flicker, above about 80 Hz.</strong> You do not see it, and it remains associated in the literature with headaches and visual fatigue when the modulation depth is large.</p>

<p><strong>Stroboscopic effects</strong>, which can persist at much higher frequencies and appear to freeze moving objects.</p>

<p>The practical recommendation that follows is simple: the higher the modulation frequency, the more negligible the risk, the standard holding that beyond a few kilohertz no effect has been evidenced.</p>

<h2>Pulsing on purpose is not flickering</h2>

<p>Two things get confused under the word "blinking".</p>

<p><strong>Unwanted flicker</strong> is a defect: nobody asked for it, it comes from the power supply, and it is written down nowhere.</p>

<p><strong>Chosen pulsing</strong> is a setting: a low frequency applied deliberately to the light, offered by a share of the devices on the market — ours included. Our seven-spectrum panels offer pulsing adjustable from 1 to 40 Hz, and it is printed on their spec sheet.</p>

<p>On one point the two have the same consequence, and it is better said plainly: <strong>light modulated between a few hertz and a few tens of hertz falls inside the band the literature associates with photosensitive seizures.</strong> That is why a history of photosensitive epilepsy is a contraindication to using a pulsed mode, and why, in any doubt, medical advice outranks a user manual — ours included. The other usage precautions — pregnancy, photosensitising medication, eye conditions — are gathered on <a href="/en/pages/comment-ca-marche">how it works</a>.</p>

<p>The difference between the two remains complete: a setting that is displayed and adjustable can be switched off. Power-supply flicker cannot.</p>

<h2>Photobiological safety sits in a second standard</h2>

<p><strong>IEC 62471</strong> — adopted in Europe as EN 62471 — defines how to assess the photobiological safety of lamps and lamp systems. It covers incoherent sources from 200 to 3,000 nm, so LEDs, and leaves lasers to other texts. It measures several distinct hazards: ultraviolet, blue light, retinal thermal, infrared to the eye, and skin effects. From these it derives a <strong>risk group</strong>, from exempt to group 3.</p>

<p>The useful point for a buyer is what the French health agency does with it. In its expertise on LEDs, ANSES notes that only lamps in <strong>risk groups 0 or 1</strong> are intended for sale to the general public, groups 2 and 3 belonging to professional use with protections.</p>

<p>So here is a question worth asking any brand, ours included: <em>which risk group, measured at what distance, on which channel?</em> We display CE and FDA listed on every product page. We do not, to date, display a per-device IEC 62471 risk group — until the corresponding test report is in front of us, writing one would mean inventing a number, and we do not allow ourselves that. It is the same rule that stops us showing star ratings before we have verified customer reviews, set out on <a href="/en/pages/nos-valeurs">our values</a>.</p>

<h2>The blue channel, and why it is not like the others</h2>

<p>Some devices on the market — ours included, on the mask — carry a 460 nm blue channel alongside red and near-infrared. That channel does not have the same status as the others, and deserves separate treatment.</p>

<p>In May 2019, ANSES published an expert assessment of the health effects of LEDs. It confirms the toxicity of blue light to the eye, and points to disruption of biological rhythms and sleep linked to evening and night-time exposure to blue-rich light — recommending that this exposure be limited, particularly for children, before bedtime.</p>

<p>Two practical consequences, and neither costs anything to apply. Blue is only of interest in a surface routine, on the skin: it is the least penetrating spectrum of the range, as <a href="/en/pages/wavelengths">the wavelengths page</a> explains. And a session using it belongs in the morning or during the day, not in the hour before bed. A device whose channels switch on separately is exactly what lets you make that choice; a device that lights everything at once does not.</p>

<h2>Two things you can check yourself</h2>

<p><strong>Is the invisible light actually there?</strong> Near-infrared cannot be seen with the naked eye. Many camera sensors still see it, as a purplish glow: point a phone camera at the device running in near-infrared mode. Beware the reverse conclusion: many rear sensors carry an effective infrared filter, so the absence of a glow proves nothing. The front camera, often less filtered, sometimes gives a better result.</p>

<p><strong>Is the light steady?</strong> Film the panel at reduced brightness with your phone camera. Dark bands rolling across the screen betray fast modulation of the current — that is the sensor's rolling shutter sampling the light faster than your eye does. It is not a measurement, and a clean result guarantees nothing: flicker is quantified with a photometer, not a phone. But heavy banding at reduced brightness tells you something about how the device dims.</p>

<h2>What this article does not say</h2>

<p>Describing a standard is not claiming compliance with it, and citing a health opinion is not a health claim. Antared devices are wellness products: they do not diagnose, treat or cure any disease. "CE" and "FDA listed" are regulatory statements, not proof of clinical benefit — a point we repeat because it is widely exploited in this industry.</p>

<p>None of the references cited here concerns an Antared device. Usage figures — duration, frequency, distance — are not written in a blog post: they live on <a href="/en/pages/comment-ca-marche">how it works</a>, and the site's scientific references on <a href="/en/pages/science">the Science page</a>.</p>

<h2>Sources</h2>

<ul>
  <li><cite>IEEE 1789-2015 — Recommended Practices for Modulating Current in High-Brightness LEDs for Mitigating Health Risks to Viewers</cite>. <a href="https://ieeexplore.ieee.org/document/7118618" target="_blank" rel="noopener">IEEE Xplore</a> — the flicker standard.</li>
  <li>DIAL. <a href="https://www.dial.de/en-GB/articles/ieee-1789-a-new-standard-for-evaluating-flickering-leds" target="_blank" rel="noopener">IEEE 1789: a new standard for evaluating flickering LEDs?</a> — an accessible reading of the frequency bands and thresholds.</li>
  <li><cite>IEC 62471:2006 — Photobiological safety of lamps and lamp systems</cite>. <a href="https://webstore.iec.ch/en/publication/7076" target="_blank" rel="noopener">IEC Webstore</a> — risk groups, 200 to 3,000 nm.</li>
  <li>ANSES. <a href="https://www.anses.fr/en/content/leds-blue-light" target="_blank" rel="noopener">LEDs and blue light</a> — May 2019 assessment: eye toxicity, biological rhythms, risk groups for domestic use.</li>
  <li>Jenkins PA, Carroll JD. <cite>Photomed Laser Surg</cite> 2011;29(12):785–787. <a href="https://doi.org/10.1089/pho.2011.9895" target="_blank" rel="noopener">10.1089/pho.2011.9895</a> — pulse parameters are among the eight to report.</li>
</ul>
```
