class DatabaseError {
  constructor(statement) {
    this.statement = statement;
    this.message = `Syntax error: '${this.statement}'`;
  }
}

class Parser {
  constructor() {
    this.commands = new Map([
      ["createTable", /^create table ([a-zA-Z]+) \((.+)\)/],
      ["insert", /^insert into ([a-zA-Z]+) \((.+)\) values \((.+)\)/],
      ["select", /^select (.+) from ([a-zA-Z]+)(?: where (.+))?/],
      ["delete", /^delete from ([a-zA-Z]+)(?: where (.+))?/],
    ]);
  }

  parse(statement) {
    for (let [command, regExp] of this.commands) {
      const parsedStatement = statement.match(regExp);
      if (parsedStatement) {
        return {
          command,
          parsedStatement,
        };
      }
    }
  }
}

class Database {
  constructor() {
    this.tables = {};
    this.parser = new Parser();
  }

  createTable(parsedStatement) {
    let [, tableName, columns] = parsedStatement;
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
  }

  insert(parsedStatement) {
    let [, tableName, columns, values] = parsedStatement;
    columns = columns.split(", ");
    values = values.split(", ");

    const row = {};
    for (let i = 0; i < columns.length; i++) {
      row[columns[i]] = values[i];
    }

    this.tables[tableName].data.push(row);

    return this;
  }

  select(parsedStatement) {
    let [, columns, tableName, clauseWhere] = parsedStatement;
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
  }

  delete(parsedStatement) {
    const [, tableName, whereClause] = parsedStatement;
    if (whereClause) {
      const [columnWhere, valueWhere] = whereClause.split(" = ");
      this.tables[tableName].data = this.tables[tableName].data.filter(
        (row) => row[columnWhere] !== valueWhere
      );
    } else {
      this.tables[tableName].data = [];
    }
    return this;
  }

  execute(statement) {
    try {
      const { command, parsedStatement } = this.parser.parse(statement);
      return this[command](parsedStatement);
    } catch (error) {
      throw new DatabaseError(statement);
    }
  }
}

try {
  let database = new Database();
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