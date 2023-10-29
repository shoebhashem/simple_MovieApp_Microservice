kubectl get pods -o name | grep userapi | head -1 | xargs kubectl logs -f
