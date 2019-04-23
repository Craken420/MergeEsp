const R = require('ramda')
const { DrkBx } = require('./DarkBox')
const fs = require('fs')

const print = console.log
// const dir = 'C:\\Users\\lapena\\Documents\\Luis Angel\\Sección Mavi\\Intelisis\\Intelisis5000\\Reportes MAVI\\'
const rootData = 'c:\\Users\\lapena\\Documents\\Luis Angel\\Sección Mavi\\HerramientasMavi\\ProyectosGit\\MergeEsp\\Data\\'
const rootEsp = 'c:\\Users\\lapena\\Documents\\Luis Angel\\Sección Mavi\\Intelisis\\Intelisis5000\\Reportes Mavi\\'

const cnctRootEsp = R.map(file => rootData + file)

const omitFls = R.without(cnctRootEsp(['MenuPrincipal_DLG_MAVI.esp']))

const espFiltFls = R.pipe(
    DrkBx.mix.fls.getFiltFls,
    omitFls
)

const oppDir = R.pipe(
    espFiltFls,
    R.map(DrkBx.intls.fnCmp.cutByExstInOrig)
)

const gtMergOrgEsp = obj => {
    return R.set(R.lensProp('exst', obj),
        DrkBx.intls.fnCmp.mergOrgEsp(
            R.prop('exst', obj),
            DrkBx.intls.newPath.toOrigFls(R.prop('path', obj))
        ),
        obj
    )
   
}

const procces = R.pipe(
    oppDir,
    R.map(gtMergOrgEsp)
)

// procces('.esp', 'Data\\')
console.log(procces('.esp', 'Data\\'))
