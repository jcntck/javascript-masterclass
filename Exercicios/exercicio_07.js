const DatabaseError = function (statement) {
  this.statement = statement;
  this.message = `Syntax error: '${this.statement}'`;
};

const database = {
  tables: {},
  createTable(statement) {
    const regExp = /^create table ([a-zA-Z]+) \((.+)\)/;

    const result = statement.match(regExp);

    let [, tableName, columns] = result;
    columns = columns.split(", ");

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
  insert(statement) {
    const regExp = /^insert into ([a-zA-Z]+) \((.+)\) values \((.+)\)/;

    const result = statement.match(regExp);

    let [, tableName, columns, values] = result;
    columns = columns.split(", ");
    values = values.split(", ");

    const row = {};
    for (let i = 0; i < columns.length; i++) {
      row[columns[i]] = values[i];
    }

    this.tables[tableName].data.push(row);

    return this;
  },
  select(statement) {
    const regExp = /^select (.+) from ([a-zA-Z]+)(?: where (.+))?/;

    const result = statement.match(regExp);

    let [, columns, tableName, clauseWhere] = result;
    columns = columns.split(", ");

    let data = this.tables[tableName].data;
    if (clauseWhere) {
      const [columnWhere, valueWhere] = clauseWhere.split(" = ");
      data = data.filter((data) => data[columnWhere] === valueWhere);
    }

    return data.map((row) => {
      const response = {};
      columns.forEach((column) => {
        response[column] = row[column];
      });
      return response;
    });
  },
  delete(statement) {
    const regExp = /^delete from ([a-zA-Z]+)(?: where (.+))?/;
    const result = statement.match(regExp);
    const [, tableName, whereClause] = result;
    if (whereClause) {
      const [columnWhere, valueWhere] = whereClause.split(" = ");
      this.tables[tableName].data = this.tables[tableName].data.filter(
        (row) => row[columnWhere] !== valueWhere
      );
    } else {
      this.tables[tableName].data = [];
    }
    return this;
  },
  execute(statement) {
    if (statement.startsWith("create table")) {
      return this.createTable(statement);
    }

    if (statement.startsWith("insert into")) {
      return this.insert(statement);
    }

    if (statement.startsWith("select")) {
      return this.select(statement);
    }

    if (statement.startsWith("delete from")) {
      return this.delete(statement);
    }

    throw new DatabaseError(statement);
  },
};

try {
  database.execute(
    "create table author (id number, name string, age number, city string, state string, country string)"
  );
  database.execute(
    "insert into author (id, name, age) values (1, Douglas Crockford, 62)"
  );
  database.execute(
    "insert into author (id, name, age) values (2, Linus Torvalds, 47)"
  );
  database.execute(
    "insert into author (id, name, age) values (3, Martin Fowler, 54)"
  );
  database.execute("delete from author where id = 2");
  console.log(
    JSON.stringify(
      database.execute("select name, age from author"),
      undefined,
      2
    )
  );
  // console.log(JSON.stringify(database, null, 2));
} catch (error) {
  console.error(error.message);
}
