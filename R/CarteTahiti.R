library(rgdal)
library(dplyr)
library(broom)
library(viridis)
library(ggplot2)
DistrictShp<-readOGR("Cartographie/shp", "District")
CommuneShp <-readOGR("Cartographie/shp", "Commune")
DistrictShp<-subset(DistrictShp, (IDSub==1 & !(IDCom==29) & !(IDDist %in% c(474001910,120001570,120001560))))
DistrictShp<-subset(DistrictShp, (IDSub==1 & (IDCom==35) & !(IDDist %in% c(474001910,120001570,120001560))))
CommuneShp <-subset(CommuneShp, (IDSub==1 & !(IDCom==29)))
# plot(District)
# plot(Commune)

data<-as.data.frame(cbind("IDDist"=DistrictShp$IDDist, "IDCom"=DistrictShp$IDCom, "Population"=DistrictShp$Pop_RP12))
District <- tidy(DistrictShp, region = "IDDist") %>% 
  mutate(id = as.numeric(id)) %>%
  left_join(data, by = c("id" = "IDDist"))


theme_map <- function(...) {
  theme_minimal() +
    theme(
      text = element_text(family = "Calibri", color = "#22211d"),
      axis.line = element_blank(),
      axis.text.x = element_blank(),
      axis.text.y = element_blank(),
      axis.ticks = element_blank(),
      axis.title.x = element_blank(),
      axis.title.y = element_blank(),
      # panel.grid.minor = element_line(color = "#ebebe5", size = 0.2),
      panel.grid.major = element_line(color = "#ebebe5", size = 0.2),
      panel.grid.minor = element_blank(),
      plot.background = element_rect(fill = "#f5f5f2", color = NA), 
      panel.background = element_rect(fill = "#f5f5f2", color = NA), 
      legend.background = element_rect(fill = "#f5f5f2", color = NA),
      panel.border = element_blank(),
      ...
    )
}
warnings()

p<-ggplot() +
  geom_polygon(data = District,aes(long,lat, group=group, fill=Population))+
  geom_path(data = District, aes(x = long,y = lat,group = IDCom),color = "white", size = 0.1) +
  coord_equal() +
  theme_map() +
  labs(x = NULL, 
       y = NULL, 
       title = "Switzerland's regional demographics", 
       subtitle = "Average age in Swiss municipalities, 2015", 
       caption = "Geometries: ThemaKart, BFS; Data: BFS, 2016")
p
q <- p +
  # this is the main part
  theme(legend.position = "bottom") +
  scale_fill_viridis(
    option = "magma", 
    direction = -1,
    name = "Average age",
    # here we use guide_colourbar because it is still a continuous scale
    guide = guide_colorbar(
      direction = "horizontal",
      barheight = unit(2, units = "mm"),
      barwidth = unit(50, units = "mm"),
      draw.ulim = F,
      title.position = 'top',
      # some shifting around
      title.hjust = 0.5,
      label.hjust = 0.5
    ))
q

no_classes <- 6
labels <- c()

quantiles <- quantile(map_data$avg_age_15, 
                      probs = seq(0, 1, length.out = no_classes + 1))

# here I define custom labels (the default ones would be ugly)
labels <- c()
for(idx in 1:length(quantiles)){
  labels <- c(labels, paste0(round(quantiles[idx], 2), 
                             " - ", 
                             round(quantiles[idx + 1], 2)))
}
# I need to remove the last label 
# because that would be something like "66.62 - NA"
labels <- labels[1:length(labels)-1]

# here I actually create a new 
# variable on the dataset with the quantiles
map_data$avg_age_15_quantiles <- cut(map_data$avg_age_15, 
                                     breaks = quantiles, 
                                     labels = labels, 
                                     include.lowest = T)

p <- ggplot() +
  # municipality polygons (watch how I 
  # use the new variable for the fill aesthetic)
  geom_polygon(data = map_data, aes(fill = avg_age_15_quantiles, 
                                    x = long, 
                                    y = lat, 
                                    group = group)) +
  # municipality outline
  geom_path(data = map_data, aes(x = long, 
                                 y = lat, 
                                 group = group), 
            color = "white", size = 0.1) +
  coord_equal() +
  theme_map() +
  labs(x = NULL, 
       y = NULL, 
       title = "Switzerland's regional demographics", 
       subtitle = "Average age in Swiss municipalities, 2015", 
       caption = "Geometries: ThemaKart, BFS; Data: BFS, 2016") +
  # now the discrete-option is used, 
  # and we use guide_legend instead of guide_colourbar
  scale_fill_viridis(
    option = "magma",
    name = "Average age",
    discrete = T,
    direction = -1,
    guide = guide_legend(
      keyheight = unit(5, units = "mm"),
      title.position = 'top',
      reverse = T
    ))
p
