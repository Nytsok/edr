# Audit de Sécurité - GLPI 11.0.7

**Cible** : https://github.com/glpi-project/glpi
**Version auditée** : GLPI 11.0.7 (branche `main`, clone du 2026-04-23)
**Méthodologie** : analyse statique (SAST) du code PHP + revue des templates Twig + JavaScript + recherche CVE publiques
**Objectif** : identifier les vulnérabilités critiques exploitables

> Note : GLPI 11.0.7 est la version courante en développement. Les CVE fixées dans 11.0.6 et antérieures ne l'impactent plus, mais plusieurs motifs de code vulnérables persistent.

---

## 1. Synthèse exécutive

| Niveau | Nb | Exemples clés |
|--------|----|---------------|
| Critique | 2 | `eval()` sur `system_name` AssetDefinition (RCE admin), ReDoS upload via DocumentType |
| Élevé | 7 | XSS plugin `getHistoryEntry()`, AJAX `innerHTML`, CSRF manquant, path traversal partiel |
| Moyen | 6+ | Enumération documents, validation image faible, `exec()` git |
| Latent / non-exploitable | 3 | SQLi `$_SESSION['glpigroups']`, `users_id = '$user'`, `$target/$user_table` — voir §2.1 corrigé |

**Risque global** : la surface pré-auth est bien fermée sur 11.0.7 (aucune SQLi exploitable sans privilège identifiée par analyse statique). La surface admin reste large (RCE via `eval`, DoS upload). Les plugins tiers restent le principal angle d'attaque non couvert.

**Important** : la revue ciblée du 2026-04-23 (4 agents sur unauth / low-priv Search / inventaire-API / patch-bypass) n'a **pas** permis d'écrire une PoC SQLi avec compte sans privilège ou sans authentification. Les CVE récentes (CVE-2026-26263, CVE-2025-24799, CVE-2022-35914) sont bien corrigées.

---

## 2. Vulnérabilités critiques identifiées dans 11.0.7

