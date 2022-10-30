const command =
  "create table author (id number, name string, age number, city string, state string, country string)";

const regExp = /^create table ([a-zA-Z]+) \((.+)\)/;

const result = command.match(regExp);

const tableName = result[1];
const columns = result[2].split(", ");

const database = {
  tables: {
    [tableName]: {
      columns: {},
      data: [],
    },
  },
};

for (const column of columns) {
  const [key, value] = column.split(" ");
  database.tables[tableName].columns[key] = value;
}

console.log(JSON.stringify(database, null, 2));
