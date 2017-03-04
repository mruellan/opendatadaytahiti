library(RODBC)

myconn <-odbcConnect("EFH")
EBF <- sqlQuery(myconn, "
select * from openquery([SQL_CUBEEBF],'select 
non empty {[Measures].[Ménages],[Measures].[Individus],
                        [Measures].[Dépenses],[Measures].[Ressources],
                        [Measures].[Dépenses moyennes mensuelles par ménage]
                        } on 0,
                        non empty ([Géographie].[Comas].children,[Géographie].[Ile].children,
                        [Individu].[Sexe].children, [Individu].[Tranche Age].children, [Individu].[CS8 Courte].children) on 1
                        from EBF')")
colnames(EBF)<-c("Comas","Ile", "Sexe", "TrancheAge", "CS8", "Menages", "Individus","Depenses","Ressources", "DMM")



RP<-sqlQuery(myconn, "select * from openquery([RP2012],'select 
non empty {[Measures].[Menages],[Measures].[Individus],[Measures].[Résidences principales],
[Measures].[Population moyenne du ménage]
} on 0,
non empty ([Geographie].[Comas].children,[Geographie].[Ile].children,
[Individus].[Sexe].children, [Individus].[Age décennal 80].children, [Individus].[CSP].[CSP1]) on 1
from RP2012')")
colnames(RP)<-c("Comas","Ile", "Sexe", "TrancheAge", "CS8", "Menages", "Individus","ResidencesPrincipales","PopMoyenneMenage")



write.csv2(EBF, "EBF.csv", row.names = FALSE, na = "")
write.csv2(RP, "RP.csv", row.names = FALSE, na = "")
