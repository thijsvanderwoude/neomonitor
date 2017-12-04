function refreshStats() {
	
	// Flash the updated sign.
	document.getElementById("refresh").style.opacity = 1;
	document.getElementById("refresh").style.transition = "opacity 100ms linear 0s";
	
	var xml = new XMLHttpRequest();
	
	var pool = url + "stats_address?address=" + address;
	
	xml.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200){
			var response = JSON.parse(this.responseText);
			refreshPageStats(response);
		}
	};
	
	xml.open("GET", pool, true);
	xml.send();

}

// workercreate() - create table for workers
function workercreate(response){
	var workerBar = document.createElement("div");
	workerBar.setAttribute("class", "entry");
	workerBar.setAttribute("id", "workerBar");
	var workerselement = document.getElementById("workers");
	workerselement.appendChild(workerBar);

	var workerbar2 = document.createElement("div");
	workerbar2.setAttribute("class", "entry-title");
	var node = document.createTextNode("Workers");
	workerbar2.appendChild(node);
	workerselement = document.getElementById("workerBar");
	workerselement.appendChild(workerbar2);

	workersInfo = document.createElement("div");
	workersInfo.setAttribute("id", "workersInfo");
	var workerselement = document.getElementById("workers");
	workerselement.appendChild(workersInfo);

	workersTable = document.createElement("table");
	workersTable.setAttribute("id", "workersTable");
	var workerselement = document.getElementById("workersInfo");
	workerselement.appendChild(workersTable);

	workersHead = document.createElement("tr");
	workersHead.setAttribute("id", "workersHead");
	var workerselement = document.getElementById("workersTable");
	workerselement.appendChild(workersHead);

	workerID = document.createElement("th");
	workerID.setAttribute("id", "workerID");
	node = document.createTextNode("Worker ID");
	workerID.appendChild(node);
	var workerselement = document.getElementById("workersHead");
	workerselement.appendChild(workerID);

	workerHashrate = document.createElement("th");
	workerHashrate.setAttribute("id", "workerHashrate");
	node = document.createTextNode("Hashrate");
	workerHashrate.appendChild(node);
	var workerselement = document.getElementById("workersHead");
	workerselement.appendChild(workerHashrate);

	workerHashes = document.createElement("th");
	workerHashes.setAttribute("id", "workerHashes");
	node = document.createTextNode("Hashes");
	workerHashes.appendChild(node);
	var workerselement = document.getElementById("workersHead");
	workerselement.appendChild(workerHashes);

	workerLastShare = document.createElement("th");
	workerLastShare.setAttribute("id", "workerLastShare");
	node = document.createTextNode("Last Share");
	workerLastShare.appendChild(node);
	var workerselement = document.getElementById("workersHead");
	workerselement.appendChild(workerLastShare);
	
	var workerAmount = 0;
	while(response.perWorkerStats[workerAmount]){
		workerAmount++;
	}
	workerAmount--;
	
	var i = 0;
	while(i <= workerAmount){
		
		workersHead = document.createElement("tr");
		var workersData = "worker" + i.toString() + "Data";
		workersHead.setAttribute("id", workersData);
		workersElement = document.getElementById("workersTable");
		workersElement.appendChild(workersHead);
		
		
		workersHead = document.createElement("td");
		var workersXData = "worker" + i.toString() + "ID";
		workersHead.setAttribute("id", workersXData);
		workersElement = document.getElementById(workersData);
		workersElement.appendChild(workersHead);
		
		workersHead = document.createElement("td");
		workersXData = "worker" + i.toString() + "Hashrate";
		workersHead.setAttribute("id", workersXData);
		workersElement = document.getElementById(workersData);
		workersElement.appendChild(workersHead);
		
		workersHead = document.createElement("td");
		workersXData = "worker" + i.toString() + "Hashes";
		workersHead.setAttribute("id", workersXData);
		workersElement = document.getElementById(workersData);
		workersElement.appendChild(workersHead);
		
		workersHead = document.createElement("td");
		workersXData = "worker" + i.toString() + "LastShare";
		workersHead.setAttribute("id", workersXData);
		workersElement = document.getElementById(workersData);
		workersElement.appendChild(workersHead);
		
		i++;
		
	}
}


function refreshPageStats(response) {
	
	if(times == 1){
		workercreate(response);
	}
	times++;
	
	// Initiate as variables for cleaner code.
	var balance = response.stats.balance;
	var hashrate = response.stats.hashrate;
	var lastShare = response.stats.lastShare;
	var totalHashes = response.stats.hashes;
	
	// Sometimes these are not passed, but we need to process them anyway.
	// Balance
	if(balance){
		if(balance.length == 16){
			balance += " XMR";
		} else {
			var add = "";
			var i = balance.length;
			while(i != 12){
				add += "0";
				i++;
			}
			balance = "0." + add + balance + " XMR";
		}		
	} else {
		balance = "0.000000000000 XMR"
	}	
	
	// Hashrate
	if(hashrate){
		hashrate += "/s";
	} else {
		hashrate = "0 H/s";
	}
	
	// Last Share
	if(lastShare){
		lastShare = new Date(parseInt(lastShare) * 1000);
	}
	
	document.getElementById("balance").innerHTML = balance;	// check length, if too short add zeros
	document.getElementById("totalPaid").innerHTML = "0.000000000000 XMR";
	document.getElementById("hashrate").innerHTML = hashrate;
	document.getElementById("lastShare").innerHTML = lastShare;
	document.getElementById("totalHashes").innerHTML = response.stats.hashes;
	document.getElementById("paymentid").innerHTML = "-";	// if doesnt exist, just do "-"
	
	
	// Workers
	if(workers = true){
		var i = 0;
		var workerAmount = 0;
		while(response.perWorkerStats[workerAmount]){
			workerAmount++;
		}
		workerAmount--;
		
		while(i <= workerAmount){
			var iString = i.toString();
			
			// workerxID
			var workerxID = response.perWorkerStats[i].workerId;
			// workerHashrate
			if(response.perWorkerStats[i].hashrate){
				workerxHashrate = response.perWorkerStats[i].hashrate + "/s";
			} else {
				workerxHashrate = "0 H/s";
			}
			// workerxHashes
			var workerxHashes = response.perWorkerStats[i].hashes;
			
			document.getElementById("worker" + iString + "ID").innerHTML = workerxID;
			document.getElementById("worker" + iString + "Hashrate").innerHTML = workerxHashrate;
			document.getElementById("worker" + iString + "Hashes").innerHTML = workerxHashes;
			document.getElementById("worker" + iString + "LastShare").innerHTML = new Date(parseInt(response.perWorkerStats[i].lastShare) * 1000);
			i++;
		}
		
	}
	
	document.getElementById("refresh").style.transition = "opacity " + interval.toString() + "ms linear 0s";
	document.getElementById("refresh").style.opacity = 0;
}
