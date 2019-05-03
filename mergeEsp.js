const R = require('ramda')
const { DrkBx } = require('./DarkBox')

// const dir = 'C:\\Users\\lapena\\Documents\\Luis Angel\\Sección Mavi\\Intelisis\\Intelisis5000\\Reportes MAVI\\'
const rootData = 'Data\\'
const rootEsp = 'c:\\Users\\lapena\\Documents\\Luis Angel\\Sección Mavi\\Intelisis\\Intelisis5000\\Reportes Mavi\\'

const cnctRootEsp = R.map(file => rootData + file)

const omitFls = R.without( cnctRootEsp( ['MenuPrincipal_DLG_MAVI.esp'] ) )

const espFiltFls = R.pipe(
    DrkBx.mix.fls.getFiltFls,
    omitFls
)

const gtPthToOrig = R.pipe(
    R.prop('path'),
    DrkBx.intls.newPath.toOrigFls
)

const gtMergOrgEspCmps = obj => {
    return R.set( R.lensProp('exst', obj),
        DrkBx.intls.fnCmp.mergOrgEsp( R.prop('exst', obj) )( gtPthToOrig(obj) ),
        obj
    )
}

const testInxst = obj => ( R.prop('cmpInxst', obj) != '' ) ? true : false

const testExist = obj => ( R.prop('exst', obj) != '' ) ? true : false

const addCmpsExst = obj => R.cond([
    [testExist(obj),
        DrkBx.intls.fnCmp.addCmpExst( R.prop('exst', obj) )( gtPthToOrig(obj) ) 
    ],
    [R.T, false]
])


const addCmpsInxst = obj => R.cond([
    [testInxst(obj),
        DrkBx.intls.fnCmp.addCmpInexst( R.prop('cmpInxst', obj) )( gtPthToOrig(obj) )
    ],
    [R.T, false]
])

const addCmpsToFile = R.both(addCmpsExst, addCmpsInxst)

const cutByExistAndMrg = R.pipe(
    DrkBx.intls.fnCmp.cutByExstInOrig,
    gtMergOrgEspCmps,
)

const mrgEspFl = R.pipe(
    cutByExistAndMrg,
    addCmpsToFile
)

const mrgDirEspFls = R.curry( (ext, dir) => {
    espFiltFls(ext, dir).forEach(file => {
        mrgEspFl(file)
    })
})

const selectMergeFile = R.pipe(
    R.forEach(mrgEspFl)
)

module.exports.mergeEsp = {
    mrgDirEspFls: mrgDirEspFls,
    mrgEspFl: mrgEspFl,
    selectMergeFile: selectMergeFile
}

/* Usage */

/* Opp dir of .esp files */
// mrgDirEspFls('.esp','Data\\')

/* Opp .esp file */
// mrgEspFl('Data\\AccesoExpirado_FRM_MAVI.esp')

/* Opp with indicate files */
// selectMergeFile(cnctRootEsp(['AccesoExpirado_FRM_MAVI.esp','ActivoFijo_TBL_MAVI.esp']))