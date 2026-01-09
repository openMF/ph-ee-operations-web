#!/bin/bash
set -e

echo "=========================================="
echo "Building ph-ee-operations-web for K8s"
echo "Version: v1.26.0-gazelle-1.2.0-beta"
echo "=========================================="
echo ""

# Load environment variables
echo "🔧 Loading environment variables..."
export PH_OPS_BACKEND_SERVER_URL=https://ops-bk.mifos.gazelle.localhost/api/v1
export PH_OPS_BATCH_SIGNATURE_URL=https://ops.mifos.gazelle.localhost/api/v1/util/x-signature
export PH_OPS_BULK_CONNECTOR_URL=https://bulk-processor.mifos.gazelle.localhost
export PH_VOU_BACKEND_SERVER_URL=https://ops-bk.mifos.gazelle.localhost/api/v1
export PH_VOU_CALLBACK_URL=
export PH_ACT_BACKEND_SERVER_URL=https://ops-bk.mifos.gazelle.localhost/api/v1
export PH_PLATFORM_TENANT_ID=greenbank
export PH_PLATFORM_TENANT_IDS=greenbank,bluebank,redbank
export PH_REGISTERING_INSTITUTION_ID=123
export PH_AUTH_ENABLED=false
export PH_OAUTH_ENABLED=false
export PH_OAUTH_TYPE=keycloak
export PH_OAUTH_SERVER_URL=https://ops-bk.mifos.gazelle.localhost/auth
export PH_OAUTH_REALM=paymenthub
export PH_OAUTH_CLIENT_ID=opsapp
export PH_OAUTH_CLIENT_SECRET=Y2xpZW50Og==
export PH_OAUTH_BASIC_AUTH=true
export PH_OAUTH_BASIC_AUTH_TOKEN=Y2xpZW50Og==
export PH_DEFAULT_LANGUAGE=en
export PH_SUPPORTED_LANGUAGES=en,fr,es

echo "✅ Environment configured"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies (this may take several minutes)..."
    npm install
    echo "✅ Dependencies installed"
    echo ""
fi

# Build the application
echo "🔨 Building Angular application..."
echo "   This will create production-ready files in dist/"
echo ""

npm run build

echo ""
echo "✅ Build completed successfully!"
echo ""
echo "📁 Built files are in: $(pwd)/dist"
echo ""
echo "Next steps:"
echo "1. Apply helm upgrade: helm upgrade ph-ee-engine ./repos/ph_template/helm/ph-ee-engine --namespace paymenthub -f config/ph_values.yaml"
echo "2. Wait for pod restart: kubectl rollout status deployment/ph-ee-operations-web -n paymenthub"
echo "3. Access UI at: https://ops.mifos.gazelle.localhost"
echo ""
