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

    var data = {"OkPercent": 98.20627802690584, "KoPercent": 1.7937219730941705};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9237668161434978, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "COMPLIANCE_TABLE-CheckStatus"], "isController": false}, {"data": [1.0, 500, 1500, "query5-GetResult"], "isController": false}, {"data": [1.0, 500, 1500, "query1-CheckStatus"], "isController": false}, {"data": [1.0, 500, 1500, "query1-GetResult"], "isController": false}, {"data": [0.5, 500, 1500, "COMPLIANCE_TABLE_BY_SECTIONS-RunQuery"], "isController": false}, {"data": [1.0, 500, 1500, "NEW_DAILY_VLN-CheckStatus"], "isController": false}, {"data": [0.5, 500, 1500, "COMPLIANCE_TABLE-RunQuery"], "isController": false}, {"data": [0.5, 500, 1500, "query2-RunQuery"], "isController": false}, {"data": [0.5, 500, 1500, "query4-RunQuery"], "isController": false}, {"data": [0.0, 500, 1500, "COUNTS-RunQuery"], "isController": false}, {"data": [1.0, 500, 1500, "COMPLIANCE_FAILED_RULES_BY_STANDARDS-CheckStatus"], "isController": false}, {"data": [0.5, 500, 1500, "VLN_BY_SEVERITY-RunQuery"], "isController": false}, {"data": [1.0, 500, 1500, "TOP_NONCOMPLIANT_ASSETS-CheckStatus"], "isController": false}, {"data": [1.0, 500, 1500, "TOP_TO_FIX-CheckStatus"], "isController": false}, {"data": [1.0, 500, 1500, "COMPLIANCE_TREND-CheckStatus"], "isController": false}, {"data": [1.0, 500, 1500, "query6-GetResult"], "isController": false}, {"data": [1.0, 500, 1500, "query5-CheckStatus"], "isController": false}, {"data": [1.0, 500, 1500, "query2-GetResult"], "isController": false}, {"data": [1.0, 500, 1500, "query2-CheckStatus"], "isController": false}, {"data": [1.0, 500, 1500, "query6-CheckStatus"], "isController": false}, {"data": [1.0, 500, 1500, "PUBLISHED_AGE-CheckStatus"], "isController": false}, {"data": [0.5, 500, 1500, "NET_NEW-RunQuery"], "isController": false}, {"data": [1.0, 500, 1500, "AVG_CLOSE_TIME-CheckStatus"], "isController": false}, {"data": [1.0, 500, 1500, "query3-CheckStatus"], "isController": false}, {"data": [0.5, 500, 1500, "NONCOMPLIANT_ASSETS_OVERTIME-RunQuery"], "isController": false}, {"data": [1.0, 500, 1500, "COMPLIANCE_TABLE_BY_SECTIONS-CheckStatus"], "isController": false}, {"data": [1.0, 500, 1500, "query4-CheckStatus"], "isController": false}, {"data": [0.5, 500, 1500, "query3-RunQuery"], "isController": false}, {"data": [1.0, 500, 1500, "COMPLIANCE_STANDARDS-CheckStatus"], "isController": false}, {"data": [0.5, 500, 1500, "query6-RunQuery"], "isController": false}, {"data": [1.0, 500, 1500, "NET_NEW-CheckStatus"], "isController": false}, {"data": [1.0, 500, 1500, "CLOSED_DAILY_VLN-CheckStatus"], "isController": false}, {"data": [0.5, 500, 1500, "COMPLIANCE_FAILED_RULES_BY_STANDARDS-RunQuery"], "isController": false}, {"data": [0.5, 500, 1500, "PUBLISHED_AGE-RunQuery"], "isController": false}, {"data": [0.5, 500, 1500, "COMPLIANCE_TREND-RunQuery"], "isController": false}, {"data": [0.5, 500, 1500, "TOP_TO_FIX-RunQuery"], "isController": false}, {"data": [0.5, 500, 1500, "COMPLIANCE_TOP_FAILED_RULES-RunQuery"], "isController": false}, {"data": [0.0, 500, 1500, "COMPLIANCE_SUNBURST-CheckStatus"], "isController": false}, {"data": [0.5, 500, 1500, "NEW_DAILY_VLN-RunQuery"], "isController": false}, {"data": [1.0, 500, 1500, "COMPLIANCE_TOP_FAILED_RULES-CheckStatus"], "isController": false}, {"data": [1.0, 500, 1500, "query3-GetResult"], "isController": false}, {"data": [1.0, 500, 1500, "COUNTS-CheckStatus"], "isController": false}, {"data": [0.5, 500, 1500, "TOP_NONCOMPLIANT_ASSETS-RunQuery"], "isController": false}, {"data": [0.5, 500, 1500, "AVG_CLOSE_TIME-RunQuery"], "isController": false}, {"data": [0.0, 500, 1500, "COMPLIANCE_SUNBURST-RunQuery"], "isController": false}, {"data": [0.5, 500, 1500, "CLOSED_DAILY_VLN-RunQuery"], "isController": false}, {"data": [0.0, 500, 1500, "query1-RunQuery"], "isController": false}, {"data": [0.5, 500, 1500, "query5-RunQuery"], "isController": false}, {"data": [0.5, 500, 1500, "COMPLIANCE_STANDARDS-RunQuery"], "isController": false}, {"data": [1.0, 500, 1500, "NONCOMPLIANT_ASSETS_OVERTIME-CheckStatus"], "isController": false}, {"data": [1.0, 500, 1500, "VLN_BY_SEVERITY-CheckStatus"], "isController": false}, {"data": [1.0, 500, 1500, "query4-GetResult"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 223, 4, 1.7937219730941705, 424.82959641255604, 267, 2109, 303.0, 1136.8, 1185.5999999999997, 2092.52, 4.466073860450212, 7.003176664013058, 2.488208181877353], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["COMPLIANCE_TABLE-CheckStatus", 4, 0, 0.0, 298.25, 283, 313, 298.5, 313.0, 313.0, 313.0, 0.10308481302992037, 0.13794137212328944, 0.06251530165193413], "isController": false}, {"data": ["query5-GetResult", 1, 0, 0.0, 288.0, 288, 288, 288.0, 288.0, 288.0, 288.0, 3.472222222222222, 5.106608072916667, 1.7564561631944446], "isController": false}, {"data": ["query1-CheckStatus", 3, 0, 0.0, 303.0, 276, 348, 285.0, 348.0, 348.0, 348.0, 2.9644268774703555, 4.865442811264822, 1.3866801506916997], "isController": false}, {"data": ["query1-GetResult", 1, 0, 0.0, 294.0, 294, 294, 294.0, 294.0, 294.0, 294.0, 3.401360544217687, 4.9758184523809526, 1.720610119047619], "isController": false}, {"data": ["COMPLIANCE_TABLE_BY_SECTIONS-RunQuery", 2, 0, 0.0, 1211.5, 1162, 1261, 1211.5, 1261.0, 1261.0, 1261.0, 0.05078462241633234, 0.0709695260525113, 0.02965742598141283], "isController": false}, {"data": ["NEW_DAILY_VLN-CheckStatus", 1, 0, 0.0, 320.0, 320, 320, 320.0, 320.0, 320.0, 320.0, 3.125, 4.8919677734375, 1.861572265625], "isController": false}, {"data": ["COMPLIANCE_TABLE-RunQuery", 2, 0, 0.0, 1191.0, 1170, 1212, 1191.0, 1212.0, 1212.0, 1212.0, 0.05067909993918508, 0.07082206251266977, 0.02900190680113521], "isController": false}, {"data": ["query2-RunQuery", 1, 0, 0.0, 1164.0, 1164, 1164, 1164.0, 1164.0, 1164.0, 1164.0, 0.8591065292096219, 1.4942077426975946, 1.2676855133161513], "isController": false}, {"data": ["query4-RunQuery", 1, 0, 0.0, 1145.0, 1145, 1145, 1145.0, 1145.0, 1145.0, 1145.0, 0.8733624454148472, 1.7347843886462881, 1.8934224890829694], "isController": false}, {"data": ["COUNTS-RunQuery", 1, 0, 0.0, 2109.0, 2109, 2109, 2109.0, 2109.0, 2109.0, 2109.0, 0.474158368895211, 0.6681743421052632, 0.25467490516832625], "isController": false}, {"data": ["COMPLIANCE_FAILED_RULES_BY_STANDARDS-CheckStatus", 2, 0, 0.0, 292.5, 288, 297, 292.5, 297.0, 297.0, 297.0, 3.225806451612903, 4.314201108870968, 2.006678427419355], "isController": false}, {"data": ["VLN_BY_SEVERITY-RunQuery", 1, 0, 0.0, 1295.0, 1295, 1295, 1295.0, 1295.0, 1295.0, 1295.0, 0.7722007722007722, 1.088169642857143, 0.435871138996139], "isController": false}, {"data": ["TOP_NONCOMPLIANT_ASSETS-CheckStatus", 4, 0, 0.0, 302.75, 295, 311, 302.5, 311.0, 311.0, 311.0, 3.0257186081694405, 4.1005283188350985, 1.840842473524962], "isController": false}, {"data": ["TOP_TO_FIX-CheckStatus", 60, 0, 0.0, 346.13333333333344, 307, 477, 331.5, 390.8, 403.95, 477.0, 2.698691134799622, 3.5845066314712364, 1.6128896235325867], "isController": false}, {"data": ["COMPLIANCE_TREND-CheckStatus", 3, 0, 0.0, 290.6666666666667, 288, 293, 291.0, 293.0, 293.0, 293.0, 3.260869565217391, 4.387100883152174, 1.9775390625], "isController": false}, {"data": ["query6-GetResult", 1, 0, 0.0, 291.0, 291, 291, 291.0, 291.0, 291.0, 291.0, 3.4364261168384878, 22.960964347079038, 1.7383483676975946], "isController": false}, {"data": ["query5-CheckStatus", 2, 0, 0.0, 321.0, 297, 345, 321.0, 345.0, 345.0, 345.0, 3.0441400304414, 5.016588184931507, 1.4239678462709284], "isController": false}, {"data": ["query2-GetResult", 1, 0, 0.0, 284.0, 284, 284, 284.0, 284.0, 284.0, 284.0, 3.5211267605633805, 6.392358054577465, 1.7811949823943665], "isController": false}, {"data": ["query2-CheckStatus", 58, 0, 0.0, 293.46551724137936, 269, 461, 281.5, 332.90000000000003, 371.45, 461.0, 3.079046557307427, 5.373037854355789, 1.440296192334236], "isController": false}, {"data": ["query6-CheckStatus", 2, 0, 0.0, 285.0, 279, 291, 285.0, 291.0, 291.0, 291.0, 3.4364261168384878, 5.426465850515465, 1.6074688573883162], "isController": false}, {"data": ["PUBLISHED_AGE-CheckStatus", 1, 0, 0.0, 311.0, 311, 311, 311.0, 311.0, 311.0, 311.0, 3.215434083601286, 4.980154742765273, 1.8809033360128617], "isController": false}, {"data": ["NET_NEW-RunQuery", 1, 0, 0.0, 1169.0, 1169, 1169, 1169.0, 1169.0, 1169.0, 1169.0, 0.8554319931565441, 1.205457388793841, 0.4602959260051326], "isController": false}, {"data": ["AVG_CLOSE_TIME-CheckStatus", 1, 0, 0.0, 308.0, 308, 308, 308.0, 308.0, 308.0, 308.0, 3.246753246753247, 4.854276582792208, 1.9023944805194806], "isController": false}, {"data": ["query3-CheckStatus", 22, 0, 0.0, 294.13636363636374, 277, 396, 284.0, 352.59999999999997, 392.99999999999994, 396.0, 2.9439314866854005, 5.474526001940319, 1.3770929512913155], "isController": false}, {"data": ["NONCOMPLIANT_ASSETS_OVERTIME-RunQuery", 1, 0, 0.0, 1168.0, 1168, 1168, 1168.0, 1168.0, 1168.0, 1168.0, 0.8561643835616438, 1.1964562821061644, 0.4958061322773973], "isController": false}, {"data": ["COMPLIANCE_TABLE_BY_SECTIONS-CheckStatus", 11, 0, 0.0, 309.8181818181818, 280, 457, 294.0, 431.2000000000001, 457.0, 457.0, 0.28340289586231776, 0.3878674576183851, 0.17518948543051477], "isController": false}, {"data": ["query4-CheckStatus", 4, 0, 0.0, 285.0, 278, 291, 285.5, 291.0, 291.0, 291.0, 3.369839932603201, 6.752843302443134, 1.5763216090985677], "isController": false}, {"data": ["query3-RunQuery", 1, 0, 0.0, 1161.0, 1161, 1161, 1161.0, 1161.0, 1161.0, 1161.0, 0.8613264427217916, 1.5939586024978467, 1.1052567829457365], "isController": false}, {"data": ["COMPLIANCE_STANDARDS-CheckStatus", 1, 0, 0.0, 280.0, 280, 280, 280.0, 280.0, 280.0, 280.0, 3.571428571428571, 4.600306919642857, 2.162388392857143], "isController": false}, {"data": ["query6-RunQuery", 1, 0, 0.0, 1109.0, 1109, 1109, 1109.0, 1109.0, 1109.0, 1109.0, 0.9017132551848511, 1.368420311091073, 0.5758988954012624], "isController": false}, {"data": ["NET_NEW-CheckStatus", 1, 0, 0.0, 311.0, 311, 311, 311.0, 311.0, 311.0, 311.0, 3.215434083601286, 4.785470257234727, 1.8432224678456592], "isController": false}, {"data": ["CLOSED_DAILY_VLN-CheckStatus", 1, 0, 0.0, 336.0, 336, 336, 336.0, 336.0, 336.0, 336.0, 2.976190476190476, 4.659016927083333, 1.7903645833333333], "isController": false}, {"data": ["COMPLIANCE_FAILED_RULES_BY_STANDARDS-RunQuery", 1, 0, 0.0, 1149.0, 1149, 1149, 1149.0, 1149.0, 1149.0, 1149.0, 0.8703220191470844, 1.2162410248041775, 0.5116541557876414], "isController": false}, {"data": ["PUBLISHED_AGE-RunQuery", 1, 0, 0.0, 1203.0, 1203, 1203, 1203.0, 1203.0, 1203.0, 1203.0, 0.8312551953449709, 1.1713879364089774, 0.45702800290939316], "isController": false}, {"data": ["COMPLIANCE_TREND-RunQuery", 1, 0, 0.0, 1172.0, 1172, 1172, 1172.0, 1172.0, 1172.0, 1172.0, 0.8532423208191127, 1.192372813566553, 0.48828125000000006], "isController": false}, {"data": ["TOP_TO_FIX-RunQuery", 1, 0, 0.0, 1294.0, 1294, 1294, 1294.0, 1294.0, 1294.0, 1294.0, 0.7727975270479134, 1.0890105776661514, 0.4346986089644513], "isController": false}, {"data": ["COMPLIANCE_TOP_FAILED_RULES-RunQuery", 1, 0, 0.0, 1254.0, 1254, 1254, 1254.0, 1254.0, 1254.0, 1254.0, 0.7974481658692185, 1.1144026614832536, 0.46102472089314195], "isController": false}, {"data": ["COMPLIANCE_SUNBURST-CheckStatus", 2, 2, 100.0, 273.5, 267, 280, 273.5, 280.0, 280.0, 280.0, 0.051774573506950736, 0.051268962437546924, 0.029780491987884752], "isController": false}, {"data": ["NEW_DAILY_VLN-RunQuery", 1, 0, 0.0, 1140.0, 1140, 1140, 1140.0, 1140.0, 1140.0, 1140.0, 0.8771929824561404, 1.236122532894737, 0.49170778508771934], "isController": false}, {"data": ["COMPLIANCE_TOP_FAILED_RULES-CheckStatus", 2, 0, 0.0, 287.5, 283, 292, 287.5, 292.0, 292.0, 292.0, 3.33889816360601, 4.465450229549249, 2.044422996661102], "isController": false}, {"data": ["query3-GetResult", 1, 0, 0.0, 299.0, 299, 299, 299.0, 299.0, 299.0, 299.0, 3.3444816053511706, 10.863033026755854, 1.69183737458194], "isController": false}, {"data": ["COUNTS-CheckStatus", 1, 0, 0.0, 299.0, 299, 299, 299.0, 299.0, 299.0, 299.0, 3.3444816053511706, 5.300872700668896, 1.9139318561872911], "isController": false}, {"data": ["TOP_NONCOMPLIANT_ASSETS-RunQuery", 1, 0, 0.0, 1209.0, 1209, 1209, 1209.0, 1209.0, 1209.0, 1209.0, 0.8271298593879239, 1.1558816687344913, 0.4749534739454094], "isController": false}, {"data": ["AVG_CLOSE_TIME-RunQuery", 1, 0, 0.0, 1165.0, 1165, 1165, 1165.0, 1165.0, 1165.0, 1165.0, 0.8583690987124463, 1.2095962982832618, 0.4727736051502146], "isController": false}, {"data": ["COMPLIANCE_SUNBURST-RunQuery", 2, 2, 100.0, 1586.5, 1082, 2091, 1586.5, 2091.0, 2091.0, 2091.0, 0.04918355301987015, 0.048703244884910485, 0.0283381799626205], "isController": false}, {"data": ["CLOSED_DAILY_VLN-RunQuery", 1, 0, 0.0, 1189.0, 1189, 1189, 1189.0, 1189.0, 1189.0, 1189.0, 0.8410428931875525, 1.185180561396131, 0.47637195121951215], "isController": false}, {"data": ["query1-RunQuery", 1, 0, 0.0, 2093.0, 2093, 2093, 2093.0, 2093.0, 2093.0, 2093.0, 0.47778308647873863, 0.7759309304825609, 0.3798002269469661], "isController": false}, {"data": ["query5-RunQuery", 1, 0, 0.0, 1122.0, 1122, 1122, 1122.0, 1122.0, 1122.0, 1122.0, 0.8912655971479501, 1.4465658422459893, 0.7058753899286987], "isController": false}, {"data": ["COMPLIANCE_STANDARDS-RunQuery", 1, 0, 0.0, 1132.0, 1132, 1132, 1132.0, 1132.0, 1132.0, 1132.0, 0.8833922261484098, 1.234506128533569, 0.5046723166961131], "isController": false}, {"data": ["NONCOMPLIANT_ASSETS_OVERTIME-CheckStatus", 4, 0, 0.0, 291.5, 284, 300, 291.0, 300.0, 300.0, 300.0, 3.286770747740345, 4.434251746096959, 2.0157148726376333], "isController": false}, {"data": ["VLN_BY_SEVERITY-CheckStatus", 1, 0, 0.0, 331.0, 331, 331, 331.0, 331.0, 331.0, 331.0, 3.0211480362537766, 4.7323451661631415, 1.8115086858006042], "isController": false}, {"data": ["query4-GetResult", 1, 0, 0.0, 287.0, 287, 287, 287.0, 287.0, 287.0, 287.0, 3.484320557491289, 5.331963196864112, 1.7625762195121952], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 4, 100.0, 1.7937219730941705], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 223, 4, "400/Bad Request", 4, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["COMPLIANCE_SUNBURST-CheckStatus", 2, 2, "400/Bad Request", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["COMPLIANCE_SUNBURST-RunQuery", 2, 2, "400/Bad Request", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
