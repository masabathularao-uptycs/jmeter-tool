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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6917562724014337, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "HTTP GET Request 9wait for result"], "isController": false}, {"data": [0.875, 500, 1500, "HTTP GET Request 9 for result"], "isController": false}, {"data": [0.625, 500, 1500, "NEW_DAILY_VLN - HTTP POST Request 82 for running query"], "isController": false}, {"data": [0.625, 500, 1500, "HTTP GET Request 6 for result"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "HTTP POST Request 14 for running query"], "isController": false}, {"data": [0.75, 500, 1500, "COMPLIANCE_SUNBURST - HTTP POST Request 92 for running query"], "isController": false}, {"data": [1.0, 500, 1500, "COMPLIANCE_STANDARDS - HTTP POST Request 96wait for result"], "isController": false}, {"data": [0.875, 500, 1500, "HTTP POST Request 6 for running query"], "isController": false}, {"data": [1.0, 500, 1500, "COMPLIANCE_FAILED_RULES_BY_STANDARDS - HTTP POST Request 97 wait for result"], "isController": false}, {"data": [0.8, 500, 1500, "TOP_NONCOMPLIANT_ASSETS - HTTP POST Request 99 for running query"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "HTTP POST Request 13 for running query"], "isController": false}, {"data": [0.5, 500, 1500, "COMPLIANCE_TREND - HTTP POST Request 95 wait for result"], "isController": false}, {"data": [0.375, 500, 1500, "HTTP POST Request 5 for running query"], "isController": false}, {"data": [1.0, 500, 1500, "COMPLIANCE_SUNBURST - HTTP POST Request 91wait for result"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP GET Request 6wait for result"], "isController": false}, {"data": [0.25, 500, 1500, "HTTP GET Request 14 wait for result"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP GET Request 11 wait for result"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "RESOLVED_VULNERABILITIES - HTTP POST Request 90 for running query"], "isController": false}, {"data": [0.25, 500, 1500, "COMPLIANCE_FAILED_RULES_BY_STANDARDS - HTTP POST Request 97 for running query"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP POST Request 12 for running query"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "OPEN_VULNERABILITIES - HTTP POST Request 89 for running query"], "isController": false}, {"data": [0.75, 500, 1500, "TOP_TO_FIX - HTTP POST Request 88 wait for result"], "isController": false}, {"data": [1.0, 500, 1500, "CLOSED_DAILY_VLN_URL -  HTTP POST Request 83wait for result"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP GET Request 1 for result"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP GET Request 1wait for result"], "isController": false}, {"data": [0.75, 500, 1500, "VLN_BY_SEVERITY - HTTP POST Request 84 wait for result"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP GET Request 8wait for result"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP GET Request 10 wait for result"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "HTTP GET Request 2 wait for result"], "isController": false}, {"data": [0.7, 500, 1500, "COMPLIANCE_TOP_FAILED_RULES - HTTP POST Request 98 for running query"], "isController": false}, {"data": [0.75, 500, 1500, "HTTP GET Request 8 for result"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "HTTP GET Request 13 wait for result"], "isController": false}, {"data": [0.5, 500, 1500, "COUNTS - HTTP POST Request 81wait for result"], "isController": false}, {"data": [0.5, 500, 1500, "NEW_DAILY_VLN - HTTP POST Request 82wait for result"], "isController": false}, {"data": [0.375, 500, 1500, "CLOSED_DAILY_VLN_URL - HTTP POST Request 83 for running query"], "isController": false}, {"data": [0.875, 500, 1500, "NET_NEW - HTTP POST Request 85 for running query"], "isController": false}, {"data": [0.25, 500, 1500, "COMPLIANCE_TOP_FAILED_RULES - HTTP POST Request 98 wait for result"], "isController": false}, {"data": [1.0, 500, 1500, "COMPLIANCE_TABLE_BY_SECTIONS - HTTP POST Request 94 wait for result"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "NET_NEW - HTTP POST Request 85 wait for result"], "isController": false}, {"data": [1.0, 500, 1500, "AVG_CLOSE_TIME - HTTP POST Request 86wait for result"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP GET Request 5 wait for result"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "HTTP POST Request 11 for running query"], "isController": false}, {"data": [0.75, 500, 1500, "COMPLIANCE_TABLE - HTTP POST Request 93 for running query"], "isController": false}, {"data": [0.75, 500, 1500, "HTTP POST Request 9 for running query"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "HTTP POST Request 10 for running query"], "isController": false}, {"data": [0.75, 500, 1500, "HTTP POST Request 2 for running query"], "isController": false}, {"data": [0.5, 500, 1500, "COMPLIANCE_TABLE -  HTTP POST Request 93wait for result"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "COMPLIANCE_STANDARDS - HTTP POST Request 96 for running query"], "isController": false}, {"data": [0.875, 500, 1500, "HTTP GET Request 5 for result"], "isController": false}, {"data": [0.75, 500, 1500, "HTTP POST Request 8 for running query"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP GET Request 10 for result"], "isController": false}, {"data": [0.75, 500, 1500, "HTTP GET Request 2 for result"], "isController": false}, {"data": [0.7, 500, 1500, "NONCOMPLIANT_ASSETS_OVERTIME - HTTP POST Request 100 for running query"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "HTTP GET Request 14 for result"], "isController": false}, {"data": [0.5, 500, 1500, "OPEN_VULNERABILITIES - HTTP POST Request 89wait for result"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "NONCOMPLIANT_ASSETS_OVERTIME - HTTP POST Request 100 wait for result"], "isController": false}, {"data": [0.375, 500, 1500, "HTTP POST Request 1 for running query"], "isController": false}, {"data": [1.0, 500, 1500, "TOP_NONCOMPLIANT_ASSETS - HTTP POST Request 99wait for result"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP GET Request 11 for result"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP GET Request 12 wait for result"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "TOP_TO_FIX - HTTP POST Request 88 for running query"], "isController": false}, {"data": [0.5, 500, 1500, "AVG_CLOSE_TIME - HTTP POST Request 86 for running query"], "isController": false}, {"data": [1.0, 500, 1500, "COMPLIANCE_SUNBURST - HTTP POST Request 92wait for result"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP GET Request 13 for result"], "isController": false}, {"data": [0.5, 500, 1500, "VLN_BY_SEVERITY HTTP POST Request 84 for running query"], "isController": false}, {"data": [1.0, 500, 1500, "PUBLISHED_AGE - HTTP POST Request 87 wait for result"], "isController": false}, {"data": [0.375, 500, 1500, "COUNTS - HTTP POST Request 81 for running query"], "isController": false}, {"data": [0.25, 500, 1500, "COMPLIANCE_SUNBURST - HTTP POST Request 91 for running query"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "COMPLIANCE_TABLE_BY_SECTIONS - HTTP POST Request 94 for running query"], "isController": false}, {"data": [0.75, 500, 1500, "COMPLIANCE_TREND - HTTP POST Request 95 for running query"], "isController": false}, {"data": [0.75, 500, 1500, "PUBLISHED_AGE - HTTP POST Request 87 for running query"], "isController": false}, {"data": [0.625, 500, 1500, "RESOLVED_VULNERABILITIES - HTTP POST Request 90 wait for result"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "HTTP GET Request 12 for result"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 279, 0, 0.0, 984.8028673835122, 261, 6904, 439.0, 2882.0, 3609.0, 5436.5999999999985, 2.720093594618309, 3.960186107658185, 1.5960136979623674], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["HTTP GET Request 9wait for result", 3, 0, 0.0, 287.0, 277, 299, 285.0, 299.0, 299.0, 299.0, 3.260869565217391, 5.043096127717391, 1.5253481657608694], "isController": false}, {"data": ["HTTP GET Request 9 for result", 4, 0, 0.0, 422.25, 271, 831, 293.5, 831.0, 831.0, 831.0, 0.059312860510980295, 0.07770332263230476, 0.028903434956034344], "isController": false}, {"data": ["NEW_DAILY_VLN - HTTP POST Request 82 for running query", 4, 0, 0.0, 925.5000000000001, 374, 2349, 489.5, 2349.0, 2349.0, 2349.0, 0.04971661529283086, 0.06947702781644625, 0.02786849333797355], "isController": false}, {"data": ["HTTP GET Request 6 for result", 4, 0, 0.0, 797.0, 271, 1202, 857.5, 1202.0, 1202.0, 1202.0, 0.05509414211533959, 0.0722572586532237, 0.02684763370659615], "isController": false}, {"data": ["HTTP POST Request 14 for running query", 3, 0, 0.0, 549.3333333333334, 306, 993, 349.0, 993.0, 993.0, 993.0, 0.0777343041484207, 0.11569050734589173, 0.04957080137589718], "isController": false}, {"data": ["COMPLIANCE_SUNBURST - HTTP POST Request 92 for running query", 6, 0, 0.0, 1074.1666666666667, 304, 4463, 386.5, 4463.0, 4463.0, 4463.0, 0.0652507259143258, 0.09164201072830686, 0.03791424015529673], "isController": false}, {"data": ["COMPLIANCE_STANDARDS - HTTP POST Request 96wait for result", 2, 0, 0.0, 290.0, 282, 298, 290.0, 298.0, 298.0, 298.0, 3.3670033670033668, 4.463581123737374, 2.03861531986532], "isController": false}, {"data": ["HTTP POST Request 6 for running query", 4, 0, 0.0, 447.5, 328, 624, 419.0, 624.0, 624.0, 624.0, 0.055026687943652675, 0.08757787566032027, 0.04352696995542839], "isController": false}, {"data": ["COMPLIANCE_FAILED_RULES_BY_STANDARDS - HTTP POST Request 97 wait for result", 2, 0, 0.0, 294.0, 294, 294, 294.0, 294.0, 294.0, 294.0, 3.246753246753247, 4.305752840909091, 2.0197088068181817], "isController": false}, {"data": ["TOP_NONCOMPLIANT_ASSETS - HTTP POST Request 99 for running query", 5, 0, 0.0, 848.4, 354, 2650, 391.0, 2650.0, 2650.0, 2650.0, 0.0879445597495339, 0.12186848660604355, 0.05049941516867767], "isController": false}, {"data": ["HTTP POST Request 13 for running query", 3, 0, 0.0, 2051.3333333333335, 379, 3094, 2681.0, 3094.0, 3094.0, 3094.0, 0.06781653367090897, 0.10768523803603318, 0.053312802348712614], "isController": false}, {"data": ["COMPLIANCE_TREND - HTTP POST Request 95 wait for result", 3, 0, 0.0, 1924.0, 287, 4339, 1146.0, 4339.0, 4339.0, 4339.0, 0.513347022587269, 0.6889745358487337, 0.31131689553388087], "isController": false}, {"data": ["HTTP POST Request 5 for running query", 4, 0, 0.0, 2119.5, 381, 4938, 1579.5, 4938.0, 4938.0, 4938.0, 0.05110253724097401, 0.08129495426322916, 0.04042290543475484], "isController": false}, {"data": ["COMPLIANCE_SUNBURST - HTTP POST Request 91wait for result", 3, 0, 0.0, 306.6666666666667, 271, 349, 300.0, 349.0, 349.0, 349.0, 2.798507462686567, 3.7568505130597014, 1.7217379897388059], "isController": false}, {"data": ["HTTP GET Request 6wait for result", 2, 0, 0.0, 306.0, 286, 326, 306.0, 326.0, 326.0, 326.0, 3.189792663476874, 5.163165370813397, 1.492100279106858], "isController": false}, {"data": ["HTTP GET Request 14 wait for result", 2, 0, 0.0, 1670.5, 1059, 2282, 1670.5, 2282.0, 2282.0, 2282.0, 0.5924170616113744, 0.9172629406101896, 0.2771169653436019], "isController": false}, {"data": ["HTTP GET Request 11 wait for result", 4, 0, 0.0, 852.0, 746, 963, 849.5, 963.0, 963.0, 963.0, 1.1484352569623888, 1.8162997057134653, 0.5372075078954924], "isController": false}, {"data": ["RESOLVED_VULNERABILITIES - HTTP POST Request 90 for running query", 3, 0, 0.0, 814.0, 467, 1311, 664.0, 1311.0, 1311.0, 1311.0, 0.07792005402457079, 0.10889023174722735, 0.04588456306329706], "isController": false}, {"data": ["COMPLIANCE_FAILED_RULES_BY_STANDARDS - HTTP POST Request 97 for running query", 6, 0, 0.0, 1775.5, 340, 3609, 1993.0, 3609.0, 3609.0, 3609.0, 0.07907013520993121, 0.10957082213173083, 0.04648459120740096], "isController": false}, {"data": ["HTTP POST Request 12 for running query", 3, 0, 0.0, 415.6666666666667, 323, 475, 449.0, 475.0, 475.0, 475.0, 0.07111701118907643, 0.10947667510193439, 0.04930964642992604], "isController": false}, {"data": ["OPEN_VULNERABILITIES - HTTP POST Request 89 for running query", 3, 0, 0.0, 1421.3333333333335, 415, 3409, 440.0, 3409.0, 3409.0, 3409.0, 0.06492663290481755, 0.08075672666969658, 0.03664804083885209], "isController": false}, {"data": ["TOP_TO_FIX - HTTP POST Request 88 wait for result", 4, 0, 0.0, 489.0, 282, 685, 494.5, 685.0, 685.0, 685.0, 1.3477088948787064, 1.8379643278301887, 0.8041505222371967], "isController": false}, {"data": ["CLOSED_DAILY_VLN_URL -  HTTP POST Request 83wait for result", 2, 0, 0.0, 286.0, 281, 291, 286.0, 291.0, 291.0, 291.0, 2.1739130434782608, 3.0963400135869565, 1.3056216032608694], "isController": false}, {"data": ["HTTP GET Request 1 for result", 4, 0, 0.0, 287.75, 268, 321, 281.0, 321.0, 321.0, 321.0, 0.04688232536333802, 0.061510160278949844, 0.02371586380684482], "isController": false}, {"data": ["HTTP GET Request 1wait for result", 2, 0, 0.0, 305.0, 287, 323, 305.0, 323.0, 323.0, 323.0, 2.7472527472527473, 4.449529962225275, 1.2850918612637363], "isController": false}, {"data": ["VLN_BY_SEVERITY - HTTP POST Request 84 wait for result", 2, 0, 0.0, 649.0, 311, 987, 649.0, 987.0, 987.0, 987.0, 1.2091898428053203, 1.725221055018138, 0.7238607164449818], "isController": false}, {"data": ["HTTP GET Request 8wait for result", 3, 0, 0.0, 1063.3333333333333, 288, 1632, 1270.0, 1632.0, 1632.0, 1632.0, 0.9247842170160296, 1.4883245992601726, 0.4325894921393341], "isController": false}, {"data": ["HTTP GET Request 10 wait for result", 3, 0, 0.0, 282.6666666666667, 267, 312, 269.0, 312.0, 312.0, 312.0, 3.401360544217687, 5.362236040249433, 1.5910661139455782], "isController": false}, {"data": ["HTTP GET Request 2 wait for result", 14, 0, 0.0, 781.9999999999999, 261, 3420, 276.0, 3322.5, 3420.0, 3420.0, 1.2029558343357964, 2.0641399671335283, 0.5627107857879361], "isController": false}, {"data": ["COMPLIANCE_TOP_FAILED_RULES - HTTP POST Request 98 for running query", 5, 0, 0.0, 685.6, 372, 1666, 405.0, 1666.0, 1666.0, 1666.0, 0.0801012479774435, 0.11099967859374249, 0.04630853398695952], "isController": false}, {"data": ["HTTP GET Request 8 for result", 4, 0, 0.0, 638.5, 282, 1666, 303.0, 1666.0, 1666.0, 1666.0, 0.05770756690471038, 0.07576935908533507, 0.028121167856885235], "isController": false}, {"data": ["HTTP GET Request 13 wait for result", 3, 0, 0.0, 2130.3333333333335, 934, 3303, 2154.0, 3303.0, 3303.0, 3303.0, 0.4623208506703652, 0.7419406880875328, 0.21626141354600092], "isController": false}, {"data": ["COUNTS - HTTP POST Request 81wait for result", 3, 0, 0.0, 1611.0, 315, 3342, 1176.0, 3342.0, 3342.0, 3342.0, 0.5434782608695652, 0.7724043251811595, 0.3104831861413044], "isController": false}, {"data": ["NEW_DAILY_VLN - HTTP POST Request 82wait for result", 3, 0, 0.0, 1639.3333333333335, 293, 3497, 1128.0, 3497.0, 3497.0, 3497.0, 0.5360014293371449, 0.7582884804359478, 0.31877428756476683], "isController": false}, {"data": ["CLOSED_DAILY_VLN_URL - HTTP POST Request 83 for running query", 4, 0, 0.0, 2826.75, 356, 5413, 2769.0, 5413.0, 5413.0, 5413.0, 0.0502746251398263, 0.07025682478036273, 0.02847586189560474], "isController": false}, {"data": ["NET_NEW - HTTP POST Request 85 for running query", 4, 0, 0.0, 654.25, 341, 1438, 419.0, 1438.0, 1438.0, 1438.0, 0.054779512462339086, 0.07655222884141331, 0.029476085319090663], "isController": false}, {"data": ["COMPLIANCE_TOP_FAILED_RULES - HTTP POST Request 98 wait for result", 4, 0, 0.0, 1353.0, 966, 1669, 1388.5, 1669.0, 1669.0, 1669.0, 0.7226738934056007, 0.9758567637759711, 0.44249661246612465], "isController": false}, {"data": ["COMPLIANCE_TABLE_BY_SECTIONS - HTTP POST Request 94 wait for result", 3, 0, 0.0, 280.3333333333333, 277, 284, 280.0, 284.0, 284.0, 284.0, 3.303964757709251, 4.434325096365638, 2.042392276982379], "isController": false}, {"data": ["NET_NEW - HTTP POST Request 85 wait for result", 3, 0, 0.0, 529.3333333333334, 296, 987, 305.0, 987.0, 987.0, 987.0, 1.3333333333333333, 1.8537326388888888, 0.7630208333333334], "isController": false}, {"data": ["AVG_CLOSE_TIME - HTTP POST Request 86wait for result", 2, 0, 0.0, 393.0, 287, 499, 393.0, 499.0, 499.0, 499.0, 1.7921146953405018, 2.4930345542114694, 1.0483170922939067], "isController": false}, {"data": ["HTTP GET Request 5 wait for result", 3, 0, 0.0, 1538.0, 279, 3050, 1285.0, 3050.0, 3050.0, 3050.0, 0.6404782237403929, 1.0307696413321947, 0.2995987003629377], "isController": false}, {"data": ["HTTP POST Request 11 for running query", 3, 0, 0.0, 705.3333333333334, 323, 1296, 497.0, 1296.0, 1296.0, 1296.0, 0.06449116471043467, 0.10118730921363774, 0.04887221075712627], "isController": false}, {"data": ["COMPLIANCE_TABLE - HTTP POST Request 93 for running query", 6, 0, 0.0, 674.1666666666666, 381, 1386, 497.0, 1386.0, 1386.0, 1386.0, 0.06912522033663983, 0.09578973404071475, 0.0395579874192099], "isController": false}, {"data": ["HTTP POST Request 9 for running query", 4, 0, 0.0, 686.5, 346, 1072, 664.0, 1072.0, 1072.0, 1072.0, 0.05831243804303458, 0.0892766843183276, 0.04008980115458627], "isController": false}, {"data": ["HTTP POST Request 10 for running query", 3, 0, 0.0, 813.3333333333334, 318, 1693, 429.0, 1693.0, 1693.0, 1693.0, 0.06321378903451473, 0.09846288428715917, 0.04679301961734587], "isController": false}, {"data": ["HTTP POST Request 2 for running query", 4, 0, 0.0, 620.0, 336, 1244, 450.0, 1244.0, 1244.0, 1244.0, 0.046763388942796684, 0.07992931786829091, 0.06891206436980488], "isController": false}, {"data": ["COMPLIANCE_TABLE -  HTTP POST Request 93wait for result", 3, 0, 0.0, 1635.0, 482, 3420, 1003.0, 3420.0, 3420.0, 3420.0, 0.6018054162487463, 0.8078924272818455, 0.36496207372116346], "isController": false}, {"data": ["COMPLIANCE_STANDARDS - HTTP POST Request 96 for running query", 6, 0, 0.0, 938.6666666666666, 342, 3714, 367.0, 3714.0, 3714.0, 3714.0, 0.08024286841506961, 0.11119592800877323, 0.04584187306915598], "isController": false}, {"data": ["HTTP GET Request 5 for result", 4, 0, 0.0, 450.5, 270, 963, 284.5, 963.0, 963.0, 963.0, 0.05519449158973934, 0.07242929499385961, 0.026896534475859307], "isController": false}, {"data": ["HTTP POST Request 8 for running query", 4, 0, 0.0, 1052.75, 317, 3157, 368.5, 3157.0, 3157.0, 3157.0, 0.05506153126118437, 0.08766021615092366, 0.043554531564022794], "isController": false}, {"data": ["HTTP GET Request 10 for result", 3, 0, 0.0, 292.6666666666667, 290, 296, 292.0, 296.0, 296.0, 296.0, 0.06453555909306027, 0.09010189223637224, 0.03144848045648152], "isController": false}, {"data": ["HTTP GET Request 2 for result", 4, 0, 0.0, 688.25, 281, 1178, 647.0, 1178.0, 1178.0, 1178.0, 0.054338966472857686, 0.07532633096506006, 0.026479633076128894], "isController": false}, {"data": ["NONCOMPLIANT_ASSETS_OVERTIME - HTTP POST Request 100 for running query", 5, 0, 0.0, 654.2, 360, 1606, 383.0, 1606.0, 1606.0, 1606.0, 0.09003655484126556, 0.12476745246069904, 0.05214030959069382], "isController": false}, {"data": ["HTTP GET Request 14 for result", 3, 0, 0.0, 616.3333333333334, 284, 1267, 298.0, 1267.0, 1267.0, 1267.0, 0.08530482256596907, 0.25258224806642404, 0.041569439902752504], "isController": false}, {"data": ["OPEN_VULNERABILITIES - HTTP POST Request 89wait for result", 5, 0, 0.0, 1255.8, 307, 3028, 746.0, 3028.0, 3028.0, 3028.0, 0.6577216521967902, 0.9088634158774006, 0.3937337624967114], "isController": false}, {"data": ["NONCOMPLIANT_ASSETS_OVERTIME - HTTP POST Request 100 wait for result", 7, 0, 0.0, 752.0, 284, 1172, 811.0, 1172.0, 1172.0, 1172.0, 1.287001287001287, 1.7507742117117118, 0.789293758043758], "isController": false}, {"data": ["HTTP POST Request 1 for running query", 4, 0, 0.0, 1631.0, 1100, 2883, 1270.5, 2883.0, 2883.0, 2883.0, 0.044975151228946006, 0.0716791472711327, 0.035707810497200294], "isController": false}, {"data": ["TOP_NONCOMPLIANT_ASSETS - HTTP POST Request 99wait for result", 5, 0, 0.0, 286.8, 270, 305, 286.0, 305.0, 305.0, 305.0, 3.3222591362126246, 4.499974044850498, 2.0212572674418605], "isController": false}, {"data": ["HTTP GET Request 11 for result", 3, 0, 0.0, 276.6666666666667, 267, 286, 277.0, 286.0, 286.0, 286.0, 0.0714694110920526, 0.09489704682437583, 0.03482737903802173], "isController": false}, {"data": ["HTTP GET Request 12 wait for result", 3, 0, 0.0, 268.6666666666667, 264, 275, 267.0, 275.0, 275.0, 275.0, 3.4965034965034967, 5.442799388111888, 1.6355714597902098], "isController": false}, {"data": ["TOP_TO_FIX - HTTP POST Request 88 for running query", 3, 0, 0.0, 2568.6666666666665, 1295, 4202, 2209.0, 4202.0, 4202.0, 4202.0, 0.062189054726368154, 0.08690677472014925, 0.034981343283582086], "isController": false}, {"data": ["AVG_CLOSE_TIME - HTTP POST Request 86 for running query", 4, 0, 0.0, 1130.75, 458, 3046, 509.5, 3046.0, 3046.0, 3046.0, 0.05670220004536176, 0.07923910963370379, 0.031230508618734408], "isController": false}, {"data": ["COMPLIANCE_SUNBURST - HTTP POST Request 92wait for result", 3, 0, 0.0, 283.6666666666667, 281, 285, 285.0, 285.0, 285.0, 285.0, 2.944062806673209, 3.951292627576055, 1.8112886408243378], "isController": false}, {"data": ["HTTP GET Request 13 for result", 3, 0, 0.0, 900.0, 751, 1089, 860.0, 1089.0, 1089.0, 1089.0, 0.078003120124805, 0.10367406883775351, 0.03801128607644306], "isController": false}, {"data": ["VLN_BY_SEVERITY HTTP POST Request 84 for running query", 4, 0, 0.0, 1467.0, 415, 4060, 696.5, 4060.0, 4060.0, 4060.0, 0.05082915051782197, 0.0710317523349641, 0.02869067285087998], "isController": false}, {"data": ["PUBLISHED_AGE - HTTP POST Request 87 wait for result", 2, 0, 0.0, 287.0, 284, 290, 287.0, 290.0, 290.0, 290.0, 2.1810250817884405, 3.0926254089422027, 1.2736845692475462], "isController": false}, {"data": ["COUNTS - HTTP POST Request 81 for running query", 4, 0, 0.0, 1637.0, 1192, 2882, 1237.0, 2882.0, 2882.0, 2882.0, 0.04496857820597858, 0.06284183145776889, 0.024153044934851774], "isController": false}, {"data": ["COMPLIANCE_SUNBURST - HTTP POST Request 91 for running query", 6, 0, 0.0, 3076.6666666666665, 1236, 6904, 2089.5, 6904.0, 6904.0, 6904.0, 0.06258670866930226, 0.08672904257982413, 0.03636630044749496], "isController": false}, {"data": ["COMPLIANCE_TABLE_BY_SECTIONS - HTTP POST Request 94 for running query", 6, 0, 0.0, 1937.0, 402, 5531, 459.5, 5531.0, 5531.0, 5531.0, 0.0734340195334492, 0.10176061886519962, 0.042884320000979116], "isController": false}, {"data": ["COMPLIANCE_TREND - HTTP POST Request 95 for running query", 6, 0, 0.0, 501.6666666666667, 375, 630, 501.0, 630.0, 630.0, 630.0, 0.07414913863417287, 0.10275158957215946, 0.04243300316369658], "isController": false}, {"data": ["PUBLISHED_AGE - HTTP POST Request 87 for running query", 4, 0, 0.0, 1341.25, 379, 4143, 421.5, 4143.0, 4143.0, 4143.0, 0.056984115677754826, 0.07963307571764372, 0.031330133912671844], "isController": false}, {"data": ["RESOLVED_VULNERABILITIES - HTTP POST Request 90 wait for result", 4, 0, 0.0, 811.5, 282, 1985, 489.5, 1985.0, 1985.0, 1985.0, 0.9352349777881693, 1.275673296118775, 0.5826952303016133], "isController": false}, {"data": ["HTTP GET Request 12 for result", 3, 0, 0.0, 712.0, 274, 1026, 836.0, 1026.0, 1026.0, 1026.0, 0.07173258093826217, 0.09526983405862942, 0.034955622937688294], "isController": false}]}, function(index, item){
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
