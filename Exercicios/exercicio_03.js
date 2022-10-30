const database = {
  createTable(statement) {
    const regExp = /^create table ([a-zA-Z]+) \((.+)\)/;

    const result = statement.match(regExp);

    const tableName = result[1];
    const columns = result[2].split(", ");

    this.tables[tableName] = {
      columns: {},
      data: [],
    };

    for (const column of columns) {
      const [key, value] = column.split(" ");
      this.tables[tableName].columns[key] = value;
    }

    return this;
  },
  execute(statement) {
    if (statement.startsWith("create table")) {
      return this.createTable(statement);
    }
  },
  tables: {},
};

const result = database.execute(
  "create table author (id number, name string, age number, city string, state string, country string)"
);
console.log(JSON.stringify(result, null, 2));
