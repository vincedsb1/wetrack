Spécifications fonctionnelles V1 — PWA “Rituels de notes”

1. Objectif produit

Créer une PWA iOS/Android permettant de suivre des rituels de questions notées à fréquence régulière (couple, mais extensible), avec :

création de rituels (participants + questions + échelle + fréquence)

saisie guidée des réponses

historique daté

graphiques d’évolution (4 modes)

stockage local offline first (IndexedDB)

export/import JSON avec fusion sans perte

Aucun backend en V1.

2. Périmètre V1
   Inclus

PWA installable sur iOS (mode standalone)

Création / consultation / suppression de rituels

Ajout de participants (prénom + couleur), fixes ensuite

Ajout de questions fixes (texte), ordre modifiable par drag & drop à la création

Choix échelle globale par rituel : 5, 10, 20, 100 (fixe)

Choix fréquence par rituel : daily / weekly / monthly (fixe)

Flow de réponses “wizard” :

questions dans l’ordre

chaque participant répond à chaque question

navigation fluide “tap → étape suivante”

bouton “précédent”

Création d’une entrée complète datée

Historique listé, détail d’entrée, suppression d’entrée

4 types de graphiques en courbe

Export JSON complet

Import JSON complet avec fusion intelligente

Mode offline obligatoire

Exclu

Édition des participants après création

Édition des questions après création

Changement d’échelle après création

Ajout manuel d’entrées dans le passé

Notifications

Auth/login/PIN

Synchronisation cloud / multi-device

Partage à plusieurs téléphones

3. Terminologie

Rituel : élément principal (ex : “Couple”).

Participant : personne qui répond (ex : “Moi”, “Elle”).

Question : item noté (fixe).

Entrée : session datée de réponses complètes.

Réponse : note d’un participant pour une question lors d’une entrée.

4. Modèle de données (source de vérité)

Toutes les données sont stockées en IndexedDB sous forme de JSON sérialisable.

4.1 Rituel
type Ritual = {
id: string; // UUID
title: string; // ex "Couple"
scale: 5 | 10 | 20 | 100; // échelle globale
frequency: "daily" | "weekly" | "monthly";
participants: Participant[];
questions: Question[];  
 entries: Entry[];  
 createdAt: string; // ISO date
updatedAt: string; // ISO date
};

4.2 Participant
type Participant = {
id: string; // UUID
name: string; // prénom
color: string; // hex #RRGGBB
};

4.3 Question
type Question = {
id: string; // UUID
text: string; // texte fixe
order: number; // ordre d’affichage
};

4.4 Entry

Une entrée est toujours complète (toutes les questions \* toutes les personnes).

type Entry = {
id: string; // UUID
ritualId: string;
createdAt: string; // ISO date de fin du wizard
responses: Response[];
};

4.5 Response
type Response = {
questionId: string;
participantId: string;
value: number; // entier entre 1 et scale
};

5. Stockage local / offline
   5.1 Source de persistance

IndexedDB via une lib fiable (idb, dexie, etc.)

Une “collection” rituals contenant le tableau des rituels complets.

5.2 Chargement initial

Au démarrage, charger tous les rituels.

Si aucun rituel → écran home vide avec CTA “Créer un rituel”.

5.3 Mise à jour

Toute création/suppression/modification de rituel ou d’entrée met à jour :

IndexedDB

updatedAt du rituel concerné

5.4 Offline first

L’app doit être pleinement fonctionnelle sans réseau.

Service Worker :

cache statique des assets

stratégie “cache first” pour UI

aucune dépendance réseau pour les données

6. Import / Export JSON
   6.1 Export
   Fonctionnement

Depuis un écran “Paramètres / Données”

Bouton Exporter

Génère un fichier JSON téléchargeable contenant l’intégralité de la base.

Format
{
"version": 1,
"exportedAt": "2025-11-23T12:34:56.000Z",
"rituals": [ ...Ritual[] ]
}

6.2 Import avec fusion (sans perte)
Fonctionnement

Bouton Importer

L’utilisateur sélectionne un fichier .json

Validation minimale :

présence de rituals array

chaque rituel contient id, title, scale, frequency, participants, questions, entries

