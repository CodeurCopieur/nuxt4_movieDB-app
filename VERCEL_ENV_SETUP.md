# Configuration des variables d'environnement pour Vercel

## Variables d'environnement requises

Pour que l'application fonctionne correctement sur Vercel, vous devez configurer les variables d'environnement suivantes :

### TMDB_API_KEY (requis)
- **Description** : Clé API pour The Movie Database (TMDB)
- **Comment l'obtenir** : 
  1. Créez un compte sur https://www.themoviedb.org/
  2. Allez dans Paramètres > API
  3. Demandez une clé API
  4. Copiez votre clé API

### TMDB_BASE_URL (optionnel)
- **Description** : URL de base de l'API TMDB
- **Valeur par défaut** : `https://api.themoviedb.org/3/`
- **Note** : Vous n'avez généralement pas besoin de modifier cette valeur

## Configuration sur Vercel

### Méthode 1 : Via l'interface Vercel

1. Connectez-vous à votre dashboard Vercel : https://vercel.com/dashboard
2. Sélectionnez votre projet
3. Allez dans **Settings** > **Environment Variables**
4. Ajoutez les variables suivantes :
   - **Name** : `TMDB_API_KEY`
   - **Value** : Votre clé API TMDB
   - Cochez les environnements où vous voulez utiliser cette variable (Production, Preview, Development)
5. Cliquez sur **Save**

### Méthode 2 : Via la CLI Vercel

```bash
# Installer Vercel CLI si ce n'est pas déjà fait
npm i -g vercel

# Ajouter la variable d'environnement
vercel env add TMDB_API_KEY
# Suivez les instructions pour entrer la valeur et sélectionner les environnements
```

## Configuration locale (développement)

Créez un fichier `.env` à la racine du projet :

```env
TMDB_API_KEY=votre_cle_api_ici
TMDB_BASE_URL=https://api.themoviedb.org/3/
```

**Important** : Ne commitez jamais le fichier `.env` dans Git ! Il est déjà dans `.gitignore`.

## Vérification

Après avoir configuré les variables d'environnement sur Vercel :
1. Redéployez votre application
2. Vérifiez que les routes API fonctionnent correctement
3. Consultez les logs Vercel pour vérifier qu'il n'y a pas d'erreurs liées à la clé API

