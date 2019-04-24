const R = require('ramda')
const { DrkBx } = require('./DarkBox')

// const dir = 'C:\\Users\\lapena\\Documents\\Luis Angel\\Sección Mavi\\Intelisis\\Intelisis5000\\Reportes MAVI\\'
const rootData = 'c:\\Users\\lapena\\Documents\\Luis Angel\\Sección Mavi\\HerramientasMavi\\ProyectosGit\\MergeEsp\\Data\\'
const rootEsp = 'c:\\Users\\lapena\\Documents\\Luis Angel\\Sección Mavi\\Intelisis\\Intelisis5000\\Reportes Mavi\\'

const cnctRootEsp = R.map(file => rootData + file)

const omitFls = R.without(cnctRootEsp(['MenuPrincipal_DLG_MAVI.esp']))

const espFiltFls = R.pipe(
    DrkBx.mix.fls.getFiltFls,
    omitFls
)

const cmpsCutByExst = R.pipe(
    espFiltFls,
    R.map(DrkBx.intls.fnCmp.cutByExstInOrig)
)

const gtPthToOrig = R.pipe(
    R.prop('path'),
    DrkBx.intls.newPath.toOrigFls
)

const gtMergOrgEsp = obj => {
    return R.set(R.lensProp('exst', obj),
        DrkBx.intls.fnCmp.mergOrgEsp( R.prop('exst', obj) )( gtPthToOrig(obj) ),
        obj
    )
}

const objMrgOrgEsp = R.pipe(
    cmpsCutByExst,
    R.map(gtMergOrgEsp)
)

const testInexist = obj => (R.prop('cmpInxst',obj) != '') ? true : false

const testExist = obj => (R.prop('Exst',obj) != '') ? true : false

const prcssAddExst = R.forEach(x => R.cond([
        [testExist(x),
            DrkBx.intls.fnCmp.addCmpExst( R.prop('exst', x) )( gtPthToOrig(x) ) 
        ],
        [R.T, false]
    ])
)

const prcssAddInexst = R.forEach(x => R.cond([
        [testInexist(x), 
            DrkBx.intls.fnCmp.addCmpInexst( R.prop('cmpInxst', x ) )( gtPthToOrig(x) )
        ],
        [R.T, false]
    ])
)

prcssAddExst(objMrgOrgEsp('.esp', 'Data\\'))
prcssAddInexst(objMrgOrgEsp('.esp', 'Data\\'))

