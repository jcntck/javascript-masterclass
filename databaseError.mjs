export default class DatabaseError {
  constructor(statement) {
    this.statement = statement;
    this.message = `Syntax error: '${this.statement}'`;
  }
}
