const R = require('ramda')
const { DrkBx } = require('./DarkBox')
const fs = require('fs')

const print = console.log
// const dir = 'C:\\Users\\lapena\\Documents\\Luis Angel\\Sección Mavi\\Intelisis\\Intelisis5000\\Reportes MAVI\\'
const rootData = 'c:\\Users\\lapena\\Documents\\Luis Angel\\Sección Mavi\\HerramientasMavi\\ProyectosGit\\MergeEsp\\Data\\'
const rootEsp = 'c:\\Users\\lapena\\Documents\\Luis Angel\\Sección Mavi\\Intelisis\\Intelisis5000\\Reportes Mavi\\'

const cnctRootEsp = R.map(file => rootData + file)

const omitFls = R.without(cnctRootEsp(['MenuPrincipal_DLG_MAVI.esp']))

const origFls = pathFile => {
    return {
        ['esp']: pathFile,
        ['orig']: 'c:\\Users\\lapena\\Documents\\Luis Angel\\Sección Mavi\\'
        + 'Intelisis\\Intelisis5000\\Codigo Original\\'
        + DrkBx.intls.newPath.maviToEsp(pathFile)
    }
}

const resultSet = R.pipe(
    R.prop('esp'),
    DrkBx.mix.fls.getTxt,
    DrkBx.intls.take.cmpAll
)

const setResult = obj => R.set(R.lensProp('esp'), resultSet(obj), obj)

const zipWithAddComp = R.curry(( comp, file) => R.zipWith(addComp, [comp], [file]))

const zipPropsWithFn = obj => R.prop('esp', obj).forEach(
    comp => zipWithAddComp(comp, R.prop('orig', obj))
)

const toRgxNameComp = nameComp => new RegExp(`^\\[\\b${nameComp}\\b\\]`, `gm`)

const nameComp = R.pipe(
    R.replace(/(?<=^\[).*?\//g, ''),
    DrkBx.intls.take.cmpHead,
    R.join('')
)

const rgxNameComp = R.pipe(nameComp, DrkBx.mix.adapt.toRegExp, toRgxNameComp)

const addCompExist = R.curry( (comp, pathFile) => {
    let headNewComp = nameComp(comp)
    if(headNewComp) {
       let newCompFields = DrkBx.intls.take.fldFull(comp)
        if (newCompFields) {
            newCompFields.forEach(fieldSend => {
                let rgxAddField = new RegExp(`(?<=\\[\\b${DrkBx.mix.adapt.toRegExp(headNewComp)}\\b\\])`,`g`)
                fs.appendFileSync('Reporte.txt','\n\nExist Comp: [' + headNewComp + ']')
                fs.appendFileSync('Reporte.txt','\nNew Field In Exist Comps: \n' + fieldSend)
                fs.writeFileSync(pathFile, DrkBx.mix.fls.getTxt(pathFile).replace(rgxAddField, '\n' + fieldSend), 'latin1')
            })
        }
    }
});

const addCompInexist = R.curry( (comp, pathFile) => {
    fs.appendFileSync(pathFile, '\n[' + nameComp(comp) + ']\n'+ DrkBx.intls.take.fldFull(comp))
    fs.appendFileSync('Reporte.txt', '\n[' + nameComp(comp) + ']\n'+ DrkBx.intls.take.fldFull(comp))
})

const existComp = (comp, pathFile) => R.test(rgxNameComp(comp), DrkBx.mix.fls.getTxt(pathFile))

const addComp = (comp, pathFile) =>(existComp(comp, pathFile)) ? addCompExist(comp)(pathFile) : addCompInexist(comp)(pathFile)

const espflsOk = R.pipe(
    DrkBx.mix.fls.getFiltFls,
    omitFls,
    R.map(origFls),
    R.map(setResult),
    R.forEach(zipPropsWithFn)
)

espflsOk('.esp', 'Data\\')
