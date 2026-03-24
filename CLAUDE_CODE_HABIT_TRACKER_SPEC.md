# Spécification — Habit tracker (Next.js) pour Claude Code

**Usage :** ouvre ce fichier dans le workspace et demande à Claude Code de **implémenter l’application décrite ci-dessous** (création / migration du projet selon l’état actuel du dépôt). Traite ce document comme **source de vérité** pour le périmètre fonctionnel et technique.

---

## Rôle attendu

Tu es un développeur frontend senior, expert **React**, **Next.js**, **TypeScript** et **Tailwind CSS**.

---

## Mission

Créer une application web **simple** de **gestion d’habitudes** (habit tracker).

---

## Stack technique imposée

| Technologie | Obligation |
|-------------|------------|
| Next.js | **App Router** |
| React | Oui |
| TypeScript | Oui |
| Tailwind CSS | Oui |
| Base de données | **Aucune** |
| Backend externe | **Aucun** (pas d’API maison distante, pas de BaaS) |

---

## Contraintes produit & technique

- L’application fonctionne **entièrement côté navigateur** pour la logique métier (habitudes, streak, persistance).
- Les données sont stockées **uniquement dans `localStorage`**.
- **Aucun** compte ni authentification.
- Toute personne ayant l’URL peut utiliser l’app (pas de garde d’accès applicative).
- **Aucune API externe** (pas d’appels réseau pour les données métier).

**Note d’implémentation Next.js :** utiliser des composants **`'use client'`** là où l’état, `localStorage` et les interactions le nécessitent. Le build Next.js peut rester standard ; l’important est que **la persistance et la logique de streak ne dépendent pas d’un serveur**.

---

## Fonctionnalités principales

### Actions utilisateur

1. **Ajouter** une habitude (champ **nom** uniquement).
2. **Supprimer** une habitude.
3. **Modifier** le nom d’une habitude.
4. **Marquer** une habitude comme faite **pour aujourd’hui**.
5. **Décocher** une habitude (annuler le fait « fait aujourd’hui »).

### Affichage

- Liste de toutes les habitudes.
- Pour chaque habitude afficher :
  - le **nom** ;
  - une **checkbox** ou **toggle** pour l’état **aujourd’hui** ;
  - le **streak** : nombre de **jours consécutifs** complétés.

---

## Logique du streak

- Le streak **augmente** si l’habitude est complétée **plusieurs jours d’affilée** (jours calendaires locaux).
- Le streak est **réinitialisé** si un **jour calendaire est manqué** (aucune complétion ce jour-là alors que la chaîne n’était pas tenable).
- Utiliser **uniquement la date locale du navigateur** (`Date`, éventuellement normalisée en **date locale** type `YYYY-MM-DD` pour comparaisons), **pas** d’horloge serveur.

### Précisions pour l’implémentation (à respecter)

- Définir clairement ce qu’est **« aujourd’hui »** : jour civil selon le fuseau du navigateur.
- Pour le streak, une approche robuste consiste à stocker par habitude au minimum :
  - l’**historique des jours complétés** (ensemble ou liste de `YYYY-MM-DD` locaux), **ou**
  - le **dernier jour complété** + un **compteur de streak** recalculé à chaque chargement / changement.
- À chaque ouverture de l’app ou changement de date (optionnel : écouter `visibilitychange` / minuit), **recalculer** le streak pour refléter un jour manqué.
- Commenter dans le code **le calcul du streak** (cas : complété aujourd’hui, hier, trou dans la série).

---

## Persistance (`localStorage`)

- Toutes les données nécessaires (liste d’habitudes, complétions par jour, etc.) sont **sérialisées** (JSON recommandé) dans `localStorage`.
- Au **rechargement** de la page, l’état doit être **restauré** sans perte.
- Gérer proprement :
  - clé de stockage **stable** (préfixe du type `habit-tracker:`) ;
  - **JSON invalide** ou données absentes → repartir d’un état initial vide sans crash.
- **Commenter dans le code** la stratégie de lecture / écriture `localStorage` (quand sauvegarder, format des données).

---

## UI / UX

- Interface **moderne**, **propre**, **minimaliste**.
- **Responsive**, **mobile first**.
- **Tailwind** pour la mise en forme et une esthétique soignée.
- Expérience **fluide** et **rapide** (pas de surcharge).
- **Micro-interactions** simples : hover, transitions CSS.

### Bonus (si rapide à faire)

- Icône ou libellé **🔥** associé au streak.
- **Mode sombre** (préférence utilisateur + `localStorage` ou `prefers-color-scheme`).
- **Animation légère** lors du check d’une habitude.

---

## Architecture & qualité de code

- Code **propre**, **lisible**, **bien structuré**.
- **Composants React réutilisables** (ex. ligne d’habitude, formulaire d’ajout, en-tête).
- Gestion d’état **simple** : `useState` / `useEffect` (ou hooks maison minces) — pas d’obligation de lib externe.
- **Séparation** nette entre :
  - **logique** (streak, persistance, types) ;
  - **UI** (composants présentation).

---

## Livrable attendu

- **Tout le code** nécessaire pour lancer le projet (`next dev`, `next build`).
- **Structure de fichiers** Next.js (App Router) **claire** (ex. `app/`, `components/`, `lib/` ou `hooks/`).
- **Commentaires ciblés** dans le code pour :
  - la gestion du `localStorage` ;
  - le calcul du streak.

---

## Contexte dépôt actuel (à prendre en compte)

Ce dépôt peut encore contenir une **app statique** (`html/`, `Dockerfile` nginx). Lors de l’implémentation Next.js :

- soit **remplacer** progressivement par une app Next (et adapter le `Dockerfile` / build si demandé ensuite) ;
- soit créer l’app Next dans une structure cohérente et indiquer les fichiers obsolètes.

**Ne pas** introduire de base de données ni d’API externe pour les habitudes.

---

## Critères d’acceptation (checklist)

- [ ] Ajouter / supprimer / renommer une habitude.
- [ ] Cocher / décocher « fait aujourd’hui ».
- [ ] Streak correct après plusieurs jours simulés (tests manuels ou logique vérifiable).
- [ ] Streak remis à zéro (ou recalculé) si un jour est sauté.
- [ ] Persistance : rechargement de page sans perte de données.
- [ ] Aucune auth, aucune API métier externe.
- [ ] UI responsive, Tailwind, expérience agréable.

---

## Expression de besoin initiale (référence verbatim)

> Tu es un développeur frontend senior expert en React, Next.js, TypeScript et Tailwind CSS.  
> Ta mission est de créer une application web simple de gestion d’habitudes (habit tracker).  
> Stack : Next.js App Router, React, TypeScript, Tailwind, pas de BDD, pas de backend externe.  
> Tout côté navigateur, `localStorage` uniquement, pas de compte, pas d’API externe.  
> Fonctions : CRUD nom + cocher/décocher aujourd’hui, affichage liste + streak.  
> Streak : jours consécutifs, reset si jour manqué, date locale navigateur.  
> UI moderne minimaliste, responsive, micro-interactions ; bonus 🔥, dark mode, animation au check.  
> Architecture propre, composants réutilisables, état simple, commentaires sur localStorage et streak.

---

*Document généré pour guider Claude Code — à faire évoluer avec le produit.*
