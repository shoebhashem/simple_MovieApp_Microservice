#!/bin/sh

kubectl apply -f movieapi-deploy.yaml -l data=config
kubectl apply -f movieapi-deploy.yaml -l app=moviestore

# Extract the clusterIP
export moviestoreip=$( kubectl get \
                              services/moviestore-service \
                              --template='{{.spec.clusterIP}}' )

# Retrieve the ConfigMap, replace "NOTSET" with the clusterIP, and re-apply.
kubectl get configmap/movieapi-config -o yaml\
    | sed -r "s/NOTSET/$moviestoreip/" | kubectl apply -f -

# Finally, start the qfapp
kubectl apply -f movieapi-deploy.yaml -l app=movieapi

