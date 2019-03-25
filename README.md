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
    consoleName: path => path.toUpperCase()
  },
  'build': {
    paths: APPS,
    command: (path, index) => `timeout ${index * 3} & npm run serve`,
    shouldExit: true,
    consoleName: (path, index) => `${index}: ${path}`
  },
  'manual': {
    paths: APPS,
    shell: 'powershell',
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
- `shell` - [optional, String/Function] The command line shell to use. Currently `cmd`, `powershell` (<= 5) or `pwsh` (>= 6). When a function is provided it passes the `path` and `index` as parameters. [default: `cmd`]
- `command` - [optional, String/Function] The command that should be run on startup. Depends on the used shell (see above). When a function is provided it passes the `path` and `index` as parameters. [default: *nothing*]
- `shouldExit` - [optional, Bool/Function] Should the console close after execution? When a function is provided it passes the `path` and `index` as parameters. [default: `false`]
- `consoleName` - [optional, String/Function] The name for the ConEmu console. When a function is provided it passes the `path` and `index` as parameters. [default: *the provided path*]

## Max console issue
ConEmu only allows 30 consoles (tabs) as a maximum. If you provided more than 30 paths conemu-grid will start another instance of ConEmu with the remaining consoles.