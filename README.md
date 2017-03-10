# conemu-grid
A Node.js application to open multiple consoles in ConEmu in a grid layout.

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
    paths: APPS,
    command: 'npm run serve',
    consoleName: app => app.toUpperCase()
  },
  'build': {
    paths: APPS,
    command: index => `timeout ${index * 3} & npm run serve`,
    shouldExit: true,
    consoleName: (app, index) => `${index}: ${app}`
  },
  'manual': {
    paths: APPS,
    shell: 'powershell'
    consoleName: 'My app'
  },
};

module.exports = { Methods, ConEmuPath };
```
## How to start
Add a valid config as seen above. Now you can call the application with your provided method name, eg.:
`node .\index.js serve`

## Method options
- `paths` - **[required, Array]** Array of strings containing the full paths.
- `shell` - [optional, String] The command line shell to use. Currently `cmd` or `powershell`. [default: `cmd`]
- `command` - [optional, String/Function] The command that should be run on startup. Depends on the used shell (see above). When a function is provided it passes the `path` and `index` as parameters, useful for eg. modifying the command based on the those values. [default: *nothing*]
- `shouldExit` - [optional, Bool] Should the console close after execution? [default: `false`]
- `consoleName` - [optional, String/Function] The name for the ConEmu console. When a function is provided it passes the `path` and `index` as parameters, useful for eg. beautifying the console name. [default: *the provided app*]

