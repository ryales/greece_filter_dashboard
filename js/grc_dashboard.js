// Color scale options: set as array
var colors = ['#F44336','#673AB7','#009688','#FFEB3B','#FF9800','#9E9E9E','#8A2BE2'];

// Set max date for graphs and charts to today's date
// Then parse by week
var weekFormat = d3.time.format("%W");
var scale_maxDate = new Date();
var scale_minDate = new Date(2016,1,1);
scale_maxWeek = weekFormat(scale_maxDate);
scale_minWeek = weekFormat(scale_minDate);

// Define charts that need to be constructed
var count_chart1  = dc.compositeChart("#serv_count"),      // Total Services Provided
    //count_chart2  = dc.lineChart("#dist_count"),      // Total Distributions Provided
    stats_chart1  = dc.compositeChart("#serv_stats"), // Services by Sector
    stats_chart2  = dc.compositeChart("#dist_stats"), // Distributions by Category
    
    loc_chart     = dc.rowChart("#location"),         // Locations

    vulner_chart  = dc.pieChart("#rfl"),              // RFL Tracing
    under5_chart  = dc.pieChart("#under5");           // Under5 out of Total


// Build the charts with the given data
function generateCharts(data) {

    // Feed data into crossfilter
    var cf1 = crossfilter(data);

    // Set common dimensions for date and location
    var dateDimension = cf1.dimension(function(d){ return d.reportWeek; });
    var locDimension  = cf1.dimension(function(d){ return d.locationName; });

    // Grab dimension definitions for under5s and vulnerable population
    var under5Dimension = cf1.dimension(function(d){ return d.Under5; })
    var vulnerDimension = cf1.dimension(function(d){ return d.tRFL_Vulnerable; });


    // Set groups (when filtered by a given dimension, return the right indicators)
    var dateGroup1         = dateDimension.group().reduceSum(function(d) {return d.tRFL+d.tConnect+d.tHygiene+d.tHealth+d.tPSS;});
    var servicesGroup     = dateDimension.group().reduceSum(function(d) {return d.tPpl_Reached;}); // Services total
    var rflGroup          = dateDimension.group().reduceSum(function(d) {return d.tRFL;});
    var washGroup         = dateDimension.group().reduceSum(function(d) {return d.tHygiene;});
    var healthGroup       = dateDimension.group().reduceSum(function(d) {return d.tHealth;});
    var connectivityGroup = dateDimension.group().reduceSum(function(d) {return d.tConnect;});
    var pssGroup          = dateDimension.group().reduceSum(function(d) {return d.tPSS;});
    
    var dateGroup         = dateDimension.group().reduceSum(function(d) {return d.tRFL+d.tConnect+d.tHygiene+d.tHealth+d.tPSS+d.tFood+d.tHygiene+d.Water_Bottles+d.tWarmth+d.tClothing+d.tBags+d.tRamadan+d.tNFI_Other;});
    var locGroup          = locDimension.group().reduceSum(function(d) {return d.tRFL+d.tConnect+d.tHygiene+d.tHealth+d.tPSS+d.tFood+d.tHygiene+d.Water_Bottles+d.tWarmth+d.tClothing+d.tBags+d.tRamadan+d.tNFI_Other;});
    var vulnerGroup       = vulnerDimension.group().reduceSum(function(d) {return d.tRFL+d.tConnect+d.tHygiene+d.tHealth+d.tPSS;});

    // Define groups for dataset2
    var dateGroup2 = dateDimension.group().reduceSum(function(d) {return d.tFood+d.tHygiene+d.Water_Bottles+d.tWarmth+d.tClothing+d.tBags+d.tRamadan+d.tNFI_Other;});
    var distGroup  = dateDimension.group().reduceSum(function(d) {return d.tBen;});
    var foodGroup  = dateDimension.group().reduceSum(function(d) {return d.tFood;});
    var waterGroup  = dateDimension.group().reduceSum(function(d) {return d.Water_Bottles;});
    var hygieneGroup  = dateDimension.group().reduceSum(function(d) {return d.tHygiene;});
    var textilesGroup = dateDimension.group().reduceSum(function(d) {return d.tTextiles;});
    var warmthGroup = dateDimension.group().reduceSum(function(d) {return d.tWarmth;});
    var bagsGroup = dateDimension.group().reduceSum(function(d) {return d.tBags;});
    var ramadanGroup = dateDimension.group().reduceSum(function(d) {return d.tRamadan;});
    var under5Group = dateDimension.group().reduceSum(function(d) {return d.Men_Women_Under5;});

    // Set totals groups
    var servicesAll     = cf1.groupAll().reduceSum(function(d){ return d.tRFL+d.tConnect+d.tWASH+d.tHealth+d.tPSS;; });
    var rflAll          = cf1.groupAll().reduceSum(function(d){ return d.tRFL; });
    var connectivityAll = cf1.groupAll().reduceSum(function(d){ return d.tConnect; });
    var washAll         = cf1.groupAll().reduceSum(function(d){ return d.tWASH; });
    var healthAll       = cf1.groupAll().reduceSum(function(d){ return d.tHealth; });
    var pssAll          = cf1.groupAll().reduceSum(function(d){ return d.tPSS; });

    var distAll     = cf1.groupAll().reduceSum(function(d){ return d.tFood+d.tHygiene+d.Water_Bottles+d.tWarmth+d.tClothing+d.tBags+d.tRamadan+d.tNFI_Other; });
    var foodAll     = cf1.groupAll().reduceSum(function(d){ return d.tFood; });
    var hygieneAll  = cf1.groupAll().reduceSum(function(d){ return d.tHygiene; });
    var waterAll    = cf1.groupAll().reduceSum(function(d){ return d.Water_Bottles; });
    var warmthAll   = cf1.groupAll().reduceSum(function(d){ return d.tWarmth; });
    var clothingAll = cf1.groupAll().reduceSum(function(d){ return d.tClothing; });
    var bagsAll     = cf1.groupAll().reduceSum(function(d){ return d.tBags; });
    var ramadanAll  = cf1.groupAll().reduceSum(function(d){ return d.tRamadan; });

    // Set x scale for Jan 1, 2016 through today
    var xScaleRange = d3.scale.linear().domain([scale_minWeek, scale_maxWeek]);
    console.log(xScaleRange);

    count_chart1
        .width($('#serv_count').width())
        .height(150)
        .dimension(dateDimension)
        //.group(dateGroup)
        .x(xScaleRange)
        .elasticY(true)
        .compose([
            dc.lineChart(count_chart1).group(dateGroup1, 'Services').colors(colors[2]),
            dc.lineChart(count_chart1).group(dateGroup2, 'Distributions').colors(colors[3])
            ])
        .xAxisLabel("Week of 2016")
        .yAxisLabel(" ")
        .legend(dc.legend().x($('#serv_count').width()-100).y(0).gap(2))
        .xAxis().ticks(8);
    //count_chart1.yAxis().ticks(8);
        
    stats_chart1
            .width($('#serv_stats').width())
            .height(200)
            .dimension(dateDimension)
            .x(xScaleRange)
            .elasticY(true)
            .compose([
                dc.lineChart(stats_chart1).group(connectivityGroup, 'Connectivity').colors(colors[2]),
                dc.lineChart(stats_chart1).group(washGroup, 'WASH').colors(colors[3]),
                dc.lineChart(stats_chart1).group(healthGroup, 'Health').colors(colors[4]),
                dc.lineChart(stats_chart1).group(rflGroup, 'RFL').colors(colors[5]),
                dc.lineChart(stats_chart1).group(pssGroup, 'PSS').colors(colors[6])           
            ])
            .brushOn(false)
            .xAxisLabel("Week of 2016")
            .yAxisLabel(" ")
            .legend(dc.legend().x($('#serv_count').width()-100).y(0).gap(2))
            .xAxis().ticks(8);

    /*count_chart2
        .width($('#dist_count').width())
        .height(150)
        .dimension(dateDimension)
        .group(dateGroup)
        .x(xScaleRange)
        .xAxisLabel("Week of 2016")
        .yAxisLabel("Total Distributions")
        .xAxis().ticks(8);
    count_chart2.yAxis().ticks(8);*/

    stats_chart2
        .width($('#dist_stats').width())
        .height(150)
        .dimension(dateDimension)
        .x(d3.scale.linear().domain([scale_minWeek, scale_maxWeek]))
            .elasticY(true)
            .compose([
                dc.lineChart(stats_chart2).group(foodGroup, 'Food').colors(colors[2]),
                dc.lineChart(stats_chart2).group(waterGroup, 'Water Bottles').colors(colors[3]),
                dc.lineChart(stats_chart2).group(hygieneGroup, 'Hygiene').colors(colors[4]),
                dc.lineChart(stats_chart2).group(textilesGroup, 'Textiles').colors(colors[5]),         
            ])
        .brushOn(false)
        .xAxisLabel("Week of 2016")
        .yAxisLabel(" ")
        .legend(dc.legend().x($('#serv_count').width()-100).y(0).gap(2))
        .xAxis().ticks(8);
    stats_chart2.yAxis().ticks(8);
            
    loc_chart.width($('#location').width()).height(400)
            .dimension(locDimension)
            .group(locGroup)
            .xAxis().ticks(5);

    vulner_chart.width($('#rfl').width()).height(200)
            .dimension(vulnerDimension)
            .group(vulnerGroup);

    under5_chart.width($('#under5').width()).height(200)
        .dimension(under5Dimension)
        .group(under5Group);

    dc.dataCount('#servicestotal')
        .dimension(cf1)
        .group(servicesAll);

    dc.dataCount('#rfltotal')
        .dimension(cf1)
        .group(rflAll);

    dc.dataCount('#washtotal')
        .dimension(cf1)
        .group(washAll);

    dc.dataCount('#healthtotal')
        .dimension(cf1)
        .group(healthAll);

    dc.dataCount('#connectivitytotal')
        .dimension(cf1)
        .group(connectivityAll);

    dc.dataCount('#psstotal')
        .dimension(cf1)
        .group(pssAll);

    dc.dataCount('#disttotal')
        .dimension(cf1)
        .group(distAll);

    dc.dataCount('#foodtotal')
        .dimension(cf1)
        .group(foodAll);

    dc.dataCount('#hygienetotal')
        .dimension(cf1)
        .group(hygieneAll);

    dc.dataCount('#watertotal')
        .dimension(cf1)
        .group(waterAll);

    dc.dataCount('#clothingtotal')
        .dimension(cf1)
        .group(clothingAll);

    dc.dataCount('#warmthtotal')
        .dimension(cf1)
        .group(warmthAll);

    dc.dataCount('#bagstotal')
        .dimension(cf1)
        .group(bagsAll);

    dc.dataCount('#ramadantotal')
        .dimension(cf1)
        .group(ramadanAll);

    /*function rangesEqual(range1, range2) {
        if (!range1 && !range2) {
            return true;
        }
        else if (!range1 || !range2) {
            return false;
        }
        else if (range1.length === 0 && range2.length === 0) {
            return true;
        }
        else if (range1[0].valueOf() === range2[0].valueOf() &&
            range1[1].valueOf() === range2[1].valueOf()) {
            return true;
        }
        return false;
    }*/
    // monkey-patch the first chart with a new function
    // technically we don't even need to do this, we could just change the 'filtered'
    // event externally, but this is a bit nicer and could be added to dc.js core someday
    count_chart1.focusCharts = function (chartlist) {
        if (!arguments.length) {
            return this._focusCharts;
        }
        this._focusCharts = chartlist; // only needed to support the getter above
        this.on('filtered', function (range_chart) {
            if (!range_chart.filter()) {
                dc.events.trigger(function () {
                    chartlist.forEach(function(focus_chart) {
                        focus_chart.x().domain(focus_chart.xOriginalDomain());
                    });
                });
            } else chartlist.forEach(function(focus_chart) {
                if (!rangesEqual(range_chart.filter(), focus_chart.filter())) {
                    dc.events.trigger(function () {
                        focus_chart.focus(range_chart.filter());
                    });
                }
            });
        });
        return this;
    };
    /*count_chart2.focusCharts = function (chartlist) {
        if (!arguments.length) {
            return this._focusCharts;
        }
        this._focusCharts = chartlist; // only needed to support the getter above
        this.on('filtered', function (range_chart) {
            if (!range_chart.filter()) {
                dc.events.trigger(function () {
                    chartlist.forEach(function(focus_chart) {
                        focus_chart.x().domain(focus_chart.xOriginalDomain());
                    });
                });
            } else chartlist.forEach(function(focus_chart) {
                if (!rangesEqual(range_chart.filter(), focus_chart.filter())) {
                    dc.events.trigger(function () {
                        focus_chart.focus(range_chart.filter());
                    });
                }
            });
        });
        return this;
    };*/
    count_chart1.focusCharts([stats_chart1,stats_chart2]);
    //count_chart2.focusCharts([stats_chart2,stats_chart2]);

dc.renderAll();
};

