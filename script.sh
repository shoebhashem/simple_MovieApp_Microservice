

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

# Finally, start the movieapi-service
kubectl apply -f movieapi-deploy.yaml -l app=movieapi


kubectl apply -f userapi-deploy.yaml -l data=config
kubectl apply -f userapi-deploy.yaml -l app=userstore

# Extract the clusterIP
export userstoreip=$( kubectl get \
                              services/userstore-service \
                              --template='{{.spec.clusterIP}}' )

# Retrieve the ConfigMap, replace "NOTSET" with the clusterIP, and re-apply.
kubectl get configmap/userapi-config -o yaml\
    | sed -r "s/NOTSET/$userstoreip/" | kubectl apply -f -

# create secret
kubectl delete secret session-secret
kubectl create secret generic session-secret --from-literal=SESSION_SECRET=your-secret-value


# Finally, start the userapi
kubectl apply -f userapi-deploy.yaml -l app=userapi

kubectl apply -f basic-ingress.yaml 
