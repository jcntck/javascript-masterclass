const command =
  "create table author (id number, name string, age number, city string, state string, country string)";

const regExp = /^create table ([a-zA-Z]+) \((.+)\)/;

const result = command.match(regExp);

const tableName = result[1];
const columns = result[2].split(", ");

console.log(tableName);
console.log(columns);
