const { exec } = require("node:child_process");

const dotenv = require("dotenv");
dotenv.config({
  path: ".env.example",
});

function checkPostgres() {
  exec(
    `docker exec postgres-dev pg_isready --host ${process.env.POSTGRES_HOST}`,
    handleReturn,
  );

  function handleReturn(error, stdout) {
    if (stdout.search("accepting connections") === -1) {
      process.stdout.write(".");
      checkPostgres();
      return;
    }

    console.log("\n🟢 Postgres is ready\n");
  }
}

process.stdout.write("🔴 Awaiting for postgres");
checkPostgres();