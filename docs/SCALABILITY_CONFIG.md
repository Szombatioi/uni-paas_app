# Automatikus skálázódás konfigurációja OpenShift környezetben

Jelen dokumentáció a BME Mérnökinformatikus MSc képzés *Felhőalapú elosztott rendszerek laboratórium* tárgyának 3. feladatának, a *Skálázódó webalkalmazás* feladatának dokumentációja, amely az **automatikus skálázódás konfigurációját** mutatja be.

## Platform
Az egyetem által futtatott OpenShift PaaS környezetet használtam a horizontális skálázódás létrehozására. Ehhez előzetesen magát a webalkalmazást is skálázhatóként írtam meg, azaz mikroszolgáltatás architektúrára építettem, valamint mindegyik szolgáltatás *stateless* és *immutable*-ként lett megírva.

## Érintett szolgáltatások
A webalkalmazás egy kritikus pontja a backend szerver, ugyanis ez fogad minden kliensoldali kérést, legyen az bejelentkezés, képfeltöltés, törlés, lekérdezés, emiatt ennél a szolgáltatásnál létfontosságú a skálázódás.

A skálázódás eléréséhez először csökkentettem a rendelkezésre álló cpu és memory értékeket a deployment YAML konfigurációjában:
```yaml
[...]
resources:
    limits:
        cpu: 300m
        memory: 256Mi
    requests:
        cpu: 100m
        memory: 128Mi
[...]
```

Ez azt írja le, hogy a cpu 100m (millicores) és 300m közötti, a memória pedig 128Mi (mebibyte) és 256Mi közötti lehet. Ennek megfelelően, ha elkezdik terhelni a szervert és eléri a Pod skálázódás konfigurációjában meghatározott határértéket (lásd: <a href="#hpa">HPA</a>), akkor a környezet új Pod-okat fog indítani.

## <span id="hpa">Horizontal Pod Autoscaler (HPA)</span>
Az OpenShift környezet tartalmaz Horizontal Pod Autoscaler-t, amely lehetővé teszi a horizontális skálázhatóságot (Pod-ok felvételét/törlését). Ezt az oldalsó menü `Workloads > HorizontalPodAutoscalers` almenüjében hoztam létre, melynél a következő YAML konfigurációt alkalmaztam:
```yaml
kind: HorizontalPodAutoscaler
apiVersion: autoscaling/v2
metadata:
  name: fotoalbum-server-hpa
  namespace: fotoalbum
  [...]
spec:
  scaleTargetRef:
    kind: Deployment
    name: fotoalbum-server
    apiVersion: apps/v1
  minReplicas: 1
  maxReplicas: 5
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 50
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 0
      selectPolicy: Max
      policies:
        - type: Pods
          value: 4
          periodSeconds: 15
        - type: Percent
          value: 100
          periodSeconds: 15
    scaleDown:
      stabilizationWindowSeconds: 60
      selectPolicy: Max
      policies:
        - type: Percent
          value: 100
          periodSeconds: 60
status:
    [...]
```

Ez a konfiguráció a következő skálázódási szabályt állítja be:
* A backend szervert vizsgálja csak (*scaleTargetRef*)
* legalább egy Pod fusson mindig (*minReplicas*)
* legfeljebb öt Pod futhat a felskálázás során (*maxReplicas*)
* 50% átlagos CPU használat felett induljon új Pod (*averageUtilization*)
* 60 másodperc megfigyelés után skálázódjon csak le az alkalmazás (*stabilizationWindowSeconds*)
* Egyszerre az összes felesleges Pod álljon le (*scaleDown* > *Percent*)