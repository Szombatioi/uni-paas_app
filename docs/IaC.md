<!-- TODO: befejezni -->
OpenShiften a Service-ek automatikusan biztosítják a belső hálózatot, külön NetworkPolicy nem szükséges alapértelmezetten

OpenShift/Kubernetes környezetben ezt a namespace-alapú RBAC és a Service Account-ok kezelik. Mivel egyetemi managed OpenShift-et használsz, ezeket a platform kezeli, nem kell külön konfigurálni.

Route-ok nincsenek kezelve jogosultsági korlát miatt - de ezek amúgy is léteznek már és nem nagyon változnak
A Terraform-nak le kell kérdeznie a cluster-szintű CRD-ket (Custom Resource Definitions), és ehhez nem volt jogosultságod:
Lehetséges megoldás:
openshift Terraform provider használata, ami natívan ismeri a Route típust és nem igényel CRD listázást:


Cloudflare R2 nincs kezelve - csak a credentials van kezelve, maga a bucket nem