//Load in data from source files
d3.queue()
  .defer(d3.csv, "data/GRC_data_all_autoimport.csv")
  .await(analyze);

// Format data for processing
function analyze(error, data) {
    if(error) { console.log(error); }

    var dateFormat = d3.time.format("%Y-%m-%d");
    var weekFormat = d3.time.format("%W");
   

    data.forEach(function(d) {
        d.reportDate           = dateFormat.parse(d.endDate);
        d.reportWeek           = weekFormat(dateFormat.parse(d.endDate));
        d.locationName         = d.locationName;
        d.latitude             = +d.latitude;
        d.longitude            = +d.longitude;
        // Totals data
        d.tRFL                 = +d.tRFL;
        d.tHealth              = +d.tHealth;
        d.tWASH             = +d.tWASH;
        d.tConnect             = +d.tConnect;
        d.tPSS                 = +d.tPSS;
        // Health data   
        d.Health_IncERU        = +d.Health_IncERU;
        d.First_Aid            = +d.First_Aid;
        d.Rescue               = +d.Rescue;
        // WASH data
        d.Hyg_Promo            = +d.Hyg_Promo;
        d.WASH                 = +d.WASH;
        // PSS data
        d.PSS_Counseling       = +d.PSS_Counseling;
        d.Child_Activities     = +d.Child_Activities;
        // RFL data
        d.tRFL_Vulnerable      = +d.tRFL_Vulnerable;
        // Connectivity data
        d.Info_Services        = +d.Info_Services;
        d.WIFI_Mobile          = +d.WIFI_Mobile;
        d.PhoneCards_Calls    = +d.PhoneCards_Calls;
        d.Hotline_Calls        = +d.Hotline_Calls;
        // Other data
        d.Other_Services       = +d.Other_Services;
        // Beneficiaries data
        d.tPpl_Reached    = +d.tPpl_Reached;

        // Distributions
        // Totals
        d.tFood           = +d.tFood;
        d.tTextiles            = +d.tTextiles;
        d.tBags           = +d.tBags;
        d.Water_Bottles        = +d.Water_Bottles;
        d.tHygiene        = +d.tHygiene;
        d.tNFI_Other           = +d.tNFI_Other;
        d.tWarmth              = +d.tWarmth;
        d.tHygKits             = +d.tHygKits;
        d.tClothing            = +d.tClothing;
        d.tRamadan             = +d.tRamadan;
        d.tDistributions       = +d.tDistributions;
        // Food data
        d.Food_Parcels         = +d.Food_Parcels;
        d.Family_Parcels       = +d.Family_Parcels;
        d.Food_To_Go           = +d.Food_To_Go;
        d.Hot_Meals            = +d.Hot_Meals;
        // Ramadan data
        d.Tea                  = +d.Tea;
        d.Sugar_Packs          = +d.Sugar_Packs;
        d.Plastic_Bags         = +d.Plastic_Bags;
        d.Plastic_Cups         = +d.Plastic_Cups;
        // Hygiene data
        d.Male_HygKits          = +d.Male_HygKits;
        d.Fem_HygKits           = +d.Fem_HygKits;
        d.Razors               = +d.Razors;
        d.Unisex_HygKits        = +d.Unisex_HygKits;
        d.San_Pads             = +d.San_Pads;
        d.Diapers              = +d.Diapers;
        d.BabyKits             = +d.BabyKits;
        d.Survival_Kits        = +d.Survival_Kits;
        // Clothing and Warmth data
        d.Jackets              = +d.Jackets;
        d.Socks                = +d.Socks;
        d.Med_Thermal_Blankets = +d.Med_Thermal_Blankets;
        d.High_Thermal_Blankets= +d.High_Thermal_Blankets;
        d.Sleeping_Bags        = +d.Sleeping_Bags;
        d.Camping_Mats         = +d.Camping_Mats;
        d.Alum_Blankets        = +d.Alum_Blankets;
        d.Other                = +d.Other;
        // Bags data
        d.Duffel_Bags          = +d.Duffel_Bags;
        d.Backpacks            = +d.Backpacks;
        // Beneficiaries data
        d.Female               = +d.Female;
        d.Male                 = +d.Male;
        d.Under5               = +d.Under5;
        d.Men_Women_Under5     = +d.Men_Women_Under5;
        d.tBen                 = +d.tBen;


        // HR Data
        d.Ben_Hrs_Service = +d.Ben_Hrs_Service;
        d.Ben_Vols = +d.Ben_Vols;
        d.RFL_Hrs_Service = +d.RFL_Hrs_Service;
        d.RFL_Vols = +d.RFL_Vols;
        d.FTTraining_Hrs_Service = +d.FTTraining_Hrs_Service;
        d.FTTraining_Vols = +d.FTTraining_Vols;
        d.Nursing_Hrs_Service = +d.Nursing_Hrs_Service;
        d.Nursing_Vols = +d.Nursing_Vols;
        d.Sam_Hrs_Service = +d.Sam_Hrs_Service;
        d.Sam_Vols = +d.Sam_Vols;
        d.SocWel_Hrs_Service = +d.SocWel_Hrs_Service;
        d.SocWel_Vols = +d.SocWel_Vol;
        d.Staff_Vols_Trained = +d.Staff_Vols_Trained;

        d.tVolsHrs_ExcBen     = +d.tVolsHrs_ExcBen;
        d.tVolsHrs_IncBen = +d.tVolsHrs_IncBen;
        d.tVols_ExcBen = +d.tVols_ExcBen;
        d.tVols_IncBen = +d.tVols_IncBen;

    });
    console.log(data);

    // Send formatted data to chart builder function
    generateCharts(data);

};
