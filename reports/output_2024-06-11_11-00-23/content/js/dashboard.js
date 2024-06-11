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

    var data = {"OkPercent": 76.97368421052632, "KoPercent": 23.026315789473685};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.680921052631579, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "COMPLIANCE_STANDARDS-CheckStatus"], "isController": false}, {"data": [1.0, 500, 1500, "NET_NEW-CheckStatus"], "isController": false}, {"data": [1.0, 500, 1500, "COMPLIANCE_TABLE-CheckStatus"], "isController": false}, {"data": [1.0, 500, 1500, "CLOSED_DAILY_VLN-CheckStatus"], "isController": false}, {"data": [0.0, 500, 1500, "query1\"SELECT CASE WHEN max(upt_gateway_time) IS NOT NULL THEN to_unixtime (LOCALTIMESTAMP) - to_unixtime (max(upt_gateway_time)) ELSE - 1 END FROM process_open_sockets WHERE upt_day >= CAST(date_format (CURRENT_DATE - INTERVAL '14'day, '%Y%m%d') AS INTEGER)\"-RunQuery"], "isController": false}, {"data": [0.5, 500, 1500, "COMPLIANCE_FAILED_RULES_BY_STANDARDS-RunQuery"], "isController": false}, {"data": [0.0, 500, 1500, "PUBLISHED_AGE-RunQuery"], "isController": false}, {"data": [0.5, 500, 1500, "COMPLIANCE_TABLE_BY_SECTIONS-RunQuery"], "isController": false}, {"data": [0.5, 500, 1500, "COMPLIANCE_TREND-RunQuery"], "isController": false}, {"data": [1.0, 500, 1500, "NEW_DAILY_VLN-CheckStatus"], "isController": false}, {"data": [0.5, 500, 1500, "COMPLIANCE_TOP_FAILED_RULES-RunQuery"], "isController": false}, {"data": [0.5, 500, 1500, "TOP_TO_FIX-RunQuery"], "isController": false}, {"data": [0.5, 500, 1500, "COMPLIANCE_TABLE-RunQuery"], "isController": false}, {"data": [0.9, 500, 1500, "COMPLIANCE_SUNBURST-CheckStatus"], "isController": false}, {"data": [0.5, 500, 1500, "NEW_DAILY_VLN-RunQuery"], "isController": false}, {"data": [1.0, 500, 1500, "COMPLIANCE_TOP_FAILED_RULES-CheckStatus"], "isController": false}, {"data": [0.0, 500, 1500, "COUNTS-RunQuery"], "isController": false}, {"data": [0.0, 500, 1500, "query1\"SELECT CASE WHEN max(upt_gateway_time) IS NOT NULL THEN to_unixtime (LOCALTIMESTAMP) - to_unixtime (max(upt_gateway_time)) ELSE - 1 END FROM process_open_sockets WHERE upt_day >= CAST(date_format (CURRENT_DATE - INTERVAL '14'day, '%Y%m%d') AS INTEGER)\"-CheckStatus"], "isController": false}, {"data": [1.0, 500, 1500, "COMPLIANCE_FAILED_RULES_BY_STANDARDS-CheckStatus"], "isController": false}, {"data": [1.0, 500, 1500, "COUNTS-CheckStatus"], "isController": false}, {"data": [0.5, 500, 1500, "TOP_NONCOMPLIANT_ASSETS-RunQuery"], "isController": false}, {"data": [0.5, 500, 1500, "AVG_CLOSE_TIME-RunQuery"], "isController": false}, {"data": [0.5, 500, 1500, "VLN_BY_SEVERITY-RunQuery"], "isController": false}, {"data": [1.0, 500, 1500, "TOP_NONCOMPLIANT_ASSETS-CheckStatus"], "isController": false}, {"data": [0.25, 500, 1500, "COMPLIANCE_SUNBURST-RunQuery"], "isController": false}, {"data": [0.5, 500, 1500, "CLOSED_DAILY_VLN-RunQuery"], "isController": false}, {"data": [0.9727272727272728, 500, 1500, "TOP_TO_FIX-CheckStatus"], "isController": false}, {"data": [1.0, 500, 1500, "COMPLIANCE_TREND-CheckStatus"], "isController": false}, {"data": [0.5, 500, 1500, "COMPLIANCE_STANDARDS-RunQuery"], "isController": false}, {"data": [1.0, 500, 1500, "PUBLISHED_AGE-CheckStatus"], "isController": false}, {"data": [1.0, 500, 1500, "NONCOMPLIANT_ASSETS_OVERTIME-CheckStatus"], "isController": false}, {"data": [1.0, 500, 1500, "VLN_BY_SEVERITY-CheckStatus"], "isController": false}, {"data": [0.5, 500, 1500, "NET_NEW-RunQuery"], "isController": false}, {"data": [1.0, 500, 1500, "AVG_CLOSE_TIME-CheckStatus"], "isController": false}, {"data": [0.0, 500, 1500, "NONCOMPLIANT_ASSETS_OVERTIME-RunQuery"], "isController": false}, {"data": [1.0, 500, 1500, "COMPLIANCE_TABLE_BY_SECTIONS-CheckStatus"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 152, 35, 23.026315789473685, 711.7828947368419, 277, 2834, 369.0, 1475.6000000000001, 1844.9999999999989, 2755.0299999999997, 2.97951582867784, 82.6173597838871, 1.6662531853376459], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["COMPLIANCE_STANDARDS-CheckStatus", 3, 0, 0.0, 292.0, 284, 299, 293.0, 299.0, 299.0, 299.0, 3.257328990228013, 4.382337472855592, 1.9722109120521172], "isController": false}, {"data": ["NET_NEW-CheckStatus", 1, 0, 0.0, 304.0, 304, 304, 304.0, 304.0, 304.0, 304.0, 3.289473684210526, 4.898874383223684, 1.8856650904605263], "isController": false}, {"data": ["COMPLIANCE_TABLE-CheckStatus", 6, 0, 0.0, 289.6666666666667, 284, 298, 289.0, 298.0, 298.0, 298.0, 0.14620595545591888, 0.19672601460841174, 0.08866591634582582], "isController": false}, {"data": ["CLOSED_DAILY_VLN-CheckStatus", 1, 0, 0.0, 318.0, 318, 318, 318.0, 318.0, 318.0, 318.0, 3.1446540880503147, 4.916592963836478, 1.8917059748427674], "isController": false}, {"data": ["query1\"SELECT CASE WHEN max(upt_gateway_time) IS NOT NULL THEN to_unixtime (LOCALTIMESTAMP) - to_unixtime (max(upt_gateway_time)) ELSE - 1 END FROM process_open_sockets WHERE upt_day >= CAST(date_format (CURRENT_DATE - INTERVAL '14'day, '%Y%m%d') AS INTEGER)\"-RunQuery", 1, 1, 100.0, 2481.0, 2481, 2481, 2481.0, 2481.0, 2481.0, 2481.0, 0.40306328093510685, 0.38613777206771466, 0.22396778012898025], "isController": false}, {"data": ["COMPLIANCE_FAILED_RULES_BY_STANDARDS-RunQuery", 1, 0, 0.0, 1221.0, 1221, 1221, 1221.0, 1221.0, 1221.0, 1221.0, 0.819000819000819, 1.1445216523341522, 0.48148290335790334], "isController": false}, {"data": ["PUBLISHED_AGE-RunQuery", 1, 0, 0.0, 2152.0, 2152, 2152, 2152.0, 2152.0, 2152.0, 2152.0, 0.4646840148698885, 0.6548232748605948, 0.2554854495817844], "isController": false}, {"data": ["COMPLIANCE_TABLE_BY_SECTIONS-RunQuery", 1, 0, 0.0, 1183.0, 1183, 1183, 1183.0, 1183.0, 1183.0, 1183.0, 0.8453085376162299, 1.1812856614539307, 0.493646978021978], "isController": false}, {"data": ["COMPLIANCE_TREND-RunQuery", 1, 0, 0.0, 1165.0, 1165, 1165, 1165.0, 1165.0, 1165.0, 1165.0, 0.8583690987124463, 1.1995372854077253, 0.49121512875536477], "isController": false}, {"data": ["NEW_DAILY_VLN-CheckStatus", 1, 0, 0.0, 306.0, 306, 306, 306.0, 306.0, 306.0, 306.0, 3.2679738562091503, 5.109400531045751, 1.9467422385620916], "isController": false}, {"data": ["COMPLIANCE_TOP_FAILED_RULES-RunQuery", 1, 0, 0.0, 1181.0, 1181, 1181, 1181.0, 1181.0, 1181.0, 1181.0, 0.8467400508044031, 1.1832861452159187, 0.4895215918712955], "isController": false}, {"data": ["TOP_TO_FIX-RunQuery", 1, 0, 0.0, 1251.0, 1251, 1251, 1251.0, 1251.0, 1251.0, 1251.0, 0.7993605115907274, 1.1264425959232616, 0.4496402877697842], "isController": false}, {"data": ["COMPLIANCE_TABLE-RunQuery", 2, 0, 0.0, 1201.5, 1193, 1210, 1201.5, 1210.0, 1210.0, 1210.0, 0.04876740386725512, 0.06815054192777548, 0.02790790885372217], "isController": false}, {"data": ["COMPLIANCE_SUNBURST-CheckStatus", 5, 0, 0.0, 424.6, 279, 771, 348.0, 771.0, 771.0, 771.0, 0.12321947853516683, 0.16473385362758144, 0.07508686973236729], "isController": false}, {"data": ["NEW_DAILY_VLN-RunQuery", 1, 0, 0.0, 1181.0, 1181, 1181, 1181.0, 1181.0, 1181.0, 1181.0, 0.8467400508044031, 1.1932088801862828, 0.47463748941574935], "isController": false}, {"data": ["COMPLIANCE_TOP_FAILED_RULES-CheckStatus", 4, 0, 0.0, 295.25, 288, 302, 295.5, 302.0, 302.0, 302.0, 3.2414910858995136, 4.37158123987034, 1.9847801863857375], "isController": false}, {"data": ["COUNTS-RunQuery", 1, 0, 0.0, 2834.0, 2834, 2834, 2834.0, 2834.0, 2834.0, 2834.0, 0.35285815102328866, 0.49724053899082565, 0.18952342095977417], "isController": false}, {"data": ["query1\"SELECT CASE WHEN max(upt_gateway_time) IS NOT NULL THEN to_unixtime (LOCALTIMESTAMP) - to_unixtime (max(upt_gateway_time)) ELSE - 1 END FROM process_open_sockets WHERE upt_day >= CAST(date_format (CURRENT_DATE - INTERVAL '14'day, '%Y%m%d') AS INTEGER)\"-CheckStatus", 34, 34, 100.0, 1330.7352941176468, 948, 2685, 1224.5, 1739.0, 2562.75, 2685.0, 0.703424019861384, 83.88723395313954, 0.30431332109237613], "isController": false}, {"data": ["COMPLIANCE_FAILED_RULES_BY_STANDARDS-CheckStatus", 4, 0, 0.0, 293.25, 288, 306, 289.5, 306.0, 306.0, 306.0, 3.2102728731942216, 4.330263091894061, 1.9970154494382022], "isController": false}, {"data": ["COUNTS-CheckStatus", 1, 0, 0.0, 323.0, 323, 323, 323.0, 323.0, 323.0, 323.0, 3.0959752321981426, 4.910023219814241, 1.7717202012383901], "isController": false}, {"data": ["TOP_NONCOMPLIANT_ASSETS-RunQuery", 1, 0, 0.0, 1210.0, 1210, 1210, 1210.0, 1210.0, 1210.0, 1210.0, 0.8264462809917356, 1.1549263946280992, 0.47456095041322316], "isController": false}, {"data": ["AVG_CLOSE_TIME-RunQuery", 1, 0, 0.0, 1157.0, 1157, 1157, 1157.0, 1157.0, 1157.0, 1157.0, 0.8643042350907519, 1.2179599719101124, 0.4760425669835782], "isController": false}, {"data": ["VLN_BY_SEVERITY-RunQuery", 1, 0, 0.0, 1248.0, 1248, 1248, 1248.0, 1248.0, 1248.0, 1248.0, 0.8012820512820512, 1.129150390625, 0.4522861578525641], "isController": false}, {"data": ["TOP_NONCOMPLIANT_ASSETS-CheckStatus", 5, 0, 0.0, 294.6, 280, 300, 298.0, 300.0, 300.0, 300.0, 3.170577045022194, 4.28523303741281, 1.92897412016487], "isController": false}, {"data": ["COMPLIANCE_SUNBURST-RunQuery", 2, 0, 0.0, 1861.5, 1151, 2572, 1861.5, 2572.0, 2572.0, 2572.0, 0.04772358499570488, 0.06669184582895867, 0.027450382385224778], "isController": false}, {"data": ["CLOSED_DAILY_VLN-RunQuery", 1, 0, 0.0, 1201.0, 1201, 1201, 1201.0, 1201.0, 1201.0, 1201.0, 0.8326394671107411, 1.1733386240632806, 0.47161219816819316], "isController": false}, {"data": ["TOP_TO_FIX-CheckStatus", 55, 0, 0.0, 356.20000000000016, 303, 609, 323.0, 456.8, 505.4, 609.0, 2.6327126513809773, 3.5024614367430953, 1.5734571705519125], "isController": false}, {"data": ["COMPLIANCE_TREND-CheckStatus", 4, 0, 0.0, 294.5, 286, 300, 296.0, 300.0, 300.0, 300.0, 3.0935808197989174, 4.172859870456303, 1.8760875870069607], "isController": false}, {"data": ["COMPLIANCE_STANDARDS-RunQuery", 1, 0, 0.0, 1161.0, 1161, 1161, 1161.0, 1161.0, 1161.0, 1161.0, 0.8613264427217916, 1.2036700581395348, 0.4920663759689922], "isController": false}, {"data": ["PUBLISHED_AGE-CheckStatus", 1, 0, 0.0, 311.0, 311, 311, 311.0, 311.0, 311.0, 311.0, 3.215434083601286, 4.980154742765273, 1.8809033360128617], "isController": false}, {"data": ["NONCOMPLIANT_ASSETS_OVERTIME-CheckStatus", 3, 0, 0.0, 315.0, 287, 364, 294.0, 364.0, 364.0, 364.0, 3.054989816700611, 4.109120417515275, 1.8735679735234216], "isController": false}, {"data": ["VLN_BY_SEVERITY-CheckStatus", 1, 0, 0.0, 322.0, 322, 322, 322.0, 322.0, 322.0, 322.0, 3.105590062111801, 4.870681288819876, 1.8621409161490683], "isController": false}, {"data": ["NET_NEW-RunQuery", 1, 0, 0.0, 1189.0, 1189, 1189, 1189.0, 1189.0, 1189.0, 1189.0, 0.8410428931875525, 1.185180561396131, 0.45255335365853655], "isController": false}, {"data": ["AVG_CLOSE_TIME-CheckStatus", 1, 0, 0.0, 302.0, 302, 302, 302.0, 302.0, 302.0, 302.0, 3.3112582781456954, 4.9507191639072845, 1.9401903973509935], "isController": false}, {"data": ["NONCOMPLIANT_ASSETS_OVERTIME-RunQuery", 1, 0, 0.0, 1975.0, 1975, 1975, 1975.0, 1975.0, 1975.0, 1975.0, 0.5063291139240507, 0.7075751582278481, 0.2932159810126582], "isController": false}, {"data": ["COMPLIANCE_TABLE_BY_SECTIONS-CheckStatus", 2, 0, 0.0, 283.0, 277, 289, 283.0, 289.0, 289.0, 289.0, 3.316749585406302, 4.435828669154229, 2.0502953980099505], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500/Internal Server Error", 1, 2.857142857142857, 0.6578947368421053], "isController": false}, {"data": ["Assertion failed", 34, 97.14285714285714, 22.36842105263158], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 152, 35, "Assertion failed", 34, "500/Internal Server Error", 1, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["query1\"SELECT CASE WHEN max(upt_gateway_time) IS NOT NULL THEN to_unixtime (LOCALTIMESTAMP) - to_unixtime (max(upt_gateway_time)) ELSE - 1 END FROM process_open_sockets WHERE upt_day >= CAST(date_format (CURRENT_DATE - INTERVAL '14'day, '%Y%m%d') AS INTEGER)\"-RunQuery", 1, 1, "500/Internal Server Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["query1\"SELECT CASE WHEN max(upt_gateway_time) IS NOT NULL THEN to_unixtime (LOCALTIMESTAMP) - to_unixtime (max(upt_gateway_time)) ELSE - 1 END FROM process_open_sockets WHERE upt_day >= CAST(date_format (CURRENT_DATE - INTERVAL '14'day, '%Y%m%d') AS INTEGER)\"-CheckStatus", 34, 34, "Assertion failed", 34, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
