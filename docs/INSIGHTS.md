# Skálázódás és a terheléspróba tanulságai

A terheléspróba elvégzése többször is megtörtént, mire az elvárt eredményt produkálta. Ennek okai konfigurációs és programozási hibákból fakadtak, melyet jelen dokumentáció jellemez.

## Sikertelen bejelentkezés a virtuális felhasználóknak
Az első próba során azt lehetett látni a Locust felületén, hogy csak a `POST /api/auth/login` hívás történt meg a felhasználóknál, aminek az volt az oka, hogy a `locustfile.py`-ban először a login metódust úgy írtam meg, hogy explicit egy objektumot várjon vissza a hívás, míg az Auth szolgáltatásom valójában csak egy szimpla sztringet adott vissza - a JWT tokent. 

## Locust image frissítése
Miután kijavítottam az előző pontban a hibát, furcsa módon még mindig nem volt másfajta hívás, csak a login. Ennek az volt az oka, hogy a CI/CD pipeline nem vezette le a Locust image frissítését. A workflow fájlba (`.github/workflows/main.yaml`) felvettem szolgáltatásként a mátrixba a locust-ot is, hogy a *Update deployment with new image* lépésnél a locust image-ét is frissítse az új deployment-hez.

## Teszt után nem csökkent a Podok száma
Az egyik terheléspróba leállítása után furcsa volt, hogy a Podok száma nem csökkent percekkel később sem. Ennek oka az volt, hogy a HPA konfigurációjából hiányzott ez a rész:
```yaml
scaleDown:
      stabilizationWindowSeconds: 60
      selectPolicy: Max
      policies:
        - type: Percent
          value: 100
          periodSeconds: 60
```

## Csak az első Pod volt leterhelve
Az első pár hibás tesztelésnél az a furcsaság történt, hogy csak az első Pod volt terhelve, még a felskálázódás után is.
![image](images/old/cpu_metrics.png)

Ennek az volt az oka, hogy az OKD loadbalancere `iptables` alapú round-robin-t használt, azaz ha a Locust virtuális felhasználói ugyanazon a kapcsolaton indítottak új hívást, akkor ugyanahhoz a Pod-hoz mentek a kérések, azaz az elsőhöz.

Ennek megoldásához először is a `locustfile.py`-ban minden HTTP hívás elé betettem egy Cookie törlést, valamint a szerver Route konfigurációjába felvettem ezt:
```yaml
annotations:
    haproxy.router.openshift.io/balance: leastconn
    haproxy.router.openshift.io/disable_cookies: 'true'
    openshift.io/host.generated: 'true'
  ```

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