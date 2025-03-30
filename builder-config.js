module.exports = {
    appId: 'com.yourcompany.worktimerbomb',
    productName: 'Work Timer Bomb',
    directories: {
        output: 'dist'
    },
    win: {
        target: [
            {
                target: 'nsis',
                arch: ['x64', 'ia32']
            },
            {
                target: 'msi',
                arch: ['x64']
            }
        ],
        icon: 'assets/logo.ico'
    },
    nsis: {
        oneClick: false,
        perMachine: true,
        allowElevation: true,
        allowToChangeInstallationDirectory: true,
        installerIcon: 'assets/logo.ico',
        uninstallerIcon: 'assets/logo.ico',
        createDesktopShortcut: true,
        createStartMenuShortcut: true
    },
    msi: {
        icon: 'assets/logo.ico'
    }
};