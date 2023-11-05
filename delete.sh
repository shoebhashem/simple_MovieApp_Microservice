kubectl delete --cascade='foreground' -f userapi-deploy.yaml
kubectl delete --cascade='foreground' -f movieapi-deploy.yaml
kubectl delete --cascade='foreground' -f basic-ingress.yaml