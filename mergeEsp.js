const R = require('ramda')

const DrkBx = {
    getFiltFls: R.curry( (ext, files) => filterFiles( ext, getPathsFiles(files) ) ),
    toOrigFls: pathFile => 'c:\\Codigo Original\\'
        + maviToEsp(pathFile),
    mergOrgEsp: R.curry( (cmps, file) => delEmptyToTxt(R.mergeDeepRight(
            fnObj.toObj(
                R.unnest(
                    getCmpsByName( cmps, fnFile.gtLtnTxt( file ) )
                )
            ),
            fnObj.toObj(cmps)
        ))
    ),
    addCmpExst: R.curry( (exstCmp, txt) => {
        // console.log(mergCmpWithCmpInTxt(exstCmp, txt).join(''))
        return R.replace(
            cmpByNameNoAdapt(cmpHead(exstCmp)),
            mergCmpWithCmpInTxt(exstCmp, txt).join('') + '\n',
            txt
        )
    }),
    addCmpInexstInTxt: R.curry( (InxstCmp, txt) => {
        txt = txt + '\n' + InxstCmp + '\n'
        return txt
    }),
    cutByExstInOrig: file => R.zipObj(['path','exst','cmpInxst'],
        [
            file,
            getExstInOrigUnq(file),
            getInxst( getAllInPath(file) )( toOrigFls(file) ).join('\n')
        ]
    )
}

const rootData = 'Data\\'
const rootEsp = 'c:\\Reportes\\'

const cnctRootEsp = R.map(file => rootData + file)

const omitFls = R.without( cnctRootEsp( ['MenuPrincipal_DLG.esp'] ) )

const espFiltFls = R.pipe(
    DrkBx.getFiltFls,
    omitFls
)

const gtPthToOrig = R.pipe(
    R.prop('path'),
    DrkBx.toOrigFls
)

const gtMergOrgEspCmps = obj => {
    return R.set( R.lensProp('exst', obj),
        DrkBx.mergOrgEsp( R.prop('exst', obj) )( gtPthToOrig(obj) ),
        obj
    )
}

const testInxst = obj => ( R.prop('cmpInxst', obj) != '' ) ? true : false

const testExist = obj => ( R.prop('exst', obj) != '' ) ? true : false

const addCmpsExst = obj => R.cond([
    [testExist(obj),
        DrkBx.addCmpExst( R.prop('exst', obj) )( gtPthToOrig(obj) ) 
    ],
    [R.T, false]
])


const addCmpsInxst = obj => R.cond([
    [testInxst(obj),
        DrkBx.addCmpInexst( R.prop('cmpInxst', obj) )( gtPthToOrig(obj) )
    ],
    [R.T, false]
])

const addCmpsToFile = R.both(addCmpsExst, addCmpsInxst)

const cutByExistAndMrg = R.pipe(
    DrkBx.cutByExstInOrig,
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
// mrgEspFl('Data\\AccesoExpirado_FRM.esp')

/* Opp with indicate files */
// selectMergeFile(cnctRootEsp(['AccesoExpirado_FRM.esp','ActivoFijo_TBL.esp']))