function deleteInvalidPropertyInObject(data = {}, blackListFields = []) {
  let nullishData = ["", " ", "0", 0, null, undefined];
  Object.keys(data).forEach((key) => {
    if (blackListFields.includes(key)) delete data[key];
    if (typeof data[key] == "string") data[key] = data[key].trim();
    if (Array.isArray(data[key]) && data[key].length > 0)
      data[key] = data[key].map((item) => item.trim());
    if (Array.isArray(data[key]) && data[key].length == 0) delete data[key];
    if (nullishData.includes(data[key])) delete data[key];
  });
}

function copyObject(object) {
  return JSON.parse(JSON.stringify(object));
}

function convertTOObject(value) {
  if (typeof value == "object") {
    return value;
  }
  if (typeof value == "string" && value.charAt(0) === "{") {
    return JSON.parse(value);
  }
  return null;
}

function parseLiteral(valueNode){
    switch(valueNode.kind) {
        case Kind.STRING:
            return valueNode.value.charAt(0) === '{'? JSON.parse(valueNode.value): valueNode.value
        case Kind.INT:
        case Kind.FLOAT:
            return Number(valueNode.value)
        case Kind.OBJECT: 
                
    }
}

module.exports = {
  deleteInvalidPropertyInObject,
  copyObject,
  convertTOObject,
  parseLiteral
};
