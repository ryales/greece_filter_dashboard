# LIBRARIES REQUIRED:
# install.packages("devtools")
library(devtools)
#
# install_github("bedatadriven/activityinfo-R", ref = "release")
library(activityinfo)
#
# install.packages("RCurl")
library(RCurl)
# 
# install.packages("rjson")
library(rjson)
#
# install.packages("RJSONIO")
library(RJSONIO)
#
# install_github("Vizzuality/cartodb-r", subdir = "CartoDB")
# library(CartoDB)
#
# install.packages("rdrop2")
library(rdrop2)
#
#
# AUTHENTICATE CREDENTIALS
activityinfo_email <- "ryales@redcross.org.uk"
activityinfo_pass  <- "Activity15Info"
activityInfoLogin(activityinfo_email,activityinfo_pass)
#
#
# STORED DATABASE VARIABLES:
GRCreportingDb <- getDatabaseSchema(5773)
#
#
# ACCESSING ACTIVITIES:
GRCdata <- GRCreportingDb$activities[[1]]
#
dataDf <- getSitesDataFrame(GRCdata)
#
#
# REASSIGN MISSING VALUES AS 0 FOR PROPER DATATYPE IMPORT BY CARTODB
dataDf[is.na(dataDf)] <- 0
#
# RENAME COLUMNS FOR HR
names(hrDf)[names(hrDf)=="Nursing.Volunteers"] <- "nurse_vols"
names(hrDf)[names(hrDf)=="Nursing.Hours.of.Service"] <- "nurse_vols_hrs"
names(hrDf)[names(hrDf)=="Social.Welfare.Volunteers"] <- "social_vols"
names(hrDf)[names(hrDf)=="Social.Welfare.Hours.of.Service"] <- "social_vols_hrs"
names(hrDf)[names(hrDf)=="RFL.Volunteers"] <- "rfl_vols"
names(hrDf)[names(hrDf)=="RFL.Hours.of.Service"] <- "rfl_vols_hrs"
names(hrDf)[names(hrDf)=="Samaritan.Volunteers"] <- "samaritan_vols"
names(hrDf)[names(hrDf)=="Samaritan.Hours.of.Service"] <- "samaritan_vols_hrs"
names(hrDf)[names(hrDf)=="Fast.Track.Training.Volunteers"] <- "fasttrack_vols"
names(hrDf)[names(hrDf)=="Fast.Track.Training.Hours.of.Service"] <- "fasttrack_vols_hrs"
names(hrDf)[names(hrDf)=="Staff.and.Volunteers.Trained"] <- "staffvols_trained"
names(hrDf)[names(hrDf)=="Fast.Track.Training.Hours.of.Service"] <- "fasttrack_vols_hrs"
names(hrDf)[names(hrDf)=="Total.Volunteers"] <- "total_vols"
names(hrDf)[names(hrDf)=="Total.Volunteer.Hours"] <- "total_hrs"
#
names(servDf)[names(servDf)=="Health.Services..Including.ERU."] <- "health_eru"
names(servDf)[names(servDf)=="First.Aid"] <- "first_aid"
names(servDf)[names(servDf)=="Rescue.Activities"] <- "rescue"
names(servDf)[names(servDf)=="Hygiene.Promotion..HP."] <- "hygiene_promo"
names(servDf)[names(servDf)=="WASH.Activities"] <- "wash"
names(servDf)[names(servDf)=="PSS.and.Counseling"] <- "pss_counseling"
names(servDf)[names(servDf)=="Children.Activities"] <- "child_activities"
names(servDf)[names(servDf)=="Total.PSS"] <- "total_pss"
names(servDf)[names(servDf)=="RFL.cases..traces."] <- "total_rfl"
names(servDf)[names(servDf)=="RFL.cases..vunerable.people."] <- "total_rfl_vulnerable"
names(servDf)[names(servDf)=="Provision.of.information..guidance.or.advocacy"] <- "info_services"
names(servDf)[names(servDf)=="Provision.of.wifi.or.mobile.recharging"] <- "wifi_mobile"
names(servDf)[names(servDf)=="Provision.of.phone.cards.and.free.calls"] <- "phone_cards_calls"
names(servDf)[names(servDf)=="Number.of.calls.received..Hotline."] <- "hotline_calls"
names(servDf)[names(servDf)=="Other"] <- "other_services"
names(servDf)[names(servDf)=="Total.Health"] <- "total_health"
names(servDf)[names(servDf)=="Total.Connectivity"] <- "total_connectivity"
names(servDf)[names(servDf)=="Total.WASH"] <- "total_wash"
names(servDf)[names(servDf)=="Total.people.reached"] <- "total_ppl_reached"
#
names(distDf)[names(distDf)=="Male"] <- "male"
names(distDf)[names(distDf)=="Female"] <- "female"
names(distDf)[names(distDf)=="Under.5"] <- "under5"
names(distDf)[names(distDf)=="Men..women.and.under.5"] <- "total_beneficiaries2"
names(distDf)[names(distDf)=="Total.beneficiaries"] <- "total_beneficiaries"
names(distDf)[names(distDf)=="Family.Parcels..1.per.4.persons."] <- "family_parcels"
names(distDf)[names(distDf)=="Food.Parcels"] <- "food_parcels"
names(distDf)[names(distDf)=="Food.to.go"] <- "food_to_go"
names(distDf)[names(distDf)=="Hot.Meals"] <- "hot_meals"
names(distDf)[names(distDf)=="Water.Bottles"] <- "water_bottles"
names(distDf)[names(distDf)=="Survival.Kits"] <- "survival_kits"
names(distDf)[names(distDf)=="Total.Food"] <- "total_food"
names(distDf)[names(distDf)=="Tea.Packs"] <- "tea"
names(distDf)[names(distDf)=="Packs.of.sugar"] <- "sugar_packs"
names(distDf)[names(distDf)=="Plastic.bags"] <- "plastic_bags"
names(distDf)[names(distDf)=="Total.Ramadan"] <- "ramadan"
names(distDf)[names(distDf)=="Tea.Packs"] <- "tea"
names(distDf)[names(distDf)=="Plastic.cups"] <- "plastic_cups"
names(distDf)[names(distDf)=="Feminine.Parcels"] <- "fem_hygkit"
names(distDf)[names(distDf)=="Male.Hygiene.Kit"] <- "male_hygkit"
names(distDf)[names(distDf)=="Unisex.Hygiene.Kits"] <- "unisex_hygkit"
names(distDf)[names(distDf)=="Sanitation.Pads"] <- "san_pads"
names(distDf)[names(distDf)=="Baby.Kits...2yrs"] <- "baby_kits"
names(distDf)[names(distDf)=="Razors"] <- "razors"
names(distDf)[names(distDf)=="Diapers..S.M.L."] <- "diapers"
names(distDf)[names(distDf)=="Sleeping.Bags"] <- "sleeping_bags"
names(distDf)[names(distDf)=="Camping.Mats"] <- "camp_mats"
names(distDf)[names(distDf)=="High.Thermal.Blankets"] <- "high_thermal_blankets"
names(distDf)[names(distDf)=="Medium.Thermal.Blankets"] <- "med_thermal_blankets"
names(distDf)[names(distDf)=="Clothing.items..jackets."] <- "jackets"
names(distDf)[names(distDf)=="Socks"] <- "socks"
names(distDf)[names(distDf)=="Total.Textiles"] <- "total_textiles"
names(distDf)[names(distDf)=="Alum.Emergency.blankets"] <- "alum_blankets"
names(distDf)[names(distDf)=="Duffel.Bag"] <- "duffel_bags"
names(distDf)[names(distDf)=="Backpacks"] <- "backpacks"
names(distDf)[names(distDf)=="Other"] <- "other"
names(distDf)[names(distDf)=="Total.NFI.Other"] <- "total_nfi_other"
names(distDf)[names(distDf)=="Total.Hygiene"] <- "total_hygiene"
names(distDf)[names(distDf)=="Total.backpacks.and.duffel.bags"] <- "total_bags"
names(distDf)[names(distDf)=="All.Hygiene.Kits"] <- "total_hygkits"
names(distDf)[names(distDf)=="Sleeping.bags..mats.and.blankets"] <- "total_warmth"
names(distDf)[names(distDf)=="All.clothing"] <- "total_clothing"
#
# EXPORT DATA TO JSON
cat(toJSON(hrDf), file = 'hrDf_latest.json')
#
#
# TO CREATE NEW GREECE RESPONSE LOCATION:
# createLocation(id = generateId(), 5549, "NAME", axe = "ALT_NAME", longitude = , latitude = )
#
#
# TO ADD PARTNER TO GREECE REPORTING DATABASE:
#  addPartner(5549, partnerName = "NAME", fullPartnerName = "FULL_NAME")
#
#
# TO EXPORT DATA TO CSV:
write.csv(dataDf, file="GRC_data_all_autoimport.csv", row.names= FALSE)
#
#
# TO PUSH TO DROPBOX:
# drop_access()
drop_upload('GRC_data_all_autoimport.csv', dest = "Europe Zone Data Sharing/D17_ActivityInfo_Data/data")
