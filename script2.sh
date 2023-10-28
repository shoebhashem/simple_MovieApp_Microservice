#!/bin/sh

kubectl apply -f userapi-deploy.yaml

# Extract the clusterIP
export userstoreip=$(kubectl get services/mongodb-service --template='{{.spec.clusterIP}}')

# Retrieve the ConfigMap, replace "NOTSET" with the clusterIP, and re-apply.
kubectl get configmap/userapi-config -o yaml | sed -r "s/NOTSET/$userstoreip/" | kubectl apply -f -

# You don't need to apply the userapi deployment again because it's already created.

# If you want to check if the pods are running, use the following command:
kubectl get pods

# To check the logs of the userapi pod, you can use your previous command:
# kubectl get pods -o name | grep userapi | head -1 | xargs kubectl logs -f