Algorithme de fusion

Pour chaque rituel importé :

Rituel

si id absent localement → ajouter tel quel

sinon → fusionner champs

Participants

union par participant.id

Questions

union par question.id

conserver order importé si collision (priorité import)

Entrées

union par entry.id

si collision id → ignorer l’importée

pas de dédoublonnage par date

Tri

trier entries par createdAt croissant

trier questions par order croissant

updatedAt

recalcul = max(date locale, date importée)

7. Règles métier
   7.1 Échelle

Une échelle est définie par rituel à la création.

Elle ne change jamais.

Toutes les questions utilisent la même échelle.

7.2 Fréquence

Une fréquence est définie par rituel à la création.

Elle ne change jamais.

Utilisée uniquement pour l’indicateur “à faire”.

7.3 Entrée

Une entrée est créée uniquement via le wizard.

Pas d’entrée incomplète persistée.

Date d’entrée = fin du wizard (createdAt auto).

7.4 Validation des notes

Notes strictement entières.

Bornes : 1 ≤ value ≤ scale.

Si une réponse manque → impossible de valider.

7.5 Indicateur “À faire”
Calcul

lastEntryDate = date de la dernière entrée

nextDueDate :

daily → last + 1 jour

weekly → last + 7 jours

monthly → last + 1 mois (même jour du mois)

Si now > nextDueDate → badge “À faire”.

8. Écrans & parcours utilisateur
   8.1 Écran Home — Liste des rituels

But : accès rapide aux rituels et création.

Contenu par carte rituel

Titre

fréquence (label)

échelle (ex “/5”)

participants (chips colorées)

dernière entrée (date lisible)

badge “À faire” si overdue

Actions

CTA primaire “Créer un rituel”

click carte → détail rituel

État vide

illustration simple + texte

bouton “Créer un rituel”

8.2 Écran Création rituel (wizard de création)
Étape 1 — Informations générales

Champs :

title (obligatoire)

frequency (select: daily/weekly/monthly)

scale (select: 5/10/20/100)

Validation :

title non vide

Étape 2 — Participants

UI :

1 bloc participant affiché par défaut

bouton “+ Ajouter un participant”

pour chaque participant :

champ prénom obligatoire

sélecteur couleur obligatoire

Validation :

min 1 participant

tous les champs remplis

Étape 3 — Questions

UI :

liste de questions

bouton “+ Ajouter une question”

champ texte obligatoire

drag & drop activé pour l’ordre

Validation :

min 1 question

tous les textes non vides

Étape 4 — Confirmation

afficher résumé (titre, participants, nb questions, échelle, fréquence)

bouton “Créer”

sauvegarde en IndexedDB

redirection vers détail rituel

8.3 Écran Détail rituel

Sections

1. Header / résumé

titre rituel

participants

nb questions

fréquence + échelle

bouton “Répondre maintenant”

bouton secondaire “Supprimer le rituel”

2. Graphiques

dropdown “Type de graphique” (4 modes)

dropdown “Question” visible seulement pour modes (1) et (3)

zone graphe (courbe)

3. Historique

liste des entrées (descendante par date)

chaque item :

date

moyenne globale de l’entrée

bouton “Voir détails”

bouton “Supprimer”

8.4 Écran Wizard de réponses

Préconditions

rituel a ≥ 1 participant et ≥ 1 question.

Logique de navigation

Index q sur questions triées par order.
Index p sur participants.

Ordre :

Q1-P1 → Q1-P2 → … Q1-Pn → Q2-P1 → … → Qm-Pn.

UI

Progress bar (ex : “Question 2/5” + “Participant 1/2”)

Texte question

Nom participant + couleur

Grille de notes 1..scale

Tap sur une note :

stocke en mémoire locale

passe automatiquement à l’étape suivante

Bouton “Précédent”

revient à l’étape précédente

la note précédente peut être modifiée

Fin du wizard

écran final:

récap court (moyenne couple + par personne)

bouton “Valider et enregistrer”

Validation :

toutes les réponses présentes

Sauvegarde :

création Entry

push dans entries du rituel

update IndexedDB

