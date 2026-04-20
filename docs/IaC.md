# Fotóalbum - Infrastructure-as-Code megvalósítása

A 4. labor elvégzésére *Hashicorp Terraform*-ot alkalmaztam a `hashicorp/kubernetes` provider segítségével. A CD/CD folyamatok során a felépített struktúrát a *Terraform Cloud*-ban tároljuk, amit szimplán beimportál a rendszer minden futáskor.

## Terraform fájlstruktúra
A terraform működtetéséhez a következő fájlokat hoztam létre:
* `main.tf`: Kubernetes provider konfiguráció + a Terraform Cloud backend összeállítása.
* `variables.tf`: Változók deklarációja.
* `secrets.tf`: A változók alapján az érzékeny adatok (Secrets) és a nem érzékeny adatok (ConfigMap ) deklarációi.
* `database.tf`: Az alkalmazás adatbázisának deklarációja. Ez tartalmazza a PVC leírását (külön kiemelve, hogy **NE** törölje ki, amikor változik az infrastruktúra)
    ```hcl
        lifecycle {
            prevent_destroy = true
        }
    ```
* `backend.tf`: A szerver szolgáltatás leírása (Deployment + Service)
* `auth.tf`: A felhasználókezelés szolgáltatás leírása (Deployment + Service)
* `frontend.tf`: A felhasználói felület szolgáltatás leírása (Deployment + Service)

### Nem konfigurált erőforrások
OpenShift platformon a Service erőforrások biztosítják a Pod-ok közti belső hálózatot, ezért külön NetworkPolicy konfigurációt nem vettem fel.

Emellett a Route-okat sem kezeltem, mivel hallgatói fiókkal jogosultságbeli problémákba ütköztem. Mivel a Route erőforrások ritkán vagy szinte soha nem változnak, ezért ezt nem tekintettem kritikus problémának.

A feladat leírásában említve volt, hogy kezelni kell a hozzáféréskezelést is az IaC eszközzel. Mivel az egyetemi OKD namespace szinten kezeli, ezért külön IAM role-ok konfigurálása nem volt szükséges.

## A megváltoztatott Workflow
A CI/CD workflow fájl (`.github/workflows/main.yml`) annyiban változott, hogy most már egy matrix service végzi az image-k frissítését, párhuzamosan. Új image készítése csak akkor történik meg, ha ténylegesen van változás a kódban. Ezzel a párhuzamosítási és kódváltozás ellenőrzési lépéssel jelentős javulást értem el a workflow ezen részén. (~15-20p helyett ~1p, ha nincs kódváltozás)

Emellett bekerült egy új szolgáltatás, ami a deploy job után indul csak el, a **terraform** job. Ennek kereteiben a következő lépések történnek:
1. Friss image digest-ek lekérése az OKD image registry-ből.
2. Terraform Cloud backend inicializálása, state betöltése (`terraform init`)
3. ci.tfvars generálása a Github Secretsből
4. Új state esetén a változások alkalmazása (`terraform apply`)

Fontos megjegyezni, hogy eleinte minden egyes CI/CD workflow esetén beimportáltuk a teljes infrastruktúrát az OKD-ről, aztán a változtatásokat apply-oltuk. Ez természetesen egy problémás megvalósítás, mivel (feleslegesen) mindig feltérképezi a teljes infrastruktúrát. Ehelyett a **Terraform Cloud** ingyenes tier-jében létrehozott workspace tárolja az infrastruktúra állapotait (States) és mindig a legfrissebbet alkalmazza. Természetesen, ha az infrastruktúra változik idővel, akkor ilyenkor mindig új State jön létre.