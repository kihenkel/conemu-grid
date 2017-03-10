# conemu-grid
A Node.js application to open multiple consoles in ConEmu.

The application reads from a `config` folder which is on gitignore and which you have to provide. All you have to do is create an `config/index.js`. It can look like this:

## `config/index.js`
```javascript
const APPS = [
  'C:/apps/my-apps/foo',
  'C:/apps/my-apps/bar',
  'C:/apps/my-apps/baz',
];

const ConEmuPath = 'C:/Program Files (x86)/ConEmu/ConEmu64.exe';

const Methods = {
  'serve': {
    services: APPS,
    runCommand: 'npm run serve',
    getDisplayName: app => app.toUpperCase()
  },
  'build': {
    services: APPS,
    runCommand: 'timeout <%SLEEP%> & npm run serve',
    prepareCommand: (command, index) => command.replace('<%SLEEP%>', index * 3),
    exitAfterExecution: true,
    getDisplayName: app => app.toLowerCase()
  },
  'manual': {
    services: APPS,
    application: 'powershell'
  },
};

module.exports = { Methods, ConEmuPath };
```
## How to start
Add a valid config as seen above. Now you can call the application with your provided method name, eg.:
`node .\index.js serve`

## Method options
- `services` - **[required, Array]** Array of strings containing the full path to your js application.
- `application` - [optional, String] The command line application to use. Currently `cmd` or `powershell`. [default: `cmd`]
- `runCommand` - [optional, String] The command that should be run on startup. Depends on the used application (see above) [default: *nothing*]
- `exitAfterExecution` - [optional, Bool] Should the console close after execution? [default: `false`]
- `getDisplayName` - [optional, Function] A function which returns the displayed name of the ConEmu console. Gets the service as parameter. [default: *the provided service*]
- `prepareCommand` - [optional, Function] An array iterator function which returns a modified command. Useful if you want to modify your command based on the index. (see example above) [default: *the provided command*]

