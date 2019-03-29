'use strict'; 

const exception = require('./exceptions')('LOOK');
const arrays = require('./arrays'); 
const strings = require('./strings'); 

/** ===============================================================================================
 * @name LookupTable 
 * 
 * @description a simple string lookup table 
 * 
 * @author John R. Kosinski
 * 11 May 2018
 */
function LookupTable(table, options) {
    const _this = this; 
    let _table = table; 
    let _ignoreOrder = false; 
    let _valueCompare = null;

    /** 
     * @description
     * @param {*} value
     * @param {*} tableValue
     */ 
    const isMatch = (value, tableValue) => {
        return exception.try(() => {
            if (_valueCompare) {
                return _valueCompare(value, tableValue); 
            }
            else {
                if (value.endsWith("*")) {
                    return (tableValue && tableValue.startsWith(value)); 
                }
                else if (value.startsWith("*")) {
                    return (tableValue && tableValue.endsWith(value)); 
                }
                else {
                    return (value === tableValue);
                }
            }
        });
    }; 

    /** 
     * @description
     * @param {*} table
     * @param {*} options
     */ 
    const ctor = (table, options) => {
        if (options) {
            if (options.ignoreOrder) 
                _ignoreOrder = true; 
            if (options.valueCompare) 
                _valueCompare = options.valueCompare; 
        }
    }

    /** 
     * @description
     * @param {*} row
     */ 
    this.addRow = (row) => {
        exception.try(() => {
            table.push(row); 
        });
    }; 

    /** 
     * @description
     * @param {*} values
     */ 
    this.lookup = (values) => {
        return exception.try(() => {
            if (_ignoreOrder) {
                for (let i=0; i<_table.length; i++) {
                    const rowClone = arrays.copy(_table[i]); 
                    for (let n=0; n<values.length; n++) {
                        let index = arrays.indexOf(rowClone, (r) => { return isMatch(values[n], r)});
                        if (index >= 0 && index < rowClone.length-1) {
                            arrays.removeAt(rowClone, index); 
                        }
                        else{
                            continue;
                        }
                    }
                    if (rowClone.length === 1)
                        return rowClone[0]; 
                }

                return null;
            }
            else {
                for (let i=0; i<_table.length; i++) {
                    const row = _table[i]; 
                    let match = true;

                    for (let n=0; n<values.length; n++) {
                        if (!isMatch(values[n], row[n])) {
                            match = false; 
                        }
                    }

                    if (match){
                        return row[row.length-1]; 
                    }
                }
            }

            return null;
        });
    }; 

    ctor(table, options); 
}; 

module.exports = LookupTable;