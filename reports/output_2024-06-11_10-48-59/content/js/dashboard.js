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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8369565217391305, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "COMPLIANCE_STANDARDS-CheckStatus"], "isController": false}, {"data": [0.5, 500, 1500, "TOP_NONCOMPLIANT_ASSETS-RunQuery"], "isController": false}, {"data": [1.0, 500, 1500, "TOP_NONCOMPLIANT_ASSETS-CheckStatus"], "isController": false}, {"data": [0.0, 500, 1500, "COMPLIANCE_SUNBURST-RunQuery"], "isController": false}, {"data": [1.0, 500, 1500, "COMPLIANCE_TABLE-CheckStatus"], "isController": false}, {"data": [0.5, 500, 1500, "COMPLIANCE_FAILED_RULES_BY_STANDARDS-RunQuery"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "COMPLIANCE_TREND-CheckStatus"], "isController": false}, {"data": [0.5, 500, 1500, "COMPLIANCE_TABLE_BY_SECTIONS-RunQuery"], "isController": false}, {"data": [0.5, 500, 1500, "COMPLIANCE_TREND-RunQuery"], "isController": false}, {"data": [0.5, 500, 1500, "COMPLIANCE_TOP_FAILED_RULES-RunQuery"], "isController": false}, {"data": [0.5, 500, 1500, "COMPLIANCE_STANDARDS-RunQuery"], "isController": false}, {"data": [0.5, 500, 1500, "COMPLIANCE_TABLE-RunQuery"], "isController": false}, {"data": [1.0, 500, 1500, "COMPLIANCE_SUNBURST-CheckStatus"], "isController": false}, {"data": [1.0, 500, 1500, "COMPLIANCE_TOP_FAILED_RULES-CheckStatus"], "isController": false}, {"data": [1.0, 500, 1500, "NONCOMPLIANT_ASSETS_OVERTIME-CheckStatus"], "isController": false}, {"data": [1.0, 500, 1500, "COMPLIANCE_FAILED_RULES_BY_STANDARDS-CheckStatus"], "isController": false}, {"data": [0.5, 500, 1500, "NONCOMPLIANT_ASSETS_OVERTIME-RunQuery"], "isController": false}, {"data": [1.0, 500, 1500, "COMPLIANCE_TABLE_BY_SECTIONS-CheckStatus"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 46, 0, 0.0, 560.9999999999998, 264, 2414, 285.0, 1160.2, 1578.9999999999995, 2414.0, 0.925143799525361, 1.2598170829813764, 0.5562372101383694], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["COMPLIANCE_STANDARDS-CheckStatus", 7, 0, 0.0, 278.57142857142856, 269, 291, 277.0, 291.0, 291.0, 291.0, 3.2422417786012043, 4.397923662575267, 1.963076076887448], "isController": false}, {"data": ["TOP_NONCOMPLIANT_ASSETS-RunQuery", 1, 0, 0.0, 1152.0, 1152, 1152, 1152.0, 1152.0, 1152.0, 1152.0, 0.8680555555555555, 1.21307373046875, 0.4984537760416667], "isController": false}, {"data": ["TOP_NONCOMPLIANT_ASSETS-CheckStatus", 5, 0, 0.0, 288.8, 281, 299, 288.0, 299.0, 299.0, 299.0, 3.022974607013301, 4.097547611850061, 1.839173027509069], "isController": false}, {"data": ["COMPLIANCE_SUNBURST-RunQuery", 2, 0, 0.0, 2063.0, 1712, 2414, 2063.0, 2414.0, 2414.0, 2414.0, 0.048353561239785306, 0.06757221302161404, 0.0278127417678062], "isController": false}, {"data": ["COMPLIANCE_TABLE-CheckStatus", 4, 0, 0.0, 280.75, 273, 294, 278.0, 294.0, 294.0, 294.0, 0.10140959334753068, 0.13567494422472365, 0.06149937252814116], "isController": false}, {"data": ["COMPLIANCE_FAILED_RULES_BY_STANDARDS-RunQuery", 1, 0, 0.0, 1119.0, 1119, 1119, 1119.0, 1119.0, 1119.0, 1119.0, 0.8936550491510277, 1.2488480227882037, 0.5253714253798034], "isController": false}, {"data": ["COMPLIANCE_TREND-CheckStatus", 3, 0, 0.0, 464.66666666666663, 279, 829, 286.0, 829.0, 829.0, 829.0, 1.9880715705765406, 2.674059807819748, 1.2056566848906562], "isController": false}, {"data": ["COMPLIANCE_TABLE_BY_SECTIONS-RunQuery", 2, 0, 0.0, 1143.0, 1127, 1159, 1143.0, 1159.0, 1159.0, 1159.0, 0.05008389051661533, 0.06999028059499662, 0.02924820950091403], "isController": false}, {"data": ["COMPLIANCE_TREND-RunQuery", 1, 0, 0.0, 1115.0, 1115, 1115, 1115.0, 1115.0, 1115.0, 1115.0, 0.8968609865470852, 1.2533281950672646, 0.5132427130044843], "isController": false}, {"data": ["COMPLIANCE_TOP_FAILED_RULES-RunQuery", 1, 0, 0.0, 1129.0, 1129, 1129, 1129.0, 1129.0, 1129.0, 1129.0, 0.8857395925597874, 1.2377864813994686, 0.5120682019486271], "isController": false}, {"data": ["COMPLIANCE_STANDARDS-RunQuery", 1, 0, 0.0, 1142.0, 1142, 1142, 1142.0, 1142.0, 1142.0, 1142.0, 0.8756567425569177, 1.2236960923817863, 0.5002531195271454], "isController": false}, {"data": ["COMPLIANCE_TABLE-RunQuery", 2, 0, 0.0, 1247.5, 1163, 1332, 1247.5, 1332.0, 1332.0, 1332.0, 0.04997001798920648, 0.06983114818608835, 0.028596123575854487], "isController": false}, {"data": ["COMPLIANCE_SUNBURST-CheckStatus", 6, 0, 0.0, 279.0, 264, 288, 278.5, 288.0, 288.0, 288.0, 0.15124779430299976, 0.20481472145197882, 0.09216662465339047], "isController": false}, {"data": ["COMPLIANCE_TOP_FAILED_RULES-CheckStatus", 2, 0, 0.0, 282.5, 278, 287, 282.5, 287.0, 287.0, 287.0, 3.3557046979865772, 4.487927328020135, 2.054713716442953], "isController": false}, {"data": ["NONCOMPLIANT_ASSETS_OVERTIME-CheckStatus", 2, 0, 0.0, 278.5, 275, 282, 278.5, 282.0, 282.0, 282.0, 3.454231433506045, 4.621383851468049, 2.1184153713298794], "isController": false}, {"data": ["COMPLIANCE_FAILED_RULES_BY_STANDARDS-CheckStatus", 2, 0, 0.0, 281.5, 276, 287, 281.5, 287.0, 287.0, 287.0, 3.4129692832764507, 4.566179607508532, 2.123106868600683], "isController": false}, {"data": ["NONCOMPLIANT_ASSETS_OVERTIME-RunQuery", 1, 0, 0.0, 1145.0, 1145, 1145, 1145.0, 1145.0, 1145.0, 1145.0, 0.8733624454148472, 1.2204899017467248, 0.5057655567685589], "isController": false}, {"data": ["COMPLIANCE_TABLE_BY_SECTIONS-CheckStatus", 3, 0, 0.0, 275.6666666666667, 272, 279, 276.0, 279.0, 279.0, 279.0, 0.07693885925318014, 0.10413794816885516, 0.04756083780006155], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 46, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
