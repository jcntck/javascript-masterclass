const DatabaseError = function (statement) {
  this.statement = statement;
  this.message = `Syntax error: '${this.statement}'`;
};

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
    } else {
      throw new DatabaseError(statement);
    }
  },
  tables: {},
};

try {
  database.execute(
    "create table author (id number, name string, age number, city string, state string, country string)"
  );
  database.execute("select id, name from author");
  console.log(JSON.stringify(database, null, 2));
} catch (error) {
  console.error(error.message);
}
