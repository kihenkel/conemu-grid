# conemu-grid
A Node.js application to open multiple consoles in ConEmu.

The application reads from a `config.js` file which you have to provide. It can look like this:

```javascript
const APPS = [
  'foo',
  'bar',
  'baz',
];

const ConEmuPath = 'C:/Program Files (x86)/ConEmu/ConEmu64.exe';
const AppsPath = 'C:/apps/my-apps';

const Methods = {
  'serve': {
    runCommand: 'timeout <%SLEEP1%> & npm run serve',
    services: APPS.map(app => `${AppsPath}/${app}`),
    prepareCommand: (command, index) => command.replace('<%SLEEP1%>', index * 3),
    noExit: true,
    getDisplayName: app => app.toUpperCase()
  },
  'build': {
    runCommand: 'timeout <%SLEEP1%> & git pull & timeout <%SLEEP2%> & npm run build',
    services: APPS.map(app => `${AppsPath}/${app}`),
    prepareCommand: (command, index) => {return command.replace('<%SLEEP1%>', index * 2).replace('<%SLEEP2%>', index * 6);},
    noExit: false,
    getDisplayName: app => app.toUpperCase()
  },
  'manual': {
    runCommand: '',
    services: APPS.map(app => `${AppsPath}/${app}`),
    prepareCommand: () => '',
    noExit: true,
    getDisplayName: app => app.toUpperCase()
  },
};

module.exports = { Methods, ConEmuPath };
```
Now you can call the application with your provided method, eg.:
`node .\index.js serve`