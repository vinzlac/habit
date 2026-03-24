# habit

Application déployée sur le homelab k3s via **Argo CD** (dépôt **`vinzlac/k3s-homelab`**, ressource Application `habit`).

## Prérequis GitHub (secrets du **ce** dépôt)

| Secret | Valeur |
|--------|--------|
| **`BUILDKIT_HOST`** | `tcp://buildkitd.cicd.svc.cluster.local:1234` |

Le job s’exécute sur le scale set ARC (**`runs-on: arc-runner-set`**) — même setup que [k3s-homelab / install-arc-k3s](https://github.com/vinzlac/k3s-homelab/blob/main/docs/install-arc-k3s.md).

## Image

- **`ghcr.io/vinzlac/habit`** — tags **`:<sha>`** et **`:main`**.
- Après chaque build, le workflow commit **`kubernetes/deployment.yaml`** avec le tag **SHA** (ne relance pas le workflow grâce à `paths-ignore: kubernetes/**`).

## Cluster

- **Namespace** : `habit`
- **Ingress** : `http://habit.homelab` (ajoute l’host dans `scripts/add-hosts.sh` + CoreDNS si besoin, comme pour les autres `*.homelab`)

### Secret pull GHCR (package privé)

```bash
# depuis la machine avec kubectl configuré
kubectl create secret docker-registry ghcr-pull \
  --namespace=habit \
  --docker-server=ghcr.io \
  --docker-username=TON_LOGIN_GITHUB \
  --docker-password=TON_PAT_READ_PACKAGES \
  --dry-run=client -o yaml | kubectl apply -f -
```

Ou adapte le script homelab `create-ghcr-pull-secret-todoapp.sh` (namespace / nom du secret).

## Développement local

```bash
npm run dev
# → http://localhost:3000
```

**Image Docker (même build que la prod, sans `next dev`)** :

```bash
npm run docker:up
# → http://localhost:3000
```

## Contexte homelab / CI (pour toi ou un assistant IA)

À la racine : **`install-k3s.md`** — généré par **`k3s-homelab/scripts/create-app.sh`** (template **`templates/external-app-repo/install-k3s.md`**, rendu via **`render-app-install-k3s-doc.sh`**). Il résume k3s, **geekom-as6**, GitHub Actions, Argo CD, GHCR. Tu peux le **régénérer** depuis le repo homelab : **`./scripts/update-app.sh <nom-app-argocd>`**.

## Structure

```
.
├── install-k3s.md        # Contexte K3S / homelab (généré, à committer dans ce repo)
├── Dockerfile
├── app/                  # Next.js App Router
├── kubernetes/           # Source Argo CD (path déclaré dans l’Application)
└── .github/workflows/
```
