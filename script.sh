

#!/bin/sh

kubectl apply -f userapi-deploy.yaml -l data=config
kubectl apply -f userapi-deploy.yaml -l app=userstore

# Extract the clusterIP
export userstoreip=$( kubectl get \
                              services/userstore-service \
                              --template='{{.spec.clusterIP}}' )

# Retrieve the ConfigMap, replace "NOTSET" with the clusterIP, and re-apply.
kubectl get configmap/userapi-config -o yaml\
    | sed -r "s/NOTSET/$userstoreip/" | kubectl apply -f -

# Finally, start the qfapp
kubectl apply -f userapi-deploy.yaml -l app=userapi
