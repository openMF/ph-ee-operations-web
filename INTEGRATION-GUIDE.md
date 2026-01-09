# ph-ee-operations-web v1.26.0-gazelle-1.2.0-beta Integration Guide

## Overview

This guide explains how to integrate the newer ph-ee-operations-web (v1.26.0-gazelle-1.2.0-beta) with your existing mifos-gazelle Kubernetes deployment using hostPath mounting.

## Key Features in This Version

✅ **Tenant Selector UI Component** - Runtime tenant switching between greenbank, bluebank, and redbank
✅ **Multi-tenant Support** - Reads `PH_PLATFORM_TENANT_IDS` and displays all tenants in dropdown
✅ **Local Storage** - Remembers selected tenant in browser localStorage

## Architecture

- **Local Development**: Angular app built on your host machine
- **Kubernetes Integration**: Built dist/ folder mounted via hostPath into nginx container
- **Live Updates**: Rebuild and pod will serve new files automatically

## Setup Steps

### 1. Build the Angular Application

```bash
cd ~/ph-ee-operations-web
./build-for-k8s.sh
```

This will:
- Export all required environment variables
- Install npm dependencies (if needed)
- Build production-ready Angular app to `dist/` directory

### 2. Apply Helm Configuration

The helm values have been configured to mount your local build:

```yaml
operations_web:
  deployment:
    extraVolumeMounts:
      - name: ops-web-dist
        mountPath: /usr/share/nginx/html
    extraVolumes:
      - name: ops-web-dist
        hostPath:
          path: /home/tdaly/ph-ee-operations-web/dist
          type: Directory
```

Apply the changes:

```bash
cd ~/mifos-gazelle
helm upgrade ph-ee-engine ./repos/ph_template/helm/ph-ee-engine \
  --namespace paymenthub \
  -f config/ph_values.yaml
```

### 3. Wait for Pod Restart

```bash
kubectl rollout status deployment/ph-ee-operations-web -n paymenthub
```

### 4. Access the UI

Open your browser to: **https://ops.mifos.gazelle.localhost**

Login credentials:
- Username: `mifos`
- Password: `password`

### 5. Use the Tenant Selector

Look for the tenant selector in the UI header (building icon with dropdown).
You can now switch between:
- greenbank
- bluebank
- redbank

## Configuration Files

### Environment Variables (build-for-k8s.sh)

- `PH_PLATFORM_TENANT_ID`: Default tenant (greenbank)
- `PH_PLATFORM_TENANT_IDS`: Comma-separated list of all tenants
- `PH_OPS_BACKEND_SERVER_URL`: Operations app backend API
- `PH_OPS_BULK_CONNECTOR_URL`: Bulk processor API
- And many more...

### Helm Values (config/ph_values.yaml)

Located at: `~/mifos-gazelle/config/ph_values.yaml`

Key sections modified:
- `operations_web.deployment.extraVolumeMounts`: Mount point configuration
- `operations_web.deployment.extraVolumes`: hostPath source configuration
- `operations_web.backend.PH_PLATFORM_TENANT_IDS`: Tenant list

### Helm Template (operations-web/templates/deployment.yaml)

Modified to support:
- `extraVolumeMounts` for custom volume mounts
- `extraVolumes` for hostPath volumes

## Making Changes

### Rebuild After Code Changes

```bash
cd ~/ph-ee-operations-web
./build-for-k8s.sh

# Pod will automatically serve new files
# No helm upgrade needed, just wait a moment and hard refresh browser
```

### Change Tenant Configuration

Edit `build-for-k8s.sh` and modify:

```bash
export PH_PLATFORM_TENANT_IDS=greenbank,bluebank,redbank,newbank
```

Then rebuild:

```bash
./build-for-k8s.sh
```

Hard refresh browser (Ctrl+Shift+R) to see new tenant list.

## Troubleshooting

### Tenant Selector Not Appearing

1. Check browser console for errors (F12)
2. Verify environment: `window.env.platformTenantIds`
3. Ensure you're on the correct branch:
   ```bash
   cd ~/ph-ee-operations-web && git branch
   ```
   Should show: `* v1.26.0-gazelle-1.2.0-beta`

### Build Failures

```bash
cd ~/ph-ee-operations-web
rm -rf node_modules package-lock.json
npm install
./build-for-k8s.sh
```

### Pod Not Using hostPath

```bash
# Check pod volumes
kubectl describe pod -n paymenthub -l app=ph-ee-operations-web

# Look for:
#   Volumes:
#     ops-web-dist:
#       Type:          HostPath (bare host directory volume)
#       Path:          /home/tdaly/ph-ee-operations-web/dist
```

### Files Not Updating

```bash
# Restart the pod
kubectl delete pod -n paymenthub -l app=ph-ee-operations-web

# Wait for new pod
kubectl wait --for=condition=ready pod -n paymenthub -l app=ph-ee-operations-web
```

## Component Details

### Tenant Selector Component

Location: `src/app/shared/tenant-selector/`

- **HTML**: Material Design dropdown with building icon
- **TypeScript**: Reads from SettingsService, stores selection in localStorage
- **Behavior**: Only enabled when `tenants.length > 1`

### Settings Service

Location: `src/app/settings/settings.service.ts`

Methods:
- `setTenantIdentifier(id)`: Sets current tenant
- `get tenantIdentifiers()`: Gets list of available tenants from localStorage
- Reads from `window['env']['platformTenantIds']`

## Files Modified/Created

1. ✅ `/home/tdaly/ph-ee-operations-web/build-for-k8s.sh` (new)
2. ✅ `/home/tdaly/ph-ee-operations-web/.env.local` (new)
3. ✅ `/home/tdaly/mifos-gazelle/config/ph_values.yaml` (modified)
4. ✅ `/home/tdaly/mifos-gazelle/repos/ph_template/helm/ph-ee-engine/operations-web/templates/deployment.yaml` (modified)

## Next Steps

1. Run `./build-for-k8s.sh` to build the app
2. Apply helm upgrade
3. Test tenant selector with redbank batches

## Benefits of This Approach

- ✅ No Docker image building required
- ✅ Fast iteration - just rebuild and refresh
- ✅ Full Kubernetes integration
- ✅ Production-like environment
- ✅ Easy to switch back to official image (comment out hostPath in values)

## Reverting to Official Image

To go back to the official Docker image:

```yaml
# In config/ph_values.yaml, comment out the deployment section:
operations_web:
  enabled: true
  image: docker.io/openmf/ph-ee-operations-web:gazelle-v1.1.0
  # deployment:
  #   extraVolumeMounts: ...
  #   extraVolumes: ...
```

Then helm upgrade again.
