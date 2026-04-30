# Process d'acquisition & Échantillon Gratuit

## 🎯 Stratégie globale

**30-40 prospects qualifiés à la main** (paysagistes Genève/Vaud sans site ou site nul).

Approche **2 niveaux** selon priorité :

| Niveau                             | Volume | Effort                   | Conversion attendue  |
| ---------------------------------- | ------ | ------------------------ | -------------------- |
| Top 10 prospects (les plus juteux) | 10     | 1h/prospect = 10h        | 15-25% = 1-3 clients |
| Suivants 20-30 (qualifiés)         | 20-30  | 30 min/prospect = 10-15h | 5-10% = 1-3 clients  |

**Objectif réaliste : 3-5 clients design partners signés sur ce premier batch.**

---

## 🥇 Top 10 — Combo PDF audit + Page formulaire personnalisée

### Étape 1 — Audit (30 min/prospect)

- Screenshot fiche GMB actuelle
- Screenshot fiche GMB du meilleur concurrent local
- Recherche position Google sur 3 requêtes ("paysagiste [commune]", etc.)
- Calcul aversion à la perte personnalisé (volume zone × Top 3 % × conversion × ticket moyen)

### Étape 2 — Page formulaire personnalisée (45 min/prospect)

- URL : `jonlabs.ch/demo/[nom-paysagiste]`
- Couleurs et logo du paysagiste (récupérés sur sa page Facebook ou sa camionnette)
- Questions qualifiantes : type chantier / zone / budget / urgence
- Email notification automatique vers son adresse

### Étape 3 — PDF d'audit personnalisé (30 min avec template)

4 pages structurées :

**Page 1 — Audit visuel**

- Avant/après visuel : sa fiche vs concurrent Top 3
- Verdict en 1 phrase : "Tu rates X chantiers/mois"

**Page 2 — Calcul aversion à la perte**

- Volume Google sur sa zone (chiffres CSV réels)
- Top 3 captures 40-55% des clics
- Conversion estimée → CHF perdus/mois

**Page 3 — La démo**

- Screenshot de SA page formulaire personnalisée
- Lien cliquable + QR code
- Texte : "Cette page existe vraiment, à tes couleurs. Scan le QR et essaie."

**Page 4 — Ce qu'on ferait ensemble**

- Les 3 piliers résumés
- Pricing pack Complet
- Garantie Top 3
- CTA Calendly

### Étape 4 — Email d'envoi

**Objet :** Marc, j'ai préparé un truc pour toi (PDF + démo)

**Corps :**

```
Salut Marc,

J'ai analysé ta présence sur Google et préparé deux choses :

1. Un audit chiffré de ce que tu rates chaque mois
   (PDF en pièce jointe)

2. Une démo live d'un formulaire de devis à tes couleurs :
   jonlabs.ch/demo/marc-paysagiste

Le PDF te dit combien de chantiers tu loupes par mois
(chiffres Google réels, pas du blabla).

La démo te montre concrètement ce que je sais faire en 1h.

Si ça t'intéresse, on prend 20 min pour en parler : [Calendly]
Si ça t'intéresse pas, garde le PDF et la démo, c'est cadeau.

Jonathan
```

### Étape 5 — Relance J+5 si pas de réponse

**Objet :** Marc, t'as eu le temps de regarder ?

**Corps :**

```
Salut Marc,

Je t'ai envoyé un PDF + démo y'a 5 jours, je sais que t'es
sur le terrain en ce moment.

Une dernière chose : j'ai oublié de te dire que ton
concurrent direct [Untel Paysagiste] est en train de
récupérer les chantiers que tu pourrais avoir.
Sa fiche : [lien GMB]

Si tu veux qu'on en parle, 20 min : [Calendly]
Sinon c'est ok, je te dérangerai pas plus.

Jonathan
```

---

## 🥈 Suivants 20-30 — Version allégée (sans audit complet)

Même page formulaire personnalisée (45 min), mais **sans PDF audit**. Email plus court :

**Objet :** [Nom], j'ai créé un truc pour toi (1 lien)

**Corps :**

```
Salut [nom],

J'ai créé une démo de formulaire de devis à tes couleurs :
jonlabs.ch/demo/[nom-paysagiste]

C'est ce que je peux mettre sur ton site (si t'en as pas,
on en fait un) pour transformer tes visiteurs Google en
demandes de devis qualifiées.

Tu peux essayer le formulaire, je reçois la copie de ton côté.

Si tu veux qu'on discute, 20 min : [Calendly]

Jonathan
```

---

## ⚙️ Automatisation possible (Claude Code skill à construire)

**Skill à créer : `paysagiste-audit-generator`**

Input :

- Nom paysagiste
- Commune principale
- URL fiche GMB actuelle
- URL fiche GMB d'un concurrent
- Logo (image)
- Couleur principale (hex)

Output automatique :

- Page formulaire personnalisée déployée sur sous-domaine
- PDF audit 4 pages généré (template Astro/HTML → PDF)
- Email pré-rempli prêt à envoyer

**Temps de setup skill : 2-3 jours**
**Gain ensuite : 1h → 20 min par prospect**

---

## 📊 Tracking

Tableau Notion ou Sheet simple :

| Prospect    | Niveau | Date envoi | Ouvert ? | Cliqué démo ? | Réponse | RDV   | Signé    |
| ----------- | ------ | ---------- | -------- | ------------- | ------- | ----- | -------- |
| Marc Dupont | Top 10 | 02/05      | ✓        | ✓             | Oui J+2 | 08/05 | En cours |
| ...         | ...    | ...        | ...      | ...           | ...     | ...   | ...      |

**KPI à suivre :**

- Taux ouverture email (objectif 40%+)
- Taux clic démo (objectif 30%+ des ouvertures)
- Taux réponse (objectif 15%+)
- Taux RDV (objectif 50% des réponses)
- Taux signature (objectif 30% des RDV)

---

## 🚪 Le RDV découverte (20-30 min)

**Structure :**

1. **5 min** — Où il en est (laisser parler, écouter douleurs)
2. **5 min** — Le diagnostic local en live (montrer ses concurrents Top 3 sur Google Maps)
3. **10 min** — Présenter le pack Complet (les 3 piliers, garantie, sortie propre)
4. **5 min** — Pricing + objections + closing

**Closing :**

> "Je te propose qu'on signe aujourd'hui pour démarrer la semaine prochaine. Tu paies 50% maintenant (950 CHF), je commence le kickoff dans 7 jours. Si dans 2 semaines tu changes d'avis, je te rembourse. Ça te va ?"

**Si hésite :**

> "Qu'est-ce qui te retient ? Le prix, l'engagement, ou autre chose ?"

Ne JAMAIS faire de remise spontanée. Si demande remise → "Le prix design partner est déjà à -20%. Je peux pas baisser plus, mais je peux ajouter [upsell offert]."

---

## 📝 À préparer avant de lancer la prospection

- [ ] Liste des 30-40 paysagistes triée à la main (Google Maps + RC GE)
- [ ] Template page formulaire personnalisée (1 fois, réutilisable)
- [ ] Template PDF audit (1 fois, réutilisable)
- [ ] Calendly configuré avec créneaux 20 min
- [ ] Compte Local Falcon pour screenshots positions
- [ ] Page jonlabs.ch/paysagistes pour landing publique
- [ ] Skill Claude Code `paysagiste-audit-generator` (optionnel mais recommandé)
