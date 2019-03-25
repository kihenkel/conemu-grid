module.exports = {
    default: 'cmd',
    cmd: {
        executable: 'cmd.exe',
        paramExit: '/c',
        paramNoExit: '/k',
        paramAdditional: ''
    },
    powershell: {
        executable: '*powershell.exe',
        paramExit: '',
        paramNoExit: '-NoExit',
        paramAdditional: '-NoLogo'
    },
    pwsh: {
        executable: '*pwsh.exe',
        paramExit: '',
        paramNoExit: '-NoExit',
        paramAdditional: '-NoLogo'
    }
};