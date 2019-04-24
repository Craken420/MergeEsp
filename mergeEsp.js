const R = require('ramda')
const { DrkBx } = require('./DarkBox')
const fs = require('fs')

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

const gtMergOrgEsp = obj => {
    return R.set(R.lensProp('exst', obj),
        DrkBx.intls.fnCmp.mergOrgEsp(
            R.prop('exst', obj),
            DrkBx.intls.newPath.toOrigFls(R.prop('path', obj))
        ),
        obj
    )
}

const objMrgOrgEsp = R.pipe(
    cmpsCutByExst,
    R.map(gtMergOrgEsp)
)

// const addCmpInexst = obj =>{
//     fs.appendFileSync(
//         DrkBx.intls.newPath.toOrigFls(R.prop('path', obj)),
//         '\n' + R.prop('cmpInxst', obj)
//     )
//     return true
// }

const addCmpInexst = obj =>{
    fs.appendFileSync(
        'Data\\' + DrkBx.intls.newPath.maviToEsp(R.prop('path', obj)),
        '\n' + R.prop('cmpInxst', obj),
        'latin1'
    )
    return true
}

const trnsfrmTxt = R.curry((cmps, txt) => {
    R.forEach(cmp => {
            txt = R.replace(
                DrkBx.intls.make.cmpByName(DrkBx.intls.fnCmp.getName(cmp)),
                cmp + '\n',
                txt
            )
        },
        cmps
    )
    return txt
})

const addCmpExst = obj => {
    fs.writeFileSync(
        'Data\\' + DrkBx.intls.newPath.maviToEsp(R.prop('path', obj)),
        trnsfrmTxt(
            R.prop('exst', obj),
            DrkBx.mix.fls.gtLtnTxt(DrkBx.intls.newPath.toOrigFls(R.prop('path', obj)))
        ),
        'latin1'
    )
    return true
}

// const addCmpExst = obj => {
//     fs.writeFileSync(
//         DrkBx.intls.newPath.toOrigFls(R.prop('path', obj)),
//         trnsfrmTxt(
//             R.prop('exst', obj),
//             DrkBx.mix.fls.gtLtnTxt(DrkBx.intls.newPath.toOrigFls(R.prop('path', obj)))
//         ),
//         'Latin1'
//     )
//     return true
// }

const testInexist = obj => (R.prop('cmpInxst',obj) != '') ? true : false

const testExist = obj => (R.prop('Exst',obj) != '') ? true : false

const prcssAddExst = R.forEach(x => R.cond([
        [testExist(x), (addCmpExst(x))],
        [R.T, false]
    ])
)

const prcssAddInexst = R.forEach(x => R.cond([
        [testInexist(x), (addCmpInexst(x))],
        [R.T, false]
    ])
)

prcssAddExst(objMrgOrgEsp('.esp', 'Data\\'))
prcssAddInexst(objMrgOrgEsp('.esp', 'Data\\'))

