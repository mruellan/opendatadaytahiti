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
write.csv2(EBF, "EBF.csv", row.names = FALSE, na = "")