### 2.1. [CORRIGÉ] Concaténation `$_SESSION['glpigroups']` — non-exploitable
**Fichiers** : `src/ITILFollowup.php:1080,1105` — `src/Ticket.php:5632,5663,5686`
**Type** : code smell / defense-in-depth (pas SQLi exploitable)
**Sévérité révisée** : **Information** (pas d'exploitabilité confirmée)

Vérification de la source de `$_SESSION['glpigroups']` dans `src/Session.php:723-799` :
```php
// Session.php:744-761 — peuplement depuis la base
$iterator = $DB->request([
    'SELECT'    => [Group_User::getTableField('groups_id'), ...],
    'FROM'      => Group_User::getTable(),
    'WHERE'     => ['users_id' => self::getLoginUserID(), ...],
]);
foreach ($iterator as $data) {
    $_SESSION["glpigroups"][] = $data["groups_id"]; // INT auto-increment
}
```

`groups_id` est un entier auto-incrémenté de `glpi_groups.id`. **Aucun chemin user→session n'existe dans le core**. La concaténation reste un mauvais motif (defense-in-depth), mais elle n'est exploitable que si :
- un plugin auth tiers peuple `$_SESSION['glpigroups']` depuis du user-input,
- une RCE/SQLi préalable permet la manipulation de session (auquel cas cette SQLi devient superflue).

**Correction pertinente malgré tout** (hardening) :
```php
$ids = array_map('intval', $_SESSION['glpigroups']);
$groups = implode(',', $ids);
```

---

### 2.2. `eval()` sur données DB - `system_name` AssetDefinition
**Fichier** : `src/Glpi/Asset/AssetDefinitionManager.php:408-510`
**Type** : Code Injection → RCE (CWE-94)
**Sévérité** : **Critique** (RCE admin)

```php
eval(<<<PHP
namespace Glpi\\CustomAsset;

use Glpi\\Asset\\Asset;

final class {$definition->getAssetClassName(false)} extends Asset {
    protected static string \$definition_system_name = '{$definition->fields['system_name']}';
    public static \$rightname = '{$rightname}';
}
PHP
);
```

Le champ `system_name` issu de la table `glpi_assetdefinitions` est interpolé dans `eval()`. Si un compte admin (ou une SQLi) permet de modifier ce champ avec une valeur comme `x'; system($_GET['c']); //`, il obtient une RCE permanente au prochain chargement.

**Impact** : RCE via compromission admin ou chaîne SQLi → exécution arbitraire dans le namespace `Glpi\CustomAsset`.

**Correction** : whitelister `system_name` via regex `^[A-Za-z_][A-Za-z0-9_]*$` côté validation ET avant injection dans `eval`, ou mieux : utiliser `class_alias` + une fabrique sans `eval`.

---

### 2.3. ReDoS dans la validation d'upload (DocumentType)
**Fichier** : `src/DocumentType.php:220-231` → `src/UploadHandler.php:637`
**Type** : Regular Expression DoS (CWE-1333)
**Sévérité** : **Critique** (DoS du service upload)

```php
self::$uploadable_patterns = '/(' . implode('|', $valid_ext_patterns) . ')/i';
// ...
if (!preg_match($this->options['accept_file_types'], $file->name)) { ... }
```

Les extensions valides (`glpi_documenttypes.ext`) peuvent contenir un motif entre `//`. Un admin (ou une SQLi ciblée) peut injecter un motif catastrophique comme `/(a+)+b/`, qui provoque un backtracking exponentiel sur un nom de fichier `aaaaaaaaaaaaaaaaaaaaaa!`.

**Impact** : indisponibilité de toute la fonctionnalité upload (tickets, documents, inventaire).

**Correction** : valider les motifs saisis (`Safe-Regex`), poser une limite `pcre.backtrack_limit`, ou convertir en simple matching de suffixe.

---

### 2.4. Rappels de CVE majeures patchées avant 11.0.7
Pour mémoire (non exploitables sur 11.0.7 mais à surveiller si déploiement plus ancien) :

| CVE / GHSA | Versions | Type | Sévérité |
|------------|----------|------|----------|
| CVE-2026-26026 (GHSA-2c98-648q-h27h) | <11.0.6 | SSTI → RCE admin | Critique |
| CVE-2026-26263 (GHSA-346p-qj3v-9rxj) | <11.0.6 | SQLi time-based **non-auth** (Search) | Élevé |
| CVE-2026-26027 (GHSA-chch-wcm9-f9cp) | <11.0.6 / <10.0.24 | Stored XSS **non-auth** (agent inventaire) | Élevé |
| GHSA-c9q3-mcxq-9vr4 | <11.0.5 | RCE via upload malicieux | Élevé |
| GHSA-f6f6-v3qr-9p5x | <11.0.5 | SSRF Webhooks | Moyen |
| CVE-2026-23624 (GHSA-5j4j-vx46-r477) | <11.0.5 | Session stealing / auth bypass | Moyen/Élevé |
| CVE-2025-24799 | ≤10.0.17 | SQLi pré-auth via inventaire XML (chainable RCE) | Critique (9.8) |
| CVE-2025-24801 | <10.0.18 | RCE authentifié (upload PHP + plugin loader) | Élevé (8.5) |
| CVE-2022-35914 | <10.0.3 / <9.5.9 | RCE **non-auth** `htmLawedTest.php` — listé CISA KEV | Critique |

---

## 3. Vulnérabilités élevées identifiées dans 11.0.7

### 3.1. XSS via hook plugin `getHistoryEntry()`
**Fichiers** : `src/Log.php:833-834` + `templates/components/logs.html.twig:125`
```php
$tmp['change'] = call_user_func($fct, $data); // pas d'échappement
```
```twig
<td colspan="2" style="width: 60%">{{ entry['change']|raw }}</td>
```
Tout plugin implémentant `getHistoryEntry()` peut retourner du HTML non échappé → XSS stocké visible par tout utilisateur consultant l'historique.

### 3.2. `innerHTML` sur réponse AJAX utilisateur-contrôlée
**Fichier** : `js/modules/IllustrationPicker/Controller.js:273`
```javascript
this.#getSearchResultsDiv().innerHTML = await response.text();
```
La réponse provient de `SearchController.php` avec un paramètre `filter` utilisateur. Nécessite audit du rendu côté serveur (contournement possible si `filter` est ré-émis dans le HTML).

### 3.3. Messages Session affichés en `|raw`
**Fichiers** : `src/Session.php:1585` + `templates/components/messages_after_redirect_alerts.html.twig:54`
L'annotation `@psalm-taint-sink html` reconnaît explicitement que `addMessageAfterRedirect()` sort les messages sans échappement. Tout appelant utilisant `sprintf()` avec une donnée utilisateur non échappée → XSS.

### 3.4. Champs personnalisés (`getFormInput|raw`)
**Fichier** : `templates/generic_show_form.html.twig:543`
```twig
{{ custom_fields[field].getFieldType().getFormInput(field, item.fields[field])|raw }}
```
Dépend de l'implémentation du type ; tout type retournant du HTML contenant la valeur utilisateur non échappée est vulnérable.

### 3.5. CSRF — protection non explicite sur handlers de formulaires
**Fichier** : `front/document.form.php:46-96`
Le code s'appuie sur `$doc->check()` pour les droits mais aucun `Session::checkCSRF($_POST)` explicite. Depuis 11.0, GLPI migre vers `Sec-Fetch-Site`/`Origin` (voir CHANGELOG 11.0.0) — à vérifier que le middleware est bien appliqué à toutes les routes `front/`.

### 3.6. Path traversal — blocklist incomplète
**Fichier** : `src/Document.php:1044-1048`
```php
if (str_contains($filename, '/') || str_contains($filename, '\\')) { ... }
```
Blocklist uniquement sur `/` et `\`. Repose sur des hypothèses d'encodage PHP. Préférer une whitelist stricte `^[A-Za-z0-9._-]+$`.

### 3.7. Endpoints AJAX sans `Session::checkLoginUser()` explicite
**Fichiers** : 118+ fichiers dans `ajax/` — ex. `ajax/2fa.php:40-44` régénère les codes de backup 2FA sur la seule présence d'une session :
```php
if (isset($_POST['regenerate_backup_codes'])) {
    $codes = $totp->regenerateBackupCodes(Session::getLoginUserID());
    echo json_encode($codes);
}
```
Si le bootstrap global n'impose pas auth + CSRF sur `/ajax/*`, un attaquant avec une session partielle (pré-2FA) pourrait régénérer ses codes.

---

## 4. Vulnérabilités moyennes

| # | Fichier/Ligne | Description | Type |
|---|---------------|-------------|------|
| M1 | `src/Ticket.php:5648,5677` | `users_id = '$user'` interpolé (mitigé par numérique mais non échappé) | SQLi latent |
| M2 | `src/UploadHandler.php:580-612` | Validation image par `imagetype()` — polyglot bypass possible | File upload |
| M3 | `src/Document.php:1075-1150` | `copy($fullpath, GLPI_DOC_DIR . "/" . $new_path)` — dépend de `getUploadFileValidLocationName()` | Path traversal |
| M4 | `front/document.send.php:48-80` | Accès anonyme à `docid` — énumération / information disclosure | Info disclosure |
| M5 | `src/Glpi/ItemTranslation/CldrLanguage.php:62` / `AbstractDefinition.php:726` | `eval("return $formula_to_compute;")` sur formule gettext. Actuellement lib de confiance, mais pattern dangereux. | Code injection latent |
| M6 | `src/Config.php:806-809` | `exec('git show ...')` sans raison fonctionnelle en prod | Exec système |

---

## 5. Chaînes d'attaque plausibles

1. **Admin compromis → RCE persistante** : modification de `system_name` sur une AssetDefinition → payload injecté dans `eval()` → RCE à chaque chargement du namespace `Glpi\CustomAsset` (§2.2).
2. **Admin compromis → DoS complet upload** : injection d'un regex catastrophique dans `glpi_documenttypes.ext` → toute tentative d'upload bloquée (§2.3).
3. **Plugin tiers malveillant / compromis → XSS stocké** : hook `getHistoryEntry()` renvoyant `<script>` → propagé à tous les utilisateurs via l'historique (§3.1).
4. **SQLi via `$_SESSION['glpigroups']`** : nécessite un vecteur d'empoisonnement de session (plugin auth SSO fragile, LDAP forgé) → bypass visibilité ticket/followup (§2.1).

---

## 6. Recommandations prioritaires

1. **Remplacer toutes les concaténations `$_SESSION` → SQL** par des `intval`/bind parameters (§2.1).
2. **Supprimer les `eval()` sur données DB** — passer par `class_alias` + fabriques (§2.2, M5).
3. **Valider les motifs regex** saisis en `glpi_documenttypes.ext` (§2.3).
4. **Auditer tous les `|raw` Twig** — notamment `logs.html.twig`, `messages_after_redirect_alerts.html.twig`, `generic_show_form.html.twig`, `masonry_grid.html.twig`.
5. **Forcer `Session::checkLoginUser()` + `Session::checkCSRF()`** au niveau du bootstrap de `ajax/` et `front/*.form.php`.
6. **Remplacer les blocklists par des whitelists** sur les noms de fichiers/chemins.
7. **Monitorer** https://github.com/glpi-project/glpi/security/advisories pour les CVE post-11.0.7.

---

## 7. Sources

- GLPI Security Advisories — https://github.com/glpi-project/glpi/security/advisories
- Lexfo blog — Pre-auth SQLi to RCE (CVE-2025-24799/24801) — https://blog.lexfo.fr/glpi-sql-to-rce.html
- Kudelski Security — https://kudelskisecurity.com/research/pre-authentication-sql-injection-to-rce-in-glpi
- NVD CVE-2025-24799 — https://nvd.nist.gov/vuln/detail/CVE-2025-24799
- SensePost — GLPI patch bypass to RCE — https://sensepost.com/blog/2024/from-a-glpi-patch-bypass-to-rce/
- Synacktiv — Multiple GLPI vulns — https://www.synacktiv.com/en/advisories/multiple-vulnerabilities-in-glpi
- CISA KEV — CVE-2022-35914

---

*Rapport généré le 2026-04-23 par analyse statique automatisée — certaines trouvailles requièrent une validation dynamique (PoC) pour confirmation d'exploitabilité.*

---

## 8. Revue ciblée "SQLi non-auth / bas-privilège" (addendum 2026-04-23)

Deuxième passe avec 4 agents spécialisés, explicitement à la recherche d'une PoC SQLi exploitable sans authentification ou avec un compte self-service / technician.

### 8.1. Surfaces analysées et verdict

| Surface | Analyse | Verdict |
|---------|---------|---------|
| **Endpoints pré-auth** — `front/helpdesk.faq.php`, `front/document.send.php`, `front/login.php`, `front/lostpassword.php`, `ajax/fuzzysearch.php`, `ajax/treebrowse.php`, `ajax/getKnowbaseItemAnswer.php`, API RSQL `/api.php/v2.2/Knowledgebase/Article` | `KnowbaseItem::computeBooleanFullTextSearch()` strippe `+ - * ~ < > ( )` avant MATCH AGAINST. `Dropdown::getDropdownValue()` exige `Session::validateIDOR()`. RSQL passe par `DB::quoteName()` + PDO. `treebrowse.php` cast numérique strict. | **Aucune SQLi exploitable** |
| **Moteur de recherche (compte self-service/technician)** — `ajax/search.php` avec `sort`, `order`, `criteria[X][field/searchtype/value]`, méta-critères, `itemtype` | `SQLProvider.php:4114-4116` valide les IDs de sort contre `SearchOption::getOptionsForItemtype()` ; `QueryBuilder.php:883-894` cast `(int) $criterion['field']` ; direction forcée ASC/DESC ; `makeTextSearchValue` échappe `% _ \`. Tout est construit via `DBmysqlIterator::analyseCrit` (PDO). | **Aucune SQLi exploitable** |
| **Inventaire agent (FusionInventory / GLPI Agent)** — `front/inventory.php`, `src/Glpi/Inventory/Request.php`, `Agent::handleAgent` | `handleAgent` utilise `getFromDBByCrit(['deviceid' => $value])` (ORM). XML parsé via `simplexml_load_string` sans `LIBXML_NOENT` (pas d'XXE). Schema validation avant persistence. | **CVE-2025-24799 bien corrigée — aucune SQLi** |
| **REST API / HL API** — `apirest.php`, `src/Api/`, `src/Glpi/Api/HL/` | Search valide les critères contre SearchOption. `initSession` utilise l'ORM. Password reset compare tokens via GLPIKey. | **Aucune SQLi exploitable** |
| **Preferences / Kanban / SavedSearch** (ex-CVE-2023-41320, 2023-41326, 2024-29889) | `DisplayPreference::updateOrder` paramétré. SavedSearch re-valide les critères au replay via `SearchOption`. | **Aucune SQLi exploitable** |
| **Log exports** (GHSA-3m49-qf92-vccr) | `LogCsvExport` utilise `Log::convertFiltersValuesToSqlCriteria` qui valide et paramètre. | **Correctif appliqué** |

### 8.2. Zones adjacentes encore à auditer dynamiquement

Les agents n'ont pas prouvé de bug mais ont signalé ces zones comme méritant un PoC dynamique (fuzzing / burp) :

1. **`SQLProvider::computeComplexJoinID` (lignes ~3845-3890)** — concaténation de `$joinparams['condition']`, `linkfield`, `tab['table']` avant `md5()`. Le hash neutralise l'impact SQL mais si l'un de ces paramètres fuit ailleurs sans md5 (ex. commentaire de debug, log), le motif d'injection existe.
2. **`SQLProvider::getSelectCriteria` branche méta (~205-320)** — `$addtable` construit depuis `$opt["linkfield"]`. Si un plugin déclare une `SearchOption` avec `linkfield` non constant, injection possible.
3. **`Agent::handleAgent` metadata passthrough** — `$metadata['tag']`, `$metadata['provider']['version']`, `$_SERVER['HTTP_USER_AGENT']` stockés puis rendus. Vérifier tous les `{{ ... }}` et `|raw` dans `templates/pages/admin/inventory/agent.html.twig` et dans `src/Glpi/Inventory/MainAsset/*.php` (stored XSS plutôt que SQLi).
4. **HL API `src/Glpi/Api/HL/Search.php`** — surface neuve de 11.x. Le patch de CVE-2024-29889 a ciblé `src/Search.php` et `src/SavedSearch.php` ; un pattern de type "SensePost patch bypass" reste à tester sur la nouvelle implémentation HL.
5. **Ecosystème plugins** — historiquement 50% des CVE GLPI proviennent des plugins (Formcreator, Behaviors, Genericobject, Fields). Audit hors scope de ce rapport.

### 8.3. Conclusion SQLi

**Par analyse statique sur GLPI 11.0.7 vanilla** : pas de PoC SQLi écrivable sans authentification ni avec un compte sans privilège. Le moteur Search est le vecteur historiquement le plus fragile et a été solidement hardené. Pour continuer la recherche d'un 0-day SQLi, les angles productifs sont :

- **Dynamic fuzzing** (Burp Suite / sqlmap) contre `ajax/*.php` et `apirest.php` avec un compte self-service, en ciblant des encodages exotiques (JSON imbriqué, UTF-7, double-encoding URL) sur `sort`, `criteria[X][field]`, `itemtype`.
- **Audit de plugins populaires** (Formcreator, GLPI-Inventory plugin, Fields) — ils étendent `SearchOption` et hooks sans toujours respecter les whitelists du core.
- **Race conditions sur `Session::loadGroups()`** avec un IDP SSO/SAML compromis — vecteur pour activer la SQLi latente §2.1.
- **Diff 11.0.6 → 11.0.7** sur les répertoires `src/Search/`, `src/Glpi/Api/HL/`, `src/Agent.php` pour repérer d'éventuelles régressions récentes.

