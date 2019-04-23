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

const addCmpInexst = obj =>{
    fs.appendFileSync(
        DrkBx.intls.newPath.toOrigFls(R.prop('path', obj)),
        '\n' + R.prop('cmpInxst', obj)
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
        DrkBx.intls.newPath.toOrigFls(R.prop('path', obj)),
        trnsfrmTxt(
            R.prop('exst', obj),
            DrkBx.mix.fls.getTxt(DrkBx.intls.newPath.toOrigFls(R.prop('path', obj)))
        ),
        'Latin1'
    )
    return true
}

const testInexist = obj => (R.prop('cmpInxst',obj) != '') ? true : false
const testExist = obj => (R.prop('Exst',obj) != '') ? true : false

const prcssAddInexst = R.forEach(x => {
    if (testInexist(x)) {
        console.log('ADD New Components in: ',DrkBx.intls.newPath.maviToEsp(R.prop('path',x)))
        return addCmpInexst(x)
    } else {
        console.log('Haven\'t new in: ',DrkBx.intls.newPath.maviToEsp(R.prop('path',x)))
        return false
    }
})

const prcssAddExst = R.forEach(x => {
    if (testExist(x)) {
        console.log('ADD New Components in: ',DrkBx.intls.newPath.maviToEsp(R.prop('path',x)))
        return addCmpExst(x)
    } else {
        console.log('Haven\'t new in: ',DrkBx.intls.newPath.maviToEsp(R.prop('path',x)))
        return false
    }
})

prcssAddInexst(objMrgOrgEsp('.esp', 'Data\\'))
prcssAddExst(objMrgOrgEsp('.esp', 'Data\\'))
