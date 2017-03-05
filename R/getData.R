library(RODBC)
library(dplyr)

myconn <-odbcConnect("RP2012")
EBF <- sqlQuery(myconn, "
select * from openquery([SQL_CUBEEBF],'select 
non empty {[Measures].[Ménages],[Measures].[Individus],
                        [Measures].[Dépenses],[Measures].[Ressources],
                        [Measures].[Dépenses moyennes mensuelles par ménage]
                        } on 0,
                        non empty ([Géographie].[Comas].children,[Géographie].[Ile].children,
                        [Individu].[Sexe].children, [Individu].[Tranche Age].children, [Individu].[CS8 Courte].children) on 1
                        from EBF')")
colnames(EBF)<-c("Comas","Ile", "Sexe", "TrancheAge", "CSP", "Menages", "Individus","Depenses","Ressources", "DMM")




EBFDepenses<-sqlQuery(myconn,"select * from openquery([SQL_CUBEEBF],'with member measures.[Alcool] as ([Measures].[Dépenses moyennes mensuelles par ménage répondant],[Depenses].[COICOP].[Groupe].&[021])
member measures.[Tabac] as ([Measures].[Dépenses moyennes mensuelles par ménage répondant],[Depenses].[COICOP].[Groupe].&[022])
                      select 
                      non empty {[Measures].[alcool], [Measures].[tabac]} on 0,
                      non empty ([Géographie].[Comas].children,[Géographie].[Ile].children,
                      [Individu].[Tranche Age].children, [Individu].[Sexe].children, 
                      [Individu].[CS8].children) on 1
                      from EBF')")
colnames(EBFDepenses)<-c("Comas", "Ile", "TrancheAge", "Sexe", "CSP", "Alcool", "Tabac")

RP<-sqlQuery(myconn, "select * from openquery([RP2012],'select 
non empty {[Measures].[Menages],[Measures].[Individus],[Measures].[Résidences principales],
[Measures].[Population moyenne du ménage]
} on 0,
non empty ([Geographie].[Comas].children,[Geographie].[Ile].children,
[Individus].[Sexe].children, [Individus].[Age décennal 80].children, [Individus].[CSP].[CSP1]) on 1
from RP2012')")
colnames(RP)<-c("Comas","Ile", "Sexe", "TrancheAge", "CSP", "Menages", "Individus","ResidencesPrincipales","PopMoyenneMenage")
  
RP2<-sqlQuery(myconn,"select  Comas, Ile, a.age3112 as Age, left(j.Sexe,5) as Sexe,  g.TrancheAge, CSP1, CSP1Lib, Q9Lib,
isnull(Q6Lib, 'Non renseigné') as StatutOccupation
              from  RP2012Cube.dbo.BI a
              left outer join RP2012Cube.dbo.FL fl on a.idfl=fl.idfl
              left outer join RP2012Cube.BI.Q09 b on a.Q9=b.Q9
              left outer join SIG.dbo.GeoPassage c on left(a.iddist,5)=c.idgeo
              left outer join SIG.dbo.CommunesAssociees d on c.idcomas=d.idcomas
              left outer join SIG.dbo.Iles e on c.idile=e.idile
              left outer join RP2012Cube.BI.CSPCommune f on a.csp=f.csp4
              left outer join (select distinct age, trancheage from EBFTravail.dbo.DimIndividuCache) g on a.age3112=g.age
              left outer join RP2012Cube.FL.Q06 i on fl.q6=i.Q6
              left outer join RP2012Cube.BI.Q01 j on a.Q1=j.q1")

RP2$CSP2<-RP2$CSP1
RP2$CSP2Lib<-as.character(RP2$CSP1Lib)
RP2[RP2$CSP1>6,]$CSP2<-7
RP2[RP2$CSP1>6,]$CSP2Lib<-"Sans emploi"

RP3 <- RP2 %>% 
  group_by_(.dots=c("Comas", "Ile","TrancheAge", "Sexe", "CSP2Lib")) %>% 
  summarise(StatutMarital = names(table(Q9Lib))[which.max(table(Q9Lib))],
            n=n(), 
            StatutOccupation = names(table(StatutOccupation))[which.max(table(StatutOccupation))])%>%
  mutate(StatutMaritalFreq = n / sum(n))

colnames(RP3)<-c("Comas", "Ile", "TrancheAge", "Sexe", "CSP", "StatutMarital", "Nombre", "StatutOccupation", "StatutMaritalFreq")

RP3$AgeMin<-as.numeric(substr(RP3$TrancheAge,0,2))
RP3$AgeMax<-as.numeric(substr(RP3$TrancheAge,5,7))
RP3[is.na(RP3$AgeMax),]$AgeMax <- 150

trim.trailing <- function (x) sub("^\\s+", "", x)
trim.trailing(EBFDepenses$CSP)

RP3$Nombre<-NULL

EBFDepenses$CSP<-as.character(EBFDepenses$CSP)
EBFDepenses[EBFDepenses$CSP==" Agriculteur"




table(RP3$CSP)
table(EBFDepenses$CSP)


write.csv2(RP3, "RP3.csv", row.names = FALSE, na = "")
sink("rp3.json")
cat(jsonlite::toJSON(RP3))
sink()
