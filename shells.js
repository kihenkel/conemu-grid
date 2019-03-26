module.exports = {
    default: 'cmd',
    cmd: {
        executable: 'cmd.exe',
        paramExit: '/c',
        paramNoExit: '/k',
        paramCommand: '',
        paramAdditional: ''
    },
    powershell: {
        executable: '*powershell.exe',
        paramExit: '',
        paramNoExit: '-NoExit',
        paramCommand: '',
        paramAdditional: '-NoLogo'
    },
    pwsh: {
        executable: '*pwsh.exe',
        paramExit: '',
        paramNoExit: '-NoExit',
        paramCommand: '-Command ',
        paramAdditional: '-NoLogo'
    }
};