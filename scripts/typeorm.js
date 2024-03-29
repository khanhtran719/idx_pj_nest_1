/* eslint-disable */
const { spawn } = require('node:child_process');

const argv = process.argv.slice(2);

const typeormCommand =
  'ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js';
const typeormExtensionCommand =
  'ts-node -r tsconfig-paths/register ./node_modules/typeorm-extension/bin/cli.cjs';
const typeormDataSource = '-d ./src/system/dbs/data-source.ts';

const migrationDir = './src/dbs/migrations';

const dbCreateCommand = 'db:create';
const migrationCreateCommand = 'migration:create';
const migrationGenerateCommand = 'migration:generate';
const seedCommand = 'seed:run';
const versionCommand = 'version';

const commands = [
  dbCreateCommand,
  migrationCreateCommand,
  migrationGenerateCommand,
  'migration:revert',
  'migration:run',
  'migration:show',
  seedCommand,
  'cache:clear',
  versionCommand,
];

if (argv.length < 1 || !commands.includes(argv[0])) {
  console.log(
    `Please, choose an option:\n${commands
      .map((command) => `- ${command}`)
      .join('\n')}\n`,
  );
  process.exit(0);
}

let command = '';

if (argv[0] === dbCreateCommand) {
  command = `${typeormExtensionCommand} ${typeormDataSource} ${dbCreateCommand}`;
} else if (argv[0] === migrationGenerateCommand) {
  if (!argv[1]) {
    console.log('Missing name parameter!');
    process.exit(0);
  }

  command = `${typeormCommand} ${typeormDataSource} ${migrationGenerateCommand} ${migrationDir}/${argv[1]}`;
} else if (argv[0] === migrationCreateCommand) {
  if (!argv[1]) {
    console.log('Missing name parameter!');
    process.exit(0);
  }

  command = `${typeormCommand} ${migrationCreateCommand} ${migrationDir}/${argv[1]}`;
} else if (argv[0] === seedCommand) {
  command = [
    typeormExtensionCommand,
    typeormDataSource,
    seedCommand,
    ...process.argv.slice(3),
  ].join(' ');
} else if (argv[0] === versionCommand) {
  command = `typeorm version`;
} else {
  command = [typeormCommand, typeormDataSource, ...argv].join(' ');
}

console.log('> ' + command + '\n');

spawn(command, [], { stdio: 'inherit', shell: true });
