library(maptools)
library(rgdal)
library(data.table)
setwd("~/R/shp")

importAndConvert<-function(shapeFile)
{
  inputFolder <-"shp"
  df<-spTransform(readOGR(inputFolder, shapeFile), CRS("+proj=longlat +datum=WGS84"))
  df
}

CommuneAssociee <-importAndConvert("CommuneAssociee")
plot(CommuneAssociee[CommuneAssociee$IDSub==1,], axes=TRUE)
