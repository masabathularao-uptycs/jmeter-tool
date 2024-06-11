/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6971326164874552, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "HTTP GET Request 9wait for result"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "HTTP GET Request 9 for result"], "isController": false}, {"data": [0.5, 500, 1500, "NEW_DAILY_VLN - HTTP POST Request 82 for running query"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "HTTP GET Request 6 for result"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "HTTP POST Request 14 for running query"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "COMPLIANCE_SUNBURST - HTTP POST Request 92 for running query"], "isController": false}, {"data": [0.25, 500, 1500, "COMPLIANCE_STANDARDS - HTTP POST Request 96wait for result"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "HTTP POST Request 6 for running query"], "isController": false}, {"data": [1.0, 500, 1500, "COMPLIANCE_FAILED_RULES_BY_STANDARDS - HTTP POST Request 97 wait for result"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "TOP_NONCOMPLIANT_ASSETS - HTTP POST Request 99 for running query"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP POST Request 13 for running query"], "isController": false}, {"data": [1.0, 500, 1500, "COMPLIANCE_TREND - HTTP POST Request 95 wait for result"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP POST Request 5 for running query"], "isController": false}, {"data": [0.5, 500, 1500, "COMPLIANCE_SUNBURST - HTTP POST Request 91wait for result"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP GET Request 6wait for result"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP GET Request 14 wait for result"], "isController": false}, {"data": [0.25, 500, 1500, "HTTP GET Request 11 wait for result"], "isController": false}, {"data": [0.5, 500, 1500, "RESOLVED_VULNERABILITIES - HTTP POST Request 90 for running query"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "COMPLIANCE_FAILED_RULES_BY_STANDARDS - HTTP POST Request 97 for running query"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "HTTP POST Request 12 for running query"], "isController": false}, {"data": [0.5, 500, 1500, "OPEN_VULNERABILITIES - HTTP POST Request 89 for running query"], "isController": false}, {"data": [1.0, 500, 1500, "TOP_TO_FIX - HTTP POST Request 88 wait for result"], "isController": false}, {"data": [1.0, 500, 1500, "CLOSED_DAILY_VLN_URL -  HTTP POST Request 83wait for result"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP GET Request 1 for result"], "isController": false}, {"data": [0.25, 500, 1500, "HTTP GET Request 1wait for result"], "isController": false}, {"data": [0.75, 500, 1500, "VLN_BY_SEVERITY - HTTP POST Request 84 wait for result"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP GET Request 8wait for result"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP GET Request 10 wait for result"], "isController": false}, {"data": [0.7931034482758621, 500, 1500, "HTTP GET Request 2 wait for result"], "isController": false}, {"data": [0.75, 500, 1500, "COMPLIANCE_TOP_FAILED_RULES - HTTP POST Request 98 for running query"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "HTTP GET Request 8 for result"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP GET Request 13 wait for result"], "isController": false}, {"data": [0.5, 500, 1500, "COUNTS - HTTP POST Request 81wait for result"], "isController": false}, {"data": [0.375, 500, 1500, "NEW_DAILY_VLN - HTTP POST Request 82wait for result"], "isController": false}, {"data": [0.625, 500, 1500, "CLOSED_DAILY_VLN_URL - HTTP POST Request 83 for running query"], "isController": false}, {"data": [0.5, 500, 1500, "NET_NEW - HTTP POST Request 85 for running query"], "isController": false}, {"data": [1.0, 500, 1500, "COMPLIANCE_TOP_FAILED_RULES - HTTP POST Request 98 wait for result"], "isController": false}, {"data": [0.5, 500, 1500, "COMPLIANCE_TABLE_BY_SECTIONS - HTTP POST Request 94 wait for result"], "isController": false}, {"data": [1.0, 500, 1500, "NET_NEW - HTTP POST Request 85 wait for result"], "isController": false}, {"data": [1.0, 500, 1500, "AVG_CLOSE_TIME - HTTP POST Request 86wait for result"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP GET Request 5 wait for result"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "HTTP POST Request 11 for running query"], "isController": false}, {"data": [0.5, 500, 1500, "COMPLIANCE_TABLE - HTTP POST Request 93 for running query"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "HTTP POST Request 9 for running query"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP POST Request 10 for running query"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "HTTP POST Request 2 for running query"], "isController": false}, {"data": [0.875, 500, 1500, "COMPLIANCE_TABLE -  HTTP POST Request 93wait for result"], "isController": false}, {"data": [0.75, 500, 1500, "COMPLIANCE_STANDARDS - HTTP POST Request 96 for running query"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP GET Request 5 for result"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP POST Request 8 for running query"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP GET Request 10 for result"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "HTTP GET Request 2 for result"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "NONCOMPLIANT_ASSETS_OVERTIME - HTTP POST Request 100 for running query"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "HTTP GET Request 14 for result"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "OPEN_VULNERABILITIES - HTTP POST Request 89wait for result"], "isController": false}, {"data": [1.0, 500, 1500, "NONCOMPLIANT_ASSETS_OVERTIME - HTTP POST Request 100 wait for result"], "isController": false}, {"data": [0.125, 500, 1500, "HTTP POST Request 1 for running query"], "isController": false}, {"data": [0.0, 500, 1500, "TOP_NONCOMPLIANT_ASSETS - HTTP POST Request 99wait for result"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "HTTP GET Request 11 for result"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP GET Request 12 wait for result"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "TOP_TO_FIX - HTTP POST Request 88 for running query"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "AVG_CLOSE_TIME - HTTP POST Request 86 for running query"], "isController": false}, {"data": [1.0, 500, 1500, "COMPLIANCE_SUNBURST - HTTP POST Request 92wait for result"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP GET Request 13 for result"], "isController": false}, {"data": [0.75, 500, 1500, "VLN_BY_SEVERITY HTTP POST Request 84 for running query"], "isController": false}, {"data": [0.5, 500, 1500, "PUBLISHED_AGE - HTTP POST Request 87 wait for result"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "COMPLIANCE_SUNBURST - HTTP POST Request 91 for running query"], "isController": false}, {"data": [0.25, 500, 1500, "COUNTS - HTTP POST Request 81 for running query"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "COMPLIANCE_TABLE_BY_SECTIONS - HTTP POST Request 94 for running query"], "isController": false}, {"data": [1.0, 500, 1500, "COMPLIANCE_TREND - HTTP POST Request 95 for running query"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "PUBLISHED_AGE - HTTP POST Request 87 for running query"], "isController": false}, {"data": [0.5, 500, 1500, "RESOLVED_VULNERABILITIES - HTTP POST Request 90 wait for result"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "HTTP GET Request 12 for result"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 279, 0, 0.0, 987.2759856630828, 260, 5847, 411.0, 2696.0, 3790.0, 5393.199999999996, 2.721579491581638, 3.9982724920498667, 1.5735941401906082], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["HTTP GET Request 9wait for result", 3, 0, 0.0, 1595.3333333333335, 263, 3521, 1002.0, 3521.0, 3521.0, 3521.0, 0.6213753106876554, 0.9613922043289146, 0.290662865057995], "isController": false}, {"data": ["HTTP GET Request 9 for result", 3, 0, 0.0, 692.6666666666666, 285, 1507, 286.0, 1507.0, 1507.0, 1507.0, 0.0620565542064001, 0.08247946315909231, 0.030240449754876608], "isController": false}, {"data": ["NEW_DAILY_VLN - HTTP POST Request 82 for running query", 4, 0, 0.0, 1636.0, 352, 4666, 763.0, 4666.0, 4666.0, 4666.0, 0.04540501271340356, 0.06345173163367235, 0.025451637985833636], "isController": false}, {"data": ["HTTP GET Request 6 for result", 3, 0, 0.0, 504.6666666666667, 283, 946, 285.0, 946.0, 946.0, 946.0, 0.054842601733026214, 0.07292709247376696, 0.0267250568991993], "isController": false}, {"data": ["HTTP POST Request 14 for running query", 3, 0, 0.0, 533.6666666666666, 327, 927, 347.0, 927.0, 927.0, 927.0, 0.07626795474768018, 0.11358264745137918, 0.048635717236557775], "isController": false}, {"data": ["COMPLIANCE_SUNBURST - HTTP POST Request 92 for running query", 6, 0, 0.0, 1072.6666666666667, 308, 3406, 554.0, 3406.0, 3406.0, 3406.0, 0.0720357297219421, 0.10090160969841042, 0.041856698422417515], "isController": false}, {"data": ["COMPLIANCE_STANDARDS - HTTP POST Request 96wait for result", 2, 0, 0.0, 2060.0, 752, 3368, 2060.0, 3368.0, 3368.0, 3368.0, 0.4830917874396135, 0.6406627415458938, 0.2924969806763285], "isController": false}, {"data": ["HTTP POST Request 6 for running query", 3, 0, 0.0, 1108.3333333333333, 357, 2578, 390.0, 2578.0, 2578.0, 2578.0, 0.051212017753499484, 0.0814857886650734, 0.040509506230795495], "isController": false}, {"data": ["COMPLIANCE_FAILED_RULES_BY_STANDARDS - HTTP POST Request 97 wait for result", 2, 0, 0.0, 279.0, 276, 282, 279.0, 282.0, 282.0, 282.0, 3.4965034965034967, 4.635257320804196, 2.175071022727273], "isController": false}, {"data": ["TOP_NONCOMPLIANT_ASSETS - HTTP POST Request 99 for running query", 6, 0, 0.0, 542.0, 353, 1324, 392.0, 1324.0, 1324.0, 1324.0, 0.08862367433753804, 0.12280956434078757, 0.05088937549850817], "isController": false}, {"data": ["HTTP POST Request 13 for running query", 3, 0, 0.0, 1253.6666666666667, 333, 2597, 831.0, 2597.0, 2597.0, 2597.0, 0.06762544520084757, 0.10742583742842973, 0.05316258143230693], "isController": false}, {"data": ["COMPLIANCE_TREND - HTTP POST Request 95 wait for result", 4, 0, 0.0, 300.5, 294, 308, 300.0, 308.0, 308.0, 308.0, 2.9476787030213707, 3.9782148120854828, 1.78760593220339], "isController": false}, {"data": ["HTTP POST Request 5 for running query", 3, 0, 0.0, 1970.3333333333333, 357, 4481, 1073.0, 4481.0, 4481.0, 4481.0, 0.05044560282495376, 0.08024988965024382, 0.03990326004708256], "isController": false}, {"data": ["COMPLIANCE_SUNBURST - HTTP POST Request 91wait for result", 4, 0, 0.0, 1081.5, 303, 2250, 886.5, 2250.0, 2250.0, 2250.0, 0.8797009016934242, 1.1876821255773038, 0.5412222344402904], "isController": false}, {"data": ["HTTP GET Request 6wait for result", 1, 0, 0.0, 1516.0, 1516, 1516, 1516.0, 1516.0, 1516.0, 1516.0, 0.6596306068601583, 1.082850634894459, 0.3085576764511873], "isController": false}, {"data": ["HTTP GET Request 14 wait for result", 3, 0, 0.0, 277.3333333333333, 262, 306, 264.0, 306.0, 306.0, 306.0, 3.34075723830735, 5.117709493318485, 1.5627174972160356], "isController": false}, {"data": ["HTTP GET Request 11 wait for result", 2, 0, 0.0, 1576.5, 949, 2204, 1576.5, 2204.0, 2204.0, 2204.0, 0.6273525721455457, 0.9995368373588456, 0.2934588691969887], "isController": false}, {"data": ["RESOLVED_VULNERABILITIES - HTTP POST Request 90 for running query", 3, 0, 0.0, 1582.0, 469, 3755, 522.0, 3755.0, 3755.0, 3755.0, 0.07524831945419887, 0.10515658704976422, 0.04431126624109561], "isController": false}, {"data": ["COMPLIANCE_FAILED_RULES_BY_STANDARDS - HTTP POST Request 97 for running query", 6, 0, 0.0, 1242.3333333333333, 344, 3817, 753.5, 3817.0, 3817.0, 3817.0, 0.08663884597057167, 0.12005910393773554, 0.05093416530691811], "isController": false}, {"data": ["HTTP POST Request 12 for running query", 3, 0, 0.0, 607.0, 379, 891, 551.0, 891.0, 891.0, 891.0, 0.07046719751955464, 0.10843048264158034, 0.04885909203015996], "isController": false}, {"data": ["OPEN_VULNERABILITIES - HTTP POST Request 89 for running query", 3, 0, 0.0, 1444.0, 413, 3364, 555.0, 3364.0, 3364.0, 3364.0, 0.06608366191598564, 0.08221736843844307, 0.037301129479921584], "isController": false}, {"data": ["TOP_TO_FIX - HTTP POST Request 88 wait for result", 3, 0, 0.0, 293.0, 287, 301, 291.0, 301.0, 301.0, 301.0, 1.948051948051948, 2.6392552759740258, 1.1623630275974026], "isController": false}, {"data": ["CLOSED_DAILY_VLN_URL -  HTTP POST Request 83wait for result", 3, 0, 0.0, 319.3333333333333, 296, 361, 301.0, 361.0, 361.0, 361.0, 1.8518518518518519, 2.618634259259259, 1.1121961805555556], "isController": false}, {"data": ["HTTP GET Request 1 for result", 3, 0, 0.0, 838.6666666666666, 544, 1215, 757.0, 1215.0, 1215.0, 1215.0, 0.03928398391975591, 0.05221240440897246, 0.019872171553157778], "isController": false}, {"data": ["HTTP GET Request 1wait for result", 2, 0, 0.0, 1763.0, 1375, 2151, 1763.0, 2151.0, 2151.0, 2151.0, 0.5605381165919282, 0.9073163361827354, 0.2622048416479821], "isController": false}, {"data": ["VLN_BY_SEVERITY - HTTP POST Request 84 wait for result", 2, 0, 0.0, 441.5, 287, 596, 441.5, 596.0, 596.0, 596.0, 1.6528925619834711, 2.3582773760330578, 0.9894757231404959], "isController": false}, {"data": ["HTTP GET Request 8wait for result", 3, 0, 0.0, 268.6666666666667, 261, 276, 269.0, 276.0, 276.0, 276.0, 3.4482758620689653, 5.547323994252873, 1.6130118534482758], "isController": false}, {"data": ["HTTP GET Request 10 wait for result", 3, 0, 0.0, 280.0, 276, 287, 277.0, 287.0, 287.0, 287.0, 3.246753246753247, 5.119554924242424, 1.518744926948052], "isController": false}, {"data": ["HTTP GET Request 2 wait for result", 29, 0, 0.0, 644.7241379310345, 260, 3394, 300.0, 1633.0, 2763.5, 3394.0, 1.4425707605829976, 2.4701401065761326, 0.6747962835148982], "isController": false}, {"data": ["COMPLIANCE_TOP_FAILED_RULES - HTTP POST Request 98 for running query", 6, 0, 0.0, 1441.0, 362, 5847, 421.0, 5847.0, 5847.0, 5847.0, 0.0876590646777799, 0.12147286404079068, 0.05067789676684149], "isController": false}, {"data": ["HTTP GET Request 8 for result", 3, 0, 0.0, 476.0, 265, 859, 304.0, 859.0, 859.0, 859.0, 0.05639521768554027, 0.07484482503383713, 0.027481653930746672], "isController": false}, {"data": ["HTTP GET Request 13 wait for result", 3, 0, 0.0, 1099.3333333333335, 270, 2228, 800.0, 2228.0, 2228.0, 2228.0, 0.8865248226950354, 1.426173721926714, 0.4146927637411348], "isController": false}, {"data": ["COUNTS - HTTP POST Request 81wait for result", 5, 0, 0.0, 919.6, 301, 1945, 824.0, 1945.0, 1945.0, 1945.0, 0.8289124668435014, 1.16841040492374, 0.4735486260775862], "isController": false}, {"data": ["NEW_DAILY_VLN - HTTP POST Request 82wait for result", 4, 0, 0.0, 1211.25, 295, 2081, 1234.5, 2081.0, 2081.0, 2081.0, 0.662361318099023, 0.9332244059446929, 0.39392386984600103], "isController": false}, {"data": ["CLOSED_DAILY_VLN_URL - HTTP POST Request 83 for running query", 4, 0, 0.0, 1187.75, 355, 3456, 470.0, 3456.0, 3456.0, 3456.0, 0.04914789831299839, 0.0686822680526374, 0.027837676778846743], "isController": false}, {"data": ["NET_NEW - HTTP POST Request 85 for running query", 4, 0, 0.0, 2407.75, 411, 5257, 1981.5, 5257.0, 5257.0, 5257.0, 0.054261567888004125, 0.07582842153099013, 0.029197386627236595], "isController": false}, {"data": ["COMPLIANCE_TOP_FAILED_RULES - HTTP POST Request 98 wait for result", 2, 0, 0.0, 284.0, 283, 285, 284.0, 285.0, 285.0, 285.0, 3.0349013657056148, 4.021837063732929, 1.8582843323216995], "isController": false}, {"data": ["COMPLIANCE_TABLE_BY_SECTIONS - HTTP POST Request 94 wait for result", 4, 0, 0.0, 1032.75, 299, 2130, 851.0, 2130.0, 2130.0, 2130.0, 0.9383063570255687, 1.2668052134646963, 0.580027269528501], "isController": false}, {"data": ["NET_NEW - HTTP POST Request 85 wait for result", 2, 0, 0.0, 292.5, 292, 293, 292.5, 293.0, 293.0, 293.0, 2.2271714922048997, 3.093897898106904, 1.2745336859688197], "isController": false}, {"data": ["AVG_CLOSE_TIME - HTTP POST Request 86wait for result", 2, 0, 0.0, 395.0, 293, 497, 395.0, 497.0, 497.0, 497.0, 1.7108639863130881, 2.3783348481608213, 1.000788601368691], "isController": false}, {"data": ["HTTP GET Request 5 wait for result", 1, 0, 0.0, 267.0, 267, 267, 267.0, 267.0, 267.0, 267.0, 3.745318352059925, 6.133690308988764, 1.7519604400749063], "isController": false}, {"data": ["HTTP POST Request 11 for running query", 3, 0, 0.0, 432.6666666666667, 350, 566, 382.0, 566.0, 566.0, 566.0, 0.06448977837012833, 0.10116414126485952, 0.04887116017111288], "isController": false}, {"data": ["COMPLIANCE_TABLE - HTTP POST Request 93 for running query", 6, 0, 0.0, 1869.1666666666667, 349, 5686, 1051.5, 5686.0, 5686.0, 5686.0, 0.07456565505927969, 0.10332877395421669, 0.04267136119603311], "isController": false}, {"data": ["HTTP POST Request 9 for running query", 3, 0, 0.0, 1761.0, 301, 4672, 310.0, 4672.0, 4672.0, 4672.0, 0.05634755169887868, 0.08633721544486392, 0.0387389417929791], "isController": false}, {"data": ["HTTP POST Request 10 for running query", 3, 0, 0.0, 380.6666666666667, 338, 453, 351.0, 453.0, 453.0, 453.0, 0.06357817996863477, 0.09909255393548934, 0.047062754312719876], "isController": false}, {"data": ["HTTP POST Request 2 for running query", 3, 0, 0.0, 572.6666666666666, 335, 1004, 379.0, 1004.0, 1004.0, 1004.0, 0.03970827652843774, 0.06784789827401358, 0.05851541922012945], "isController": false}, {"data": ["COMPLIANCE_TABLE -  HTTP POST Request 93wait for result", 4, 0, 0.0, 523.75, 302, 1164, 314.5, 1164.0, 1164.0, 1164.0, 1.7482517482517483, 2.3607374071241263, 1.060219077797203], "isController": false}, {"data": ["COMPLIANCE_STANDARDS - HTTP POST Request 96 for running query", 6, 0, 0.0, 908.6666666666667, 359, 3369, 417.5, 3369.0, 3369.0, 3369.0, 0.08565432768490629, 0.11869481541492383, 0.0489333805621779], "isController": false}, {"data": ["HTTP GET Request 5 for result", 3, 0, 0.0, 302.0, 272, 361, 273.0, 361.0, 361.0, 361.0, 0.0513153843522288, 0.06810313216277239, 0.025006227335705244], "isController": false}, {"data": ["HTTP POST Request 8 for running query", 3, 0, 0.0, 356.6666666666667, 333, 401, 336.0, 401.0, 401.0, 401.0, 0.05541291859842258, 0.08822414871903803, 0.04383248443820536], "isController": false}, {"data": ["HTTP GET Request 10 for result", 3, 0, 0.0, 345.6666666666667, 272, 428, 337.0, 428.0, 428.0, 428.0, 0.06490696668109043, 0.08635246511250541, 0.031629469115101685], "isController": false}, {"data": ["HTTP GET Request 2 for result", 3, 0, 0.0, 472.0, 277, 852, 287.0, 852.0, 852.0, 852.0, 0.05426426698019354, 0.07740430270416931, 0.026443231663199784], "isController": false}, {"data": ["NONCOMPLIANT_ASSETS_OVERTIME - HTTP POST Request 100 for running query", 6, 0, 0.0, 1637.3333333333335, 403, 4771, 431.0, 4771.0, 4771.0, 4771.0, 0.09461334678945377, 0.13110970614671377, 0.054790736959127034], "isController": false}, {"data": ["HTTP GET Request 14 for result", 3, 0, 0.0, 626.0, 273, 1322, 283.0, 1322.0, 1322.0, 1322.0, 0.07829218643979331, 0.23350032947961794, 0.038152149446735215], "isController": false}, {"data": ["OPEN_VULNERABILITIES - HTTP POST Request 89wait for result", 3, 0, 0.0, 541.3333333333334, 330, 915, 379.0, 915.0, 915.0, 915.0, 1.2975778546712802, 1.7731874459342563, 0.7767726805795848], "isController": false}, {"data": ["NONCOMPLIANT_ASSETS_OVERTIME - HTTP POST Request 100 wait for result", 2, 0, 0.0, 386.5, 286, 487, 386.5, 487.0, 487.0, 487.0, 2.3640661938534278, 3.1340037677304964, 1.4498374704491725], "isController": false}, {"data": ["HTTP POST Request 1 for running query", 4, 0, 0.0, 2098.25, 1134, 3264, 1997.5, 3264.0, 3264.0, 3264.0, 0.04003483030236305, 0.06377618840891576, 0.031785465855294105], "isController": false}, {"data": ["TOP_NONCOMPLIANT_ASSETS - HTTP POST Request 99wait for result", 2, 0, 0.0, 2104.0, 1535, 2673, 2104.0, 2673.0, 2673.0, 2673.0, 0.46860356138706655, 0.6216776739690721, 0.28509767455482665], "isController": false}, {"data": ["HTTP GET Request 11 for result", 3, 0, 0.0, 700.6666666666666, 284, 1522, 296.0, 1522.0, 1522.0, 1522.0, 0.06943480072212192, 0.09230850460584178, 0.0338359038675184], "isController": false}, {"data": ["HTTP GET Request 12 wait for result", 3, 0, 0.0, 284.6666666666667, 272, 307, 275.0, 307.0, 307.0, 307.0, 3.260869565217391, 5.077063519021739, 1.5253481657608694], "isController": false}, {"data": ["TOP_TO_FIX - HTTP POST Request 88 for running query", 3, 0, 0.0, 468.0, 402, 509, 493.0, 509.0, 509.0, 509.0, 0.06333389630130046, 0.08850664610074312, 0.0356253166694815], "isController": false}, {"data": ["AVG_CLOSE_TIME - HTTP POST Request 86 for running query", 3, 0, 0.0, 1573.6666666666665, 376, 3917, 428.0, 3917.0, 3917.0, 3917.0, 0.05156854318865492, 0.07206502470992694, 0.028402986678126345], "isController": false}, {"data": ["COMPLIANCE_SUNBURST - HTTP POST Request 92wait for result", 6, 0, 0.0, 292.6666666666667, 283, 306, 290.5, 306.0, 306.0, 306.0, 3.0441400304414, 4.134164129883308, 1.8728595890410957], "isController": false}, {"data": ["HTTP GET Request 13 for result", 3, 0, 0.0, 952.3333333333333, 302, 1859, 696.0, 1859.0, 1859.0, 1859.0, 0.07341065922771986, 0.09759411858268488, 0.03577335835413302], "isController": false}, {"data": ["VLN_BY_SEVERITY HTTP POST Request 84 for running query", 4, 0, 0.0, 1464.0, 383, 4652, 410.5, 4652.0, 4652.0, 4652.0, 0.052345058626465664, 0.07315017470163317, 0.029546331920016752], "isController": false}, {"data": ["PUBLISHED_AGE - HTTP POST Request 87 wait for result", 3, 0, 0.0, 1619.6666666666667, 284, 3790, 785.0, 3790.0, 3790.0, 3790.0, 0.5405405405405406, 0.7625985360360361, 0.3156672297297297], "isController": false}, {"data": ["COMPLIANCE_SUNBURST - HTTP POST Request 91 for running query", 7, 0, 0.0, 2548.285714285714, 1243, 5320, 2046.0, 5320.0, 5320.0, 5320.0, 0.0683133435478047, 0.09466468212337391, 0.039693788487249804], "isController": false}, {"data": ["COUNTS - HTTP POST Request 81 for running query", 4, 0, 0.0, 2132.5, 1309, 3636, 1792.5, 3636.0, 3636.0, 3636.0, 0.04162894043939347, 0.05817481813356645, 0.02235929418131485], "isController": false}, {"data": ["COMPLIANCE_TABLE_BY_SECTIONS - HTTP POST Request 94 for running query", 6, 0, 0.0, 484.6666666666667, 368, 792, 425.5, 792.0, 792.0, 792.0, 0.0791995564824837, 0.10975016664906677, 0.046251303492700443], "isController": false}, {"data": ["COMPLIANCE_TREND - HTTP POST Request 95 for running query", 6, 0, 0.0, 396.0, 351, 477, 378.5, 477.0, 477.0, 477.0, 0.08411843876177658, 0.11656646933882907, 0.0481380909320323], "isController": false}, {"data": ["PUBLISHED_AGE - HTTP POST Request 87 for running query", 3, 0, 0.0, 2036.6666666666665, 399, 5285, 426.0, 5285.0, 5285.0, 5285.0, 0.05640476056179142, 0.07882344957414406, 0.031011601754188056], "isController": false}, {"data": ["RESOLVED_VULNERABILITIES - HTTP POST Request 90 wait for result", 4, 0, 0.0, 865.75, 279, 1927, 628.5, 1927.0, 1927.0, 1927.0, 0.8830022075055187, 1.2044270833333333, 0.550151766004415], "isController": false}, {"data": ["HTTP GET Request 12 for result", 3, 0, 0.0, 1524.3333333333335, 517, 3029, 1027.0, 3029.0, 3029.0, 3029.0, 0.0681044267877412, 0.0950845984676504, 0.033187606413166856], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 279, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