redirect vers écran confirmation

8.5 Écran Confirmation d’enregistrement

message “Réponses enregistrées ✅”

affichage :

moyenne globale

moyenne par participant

boutons :

“Retour au rituel”

“Home”

8.6 Écran Détail d’entrée

Affiche les réponses de façon lisible.

UI :

date en header

tableau :

lignes = questions (ordre du rituel)

colonnes = participants + colonne “moyenne question”

Bas de page :

moyenne globale entrée

bouton “Supprimer cette entrée”

8.7 Écran Paramètres / Données

section Export :

bouton “Exporter JSON”

section Import :

input file + bouton “Importer JSON”

message succès/erreur

9. Calculs & graphiques
   9.1 Notations dérivées

Pour une entrée donnée :

Score participant pour une question
= réponse brute

Moyenne participant entrée
= moyenne de ses réponses sur toutes les questions

Moyenne question entrée (globale)
= moyenne des participants pour cette question

Moyenne globale entrée
= moyenne de toutes les réponses (participants \* questions)

9.2 4 modes de graphiques

Graphes en courbe, 1 panneau à la fois.

Axe X

index d’entrée (1..N), dans l’ordre chronologique.

Axe Y

note brute (1..scale).

Tooltip

date réelle de l’entrée

valeur au point

Mode 1 — “Par personne : évolution par question”

Sélection question obligatoire

Une courbe par participant

Valeur au point = réponse du participant pour cette question à chaque entrée

Mode 2 — “Par personne : évolution moyenne”

Une courbe par participant

Valeur au point = moyenne du participant sur l’entrée

Mode 3 — “Global : moyenne par question”

Sélection question obligatoire

Une seule courbe

Valeur au point = moyenne des participants pour cette question

Mode 4 — “Global : moyenne globale”

Une seule courbe

Valeur au point = moyenne totale de l’entrée

10. Suppressions
    10.1 Supprimer un rituel

accessible depuis détail rituel

confirmation modale obligatoire :

texte clair : “Supprimer ce rituel supprimera aussi tout l’historique.”

action irréversible (v1)

après suppression → redirection Home

10.2 Supprimer une entrée

accessible depuis historique et détail entrée

confirmation modale

suppression immédiate

recalcul graphes et badges

11. Contraintes UX/UI

Design mobile first, “app-like”

Navigation simple :

Home → Rituel → Wizard / Détail entrée

Transitions rapides

Cibles tactiles ≥ 44px

Couleurs participants visibles dans UI et graphes

Feedback immédiat sur chaque tap de note

Gestion des états vides :

rituel sans entrée

historique vide

graphiques sans données

12. Contraintes techniques

Next.js (App Router recommandé)

PWA :

manifest

service worker

icons iOS

IndexedDB

Drag & drop mobile pour ordre des questions

Librairie de graphes simple (ex : Recharts)

Aucune dépendance backend.

13. Scénarios d’acceptation (tests fonctionnels)

Créer rituel

Je crée un rituel avec titre, fréquence, échelle, 2 participants, 5 questions.

Il apparaît sur Home.

Répondre

Je lance “Répondre maintenant”.

Je note Q1 P1 puis Q1 P2 etc.

Je valide.

Une entrée est créée avec date du jour.

Historique

La dernière entrée est visible dans la liste.

Cliquer “Voir détails” affiche toutes les réponses.

Graphiques

Chaque mode affiche la courbe attendue.

Les valeurs correspondent aux données.

Badge à faire

Après dépassement de fréquence, Home affiche “À faire”.

Suppression entrée

Supprimer une entrée la retire et met à jour graphes.

Suppression rituel

Supprimer un rituel le retire de Home.

Export

L’export contient tous les rituels + historique.

Import fusion

Importer 2 fois le même fichier ne crée pas de doublon.

Importer un fichier partiel n’efface rien de local.

Offline

Mettre l’app en mode avion : tout fonctionne (création, réponses, graphes, export).

14. Livrables attendus pour V1

PWA fonctionnelle installable iOS

Routes/pages correspondantes

Store IndexedDB

Components de création, wizard, historique, graphes

Import/export JSON

Styles mobile clean
