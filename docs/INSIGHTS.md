# Skálázódás és a terheléspróba tanulságai
<!-- 

- JWT token hiba -> text.strip()
- locust image nem frissült -> main.yaml-be betettem
- pod szám nem csökkent -> HPA YAML frissítése
- csak az első Pod volt terhelve -> mert nem zárta le a Locust a kapcsolatokat


- Routes: 
metadata:
  annotations:
    # 1. Kikapcsolja a Session Affinity-t (nincs több INGRESSCOOKIE)
    haproxy.router.openshift.io/disable_cookies: 'true'
    # 2. Megváltoztatja az algoritmust: ne körbe-körbe, hanem a legkevesebb kapcsolathoz küldje
    haproxy.router.openshift.io/balance: 'leastconn'
 -->