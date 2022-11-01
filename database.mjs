import DatabaseError from "./databaseError.mjs";
import Parser from "./parser.mjs";

export default class Database {
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
