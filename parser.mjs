export class Parser {
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
