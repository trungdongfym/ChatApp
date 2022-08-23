type dataType = 'String' | 'Object' | 'Function' | 'Undefined' | 'Null' | 'Number' | 'Symbol';

function checkType(data: any): dataType {
   return Object.prototype.toString.call(data).slice(8, -1) as dataType;
}

export { checkType };
