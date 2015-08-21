var muDB = require('./muDB');

/**********

FixedDataTablePaths
** requires muDB

function(
  cellData: any,
  cellDataKey: string,
  rowData: object,
  rowIndex: number,
  columnData: any,
  width: number
): ?$jsx

****/
var FixedDataTableDB = function() {
	var args = Array.prototype.slice.call(arguments);
	if (args[0] === undefined && typeof args[1] === 'string' && typeof args[2] === 'object') {
		return new muDB(args[2]).get(args[1]);
		/*
		var ret = new muDB(args[2]).get(args[1]);;
		if (ret === null || ret === undefined) { ret = 0; }
		return ret;
		*/
	}
	return args[0];
}

FixedDataTableDB.muDB = muDB; // use outside of FDD

FixedDataTableDB.objectify = function() {
	return {
		cellData: arguments[0],
		cellDataKey: arguments[1],
		rowData: arguments[2],
		rowIndex: arguments[3],
		columnData: arguments[4],
		width: arguments[5]
	}
}

FixedDataTableDB.sortValues = function(stack, CS) {
	
	if (!CS) {
		if (local_debug || window.debug) {
			console.warn('tried to FixedDataTableDB.sortValues with no current_sort (CS)');
		}
		return stack;
	}
	
	stack.sort(function(a, b) {
		
		var oA = new muDB(a)
			, oB = new muDB(b)
			, oAVal = oA.get(CS)
			, oBVal = oB.get(CS)
			, sortType
			;

// really? this easy?
		//return (oAVal === null || oAVal === undefined) ? -1 : (oBVal === null || oBVal === undefined) ? 1 : (typeof oAVal === 'string') ? oAVal.localeCompare(oBVal) : ;
		if (oAVal === null || oAVal === undefined) {
			return -1;
		} else if (oBVal === null || oBVal === undefined) {
			return 1;
		} else if (typeof oAVal === 'string') {
			return oAVal.localeCompare(oBVal);
		} else if (typeof oAVal === 'number' || typeof oAVal === 'boolean') {
			if (oAVal < oBVal) return -1;
			if (oAVal > oBVal) return 1;
		}
		return 0;

/*
		if ((oAVal === undefined || oAVal === null) && (oBVal === undefined || oBVal === null)) {
			//if (local_debug || window.debug) console.log('sorting ['+CS+'] ABORT both are und/null');
			// temp override till we have really clean data
			oAVal = 0;
			oBVal = 0;
		}
		
		sortType = (oAVal === undefined || oAVal === null) ? typeof(oABal) : sortType = typeof(oAVal);
		
		if (sortType == 'number') {
			// temp override till we have really clean data
			if (oAVal === undefined || oAVal === null) oAVal = 0;
			if (oBVal === undefined || oBVal === null) oBVal = 0;
		}
		
		if (local_debug || window.debug) console.log('sorting ['+CS+'] sort type: '+sortType);
		
		if ((oAVal !== undefined && oBVal !== undefined) && (oAVal !== null && oBVal !== null)) {
			if (sortType == 'number') {
				if (oAVal < oBVal) return -1;
				if (oAVal > oBVal) return 1;
			} else if (typeof oAVal == 'string') {
				return oAVal.localeCompare(oBVal);
			}
		}

		return 0;
*/
	});
	
	return stack;
}

FixedDataTableDB.RenderSpecialCell = function() {
	var params = FixedDataTableDB.objectify.apply(null, arguments);
	
	switch (params.cellDataKey) {
		case 'webpage':
			var url = params.cellData || '';
			var shorted = url.replace('http://','').replace('https://','').replace('www.','').split('/')[0];
			return (<a href={url} target="_blank">{shorted}</a>)
			break;

		case 'avatar':
			var url = params.cellData || '';
			var twpage = 'http://twitter.com/' + args[2].name;
			return <a href={twpage} target="_blank"><img src={url} width="32"/></a>
			break;

		case 'hl':
			var url = "http://webapp.e4.r88r.net/v3/stories_by_oid?oids=" + params.rowData.oid; // + "&pretty=1";
			return <a href={url} target="_blank">{params.cellData}</a>
			break;
		
		default:
			return FixedDataTableDB.apply(null, arguments);
			break;
	}
}

module.exports = FixedDataTableDB;
