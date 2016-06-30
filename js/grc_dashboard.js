// Color scale options: set as array
var colors = ['#F44336','#673AB7','#009688','#FFEB3B','#FF9800','#9E9E9E','#8A2BE2'];

// Set max date for graphs and charts to today's date
// and then parse by week
var weekFormat = d3.time.format("%W");
var scale_maxDate = new Date();
var scale_minDate = new Date(2016,1,1);
scale_maxWeek = weekFormat(scale_maxDate);
scale_minWeek = weekFormat(scale_minDate);

// Define charts that need to be constructed
var count_chart1  = dc.lineChart("#serv_count"),
    count_chart2  = dc.lineChart("#dist_count"),
    stats_chart1  = dc.compositeChart("#serv_stats"),
    stats_chart2  = dc.compositeChart("#dist_stats");

var location_chart   = dc.rowChart("#location");
var vulnerable_chart = dc.pieChart("#rfl");
var under5_chart           = dc.pieChart("#under5");

function generateCharts(services,distributions) {


    
    // Feed data into crossfilter
    var cf1 = crossfilter(services);
    var cf2 = crossfilter(distributions);

    // Set dimensions
    var dateDimension    = cf1.dimension(function(d){ return d.reportWeek; });
    //var monthlyDimension = cf1.dimension(function (d) { return d3.time.year(d.reportDate).getMonth(); });
    var locDimension     = cf1.dimension(function(d){ return d.locationName; });
    var vulnerDimension  = cf1.dimension(function(d){ return d.rflVulner; });


    // Set groups (when filtered by a given dimension, return the right indicators)
    var dateGroup         = dateDimension.group().reduceSum(function(d) {return d.total_rfl+d.total_connectivity+d.total_wash+d.total_health+d.total_pss;});
    var servicesGroup     = dateDimension.group().reduceSum(function(d) {return d.total_ppl_reached;});
    var rflGroup          = dateDimension.group().reduceSum(function(d) {return d.total_rfl;});
    var washGroup         = dateDimension.group().reduceSum(function(d) {return d.hygiene_promo+d.wash;});
    var healthGroup       = dateDimension.group().reduceSum(function(d) {return d.health_eru+d.rescue+d.first_aid;});
    var connectivityGroup = dateDimension.group().reduceSum(function(d) {return d.info_services+d.phone_cards_calls+d.wifi_mobile+d.hotline_calls;});
    var pssGroup          = dateDimension.group().reduceSum(function(d) {return d.pss_counseling+d.child_activities;});
    
    var locGroup          = locDimension.group().reduceSum(function(d) {return d.total_rfl+d.total_connectivity+d.total_wash+d.total_health+d.total_pss;});
    var vulnerGroup       = vulnerDimension.group().reduceSum(function(d) {return d.total_rfl+d.total_connectivity+d.total_wash+d.total_health+d.total_pss;});

    // Set dimensions for dataset2
    var dateDimension2    = cf2.dimension(function(d){ return d.reportWeek; });
    var locDimension2     = cf2.dimension(function(d){ return d.locationName; });
    var under5Dimension   = cf2.dimension(function(d){ return d["Under 5"]; });

    // Define groups for dataset2
    var dateGroup2 = dateDimension2.group().reduceSum(function(d) {return d.total_food+d.total_clothing+d.total_warmth+d.total_nfi_other+d.water_bottles+d.total_hygiene;});
    var distGroup  = dateDimension2.group().reduceSum(function(d) {return d["Total.beneficiaries"];});
    var locGroup2  = locDimension2.group().reduceSum(function(d) {return d.total_food+d.total_clothing+d.total_warmth+d.total_nfi_other+d.water_bottles+d.total_hygiene;});
    var foodGroup  = dateDimension2.group().reduceSum(function(d) {return d.total_food;});
    var waterGroup  = dateDimension2.group().reduceSum(function(d) {return d.water_bottles;});
    var hygieneGroup  = dateDimension2.group().reduceSum(function(d) {return d.total_hygiene;});
    var textilesGroup = dateDimension2.group().reduceSum(function(d) {return d.total_textiles;});
    var under5Group = dateDimension2.group().reduceSum(function(d) {return d["Under 5"];});

    // Set totals groups
    var servicesAll     = cf1.groupAll().reduceSum(function(d){ return d.total_rfl+d.total_connectivity+d.total_wash+d.total_health+d.total_pss; });
    var rflAll          = cf1.groupAll().reduceSum(function(d){ return d.total_rfl; });
    var connectivityAll = cf1.groupAll().reduceSum(function(d){ return d.total_connectivity; });
    var washAll         = cf1.groupAll().reduceSum(function(d){ return d.total_wash; });
    var healthAll       = cf1.groupAll().reduceSum(function(d){ return d.total_health; });
    var pssAll          = cf1.groupAll().reduceSum(function(d){ return d.total_pss; });


    var distAll     = cf2.groupAll().reduceSum(function(d){ return d.total_rfl+d.total_connectivity+d.total_wash+d.total_health+d.total_pss; });
    var foodAll          = cf2.groupAll().reduceSum(function(d){ return d.total_food; });
    var hygieneAll = cf2.groupAll().reduceSum(function(d){ return d.total_hygiene; });
    var waterAll         = cf2.groupAll().reduceSum(function(d){ return d.water_bottles; });
    var textilesAll       = cf2.groupAll().reduceSum(function(d){ return d.total_textiles; });


    // Set x scale for Jan 1, 2016 through today
    var xScaleRange = d3.scale.linear().domain([scale_minWeek, scale_maxWeek]);
    console.log(xScaleRange);

    count_chart1
        .width($('#serv_count').width())
        .height(150)
        .dimension(dateDimension)
        .group(dateGroup)
        .x(xScaleRange)
        .xAxisLabel("Week of 2016")
        .yAxisLabel("Total Services Provided")
        .xAxis().ticks(8);
    count_chart1.yAxis().ticks(8);
            
    stats_chart1
            .width($('#serv_stats').width())
            .height(200)
            .dimension(dateDimension)
            .x(d3.scale.linear().domain([scale_minWeek, scale_maxWeek]))
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
            .yAxisLabel("Services Provided")
            .legend(dc.legend().x($('#serv_count').width()-150).y(0).gap(5))
            .xAxis().ticks(8);

    count_chart2
        .width($('#dist_count').width())
        .height(150)
        .dimension(dateDimension2)
        .group(dateGroup2)
        .x(xScaleRange)
        .xAxisLabel("Week of 2016")
        .yAxisLabel("Total Distributions")
        .xAxis().ticks(8);
    count_chart2.yAxis().ticks(8);

    stats_chart2
        .width($('#dist_stats').width())
        .height(150)
        .dimension(dateDimension2)
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
        .yAxisLabel("Total Distributions")
        .legend(dc.legend().x($('#dist_count').width()-150).y(0).gap(5))
        .xAxis().ticks(8);
    stats_chart2.yAxis().ticks(8);
            
    location_chart.width($('#location').width()).height(300)
            .dimension(locDimension)
            .group(locGroup)
            .xAxis().ticks(5);

    vulnerable_chart.width($('#rfl').width()).height(200)
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

dc.dataCount('#foodtotal')
    .dimension(cf2)
    .group(foodAll);

dc.dataCount('#hygienetotal')
    .dimension(cf2)
    .group(hygieneAll);

dc.dataCount('#watertotal')
    .dimension(cf2)
    .group(waterAll);

dc.dataCount('#textilestotal')
    .dimension(cf2)
    .group(textilesAll);

    function rangesEqual(range1, range2) {
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
    }
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
    count_chart2.focusCharts = function (chartlist) {
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
    count_chart1.focusCharts([stats_chart1]);
    count_chart2.focusCharts([stats_chart2]);

dc.renderAll();
};

// Load in data from source files
d3.queue()
  .defer(d3.csv, "data/GRC_services_ai_autoimport.csv")
  .defer(d3.csv, "data/GRC_dist_ai_autoimport.csv")
  .await(analyze);

// Format data for processing
function analyze(error, services, distributions) {
    if(error) { console.log(error); }

    var dateFormat = d3.time.format("%Y-%m-%d");
    var weekFormat = d3.time.format("%W");

    services.forEach(function(d) {
        d.reportDate           = dateFormat.parse(d.endDate);
        d.reportWeek           = weekFormat(dateFormat.parse(d.endDate));
        d.locationName         = d.locationName;
        d.latitude             = +d.latitude;
        d.longitude            = +d.longitude;
        // Totals data
        d.total_rfl            = +d.total_rfl;
        d.total_health         = +d.total_health;
        d.total_wash           = +d.total_wash;
        d.total_connectivity   = +d.total_connectivity;
        d.total_pss            = +d.total_pss;
        // Health data   
        d.health_eru           = +d.health_eru;
        d.first_aid            = +d.first_aid;
        d.rescue               = +d.rescue;
        // WASH data
        d.hygiene_promo        = +d.hygiene_promo;
        d.wash                 = +d.wash;
        // PSS data
        d.pss_counseling       = +d.pss_counseling;
        d.child_activities     = +d.child_activities;
        // RFL data
        d.total_rfl_vulnerable = +d.total_rfl_vulnerable;
        // Connectivity data
        d.info_services        = +d.info_services;
        d.wifi_mobile          = +d.wifi_mobile;
        d.phone_cards_calls    = +d.phone_cards_calls;
        d.hotline_calls        = +d.hotline_calls;
        // Other data
        d.other_services       = +d.other_services;
        // Beneficiaries data
        d.total_ppl_reached    = +d.total_ppl_reached;
    });

    distributions.forEach(function(d) {
        d.reportDate           = dateFormat.parse(d.endDate);
        d.reportWeek           = weekFormat(dateFormat.parse(d.endDate));
        d.locationName         = d.locationName;
        d.latitude             = +d.latitude;
        d.longitude            = +d.longitude;
        // Totals
        d.total_food           = +d.total_food;
        d.total_textiles       = +d.total_textiles;
        d.total_bags           = +d.total_bags;
        d.water_bottles        = +d.water_bottles;
        d.total_hygiene        = +d.total_hygiene;
        d.total_nfi_other      = +d.total_nfi_other;
        d.total_warmth         = +d.total_warmth;
        d.total_hygkits        = +d.total_hygkits;
        d.total_clothing       = +d.total_clothing;
        // Food data
        d.food_parcels         = +d.food_parcels;
        d.family_parcels       = +d.family_parcels;
        d.food_to_go           = +d.food_to_go;
        d.hot_meals            = +d.hot_meals;
        d["Tea.Packs"]         = +d["Tea.Packs"];
        // Hygiene data
        d.male_hygkit          = +d.male_hygkit;
        d.fem_hygkit           = +d.fem_hygkit;
        d.razors               = +d.razors;
        d.unisex_hygkit        = +d.unisex_hygkits;
        d.san_pads             = +d.san_pads;
        d.diapers              = +d.diapers;
        // Clothing and Warmth data
        d.jackets              = +d.jackets;
        d.socks                = +d.socks;
        d.med_thermal_blankets = +d.med_thermal_blankets;
        d.high_thermal_blankets= +d.high_thermal_blankets;
        d.sleeping_bags        = +d.sleeping_bags;
        d.camp_mats            = +d.camp_mats;
        d.alum_blankets        = +d.alum_blankets;
        // Bags data
        d.duffel_bags          = +d.duffel_bags;
        d.backpacks            = +d.backpacks;
        // Beneficiaries data
        d.Female               = +d.Female;
        d.Male                 = +d.Male;
        d["Under.5"]           = +d["Under.5"];
        d["Total.beneficiaries"]= +d["Total.beneficiaries"];
    });
    console.log(services);

    // Send formatted data to chart builder function
    generateCharts(services,distributions);
};
