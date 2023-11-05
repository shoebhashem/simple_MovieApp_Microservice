

#!/bin/sh


kubectl apply -f k8s-deployment.yaml -l data=config
kubectl apply -f k8s-deployment.yaml -l app=appstore

# Extract ClusterIP of mongoDB 
export appstoreip=$( kubectl get \
                              services/appstore-service \
                              --template='{{.spec.clusterIP}}' )

# Retrieve the ConfigMap, replace "database_IP" with the clusterIP, and re-apply.
kubectl get configmap/app-config -o yaml\
    | sed -r "s/database_IP/$appstoreip/" | kubectl apply -f -


sleep 5
# Finally, start the movieapi-service and userapi-service
kubectl apply -f k8s-deployment.yaml -l app=movieapi

# Extract ClusterIP of movieapi-service 
export movieapiip=$( kubectl get \
                              services/movieapi-service \
                              --template='{{.spec.clusterIP}}' )

# Retrieve the ConfigMap, replace "database_IP" with the clusterIP, and re-apply.
kubectl get configmap/app-config -o yaml\
    | sed -r "s/movieapi_IP/$movieapiip/" | kubectl apply -f -


# create secret
kubectl delete secret session-secret
kubectl create secret generic session-secret --from-literal=SESSION_SECRET=your-secret-value

sleep 5
kubectl apply -f k8s-deployment.yaml -l app=userapi


