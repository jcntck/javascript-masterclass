import Database from "./database.mjs";

let database = new Database();
database
  .execute(
    "create table author (id number, name string, age number, city string, state string, country string)"
  )
  .then(() =>
    Promise.all([
      database.execute(
        "insert into author (id, name, age) values (1, Douglas Crockford, 62)"
      ),
      database.execute(
        "insert into author (id, name, age) values (2, Linus Torvalds, 47)"
      ),
      database.execute(
        "insert into author (id, name, age) values (3, Martin Fowler, 54)"
      ),
    ]).then(() =>
      database
        .execute("select name, age from author")
        .then((data) => console.log(toJSON(data)))
    )
  )
  .catch((error) => console.log(error.message));

// database.execute("delete from author where id = 2");

function toJSON(object) {
  return JSON.stringify(object, undefined, 2);
}
