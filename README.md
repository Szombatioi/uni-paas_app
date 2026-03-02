# Webalkalmazás PaaS környezetben

A BME Mérnökinformatikus MSc képzés `Felhő alapú elosztott rendszerek laboratórium` tárgy első két laborfeladatának dokumentációja.

## Implementáció
### Frontend - Next.js

A felhasználói felület Next.js keretrendszerrel lett megvalósítva, melyet a MUI (Material UI) komponenskönyvtár elemeivel egészítettem ki a letisztult felhasználói felület eléréséért.

Az alkalmazás bejelentkezés nélkül is használható, azonban így csak a képek megtekintésére van lehetőség, a törlés és feltöltés funkciók csak felhasználói fiókkal érhetők el.

Képek feltöltéséhez meg kell adni egy nevet, amely nem lehet több, mint 40 karakter hosszú, ebben az esetben figyelmeztet a felület.

A képeket lehet rendezni `név` és `dátum` szerint növekvő, illetve csökkenő sorrendbe.

Képet törölni a bejelentkezett felhasználók tudnak. Nincs megkötés, hogy csak a saját képeiket törölhessék, mivel ez nem volt követelménye a feladatnak.

Ha egy képre rákattint a felhasználó, akkor az *Object storage*-ban (lásd: <a href="#backend">Backend</a>) található elérési útvonala alapján megjeleníti a képet.

### <span id="backend">Backend</span>

Két szolgáltatás tartozik a Backendhez, egy hitelesítési szolgáltatás (továbbiakban *Auth*) és egy szerverszolgáltatás (továbbiakban *Server*), ami a Frontend-el és az imént említett Auth-al kommunikál. A két szolgáltatás mikroszolgáltatásként funkcionál a rendszerben, mindkettő *immutable* és *stateless*.

#### Auth Service
A hitelesítési szolgáltatás a felhasználókezelést valósítja meg. Ezt egy korábbi projektemből használtam újra, kiegészítve JWT tokenek használatával, hogy a védett API útvonalakat a bejelentkezett felhasználhassák csak.

A JWT-hez használt titkos kulcs meg van osztva az Auth és a Server között, így a Server is védhet API végpontokat.

Az Auth szolgáltatás egy Azure MSSQL adatbázisba menti le a felhasználók adatait.

### Server
A Server kezeli a blob storage fájlkezelését (képek lementéséhez, törléséhez), illetve a fájlok metaadatainak mentéséhez.

A képeket egy Azure Blob Storage-ba mentem le, amit a ***StorageService*** valósít meg. Ehhez a szolgáltatáshoz a `@azure/storage-blob` könyvtárat használom a képek feltöltéséhez és törléséhez.

A képekhez eltárolja a szerver az Auth szolgáltatáshoz hasonlóan egy Azure adatbázisba a metaadatokat: fájlnév (ID), név (amit a felhasználó ad meg neki) és a feltöltés dátumát.


## Deployment
Ahogy az fent említve volt, az Azure SQL Server és Azure Blob Storage van használva az adatok és képek tárolására, emellett a szolgáltatások telepítésére a `Render` Platform-as-a-Service szolgáltatást használtam.

Ez a szolgáltatás összekötöttem a webalkalmazás Github repository-jával, melyhez létrehoztam egy `render.yaml` fájlt, ami a szolgáltatásaimat írja le, többek között a hozzájuk tartozó *Dockerfile*-ok elérési útvonalát.

A CI/CD folyamatot Github Actions-el oldottam meg, amit a `.github/workflows` mappában lévő `main.yaml` ír le. Ez egy-egy POST hívást küld a megfelelő *Render Hookok* címére, elindítva a telepítést. A hookok címeit a Github Secrets füléről tölti be a workflow.