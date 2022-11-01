export class DatabaseError {
  constructor(statement) {
    this.statement = statement;
    this.message = `Syntax error: '${this.statement}'`;
  }
}
