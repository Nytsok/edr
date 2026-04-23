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
| Critique | 5 | Injection SQL via `$_SESSION['glpigroups']`, `eval()` sur `system_name`, ReDoS upload, SSTI, pré-auth SQLi (fixée) |
| Élevé | 7 | XSS plugin `getHistoryEntry()`, AJAX `innerHTML`, CSRF manquant, path traversal partiel |
| Moyen | 6+ | Enumération documents, validation image faible, `exec()` git |

**Risque global** : la surface d'attaque post-authentification reste très large (plusieurs RCE chaînables via droits admin). La surface pré-auth a été significativement réduite par 11.0.5/11.0.6 mais quelques chemins restent fragiles.

---

## 2. Vulnérabilités critiques identifiées dans 11.0.7

### 2.1. Injection SQL via `$_SESSION['glpigroups']` non échappé
**Fichiers** : `src/ITILFollowup.php:1080,1105` — `src/Ticket.php:5632,5663,5686`
**Type** : SQL Injection (CWE-89)
**Sévérité** : **Critique** (contournement visibilité + éventuelle exfiltration)

```php
// src/Ticket.php:5632
$groups = "'" . implode("','", $_SESSION['glpigroups']) . "'";
// ...
$group_query = "SELECT `tickets_id`
  FROM `glpi_groups_tickets`
  WHERE `groups_id` IN ($groups) AND type IN ($requester, $obs)";
```

Le tableau `$_SESSION['glpigroups']` est concaténé dans une requête SQL sans échappement, puis enveloppé dans `new QueryExpression(...)` côté `SearchProvider::constructSQL()` (ligne 1042-1054 de `SQLProvider.php`) — ce qui désactive l'échappement automatique (`@psalm-taint-escape sql`).

**Impact** : si un attaquant arrive à influencer le contenu de `$_SESSION['glpigroups']` (via un LDAP forgé, un plugin, ou une autre chaîne d'auth), il injecte directement du SQL dans les recherches ticket/followup → bypass des restrictions de visibilité et potentiellement exfiltration inter-tenant.

**Correction recommandée** : construire la clause via `DBmysqlIterator` ou caster/valider numériquement chaque ID :
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
