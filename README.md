# Webalkalmazás PaaS környezetben

A BME Mérnökinformatikus MSc képzés `Felhő alapú elosztott rendszerek laboratórium` tárgy első két laborfeladatának dokumentációja.

## Implementáció
### Frontend - Next.js (Megjelenítési réteg)

A felhasználói felület Next.js keretrendszerrel lett megvalósítva, melyet a MUI (Material UI) komponenskönyvtár elemeivel egészítettem ki a letisztult felhasználói felület eléréséért.

Az alkalmazás bejelentkezés nélkül is használható, azonban így csak a képek megtekintésére van lehetőség, a törlés és feltöltés funkciók csak felhasználói fiókkal érhetők el.

Képek feltöltéséhez meg kell adni egy nevet, amely nem lehet több, mint 40 karakter hosszú, ebben az esetben figyelmeztet a felület.

A képeket lehet rendezni `név` és `dátum` szerint növekvő, illetve csökkenő sorrendbe.

Képet törölni a bejelentkezett felhasználók tudnak. Nincs megkötés, hogy csak a saját képeiket törölhessék, mivel ez nem volt követelménye a feladatnak.

Ha egy képre rákattint a felhasználó, akkor a *Cloudflare R2*-ban (lásd: <a href="#backend">Backend</a>) található elérési útvonala alapján megjeleníti a képet.

### <span id="backend">Backend</span> (Üzleti logikai réteg)

Két szolgáltatás tartozik a Backendhez, egy hitelesítési szolgáltatás (továbbiakban *Auth*) és egy szerverszolgáltatás (továbbiakban *Server*), ami a Frontend-el és az imént említett Auth-al kommunikál. A két szolgáltatás mikroszolgáltatásként funkcionál a rendszerben, mindkettő *immutable* és *stateless*.

#### Auth Service
A hitelesítési szolgáltatás a felhasználókezelést valósítja meg. Ezt egy korábbi projektemből használtam újra, kiegészítve JWT tokenek használatával, hogy a védett API útvonalakat a bejelentkezett felhasználhassák csak.

A JWT-hez használt titkos kulcs meg van osztva az Auth és a Server között, így a Server is védhet API végpontokat.

Az Auth szolgáltatás egy OpenShift-en futó PostgreSQL adatbázisba menti le a felhasználók adatait.

#### Server
A Server kezeli a blob storage fájlkezelését (képek lementéséhez, törléséhez), illetve a fájlok metaadatainak mentését. (Adatelérési réteg)

A képeket a Cloudflare R2 szolgáltatásba mentem le, amit a ***StorageService*** valósít meg. Ehhez a szolgáltatáshoz az `MinioClient` könyvtárat használom a képek feltöltéséhez és törléséhez.

A képekhez eltárolja a szerver az Auth szolgáltatáshoz hasonlóan egy OpenShift-en futó PostgreSQL adatbázisba a metaadatokat: fájlnév (ID), név (amit a felhasználó ad meg neki) és a feltöltés dátumát.


## Deployment
~~Ahogy az fent említve volt, az Azure SQL Server és Azure Blob Storage van használva az adatok és képek tárolására, emellett a szolgáltatások telepítésére a `Render` Platform-as-a-Service szolgáltatást használtam.~~

<span style="color: red; text-decoration-line: line-through;">
Az első verzióhoz képest az Azure SQL Server-t és Azure Blob Storage-t is lecseréltem, ugyanis a hallgatói krediteket egy hibásan beállított adatbázis elfogyasztotta napok alatt.
</span> 
<br /><br />

Az adatokat **OpenShift PostgreSQL** adatbázisban, a képeket pedig a **Cloudflare R2** objektum tárolóban helyezem el, a szolgáltatások telepítésére pedig az egyetem által futtatott **OpenShift** Platform-as-a-Service platformot használom.

A szolgáltatások OpenShift-en belül külön *Deployment* erőforrásként futnak, mindegyikhez tartozik egy dedikált *BuildConfig*, amely a hozzájuk tartozó Dockerfile alapján építi fel a konténer image-eket az OpenShift belső image registry-jébe.

A CI/CD folyamatot Github Actions-el oldottam meg, amit a `.github/workflows` mappában lévő `main.yaml` ír le. Ez az OpenShift CLI (`oc`) segítségével bejelentkezik a klaszterbe, majd `oc start-build` parancsokkal elindítja az egyes szolgáltatások build folyamatát, végül `oc set image` parancsokkal frissíti a Deployment-eket az újonnan épített image-ekre. A hookok címeit a Github Secrets füléről tölti be a workflow.

TODO: átírni a render-t OpenShift-re

# Skálázhatóság és stresszteszt
Az OpenShift tartalmaz egy Horizontal Pod Autoscaler-t, amit felkonfigurálva beállítható, hogy hány Pod fusson minimum és maximum, valamint hogy milyen átlagos terhelés felett indítson új Podokat a PaaS környezet.

Az ehhez tartozó dokumentumok megtalálhatók a `docs` mappában:
* `SCALABILITY_CONFIG.md`: Automatikus skálázódás konfigurációja OpenShift környezetben
* `STRESSTEST.md`: Terheléspróba jegyzőkönyv
* `INSIGHTS.md`: Skálázódás és a terheléspróba tanulságai