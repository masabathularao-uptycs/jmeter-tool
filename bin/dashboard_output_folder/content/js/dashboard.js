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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6936619718309859, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.75, 500, 1500, "HTTP GET Request 9wait for result"], "isController": false}, {"data": [0.75, 500, 1500, "HTTP GET Request 9 for result"], "isController": false}, {"data": [0.875, 500, 1500, "NEW_DAILY_VLN - HTTP POST Request 82 for running query"], "isController": false}, {"data": [0.875, 500, 1500, "HTTP GET Request 6 for result"], "isController": false}, {"data": [0.875, 500, 1500, "HTTP POST Request 14 for running query"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "COMPLIANCE_SUNBURST - HTTP POST Request 92 for running query"], "isController": false}, {"data": [1.0, 500, 1500, "COMPLIANCE_STANDARDS - HTTP POST Request 96wait for result"], "isController": false}, {"data": [0.875, 500, 1500, "HTTP POST Request 6 for running query"], "isController": false}, {"data": [0.5, 500, 1500, "COMPLIANCE_FAILED_RULES_BY_STANDARDS - HTTP POST Request 97 wait for result"], "isController": false}, {"data": [1.0, 500, 1500, "TOP_NONCOMPLIANT_ASSETS - HTTP POST Request 99 for running query"], "isController": false}, {"data": [0.625, 500, 1500, "HTTP POST Request 13 for running query"], "isController": false}, {"data": [0.75, 500, 1500, "COMPLIANCE_TREND - HTTP POST Request 95 wait for result"], "isController": false}, {"data": [0.75, 500, 1500, "HTTP POST Request 5 for running query"], "isController": false}, {"data": [1.0, 500, 1500, "COMPLIANCE_SUNBURST - HTTP POST Request 91wait for result"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP GET Request 6wait for result"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP GET Request 14 wait for result"], "isController": false}, {"data": [0.25, 500, 1500, "HTTP GET Request 11 wait for result"], "isController": false}, {"data": [0.25, 500, 1500, "RESOLVED_VULNERABILITIES - HTTP POST Request 90 for running query"], "isController": false}, {"data": [0.75, 500, 1500, "COMPLIANCE_FAILED_RULES_BY_STANDARDS - HTTP POST Request 97 for running query"], "isController": false}, {"data": [0.375, 500, 1500, "HTTP POST Request 12 for running query"], "isController": false}, {"data": [0.75, 500, 1500, "OPEN_VULNERABILITIES - HTTP POST Request 89 for running query"], "isController": false}, {"data": [1.0, 500, 1500, "TOP_TO_FIX - HTTP POST Request 88 wait for result"], "isController": false}, {"data": [0.75, 500, 1500, "CLOSED_DAILY_VLN_URL -  HTTP POST Request 83wait for result"], "isController": false}, {"data": [0.6, 500, 1500, "HTTP GET Request 1 for result"], "isController": false}, {"data": [0.75, 500, 1500, "HTTP GET Request 1wait for result"], "isController": false}, {"data": [0.75, 500, 1500, "VLN_BY_SEVERITY - HTTP POST Request 84 wait for result"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP GET Request 8wait for result"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP GET Request 10 wait for result"], "isController": false}, {"data": [0.7894736842105263, 500, 1500, "HTTP GET Request 2 wait for result"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "COMPLIANCE_TOP_FAILED_RULES - HTTP POST Request 98 for running query"], "isController": false}, {"data": [0.75, 500, 1500, "HTTP GET Request 8 for result"], "isController": false}, {"data": [0.75, 500, 1500, "HTTP GET Request 13 wait for result"], "isController": false}, {"data": [1.0, 500, 1500, "COUNTS - HTTP POST Request 81wait for result"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "NEW_DAILY_VLN - HTTP POST Request 82wait for result"], "isController": false}, {"data": [0.625, 500, 1500, "CLOSED_DAILY_VLN_URL - HTTP POST Request 83 for running query"], "isController": false}, {"data": [0.75, 500, 1500, "NET_NEW - HTTP POST Request 85 for running query"], "isController": false}, {"data": [1.0, 500, 1500, "COMPLIANCE_TOP_FAILED_RULES - HTTP POST Request 98 wait for result"], "isController": false}, {"data": [1.0, 500, 1500, "COMPLIANCE_TABLE_BY_SECTIONS - HTTP POST Request 94 wait for result"], "isController": false}, {"data": [0.5, 500, 1500, "NET_NEW - HTTP POST Request 85 wait for result"], "isController": false}, {"data": [1.0, 500, 1500, "AVG_CLOSE_TIME - HTTP POST Request 86wait for result"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP GET Request 5 wait for result"], "isController": false}, {"data": [0.875, 500, 1500, "HTTP POST Request 11 for running query"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "COMPLIANCE_TABLE - HTTP POST Request 93 for running query"], "isController": false}, {"data": [0.75, 500, 1500, "HTTP POST Request 9 for running query"], "isController": false}, {"data": [0.75, 500, 1500, "HTTP POST Request 10 for running query"], "isController": false}, {"data": [0.7, 500, 1500, "HTTP POST Request 2 for running query"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "COMPLIANCE_TABLE -  HTTP POST Request 93wait for result"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "COMPLIANCE_STANDARDS - HTTP POST Request 96 for running query"], "isController": false}, {"data": [0.875, 500, 1500, "HTTP GET Request 5 for result"], "isController": false}, {"data": [0.75, 500, 1500, "HTTP POST Request 8 for running query"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP GET Request 10 for result"], "isController": false}, {"data": [0.625, 500, 1500, "HTTP GET Request 2 for result"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "NONCOMPLIANT_ASSETS_OVERTIME - HTTP POST Request 100 for running query"], "isController": false}, {"data": [0.75, 500, 1500, "HTTP GET Request 14 for result"], "isController": false}, {"data": [0.75, 500, 1500, "OPEN_VULNERABILITIES - HTTP POST Request 89wait for result"], "isController": false}, {"data": [0.75, 500, 1500, "NONCOMPLIANT_ASSETS_OVERTIME - HTTP POST Request 100 wait for result"], "isController": false}, {"data": [0.3, 500, 1500, "HTTP POST Request 1 for running query"], "isController": false}, {"data": [1.0, 500, 1500, "TOP_NONCOMPLIANT_ASSETS - HTTP POST Request 99wait for result"], "isController": false}, {"data": [0.625, 500, 1500, "HTTP GET Request 11 for result"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP GET Request 12 wait for result"], "isController": false}, {"data": [0.75, 500, 1500, "TOP_TO_FIX - HTTP POST Request 88 for running query"], "isController": false}, {"data": [0.75, 500, 1500, "AVG_CLOSE_TIME - HTTP POST Request 86 for running query"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "COMPLIANCE_SUNBURST - HTTP POST Request 92wait for result"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP GET Request 13 for result"], "isController": false}, {"data": [0.5, 500, 1500, "VLN_BY_SEVERITY HTTP POST Request 84 for running query"], "isController": false}, {"data": [0.75, 500, 1500, "PUBLISHED_AGE - HTTP POST Request 87 wait for result"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "COMPLIANCE_SUNBURST - HTTP POST Request 91 for running query"], "isController": false}, {"data": [0.125, 500, 1500, "COUNTS - HTTP POST Request 81 for running query"], "isController": false}, {"data": [0.5, 500, 1500, "COMPLIANCE_TABLE_BY_SECTIONS - HTTP POST Request 94 for running query"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "COMPLIANCE_TREND - HTTP POST Request 95 for running query"], "isController": false}, {"data": [0.0, 500, 1500, "PUBLISHED_AGE - HTTP POST Request 87 for running query"], "isController": false}, {"data": [1.0, 500, 1500, "RESOLVED_VULNERABILITIES - HTTP POST Request 90 wait for result"], "isController": false}, {"data": [0.625, 500, 1500, "HTTP GET Request 12 for result"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 284, 0, 0.0, 959.9753521126759, 250, 5606, 372.0, 2781.5, 3515.75, 4927.299999999982, 2.8488599544583657, 4.16247655207696, 1.6838794431933313], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["HTTP GET Request 9wait for result", 2, 0, 0.0, 563.5, 254, 873, 563.5, 873.0, 873.0, 873.0, 1.7123287671232876, 2.6613000321061646, 0.8009819135273973], "isController": false}, {"data": ["HTTP GET Request 9 for result", 4, 0, 0.0, 874.25, 262, 2648, 293.5, 2648.0, 2648.0, 2648.0, 0.06680696128536594, 0.08748841316765206, 0.03255534539198984], "isController": false}, {"data": ["NEW_DAILY_VLN - HTTP POST Request 82 for running query", 4, 0, 0.0, 545.25, 330, 1107, 372.0, 1107.0, 1107.0, 1107.0, 0.05196424859696529, 0.07261800756079817, 0.029128397162752027], "isController": false}, {"data": ["HTTP GET Request 6 for result", 4, 0, 0.0, 453.0, 270, 890, 326.0, 890.0, 890.0, 890.0, 0.06815471119441131, 0.09269772853126598, 0.03321211024024536], "isController": false}, {"data": ["HTTP POST Request 14 for running query", 4, 0, 0.0, 418.25, 288, 806, 289.5, 806.0, 806.0, 806.0, 0.07570595805889924, 0.11265327499242941, 0.048277334582481644], "isController": false}, {"data": ["COMPLIANCE_SUNBURST - HTTP POST Request 92 for running query", 7, 0, 0.0, 363.42857142857144, 279, 664, 330.0, 664.0, 664.0, 664.0, 0.07933449690595462, 0.11120996441281139, 0.046097681307659184], "isController": false}, {"data": ["COMPLIANCE_STANDARDS - HTTP POST Request 96wait for result", 1, 0, 0.0, 268.0, 268, 268, 268.0, 268.0, 268.0, 268.0, 3.7313432835820897, 4.773495802238806, 2.259211753731343], "isController": false}, {"data": ["HTTP POST Request 6 for running query", 4, 0, 0.0, 390.0, 299, 630, 315.5, 630.0, 630.0, 630.0, 0.06571381632988335, 0.10455491724166256, 0.05198065549531789], "isController": false}, {"data": ["COMPLIANCE_FAILED_RULES_BY_STANDARDS - HTTP POST Request 97 wait for result", 3, 0, 0.0, 980.3333333333333, 265, 2140, 536.0, 2140.0, 2140.0, 2140.0, 0.9878169245966415, 1.326092772472835, 0.6144915829766217], "isController": false}, {"data": ["TOP_NONCOMPLIANT_ASSETS - HTTP POST Request 99 for running query", 6, 0, 0.0, 351.66666666666663, 324, 398, 345.5, 398.0, 398.0, 398.0, 0.09620318111852232, 0.1333128066476398, 0.05524167040790148], "isController": false}, {"data": ["HTTP POST Request 13 for running query", 4, 0, 0.0, 883.5, 293, 2186, 527.5, 2186.0, 2186.0, 2186.0, 0.07178493234270127, 0.11402167231973008, 0.05643249075768996], "isController": false}, {"data": ["COMPLIANCE_TREND - HTTP POST Request 95 wait for result", 2, 0, 0.0, 552.0, 278, 826, 552.0, 826.0, 826.0, 826.0, 1.6934801016088061, 2.245845681625741, 1.0270030694326842], "isController": false}, {"data": ["HTTP POST Request 5 for running query", 4, 0, 0.0, 988.0, 295, 3024, 316.5, 3024.0, 3024.0, 3024.0, 0.064247739282674, 0.10222229416630527, 0.05082096564352142], "isController": false}, {"data": ["COMPLIANCE_SUNBURST - HTTP POST Request 91wait for result", 2, 0, 0.0, 279.5, 279, 280, 279.5, 280.0, 280.0, 280.0, 3.4246575342465753, 4.543356699486302, 2.106967037671233], "isController": false}, {"data": ["HTTP GET Request 6wait for result", 2, 0, 0.0, 1202.0, 261, 2143, 1202.0, 2143.0, 2143.0, 2143.0, 0.8200082000820008, 1.3273081949569496, 0.3835780545305453], "isController": false}, {"data": ["HTTP GET Request 14 wait for result", 3, 0, 0.0, 1413.6666666666665, 256, 3013, 972.0, 3013.0, 3013.0, 3013.0, 0.6926806742091896, 1.0588634264604015, 0.3240176200646502], "isController": false}, {"data": ["HTTP GET Request 11 wait for result", 2, 0, 0.0, 1313.0, 759, 1867, 1313.0, 1867.0, 1867.0, 1867.0, 0.7561436672967864, 1.2043655482041589, 0.3537039224952741], "isController": false}, {"data": ["RESOLVED_VULNERABILITIES - HTTP POST Request 90 for running query", 4, 0, 0.0, 2319.75, 385, 3980, 2457.0, 3980.0, 3980.0, 3980.0, 0.07044361868869203, 0.0984422054135921, 0.04148193561453252], "isController": false}, {"data": ["COMPLIANCE_FAILED_RULES_BY_STANDARDS - HTTP POST Request 97 for running query", 6, 0, 0.0, 742.1666666666667, 319, 1298, 588.0, 1298.0, 1298.0, 1298.0, 0.0894854586129754, 0.12400377516778524, 0.05260766219239374], "isController": false}, {"data": ["HTTP POST Request 12 for running query", 4, 0, 0.0, 1317.0, 289, 1939, 1520.0, 1939.0, 1939.0, 1939.0, 0.07120478496154942, 0.10962338231629165, 0.0493705051979493], "isController": false}, {"data": ["OPEN_VULNERABILITIES - HTTP POST Request 89 for running query", 4, 0, 0.0, 1207.75, 403, 3485, 471.5, 3485.0, 3485.0, 3485.0, 0.06548895692463859, 0.08146148328394374, 0.03696544638910264], "isController": false}, {"data": ["TOP_TO_FIX - HTTP POST Request 88 wait for result", 2, 0, 0.0, 299.5, 263, 336, 299.5, 336.0, 336.0, 336.0, 2.176278563656148, 2.9105600516866157, 1.2985412132752991], "isController": false}, {"data": ["CLOSED_DAILY_VLN_URL -  HTTP POST Request 83wait for result", 4, 0, 0.0, 663.75, 263, 1146, 623.0, 1146.0, 1146.0, 1146.0, 1.0884353741496597, 1.5324723639455784, 0.6536989795918368], "isController": false}, {"data": ["HTTP GET Request 1 for result", 5, 0, 0.0, 901.6, 261, 2605, 621.0, 2605.0, 2605.0, 2605.0, 0.05356243773366613, 0.07190129580927487, 0.027095061275428767], "isController": false}, {"data": ["HTTP GET Request 1wait for result", 2, 0, 0.0, 696.5, 268, 1125, 696.5, 1125.0, 1125.0, 1125.0, 1.3623978201634876, 2.206578891348774, 0.6372935115803815], "isController": false}, {"data": ["VLN_BY_SEVERITY - HTTP POST Request 84 wait for result", 2, 0, 0.0, 402.5, 278, 527, 402.5, 527.0, 527.0, 527.0, 1.6778523489932886, 2.393888947147651, 1.004417470637584], "isController": false}, {"data": ["HTTP GET Request 8wait for result", 2, 0, 0.0, 252.0, 250, 254, 252.0, 254.0, 254.0, 254.0, 3.8535645472061657, 6.22817316955684, 1.802595134874759], "isController": false}, {"data": ["HTTP GET Request 10 wait for result", 1, 0, 0.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 261.0, 3.8314176245210727, 6.143738026819923, 1.7922353927203065], "isController": false}, {"data": ["HTTP GET Request 2 wait for result", 19, 0, 0.0, 676.4736842105262, 252, 2140, 265.0, 1485.0, 2140.0, 2140.0, 1.412849494348602, 2.4237601548557404, 0.6608934646415824], "isController": false}, {"data": ["COMPLIANCE_TOP_FAILED_RULES - HTTP POST Request 98 for running query", 6, 0, 0.0, 1295.0, 326, 3259, 374.0, 3259.0, 3259.0, 3259.0, 0.09518974489148369, 0.13190844531349158, 0.05503157126538901], "isController": false}, {"data": ["HTTP GET Request 8 for result", 4, 0, 0.0, 456.75, 262, 655, 455.0, 655.0, 655.0, 655.0, 0.06554153694904145, 0.08587925507946911, 0.03193869818122235], "isController": false}, {"data": ["HTTP GET Request 13 wait for result", 2, 0, 0.0, 447.0, 258, 636, 447.0, 636.0, 636.0, 636.0, 2.1119324181626187, 3.4071409714889125, 0.9879058870116156], "isController": false}, {"data": ["COUNTS - HTTP POST Request 81wait for result", 2, 0, 0.0, 273.0, 266, 280, 273.0, 280.0, 280.0, 280.0, 2.197802197802198, 3.1561212225274726, 1.2555803571428572], "isController": false}, {"data": ["NEW_DAILY_VLN - HTTP POST Request 82wait for result", 3, 0, 0.0, 883.0, 302, 1880, 467.0, 1880.0, 1880.0, 1880.0, 0.9055236945366737, 1.2798775656504677, 0.538538994114096], "isController": false}, {"data": ["CLOSED_DAILY_VLN_URL - HTTP POST Request 83 for running query", 4, 0, 0.0, 1149.25, 319, 3356, 461.0, 3356.0, 3356.0, 3356.0, 0.052921953349298126, 0.07395636254184142, 0.02997532513925089], "isController": false}, {"data": ["NET_NEW - HTTP POST Request 85 for running query", 4, 0, 0.0, 774.0, 313, 1397, 693.0, 1397.0, 1397.0, 1397.0, 0.059274187573166576, 0.08283336173554821, 0.031894606789858185], "isController": false}, {"data": ["COMPLIANCE_TOP_FAILED_RULES - HTTP POST Request 98 wait for result", 2, 0, 0.0, 270.0, 265, 275, 270.0, 275.0, 275.0, 275.0, 3.5650623885918002, 4.726144719251336, 2.1829044117647056], "isController": false}, {"data": ["COMPLIANCE_TABLE_BY_SECTIONS - HTTP POST Request 94 wait for result", 2, 0, 0.0, 280.0, 272, 288, 280.0, 288.0, 288.0, 288.0, 3.4246575342465753, 4.541684503424658, 2.117000214041096], "isController": false}, {"data": ["NET_NEW - HTTP POST Request 85 wait for result", 2, 0, 0.0, 1336.0, 264, 2408, 1336.0, 2408.0, 2408.0, 2408.0, 0.6589785831960461, 0.9160703253706755, 0.3771107907742998], "isController": false}, {"data": ["AVG_CLOSE_TIME - HTTP POST Request 86wait for result", 1, 0, 0.0, 269.0, 269, 269, 269.0, 269.0, 269.0, 269.0, 3.717472118959108, 5.165979321561338, 2.174575975836431], "isController": false}, {"data": ["HTTP GET Request 5 wait for result", 1, 0, 0.0, 268.0, 268, 268, 268.0, 268.0, 268.0, 268.0, 3.7313432835820897, 6.114447294776119, 1.7454232742537312], "isController": false}, {"data": ["HTTP POST Request 11 for running query", 4, 0, 0.0, 495.25, 289, 898, 397.0, 898.0, 898.0, 898.0, 0.07008690776562938, 0.10993856992045135, 0.053112734791141016], "isController": false}, {"data": ["COMPLIANCE_TABLE - HTTP POST Request 93 for running query", 7, 0, 0.0, 1174.4285714285716, 320, 4218, 353.0, 4218.0, 4218.0, 4218.0, 0.08164122181919968, 0.11313368531391049, 0.04672046483012794], "isController": false}, {"data": ["HTTP POST Request 9 for running query", 4, 0, 0.0, 791.5, 287, 2297, 291.0, 2297.0, 2297.0, 2297.0, 0.06551040796606561, 0.10023284343831376, 0.04503840547667011], "isController": false}, {"data": ["HTTP POST Request 10 for running query", 4, 0, 0.0, 534.75, 285, 999, 427.5, 999.0, 999.0, 999.0, 0.06950477845351868, 0.1082788064726325, 0.051449826238053865], "isController": false}, {"data": ["HTTP POST Request 2 for running query", 5, 0, 0.0, 884.0, 306, 2619, 313.0, 2619.0, 2619.0, 2619.0, 0.05353319057815845, 0.09147693054068522, 0.07888826619379015], "isController": false}, {"data": ["COMPLIANCE_TABLE -  HTTP POST Request 93wait for result", 7, 0, 0.0, 444.8571428571429, 269, 1327, 278.0, 1327.0, 1327.0, 1327.0, 2.095808383233533, 2.8510362088323356, 1.2709931699101797], "isController": false}, {"data": ["COMPLIANCE_STANDARDS - HTTP POST Request 96 for running query", 7, 0, 0.0, 743.1428571428572, 309, 2846, 335.0, 2846.0, 2846.0, 2846.0, 0.08931305501684189, 0.12376486823134632, 0.05102357146958252], "isController": false}, {"data": ["HTTP GET Request 5 for result", 4, 0, 0.0, 514.0, 265, 1252, 269.5, 1252.0, 1252.0, 1252.0, 0.06471025981169314, 0.09121998050603423, 0.031533612935580935], "isController": false}, {"data": ["HTTP POST Request 8 for running query", 4, 0, 0.0, 918.75, 297, 2764, 307.0, 2764.0, 2764.0, 2764.0, 0.06537336362299181, 0.10404515562946377, 0.05171135208459313], "isController": false}, {"data": ["HTTP GET Request 10 for result", 4, 0, 0.0, 287.0, 262, 327, 279.5, 327.0, 327.0, 327.0, 0.07015451531999228, 0.09204354622305627, 0.034186624164722804], "isController": false}, {"data": ["HTTP GET Request 2 for result", 4, 0, 0.0, 813.75, 271, 1266, 859.0, 1266.0, 1266.0, 1266.0, 0.0632691151814242, 0.0876901286340198, 0.030831336401885418], "isController": false}, {"data": ["NONCOMPLIANT_ASSETS_OVERTIME - HTTP POST Request 100 for running query", 6, 0, 0.0, 2105.833333333333, 339, 4063, 2151.0, 4063.0, 4063.0, 4063.0, 0.09716756546664723, 0.13464919472380119, 0.05626988898605645], "isController": false}, {"data": ["HTTP GET Request 14 for result", 4, 0, 0.0, 555.0, 268, 917, 517.5, 917.0, 917.0, 917.0, 0.0814348826319754, 0.2132098831409434, 0.03968360003257395], "isController": false}, {"data": ["OPEN_VULNERABILITIES - HTTP POST Request 89wait for result", 4, 0, 0.0, 702.0, 268, 1847, 346.5, 1847.0, 1847.0, 1847.0, 1.0430247718383312, 1.4354322848761407, 0.624388852672751], "isController": false}, {"data": ["NONCOMPLIANT_ASSETS_OVERTIME - HTTP POST Request 100 wait for result", 2, 0, 0.0, 404.0, 282, 526, 404.0, 526.0, 526.0, 526.0, 2.398081534772182, 3.1826101618705036, 1.4706984412470026], "isController": false}, {"data": ["HTTP POST Request 1 for running query", 5, 0, 0.0, 2163.8, 1045, 4221, 1443.0, 4221.0, 4221.0, 4221.0, 0.05067909993918508, 0.08078961205148996, 0.04023643383843503], "isController": false}, {"data": ["TOP_NONCOMPLIANT_ASSETS - HTTP POST Request 99wait for result", 2, 0, 0.0, 269.0, 268, 270, 269.0, 270.0, 270.0, 270.0, 3.571428571428571, 4.734584263392857, 2.1728515625], "isController": false}, {"data": ["HTTP GET Request 11 for result", 4, 0, 0.0, 659.0, 262, 1058, 658.0, 1058.0, 1058.0, 1058.0, 0.07339045557125297, 0.0962712201621929, 0.03576351301763206], "isController": false}, {"data": ["HTTP GET Request 12 wait for result", 2, 0, 0.0, 394.0, 292, 496, 394.0, 496.0, 496.0, 496.0, 2.450980392156863, 3.8284600949754903, 1.1465035232843137], "isController": false}, {"data": ["TOP_TO_FIX - HTTP POST Request 88 for running query", 4, 0, 0.0, 762.75, 366, 1823, 431.0, 1823.0, 1823.0, 1823.0, 0.0659510972613807, 0.09216408220804273, 0.037097492209526635], "isController": false}, {"data": ["AVG_CLOSE_TIME - HTTP POST Request 86 for running query", 4, 0, 0.0, 768.75, 367, 1848, 430.0, 1848.0, 1848.0, 1848.0, 0.06339847526666985, 0.08859689268223099, 0.034918691455470496], "isController": false}, {"data": ["COMPLIANCE_SUNBURST - HTTP POST Request 92wait for result", 3, 0, 0.0, 788.3333333333334, 268, 1263, 834.0, 1263.0, 1263.0, 1263.0, 1.2325390304026294, 1.654619453574363, 0.7583003800328677], "isController": false}, {"data": ["HTTP GET Request 13 for result", 4, 0, 0.0, 260.0, 254, 267, 259.5, 267.0, 267.0, 267.0, 0.07574036203893054, 0.10896922692759221, 0.03690863345451791], "isController": false}, {"data": ["VLN_BY_SEVERITY HTTP POST Request 84 for running query", 4, 0, 0.0, 1606.25, 320, 2869, 1618.0, 2869.0, 2869.0, 2869.0, 0.05593623269472801, 0.07816870018179276, 0.031573381345266396], "isController": false}, {"data": ["PUBLISHED_AGE - HTTP POST Request 87 wait for result", 2, 0, 0.0, 391.5, 270, 513, 391.5, 513.0, 513.0, 513.0, 1.8198362147406735, 2.5804708826205642, 1.062755914467698], "isController": false}, {"data": ["COMPLIANCE_SUNBURST - HTTP POST Request 91 for running query", 7, 0, 0.0, 2766.142857142857, 1103, 5592, 3156.0, 5592.0, 5592.0, 5592.0, 0.07432497000456567, 0.10299524651999872, 0.043186872219449786], "isController": false}, {"data": ["COUNTS - HTTP POST Request 81 for running query", 4, 0, 0.0, 4037.0, 1098, 5606, 4722.0, 5606.0, 5606.0, 5606.0, 0.04789501412902916, 0.06693141134632884, 0.025724861104459023], "isController": false}, {"data": ["COMPLIANCE_TABLE_BY_SECTIONS - HTTP POST Request 94 for running query", 7, 0, 0.0, 1358.8571428571427, 321, 3713, 947.0, 3713.0, 3713.0, 3713.0, 0.08353122277777116, 0.11575273937661841, 0.04878092892686245], "isController": false}, {"data": ["COMPLIANCE_TREND - HTTP POST Request 95 for running query", 7, 0, 0.0, 1780.7142857142858, 332, 3526, 2106.0, 3526.0, 3526.0, 3526.0, 0.08503298064892312, 0.11783378861408389, 0.048661451816668894], "isController": false}, {"data": ["PUBLISHED_AGE - HTTP POST Request 87 for running query", 4, 0, 0.0, 2994.5, 1795, 4167, 3008.0, 4167.0, 4167.0, 4167.0, 0.06072014087072682, 0.08485402498633796, 0.03338421807638593], "isController": false}, {"data": ["RESOLVED_VULNERABILITIES - HTTP POST Request 90 wait for result", 1, 0, 0.0, 263.0, 263, 263, 263.0, 263.0, 263.0, 263.0, 3.802281368821293, 4.875386169201521, 2.368999524714829], "isController": false}, {"data": ["HTTP GET Request 12 for result", 4, 0, 0.0, 826.5, 269, 1345, 846.0, 1345.0, 1345.0, 1345.0, 0.07133176403452457, 0.09358811033240602, 0.03476030298166773], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 284, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
